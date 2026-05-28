# Pulse Launch 主网发布清单

更新时间：2026-05-28

## 一句话介绍

Pulse Launch 是一个运行在 X Layer 上、基于 Uniswap v4 Hook 的公平发行控制台，用启动保护、社区解锁和早期 LP 身份机制，让新资产冷启动更平滑、更可运营。

## 对外短介绍

Pulse Launch 把 Uniswap v4 Hook 从“协议逻辑”变成了“产品体验”。它不只在链上控制启动期的买入上限、冷却时间和流动性节奏，也把这些变化直观地反馈给用户，让新资产的启动过程更容易理解、参与和运营。

## X Layer Mainnet 地址

- `PoolManager`
  - `0x0F5796713F5abB1FB2941Fa56EBa0cD3cc3e277d`
- `Hook`
  - `0x53Ff23a575cfA006D37bA137188B1973e94B84C0`
- `PULSE`
  - `0x39d795d0565aDBF41E1d918a7272ab7456999248`
- `LUSD`
  - `0x1Ff22784E6217AA38d1B8E2F297556f28d42F63B`
- `PoolSwapTest`
  - `0xbEE1af595fd7c0Cdceb1f27B741D50DF39120d8D`
- `PoolModifyLiquidityTest`
  - `0x604D203eE62C4A08326179e4fBC535eEB43573f1`
- `Pool ID`
  - `0x84c9444d81255b3ecd64df837eb74ad93346d5c58318d2fbed9a00690d734f91`

## 当前主网状态

- 已部署主网 `PoolManager`
- 已部署主网 `Hook`
- 已部署主网 `PULSE / LUSD`
- 已部署主网 `Swap / ModifyLiquidity` 路由
- 已完成主网池子初始化
- 已注入第一笔主网流动性

## 适合对外强调的三个点

- `Launch Protection`
  - 启动期限制单笔买入、增加冷却时间，降低抢跑与瞬时冲击
- `Community Unlock`
  - 市场不靠死时间推进，而是随着真实买家和早期 LP 参与逐步解锁
- `Role-driven UX`
  - 用轻量身份和积分，把 Hook 的链上机制变成用户可感知的产品反馈

## 当前前端状态

- 本地前端已切到 `X Layer Mainnet`
- 本地地址：`http://localhost:3000`
- 环境文件：[`.env.local`](/Users/xuzhendong/Desktop/Hackathon/.env.local)

## 可直接复用的发文句子

`Pulse Launch is now live on X Layer Mainnet.`

`Pulse Launch brings fair launch protection, community unlocks, and early LP role mechanics to a Uniswap v4 Hook-powered market.`
