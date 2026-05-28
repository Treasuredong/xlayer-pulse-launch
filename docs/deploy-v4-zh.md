# Pulse Launch 真实 Uniswap v4 部署路径

## 目标

把当前已上线的 `demo mode` 版本，升级为满足比赛提交要求的真实 v4 版本：

- Hook 合约真实挂在 Uniswap v4 Pool 上
- PoolManager / 测试路由 / Hook / Pool 全部可验证
- 真实 swap / add liquidity 触发 Hook 回调

## 当前已完成

- `PulseLaunchHook.sol` 已具备真实 `IHooks` 回调接口
- demo 版本已部署到 X Layer Testnet
- 前端已接入真实测试网 Hook 状态读取

## 真实 v4 路径的核心难点

### 1. Hook 地址权限位

Uniswap v4 会根据 Hook 合约地址的低位判断启用哪些回调。

Pulse Launch 当前需要的权限位是：

- `BEFORE_SWAP_FLAG`
- `AFTER_SWAP_FLAG`
- `AFTER_ADD_LIQUIDITY_FLAG`

组合后的目标低位是：

- `0x04c0`

所以真实 Hook 不能普通部署，必须通过 `CREATE2` 找到一个符合低位权限的地址。

### 2. 需要真实 PoolManager

demo 版的 `POOL_MANAGER=0x0` 只是为了产品演示。

真实比赛提交版本需要：

- 部署真实 `PoolManager`
- 用真实 `PoolKey` 初始化池子
- 用真实 swap / liquidity 调用触发 Hook

## 已新增工具

### Salt 搜索工具

文件：

- [scripts/find-hook-salt.mjs](/Users/xuzhendong/Desktop/Hackathon/scripts/find-hook-salt.mjs)

作用：

- 根据 `POOL_MANAGER`
- 根据 `PulseLaunchHook` 的构造参数
- 搜索一个满足 `0x04c0` 权限位要求的 `CREATE2 salt`

使用方式：

```bash
node scripts/find-hook-salt.mjs
```

如果找到，会输出：

- `hookAddress`
- `salt`
- `create2Deployer`

然后把 `salt` 写入：

```env
HOOK_SALT=0x...
```

### CREATE2 部署工具

文件：

- [scripts/deploy-hook-create2.mjs](/Users/xuzhendong/Desktop/Hackathon/scripts/deploy-hook-create2.mjs)

作用：

- 使用标准 `CREATE2 deployer`
- 把真实 `PulseLaunchHook(poolManager)` 部署到满足权限位的地址

使用前需要环境变量：

- `NEXT_PUBLIC_RPC_URL`
- `PRIVATE_KEY`
- `POOL_MANAGER`
- `HOOK_SALT`

使用方式：

```bash
node scripts/deploy-hook-create2.mjs
```

## 推荐执行顺序

### 第一步：部署 PoolManager

可直接复用 Uniswap 自带脚本：

- `contracts/lib/v4-periphery/script/01_PoolManager.s.sol`

示例：

```bash
forge script contracts/lib/v4-periphery/script/01_PoolManager.s.sol:DeployPoolManager \
  --rpc-url $NEXT_PUBLIC_RPC_URL \
  --broadcast
```

部署完成后，把地址写入：

```env
POOL_MANAGER=0x...
```

### 第二步：搜索 Hook Salt

```bash
node scripts/find-hook-salt.mjs
```

把输出的 `salt` 写入：

```env
HOOK_SALT=0x...
```

### 第三步：CREATE2 部署真实 Hook

```bash
node scripts/deploy-hook-create2.mjs
```

部署成功后，把真实地址写入：

```env
NEXT_PUBLIC_HOOK_ADDRESS=0x...
```

### 第四步：部署测试交换 / 加池路由

可复用：

- `contracts/lib/v4-periphery/script/02_PoolModifyLiquidityTest.s.sol`
- `contracts/lib/v4-periphery/script/03_PoolSwapTest.s.sol`

### 第五步：初始化池子并加初始流动性

这一步建议作为下一阶段单独脚本完成，原因是：

- 需要整理 `currency0 / currency1 / fee / tickSpacing / hook`
- 需要把 demo token 与真实 pool 连接起来
- 需要一并为前端提供最终 `Pool ID`

## 当前建议

最适合你比赛冲刺的方式是分两层提交：

### 对外展示层

- 当前 demo hook + 前端产品体验
- 用于录视频、发推、跑用户感知

### 评审验证层

- 补真实 v4 Hook 地址与真实 pool
- 提交合约地址满足比赛硬性要求

这样风险最低，推进速度也最快。
