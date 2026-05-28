// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/console2.sol";
import {IPoolManager} from "v4-core/interfaces/IPoolManager.sol";
import {PoolSwapTest} from "v4-core/test/PoolSwapTest.sol";

contract DeployPoolSwapLocalScript is Script {
    function run() external returns (PoolSwapTest router) {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        address poolManagerAddress = vm.envAddress("POOL_MANAGER");

        vm.startBroadcast(deployerKey);
        router = new PoolSwapTest(IPoolManager(poolManagerAddress));
        vm.stopBroadcast();

        console2.log("PoolSwapTest", address(router));
    }
}
