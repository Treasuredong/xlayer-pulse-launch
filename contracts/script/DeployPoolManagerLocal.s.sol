// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/console2.sol";
import {PoolManager} from "v4-core/PoolManager.sol";
import {IPoolManager} from "v4-core/interfaces/IPoolManager.sol";

contract DeployPoolManagerLocalScript is Script {
    function run() external returns (IPoolManager manager) {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerKey);
        manager = new PoolManager(msg.sender);
        vm.stopBroadcast();

        console2.log("PoolManager", address(manager));
    }
}
