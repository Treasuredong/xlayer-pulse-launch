// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/console2.sol";
import {IPoolManager} from "v4-core/interfaces/IPoolManager.sol";
import {PoolModifyLiquidityTest} from "v4-core/test/PoolModifyLiquidityTest.sol";

contract DeployPoolModifyLiquidityLocalScript is Script {
    function run() external returns (PoolModifyLiquidityTest router) {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        address poolManagerAddress = vm.envAddress("POOL_MANAGER");

        vm.startBroadcast(deployerKey);
        router = new PoolModifyLiquidityTest(IPoolManager(poolManagerAddress));
        vm.stopBroadcast();

        console2.log("PoolModifyLiquidityTest", address(router));
    }
}
