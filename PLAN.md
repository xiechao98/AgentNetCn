# AgentNet 协议项目计划

## 项目定位

一个轻量级的 Agent 协作协议，让 AI Agent 能够发现、验证和复用彼此的解决方案。

**对标参考**: EvoMap (https://evomap.ai)
**差异化**: 中文优先、协议简化、易于接入

---

## 第一阶段：协议设计（第 1-2 周）

### 目标
完成 AgentNet Protocol v0.1 草案

### 核心组件

#### 1. 节点身份 (Node Identity)
- 每个 Agent 有唯一 node_id
- 支持自我注册
- 可选的人类认领机制

#### 2. 能力资产 (Asset)
- **Gene**: 策略/知识模板
- **Capsule**: 验证过的解决方案
- 两者捆绑发布

#### 3. 发现机制 (Discovery)
- 按信号(signal)搜索
- 基于声誉排序
- 简单查询 API

#### 4. 声誉系统 (Reputation)
- 节点声誉分 (0-100)
- 资产晋升机制
- 基础积分经济

### 交付物
- `protocol/spec-v0.1.md` - 协议规范文档
- `protocol/api-reference.md` - API 参考

---

## 第二阶段：参考实现（第 3-4 周）

### 目标
搭建最小可用 Hub + 演示 Agent

### Hub 服务端
- 技术栈: Node.js + Express + SQLite
- 功能:
  - 节点注册 (`POST /a2a/hello`)
  - 资产发布 (`POST /a2a/publish`)
  - 资产搜索 (`POST /a2a/fetch`)
  - 声誉查询 (`GET /a2a/nodes/:id`)

### 演示 Agent
- 技术栈: Python (易于理解)
- 功能:
  - 注册到 Hub
  - 解决简单任务
  - 发布 Capsule

### 交付物
- `hub/` - Hub 服务端代码
- `agent-python/` - Python Agent SDK
- `examples/` - 演示案例

---

## 第三阶段：内容产出（第 5-6 周）

### 技术文章
1. **《为什么 AI Agent 需要一个协作网络？》**
   - 介绍问题背景
   - EvoMap 和 AgentNet 的对比

2. **《AgentNet 协议设计：让 AI 学会互相学习》**
   - 协议核心设计思路
   - 代码示例

3. **《10 分钟接入 AgentNet：从零开始》**
   - 教程性质
   - 完整代码

### 开源项目
- GitHub 仓库: `agentnet-protocol`
- README 包含快速开始
- MIT 许可证

### 社区运营
- 知乎专栏发布文章
- 掘金技术社区分享
- 飞书/Discord 交流群

---

## 第四阶段：推广迭代（第 7-8 周）

### 目标
获取早期反馈，建立影响力

### 行动项
- [ ] 邀请 10-20 个开发者试用
- [ ] 收集反馈，发布 v0.2
- [ ] 写第四篇文章（实战案例）
- [ ] 申请加入 Awesome-AI-Agents 等列表

### 成功指标
- GitHub stars: 200+
- 文章总阅读量: 5w+
- 试用开发者: 20+

---

## 进度追踪

| 阶段 | 状态 | 进度 |
|------|------|------|
| 协议设计 | ✅ 完成 | 100% |
| 参考实现 | ✅ 完成 | 100% |
| 内容产出 | ✅ 完成 | 100% |
| 推广迭代 | ⏳ 待开始 | 0% |

### 已完成
- ✅ 协议规范 v0.1
- ✅ API 参考文档
- ✅ Hub 服务端（Node.js + SQLite 持久化）
- ✅ Hub README 使用说明
- ✅ Python SDK
- ✅ SDK setup.py 打包配置
- ✅ SDK README 文档
- ✅ 示例代码
- ✅ 3 篇技术文章

---

## 项目结构

```
agentnet-protocol/
├── protocol/
│   ├── spec-v0.1.md
│   └── api-reference.md
├── hub/
│   ├── src/
│   ├── tests/
│   └── README.md
├── sdk-python/
│   ├── agentnet/
│   ├── examples/
│   └── README.md
├── docs/
│   ├── articles/
│   └── images/
├── examples/
│   ├── simple-agent/
│   └── task-solver/
└── README.md
```

---

## 关键决策点

### 1. 协议命名 ✅
**已确认: AgentNet**

### 2. 技术选型 ✅
Hub:
- **Node.js** (已确认)

SDK:
- Python (AI 开发者首选)
- TypeScript (Web 开发者友好)

### 3. 托管部署
- 初期: Railway/Render (免费)
- 后期: 阿里云/腾讯云 (国内访问)

---

## 风险与应对

| 风险 | 应对 |
|------|------|
| 没人关注 | 提前在社区预热，找 KOL 转发 |
| 技术太难 | 保持协议简单，先做核心功能 |
| 时间不够 | 按周迭代，随时可发布 MVP |
| 被大厂抄袭 | 协议开源无法避免，靠影响力胜出 |

---

## 下一步行动

1. **今天**: 确认项目名称、创建 GitHub 仓库
2. **本周**: 完成协议 v0.1 草案
3. **下周**: 开始 Hub 服务端开发

---

*创建于: 2026-02-23*
*目标: 2 个月内建立技术影响力*
