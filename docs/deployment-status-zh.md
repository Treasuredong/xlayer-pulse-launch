# Pulse Launch 当前部署状态

更新时间：2026-05-28

## 1. X Layer Mainnet

### PoolManager

- `0x0F5796713F5abB1FB2941Fa56EBa0cD3cc3e277d`

### 主网 Hook

- `0x53Ff23a575cfA006D37bA137188B1973e94B84C0`

### Hook Salt

- `0x0000000000000000000000000000000000000000000000000000000000000352`

### 主网 Token

- TokenA (`PULSE`): `0x39d795d0565aDBF41E1d918a7272ab7456999248`
- TokenB (`LUSD`): `0x1Ff22784E6217AA38d1B8E2F297556f28d42F63B`

### 主网路由

- PoolSwapTest: `0xbEE1af595fd7c0Cdceb1f27B741D50DF39120d8D`
- PoolModifyLiquidityTest: `0x604D203eE62C4A08326179e4fBC535eEB43573f1`

### 主网 Pool 信息

- `currency0`: `0x1Ff22784E6217AA38d1B8E2F297556f28d42F63B`
- `currency1`: `0x39d795d0565aDBF41E1d918a7272ab7456999248`
- `fee`: `0x800000` (dynamic fee)
- `tickSpacing`: `60`
- `Pool ID`: `0x84c9444d81255b3ecd64df837eb74ad93346d5c58318d2fbed9a00690d734f91`

## 2. X Layer Testnet 归档

此前测试网已完成完整验证，当前主网部署使用的是同一套合约与前端结构，测试网地址保留在 Git 历史和广播产物中用于追溯。

## 3. 当前结论

已经完成：

- 主网 PoolManager 部署
- 主网带权限位 Hook 部署
- 主网 PULSE / LUSD 部署
- 主网 swap / modifyLiquidity 路由部署
- 主网 pool 初始化
- 主网第一笔流动性注入

这意味着：

- 当前项目已经具备真实的 X Layer Mainnet v4 Hook + Pool 部署基础
- 前端也已经切换到主网参数，可直接作为主网版本继续收尾
