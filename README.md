# Pulse Launch

Pulse Launch 是一个已经部署在 X Layer Mainnet 上的公平发行控制台。它围绕 Uniswap v4 Hook，解决新资产启动期常见的狙击、巨鲸冲击和社区冷启动问题，并把这套机制做成可理解、可运营、可验证的产品体验。


## 主网地址

- `PoolManager`: `0x0F5796713F5abB1FB2941Fa56EBa0cD3cc3e277d`
- `Hook`: `0x53Ff23a575cfA006D37bA137188B1973e94B84C0`
- `PULSE`: `0x39d795d0565aDBF41E1d918a7272ab7456999248`
- `LUSD`: `0x1Ff22784E6217AA38d1B8E2F297556f28d42F63B`
- `PoolSwapTest`: `0xbEE1af595fd7c0Cdceb1f27B741D50DF39120d8D`
- `PoolModifyLiquidityTest`: `0x604D203eE62C4A08326179e4fBC535eEB43573f1`
- `Pool ID`: `0x84c9444d81255b3ecd64df837eb74ad93346d5c58318d2fbed9a00690d734f91`

## 线上访问
产品地址：https://xlayer-pulse-launch.vercel.app
部署平台：Vercel
当前线上版本已连接 X Layer Mainnet

## 产品概览

新资产的冷启动通常会同时遇到三类问题：

- 价格发现过于脆弱，容易被狙击或大额买单瞬间打穿
- 流动性冷启动困难，早期 LP 缺少明确激励
- Hook 机制虽然强大，但普通用户和运营方很难直观看懂

Pulse Launch 的目标，是把 `Uniswap v4 Hook` 从一段协议逻辑，变成一个可以被用户理解、被项目方运营、被社区参与的启动产品。

## 产品功能

### 1. Launch Protection

- 在启动早期限制单笔买入，降低大额瞬时冲击
- 引入冷却时间，减弱重复快速抢跑
- 对过早卖出施加更高惩罚，鼓励更健康的启动曲线

### 2. Community Unlock

- 市场不会依赖固定倒计时直接打开
- 随着真实买家和早期 LP 数量增加，池子阶段逐步从 `Shield` 解锁到 `Discovery`，再进入 `Open`
- 把“时间驱动启动”改成“参与驱动启动”

### 3. Guardian LP 机制

- 早期 LP 不只是单纯加池子
- 他们会成为 `Guardian LP`，获得更高的身份反馈和更强的产品可见性
- 这让 LP 行为从“底层流动性动作”变成“启动叙事的一部分”

### 4. Role-driven UX

- 用户可以在前端直接看到自己的角色、积分和最近状态变化
- 早期买家会成为 `Scout`
- 早期 LP 会升级成 `Guardian LP`
- Hook 的链上行为不再藏在交易里，而是会反映到产品界面上

## 使用路径

Pulse Launch 当前提供两种主要视图：

- `体验模式`
  - 用于快速理解启动保护、社区解锁和角色反馈机制
- `协议模式`
  - 用于连接主网部署，查看真实 Hook、PoolManager、Pool ID，并执行买入与 LP 操作

一个典型的使用流程是：

1. 连接钱包并进入 X Layer Mainnet
2. 先观察当前池子所处阶段
3. 执行买入或 LP 操作
4. 观察角色、积分和市场状态的变化
5. 在页面底部查看链上验证信息

## 核心体验

- `体验模式`：快速理解 Buy Shield、Community Unlock、Guardian LP 的启动机制
- `协议模式`：在主网配置下查看真实 Hook、PoolManager、Pool ID 等链上部署信息
- `30 秒快速上手`：帮助第一次进入页面的用户快速理解操作顺序

## 运行方式

1. 安装依赖

```bash
npm install
```

2. 复制环境变量

```bash
cp .env.example .env.local
```

3. 启动前端

```bash
npm run dev
```

4. 编译合约

```bash
forge build
```

## 网络配置

- X Layer Mainnet
  - `NEXT_PUBLIC_CHAIN_ID=196`
  - `NEXT_PUBLIC_MAINNET_RPC_URL=https://rpc.xlayer.tech`
  - 当前本地 [`.env.local`](/Users/xuzhendong/Desktop/Hackathon/.env.local) 已切到主网配置

如果需要回到测试网，请手动把环境变量改回 `1952 + testrpc.xlayer.tech/terigon`。

## 对外一句话

`Pulse Launch` 是一个运行在 X Layer 上、基于 Uniswap v4 Hook 的公平发行控制台，用启动保护、社区解锁和早期 LP 身份机制，让新资产冷启动更平滑、更可运营。

## 关键文件

- [docs/project-plan-zh.md](/Users/xuzhendong/Desktop/Hackathon/docs/project-plan-zh.md)
- [docs/deployment-status-zh.md](/Users/xuzhendong/Desktop/Hackathon/docs/deployment-status-zh.md)
- [docs/mainnet-release-zh.md](/Users/xuzhendong/Desktop/Hackathon/docs/mainnet-release-zh.md)
- [contracts/src/PulseLaunchHook.sol](/Users/xuzhendong/Desktop/Hackathon/contracts/src/PulseLaunchHook.sol)
- [src/app/page.tsx](/Users/xuzhendong/Desktop/Hackathon/src/app/page.tsx)
- [src/lib/chains.ts](/Users/xuzhendong/Desktop/Hackathon/src/lib/chains.ts)
