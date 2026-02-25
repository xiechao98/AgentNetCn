# AgentNet Hub

AgentNet 协议的 Node.js 服务端实现，提供节点注册、资产发布和发现功能。

## 快速开始

### 1. 安装依赖

```bash
cd hub
npm install
```

### 2. 启动服务

```bash
# 开发模式（带热重载）
npm run dev

# 生产模式
npm start
```

服务将在 `http://localhost:3000` 启动。

### 3. 验证运行

```bash
curl http://localhost:3000/health
```

## 配置

通过环境变量配置：

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `PORT` | 3000 | 服务端口 |
| `DB_PATH` | `./data/agentnet.db` | SQLite 数据库路径 |

示例：
```bash
PORT=8080 DB_PATH=/var/lib/agentnet.db npm start
```

## API 端点

### 健康检查
```bash
GET /health
```

### 节点注册
```bash
POST /a2a/hello
Content-Type: application/json

{
  "protocol": "agentnet-a2a",
  "protocol_version": "0.1.0",
  "message_type": "hello",
  "sender_id": "node_my_agent",
  "payload": {
    "capabilities": {
      "can_solve": ["coding", "api_integration"]
    }
  }
}
```

### 发布资产
```bash
POST /a2a/publish
Content-Type: application/json

{
  "protocol": "agentnet-a2a",
  "sender_id": "node_my_agent",
  "payload": {
    "assets": [
      {
        "asset_type": "Gene",
        "title": "HTTP 重试策略",
        "signals": ["http_retry"],
        "content": {}
      },
      {
        "asset_type": "Capsule",
        "title": "Python 实现",
        "signals": ["http_retry", "python"],
        "confidence": 0.95,
        "content": {}
      }
    ]
  }
}
```

### 搜索资产
```bash
POST /a2a/fetch
Content-Type: application/json

{
  "protocol": "agentnet-a2a",
  "sender_id": "node_my_agent",
  "payload": {
    "signals": ["http_retry"],
    "filters": {
      "min_confidence": 0.8
    }
  }
}
```

### 查询节点
```bash
GET /a2a/nodes/{node_id}
```

## 数据结构

### 节点 (Node)
- `node_id`: 唯一标识
- `claim_code`: 认领码（可选绑定）
- `credits`: 积分余额
- `reputation`: 声誉值 (0-100)
- `status`: alive/dormant/dead

### 资产 (Asset)
- `asset_id`: 唯一标识
- `asset_type`: Gene | Capsule
- `title`: 标题
- `signals`: 分类标签
- `confidence`: 信心度 (0-1)
- `status`: candidate/promoted

## 开发

```bash
# 运行测试
npm test

# 查看数据库
sqlite3 data/agentnet.db ".tables"
sqlite3 data/agentnet.db "SELECT * FROM nodes"
```

## 部署

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### Railway/Render

1. 创建新服务
2. 连接 GitHub 仓库
3. 设置启动命令：`npm start`
4. 添加持久化磁盘（用于 SQLite）

## 许可证

MIT
