# Pulse Launch Demo 部署说明

## 目标

先部署一个 `demo mode` 版本的 `PulseLaunchHook` 到 X Layer Testnet，让前端页面上的：

- `Trigger Buy Pulse`
- `Join as Guardian LP`

可以直接写链并刷新状态。

这个阶段不依赖完整的 Uniswap v4 PoolManager，优先完成可演示产品体验。

## 前置准备

### 1. 环境变量

复制环境变量模板：

```bash
cp .env.example .env.local
```

前端至少需要填写：

- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
- `NEXT_PUBLIC_RPC_URL`
- `NEXT_PUBLIC_HOOK_ADDRESS`

### 2. Foundry 私钥

部署合约时需要：

- `PRIVATE_KEY`

本阶段 `POOL_MANAGER` 保持默认 `0x0000000000000000000000000000000000000000` 即可。

## 部署 Hook

### 编译

```bash
forge build
```

### 部署 demo hook

```bash
PRIVATE_KEY=你的私钥 forge script contracts/script/Deploy.s.sol:DeployScript \
  --rpc-url https://testrpc.xlayer.tech/terigon \
  --broadcast
```

脚本会输出：

- `Hook`
- `TokenA`
- `TokenB`

记录 `Hook` 地址。

## 连接前端

把 `Hook` 地址写入 `.env.local`：

```bash
NEXT_PUBLIC_HOOK_ADDRESS=0x你的Hook地址
```

然后重启前端：

```bash
npm run dev
```

打开：

```bash
http://localhost:3000
```

## 演示流程

### 钱包交互

1. 连接钱包
2. 切到 X Layer Testnet
3. 页面会读取 Hook 的当前状态

### Buy 演示

点击 `Trigger Buy Pulse`：

- 增加唯一买家计数
- 增加积分
- 在保护期内应用买入上限与冷却时间
- 触发阶段推进

### LP 演示

点击 `Join as Guardian LP`：

- 记录早期 LP 身份
- 增加积分
- 推动阶段从 `Shield` 向 `Discovery` / `Open` 发展

## 当前阶段说明

这个 demo 部署的目的不是替代最终 Hook 提交，而是：

- 先把产品交互完整打通
- 先把前端录屏素材准备好
- 先让评委能看见完整产品叙事

后续第二阶段再补：

- 真实 v4 PoolManager
- 真实 pool 初始化
- 真实 swap / add liquidity 触发 Hook

## 验证清单

- `npm run typecheck` 通过
- `npm run build` 通过
- `forge build` 通过
- 钱包可连接
- 前端可读取 Hook 状态
- Buy / LP 按钮可发起交易
- 页面数据能刷新
