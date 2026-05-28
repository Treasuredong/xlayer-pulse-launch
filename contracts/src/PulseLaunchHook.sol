// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {IHooks} from "v4-core/interfaces/IHooks.sol";
import {IPoolManager} from "v4-core/interfaces/IPoolManager.sol";
import {PoolKey} from "v4-core/types/PoolKey.sol";
import {BalanceDelta, BalanceDeltaLibrary} from "v4-core/types/BalanceDelta.sol";
import {BeforeSwapDelta, BeforeSwapDeltaLibrary} from "v4-core/types/BeforeSwapDelta.sol";
import {ModifyLiquidityParams, SwapParams} from "v4-core/types/PoolOperation.sol";
import {Hooks} from "v4-core/libraries/Hooks.sol";
import {LPFeeLibrary} from "v4-core/libraries/LPFeeLibrary.sol";

enum LaunchPhase {
    Shield,
    Discovery,
    Open
}

enum LaunchRole {
    Observer,
    Scout,
    PulseHolder,
    GuardianLP
}

struct UserProfile {
    uint32 points;
    uint64 lastTradeAt;
    bool hasBought;
    bool isEarlyBuyer;
    bool isEarlyLp;
}

contract PulseLaunchHook is IHooks {
    using Hooks for IHooks;

    IPoolManager public immutable poolManager;

    uint32 public constant DISCOVERY_THRESHOLD = 12;
    uint32 public constant OPEN_THRESHOLD = 24;
    uint32 public constant EARLY_LP_THRESHOLD = 5;
    uint128 public constant SHIELD_BUY_CAP = 2_500 ether;
    uint64 public constant SHIELD_COOLDOWN = 60;
    uint64 public constant SHIELD_SELL_PENALTY_BPS = 800;
    uint24 public constant SHIELD_FEE_BPS = 9_000;
    uint24 public constant DISCOVERY_FEE_BPS = 4_500;
    uint24 public constant OPEN_FEE_BPS = 3_000;

    LaunchPhase public phase = LaunchPhase.Shield;
    uint32 public uniqueBuyers;
    uint32 public earlyLpCount;
    mapping(address => UserProfile) internal profiles;

    error NotPoolManager();
    error InvalidParticipant();
    error ShieldBuyCapExceeded();
    error ShieldCooldownActive();
    error DemoModeDisabled();

    event BuyRecorded(address indexed user, int256 amountSpecified, LaunchPhase phaseAfter);
    event EarlyLpRecorded(address indexed user, LaunchPhase phaseAfter);
    event PhaseAdvanced(LaunchPhase indexed previousPhase, LaunchPhase indexed newPhase);

    modifier onlyPoolManager() {
        if (msg.sender != address(poolManager)) revert NotPoolManager();
        _;
    }

    constructor(IPoolManager _poolManager) {
        poolManager = _poolManager;

        if (address(_poolManager) != address(0)) {
            Hooks.validateHookPermissions(IHooks(address(this)), getHookPermissions());
        }
    }

    function getHookPermissions() public pure returns (Hooks.Permissions memory permissions) {
        permissions.beforeSwap = true;
        permissions.afterSwap = true;
        permissions.afterAddLiquidity = true;
    }

    function getLaunchSnapshot()
        external
        view
        returns (
            uint8 phase_,
            uint32 uniqueBuyers_,
            uint32 earlyLpCount_,
            uint128 buyCap_,
            uint64 cooldownWindow_,
            uint64 sellPenaltyBps_
        )
    {
        return (
            uint8(phase),
            uniqueBuyers,
            earlyLpCount,
            SHIELD_BUY_CAP,
            SHIELD_COOLDOWN,
            SHIELD_SELL_PENALTY_BPS
        );
    }

    function getUserProfile(address user)
        external
        view
        returns (uint8 role, uint32 points, uint64 lastTradeAt, bool isEarlyBuyer, bool isEarlyLp)
    {
        UserProfile memory profile = profiles[user];
        return (
            uint8(_resolveRole(profile)),
            profile.points,
            profile.lastTradeAt,
            profile.isEarlyBuyer,
            profile.isEarlyLp
        );
    }

    function beforeInitialize(address, PoolKey calldata, uint160) external pure returns (bytes4) {
        return IHooks.beforeInitialize.selector;
    }

    function afterInitialize(address, PoolKey calldata, uint160, int24) external pure returns (bytes4) {
        return IHooks.afterInitialize.selector;
    }

    function beforeAddLiquidity(address, PoolKey calldata, ModifyLiquidityParams calldata, bytes calldata)
        external
        pure
        returns (bytes4)
    {
        return IHooks.beforeAddLiquidity.selector;
    }

    function afterAddLiquidity(
        address,
        PoolKey calldata,
        ModifyLiquidityParams calldata params,
        BalanceDelta,
        BalanceDelta,
        bytes calldata hookData
    ) external onlyPoolManager returns (bytes4, BalanceDelta) {
        if (params.liquidityDelta > 0) {
            _recordEarlyLp(_resolveParticipant(hookData));
        }

        return (IHooks.afterAddLiquidity.selector, BalanceDeltaLibrary.ZERO_DELTA);
    }

    function beforeRemoveLiquidity(address, PoolKey calldata, ModifyLiquidityParams calldata, bytes calldata)
        external
        pure
        returns (bytes4)
    {
        return IHooks.beforeRemoveLiquidity.selector;
    }

    function afterRemoveLiquidity(
        address,
        PoolKey calldata,
        ModifyLiquidityParams calldata,
        BalanceDelta,
        BalanceDelta,
        bytes calldata
    ) external pure returns (bytes4, BalanceDelta) {
        return (IHooks.afterRemoveLiquidity.selector, BalanceDeltaLibrary.ZERO_DELTA);
    }

    function beforeSwap(address, PoolKey calldata key, SwapParams calldata params, bytes calldata hookData)
        external
        onlyPoolManager
        returns (bytes4, BeforeSwapDelta, uint24)
    {
        address participant = _resolveParticipant(hookData);

        if (params.amountSpecified < 0) {
            _enforceShield(participant, uint256(-params.amountSpecified));
        }

        uint24 feeOverride = key.fee == LPFeeLibrary.DYNAMIC_FEE_FLAG
            ? LPFeeLibrary.OVERRIDE_FEE_FLAG | _currentFee()
            : 0;

        return (IHooks.beforeSwap.selector, BeforeSwapDeltaLibrary.ZERO_DELTA, feeOverride);
    }

    function afterSwap(address, PoolKey calldata, SwapParams calldata params, BalanceDelta, bytes calldata hookData)
        external
        onlyPoolManager
        returns (bytes4, int128)
    {
        address participant = _resolveParticipant(hookData);
        _recordBuy(participant, params.amountSpecified);
        return (IHooks.afterSwap.selector, 0);
    }

    function beforeDonate(address, PoolKey calldata, uint256, uint256, bytes calldata) external pure returns (bytes4) {
        return IHooks.beforeDonate.selector;
    }

    function afterDonate(address, PoolKey calldata, uint256, uint256, bytes calldata) external pure returns (bytes4) {
        return IHooks.afterDonate.selector;
    }

    function simulateBuy(uint256 amountIn) external {
        if (address(poolManager) != address(0)) revert DemoModeDisabled();
        _enforceShield(msg.sender, amountIn);
        _recordBuy(msg.sender, -int256(amountIn));
    }

    function simulateAddLiquidity() external {
        if (address(poolManager) != address(0)) revert DemoModeDisabled();
        _recordEarlyLp(msg.sender);
    }

    function _recordBuy(address user, int256 amountSpecified) internal {
        UserProfile storage profile = profiles[user];
        if (!profile.hasBought) {
            profile.hasBought = true;
            uniqueBuyers += 1;
            if (uniqueBuyers <= DISCOVERY_THRESHOLD) {
                profile.isEarlyBuyer = true;
                profile.points += 20;
            }
        }

        profile.lastTradeAt = uint64(block.timestamp);
        profile.points += 10;

        if (phase == LaunchPhase.Shield && amountSpecified > 0) {
            profile.points = profile.points > 4 ? profile.points - 4 : 0;
        }

        _advancePhaseIfNeeded();
        emit BuyRecorded(user, amountSpecified, phase);
    }

    function _recordEarlyLp(address user) internal {
        UserProfile storage profile = profiles[user];
        if (profile.isEarlyLp) {
            return;
        }

        profile.isEarlyLp = true;
        profile.points += 30;
        earlyLpCount += 1;

        _advancePhaseIfNeeded();
        emit EarlyLpRecorded(user, phase);
    }

    function _resolveParticipant(bytes calldata hookData) internal pure returns (address participant) {
        if (hookData.length == 32) {
            participant = abi.decode(hookData, (address));
        }

        if (participant == address(0)) revert InvalidParticipant();
    }

    function _enforceShield(address participant, uint256 exactInput) internal view {
        if (phase != LaunchPhase.Shield) return;
        if (exactInput > SHIELD_BUY_CAP) revert ShieldBuyCapExceeded();

        uint64 eligibleAt = profiles[participant].lastTradeAt + SHIELD_COOLDOWN;
        if (profiles[participant].lastTradeAt != 0 && block.timestamp < eligibleAt) {
            revert ShieldCooldownActive();
        }
    }

    function _advancePhaseIfNeeded() internal {
        LaunchPhase previous = phase;

        if (phase == LaunchPhase.Shield && uniqueBuyers >= DISCOVERY_THRESHOLD) {
            phase = LaunchPhase.Discovery;
        }

        if (
            phase == LaunchPhase.Discovery
                && (uniqueBuyers >= OPEN_THRESHOLD || earlyLpCount >= EARLY_LP_THRESHOLD)
        ) {
            phase = LaunchPhase.Open;
        }

        if (previous != phase) {
            emit PhaseAdvanced(previous, phase);
        }
    }

    function _resolveRole(UserProfile memory profile) internal pure returns (LaunchRole) {
        if (profile.isEarlyLp) return LaunchRole.GuardianLP;
        if (profile.isEarlyBuyer) return LaunchRole.Scout;
        if (profile.points >= 50) return LaunchRole.PulseHolder;
        return LaunchRole.Observer;
    }

    function _currentFee() internal view returns (uint24) {
        if (phase == LaunchPhase.Shield) return SHIELD_FEE_BPS;
        if (phase == LaunchPhase.Discovery) return DISCOVERY_FEE_BPS;
        return OPEN_FEE_BPS;
    }
}
