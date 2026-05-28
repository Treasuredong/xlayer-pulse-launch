import fs from "node:fs";
import path from "node:path";
import {
  createPublicClient,
  createWalletClient,
  encodeDeployData,
  getCreate2Address,
  http,
  keccak256
} from "viem";
import { privateKeyToAccount } from "viem/accounts";

const root = process.cwd();
const envPath = path.join(root, ".env.local");
const artifactPath = path.join(
  root,
  "contracts",
  "out",
  "PulseLaunchHook.sol",
  "PulseLaunchHook.json"
);

function readEnv(filePath) {
  const text = fs.readFileSync(filePath, "utf8");
  const env = {};
  for (const line of text.split(/\r?\n/)) {
    if (!line || line.trim().startsWith("#") || !line.includes("=")) continue;
    const [key, ...rest] = line.split("=");
    env[key.trim()] = rest.join("=").trim();
  }
  return env;
}

const env = {
  ...readEnv(envPath),
  ...Object.fromEntries(Object.entries(process.env).filter(([, value]) => value !== undefined))
};
const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

const rpcUrl = env.NEXT_PUBLIC_RPC_URL;
const privateKey = env.PRIVATE_KEY;
const poolManager = env.POOL_MANAGER;
const salt = env.HOOK_SALT;
const create2Deployer = env.CREATE2_DEPLOYER || "0x4e59b44847b379578588920cA78FbF26c0B4956C";

if (!rpcUrl || !privateKey || !poolManager || !salt) {
  throw new Error("NEXT_PUBLIC_RPC_URL, PRIVATE_KEY, POOL_MANAGER, and HOOK_SALT are required.");
}

const account = privateKeyToAccount(privateKey.startsWith("0x") ? privateKey : `0x${privateKey}`);
const publicClient = createPublicClient({ transport: http(rpcUrl) });
const walletClient = createWalletClient({ account, transport: http(rpcUrl) });

const deployData = encodeDeployData({
  abi: artifact.abi,
  bytecode: artifact.bytecode.object,
  args: [poolManager]
});

const expectedAddress = getCreate2Address({
  from: create2Deployer,
  salt,
  bytecodeHash: keccak256(deployData)
});

const calldata = `${salt.slice(2)}${deployData.slice(2)}`;
const hash = await walletClient.sendTransaction({
  account,
  to: create2Deployer,
  data: `0x${calldata}`
});

const receipt = await publicClient.waitForTransactionReceipt({ hash });

console.log(JSON.stringify({
  ok: receipt.status === "success",
  txHash: hash,
  expectedHookAddress: expectedAddress,
  create2Deployer,
  gasUsed: receipt.gasUsed.toString()
}, null, 2));
