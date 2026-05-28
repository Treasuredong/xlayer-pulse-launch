# Pulse Launch

Pulse Launch 是一个已经部署在 X Layer Mainnet 上的公平发行控制台。它围绕 Uniswap v4 Hook，解决新资产启动期常见的狙击、巨鲸冲击和社区冷启动问题，并把这套机制做成可理解、可运营、可验证的产品体验。

## 当前状态

- 已完成 `Next.js 14 + wagmi + viem + RainbowKit` 前端
- 已完成 `PulseLaunchHook.sol` 核心状态机与 Hook 逻辑
- 已完成 `X Layer Mainnet` 合约部署与池子初始化
- 已完成中英文切换
- 已支持 `体验模式 / 协议模式`
- 已通过 `npm run typecheck`
- 已通过 `npm run build`
- 已通过 `forge build`

## 主网地址

- `PoolManager`: `0x0F5796713F5abB1FB2941Fa56EBa0cD3cc3e277d`
- `Hook`: `0x53Ff23a575cfA006D37bA137188B1973e94B84C0`
- `PULSE`: `0x39d795d0565aDBF41E1d918a7272ab7456999248`
- `LUSD`: `0x1Ff22784E6217AA38d1B8E2F297556f28d42F63B`
- `PoolSwapTest`: `0xbEE1af595fd7c0Cdceb1f27B741D50DF39120d8D`
- `PoolModifyLiquidityTest`: `0x604D203eE62C4A08326179e4fBC535eEB43573f1`
- `Pool ID`: `0x84c9444d81255b3ecd64df837eb74ad93346d5c58318d2fbed9a00690d734f91`

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
