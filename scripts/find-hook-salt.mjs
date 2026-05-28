import fs from "node:fs";
import path from "node:path";
import { encodeDeployData, getCreate2Address, keccak256, toHex } from "viem";

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

if (!fs.existsSync(envPath)) {
  throw new Error(`Missing .env.local at ${envPath}`);
}

if (!fs.existsSync(artifactPath)) {
  throw new Error(`Missing artifact at ${artifactPath}. Run 'forge build' first.`);
}

const env = {
  ...readEnv(envPath),
  ...Object.fromEntries(Object.entries(process.env).filter(([, value]) => value !== undefined))
};
const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

const poolManager = env.POOL_MANAGER;
if (!poolManager || /^0x0{40}$/i.test(poolManager)) {
  throw new Error("POOL_MANAGER must be a real deployed PoolManager address before finding a real hook salt.");
}

const create2Deployer = env.CREATE2_DEPLOYER || "0x4e59b44847b379578588920cA78FbF26c0B4956C";
const mask = 0x3fffn;
const requiredFlags = 0x04c0n;
const start = Number.parseInt(env.HOOK_SALT_START || "0", 10);
const maxAttempts = Number.parseInt(env.HOOK_SALT_ATTEMPTS || "200000", 10);

const deployData = encodeDeployData({
  abi: artifact.abi,
  bytecode: artifact.bytecode.object,
  args: [poolManager]
});

const bytecodeHash = keccak256(deployData);

let found = null;
for (let i = start; i < start + maxAttempts; i += 1) {
  const salt = toHex(i, { size: 32 });
  const address = getCreate2Address({
    from: create2Deployer,
    salt,
    bytecodeHash
  });

  if ((BigInt(address) & mask) === requiredFlags) {
    found = { salt, address, attempts: i - start + 1 };
    break;
  }
}

if (!found) {
  console.log(JSON.stringify({
    ok: false,
    message: "No matching salt found in current search range.",
    start,
    maxAttempts,
    requiredFlags: `0x${requiredFlags.toString(16)}`
  }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  create2Deployer,
  poolManager,
  hookAddress: found.address,
  salt: found.salt,
  attempts: found.attempts,
  requiredFlags: `0x${requiredFlags.toString(16)}`
}, null, 2));
