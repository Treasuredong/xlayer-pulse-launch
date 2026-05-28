// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/console2.sol";
import {MockToken} from "../src/MockToken.sol";

contract DeployTokensLocalScript is Script {
    function run() external returns (MockToken tokenA, MockToken tokenB) {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerKey);

        vm.startBroadcast(deployerKey);
        tokenA = new MockToken("Pulse Token", "PULSE", 1_000_000 ether, deployer);
        tokenB = new MockToken("Launch USD", "LUSD", 1_000_000 ether, deployer);
        vm.stopBroadcast();

        console2.log("TokenA", address(tokenA));
        console2.log("TokenB", address(tokenB));
    }
}
