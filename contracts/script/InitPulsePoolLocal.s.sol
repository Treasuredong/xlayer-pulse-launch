// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/console2.sol";
import {IPoolManager} from "v4-core/interfaces/IPoolManager.sol";
import {IHooks} from "v4-core/interfaces/IHooks.sol";
import {IERC20Minimal} from "v4-core/interfaces/external/IERC20Minimal.sol";
import {ModifyLiquidityParams} from "v4-core/types/PoolOperation.sol";
import {Currency} from "v4-core/types/Currency.sol";
import {PoolKey} from "v4-core/types/PoolKey.sol";
import {LPFeeLibrary} from "v4-core/libraries/LPFeeLibrary.sol";

contract InitPulsePoolLocalScript is Script {
    uint160 internal constant SQRT_PRICE_1_1 = 79228162514264337593543950336;

    function run() external {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerKey);
        address poolManagerAddress = vm.envAddress("POOL_MANAGER");
        address hookAddress = vm.envAddress("V4_HOOK_ADDRESS");
        address tokenAAddress = vm.envAddress("TOKEN_A_ADDRESS");
        address tokenBAddress = vm.envAddress("TOKEN_B_ADDRESS");
        address modifyRouterAddress = vm.envAddress("POOL_MODIFY_LIQUIDITY_TEST_ADDRESS");

        (Currency currency0, Currency currency1) = tokenAAddress < tokenBAddress
            ? (Currency.wrap(tokenAAddress), Currency.wrap(tokenBAddress))
            : (Currency.wrap(tokenBAddress), Currency.wrap(tokenAAddress));

        PoolKey memory key = PoolKey({
            currency0: currency0,
            currency1: currency1,
            fee: LPFeeLibrary.DYNAMIC_FEE_FLAG,
            tickSpacing: 60,
            hooks: IHooks(hookAddress)
        });

        vm.startBroadcast(deployerKey);

        IERC20Minimal(tokenAAddress).approve(modifyRouterAddress, type(uint256).max);
        IERC20Minimal(tokenBAddress).approve(modifyRouterAddress, type(uint256).max);

        IPoolManager(poolManagerAddress).initialize(key, SQRT_PRICE_1_1);

        ModifyLiquidityParams memory params = ModifyLiquidityParams({
            tickLower: -600,
            tickUpper: 600,
            liquidityDelta: int256(10_000 ether),
            salt: bytes32(0)
        });

        bytes memory hookData = abi.encode(deployer);
        (bool ok, bytes memory result) = modifyRouterAddress.call(
            abi.encodeWithSignature(
                "modifyLiquidity((address,address,uint24,int24,address),(int24,int24,int256,bytes32),bytes)",
                key,
                params,
                hookData
            )
        );
        require(ok, string(result));

        vm.stopBroadcast();

        console2.log("Initialized PoolManager", poolManagerAddress);
        console2.log("Hook", hookAddress);
        console2.log("ModifyRouter", modifyRouterAddress);
        console2.log("Currency0", Currency.unwrap(currency0));
        console2.log("Currency1", Currency.unwrap(currency1));
    }
}
