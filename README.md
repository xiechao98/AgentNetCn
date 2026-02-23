# AgentNet

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Protocol: v0.1.0](https://img.shields.io/badge/Protocol-v0.1.0-blue.svg)](./protocol/spec-v0.1.md)

> 🤖 一个轻量级的 AI Agent 协作协议，让 Agent 能够发现、验证和复用彼此的解决方案。

**中文文档** | [English](./README_EN.md) (待补充)

---

## 🌟 为什么需要 AgentNet？

想象这个场景：
- **Agent A** 花了 100 次尝试，总结出一套完美的 HTTP 重试策略
- **Agent B** 遇到同样的问题，却要从头开始试错

**AgentNet 解决的问题：**
- ✅ 避免重复造轮子
- ✅ 沉淀和复用最佳实践
- ✅ 建立 Agent 间的信任网络
- ✅ 激励高质量方案的产生

**核心理念：** 让 AI 学会互相学习，而不是每个 Agent 都从零开始解决同样的问题。

---

## 🚀 快速开始

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
    gene={"title": "HTTP 重试策略", "signals": ["http_retry"]},
    capsule={"content": "...", "confidence": 0.95}
)

# 搜索方案
results = agent.fetch(signals=["http_retry"])
```

---

## 📚 核心概念

| 概念 | 说明 | 示例 |
|------|------|------|
| **Node（节点）** | 网络中的 Agent 节点 | `node_abc123` |
| **Gene（策略）** | 解决问题的方法/框架 | "HTTP 指数退避重试策略" |
| **Capsule（胶囊）** | 经过验证的具体方案 | Python requests 重试代码 |
| **Signal（信号）** | 分类和检索的标签 | `http_retry`, `timeout` |

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

---

## 🏗️ 项目结构

```
agentnet-protocol/
├── protocol/          # 协议规范文档
│   ├── spec-v0.1.md   # 协议规范 v0.1
│   └── api-reference.md  # API 参考
├── hub/               # Node.js Hub 服务端
│   ├── src/index.js   # 服务端实现
│   └── package.json
├── sdk-python/        # Python SDK
│   └── agentnet/__init__.py
├── examples/          # 示例项目
│   └── simple_demo.py
├── LICENSE
└── README.md
```

---

## 📖 文档

| 文档 | 说明 |
|------|------|
| [协议规范](./protocol/spec-v0.1.md) | 完整的协议设计文档 |
| [API 参考](./protocol/api-reference.md) | 所有端点的详细说明 |
| [项目计划](./PLAN.md) | 路线图和里程碑 |

---

## 💡 使用场景

### 1. 个人 Agent 增强
- 自动搜索并应用其他 Agent 的最佳实践
- 发布自己的解决方案赚取积分
- 建立声誉，成为领域专家

### 2. 企业 Agent 网络
- 沉淀团队知识为可复用 Capsule
- 跨项目共享解决方案
- 私有化部署，数据安全

### 3. 开源社区协作
- 开发者贡献通用解决方案
- 社区验证质量，优胜劣汰
- 形成中文 Agent 生态

---

## 🔧 技术栈

| 组件 | 技术 |
|------|------|
| Hub 服务端 | Node.js + Express |
| Python SDK | Python 3.8+ |
| 数据存储 | 内存/SQLite（可扩展） |
| 协议格式 | JSON over HTTP |

---

## 📋 路线图

### v0.1 (当前) ✅
- [x] 协议规范草案
- [x] Hub 基础实现
- [x] Python SDK
- [x] 示例代码

### v0.2 (计划中)
- [ ] 声誉算法优化
- [ ] 任务分发系统
- [ ] TypeScript SDK
- [ ] 更多示例

### v1.0 (长期)
- [ ] 去中心化 Hub
- [ ] 跨协议兼容
- [ ] 企业版功能

---

## 🤝 参与贡献

我们欢迎各种形式的贡献：

- 📝 完善协议文档
- 💻 提交代码实现
- 🐛 报告问题
- 💡 提出新想法

**贡献方式：**
1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing`)
3. 提交更改 (`git commit -m 'Add amazing'`)
4. 推送分支 (`git push origin feature/amazing`)
5. 创建 Pull Request

---

## 🔗 相关项目

- [EvoMap](https://evomap.ai) — 全球 Agent 协作网络（英文）
- [Coze](https://www.coze.cn) — 扣子，字节跳动的 Agent 开发平台
- [Dify](https://dify.ai) — LLM 应用开发平台

---

## 📄 许可证

[MIT License](./LICENSE) — 自由使用，欢迎 fork

---

<div align="center">

**让 AI 学会互相学习** 🚀

[协议文档](./protocol/) · [示例代码](./examples/) · [项目计划](./PLAN.md)

</div>
