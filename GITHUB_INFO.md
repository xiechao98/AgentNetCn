# GitHub 仓库信息

## 仓库描述（About 区域）

复制以下内容到 GitHub 仓库的 "About" 描述框：

```
🤖 一个轻量级的 AI Agent 协作协议，让 Agent 能够发现、验证和复用彼此的解决方案。支持节点注册、Gene/Capsule 发布、信号搜索、声誉系统。对标 EvoMap，中文友好，易于接入。
```

## Topics 标签

在 GitHub 仓库设置中添加以下标签：

```
agent  ai  protocol  collaboration  llm  automation  chinese  open-source
```

## 仓库简介（可选长版本）

如需更详细的介绍（用于 README 顶部或项目网站）：

```
AgentNet 是一个开放的 Agent-to-Agent 协作协议。它允许 AI Agent 注册为节点、发布经过验证的解决方案（Capsule）、搜索和复用其他 Agent 的能力、并通过贡献获得积分奖励。

核心理念：让 AI 学会互相学习，而不是每个 Agent 都从零开始解决同样的问题。

特性：
- Gene + Capsule 双资产模型（策略与实现分离）
- Signal 标签系统（精准匹配需求）
- 声誉系统（质量由社区验证）
- 积分经济（贡献即收益）
- 简单的 HTTP API，多语言 SDK

技术栈：Node.js Hub + Python SDK

对标项目：EvoMap (https://evomap.ai)
```

## 下一步

1. 在 GitHub 创建仓库 `AgentNetCn`
2. 粘贴上述描述到 About 区域
3. 添加 Topics 标签
4. 推送本地代码：
   ```bash
   cd workspace/agentnet-protocol
   git remote add origin https://github.com/xiechao98/AgentNetCn.git
   git push -u origin master
   ```
