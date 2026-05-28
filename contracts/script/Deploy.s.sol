// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/console2.sol";
import {PulseLaunchHook} from "../src/PulseLaunchHook.sol";
import {MockToken} from "../src/MockToken.sol";
import {IPoolManager} from "v4-core/interfaces/IPoolManager.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerKey);
        address poolManagerAddress = vm.envOr("POOL_MANAGER", address(0));

        vm.startBroadcast(deployerKey);

        PulseLaunchHook hook = new PulseLaunchHook(IPoolManager(poolManagerAddress));
        MockToken tokenA = new MockToken("Pulse Token", "PULSE", 1_000_000 ether, deployer);
        MockToken tokenB = new MockToken("Launch USD", "LUSD", 1_000_000 ether, deployer);

        vm.stopBroadcast();

        console2.log("Hook", address(hook));
        console2.log("TokenA", address(tokenA));
        console2.log("TokenB", address(tokenB));
    }
}
