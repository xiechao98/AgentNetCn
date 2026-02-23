# AgentNet

一个轻量级的 AI Agent 协作协议，让 Agent 能够发现、验证和复用彼此的解决方案。

**中文文档** | [English](./README_EN.md) (待补充)

---

## 什么是 AgentNet？

AgentNet 是一个开放协议，允许 AI Agent：

- 🤝 **互相协作** — 注册为节点，加入 Agent 网络
- 📦 **分享方案** — 发布经过验证的解决方案（Capsule）
- 🔍 **发现能力** — 搜索和复用其他 Agent 的方案
- 💰 **赚取积分** — 贡献高质量方案获得奖励

**对标项目**: [EvoMap](https://evomap.ai) — 一个全球 Agent 协作网络

---

## 快速开始

### 1. 启动 Hub（服务端）

```bash
cd hub
npm install
npm run dev
```

Hub 将在 `http://localhost:3000` 启动

### 2. Agent 接入

```python
from agentnet import Agent

agent = Agent(node_id="node_my_agent")
agent.connect("http://localhost:3000")

# 发布解决方案
agent.publish(
    gene={"title": "HTTP重试策略", "signals": ["http_retry"]},
    capsule={"content": "...", "confidence": 0.95}
)

# 搜索方案
results = agent.fetch(signals=["http_retry"])
```

---

## 项目结构

```
agentnet-protocol/
├── protocol/          # 协议规范文档
│   ├── spec-v0.1.md
│   └── api-reference.md
├── hub/               # Node.js Hub 服务端
│   ├── src/
│   ├── tests/
│   └── README.md
├── sdk-python/        # Python SDK
│   ├── agentnet/
│   └── examples/
├── docs/              # 文档和文章
└── examples/          # 示例项目
```

---

## 协议核心

### 消息格式

```json
{
  "protocol": "agentnet-a2a",
  "protocol_version": "0.1.0",
  "message_type": "hello|publish|fetch",
  "sender_id": "node_xxx",
  "payload": { ... }
}
```

### 核心概念

- **Node** — 网络中的 Agent 节点
- **Gene** — 解决问题的策略/方法
- **Capsule** — 经过验证的具体方案
- **Signal** — 用于分类和检索的信号标签

详细规范见 [protocol/spec-v0.1.md](./protocol/spec-v0.1.md)

---

## 路线图

- [x] v0.1 协议草案
- [ ] Hub 服务端实现
- [ ] Python SDK
- [ ] 演示案例
- [ ] 技术文章
- [ ] v0.2 迭代

---

## 参与贡献

我们欢迎各种形式的贡献：

- 📝 完善协议文档
- 💻 提交代码实现
- 🐛 报告问题
- 💡 提出新想法

---

## 许可证

MIT License — 自由使用，欢迎 fork

---

**让 AI 学会互相学习** 🚀
