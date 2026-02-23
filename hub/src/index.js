const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// 内存存储（开发阶段）
const nodes = new Map();
const assets = new Map();
const tasks = [];

// 中间件
app.use(cors());
app.use(express.json());

// 协议常量
const PROTOCOL = 'agentnet-a2a';
const VERSION = '0.1.0';
const STARTER_CREDITS = 500;

// 生成 ID
function generateId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// 生成认领码
function generateClaimCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
    if (i === 3) code += '-';
  }
  return code;
}

// 创建响应
function createResponse(messageType, senderId, payload) {
  return {
    protocol: PROTOCOL,
    protocol_version: VERSION,
    message_type: messageType,
    message_id: generateId('msg'),
    sender_id: senderId,
    timestamp: new Date().toISOString(),
    payload
  };
}

// ========== 路由 ==========

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', version: VERSION });
});

// 节点注册
app.post('/a2a/hello', (req, res) => {
  const { sender_id, payload = {} } = req.body;
  
  if (!sender_id) {
    return res.status(400).json({ error: 'sender_id required' });
  }

  // 检查是否已注册
  let node = nodes.get(sender_id);
  
  if (!node) {
    // 新节点
    node = {
      node_id: sender_id,
      claim_code: generateClaimCode(),
      claim_url: `http://localhost:${PORT}/claim/${generateClaimCode()}`,
      credits: STARTER_CREDITS,
      reputation: 30,
      status: 'alive',
      created_at: new Date().toISOString(),
      last_seen: new Date().toISOString(),
      capabilities: payload.capabilities || {},
      gene_count: 0,
      capsule_count: 0,
      referrer: payload.referrer || null
    };
    nodes.set(sender_id, node);
  } else {
    // 更新最后活跃时间
    node.last_seen = new Date().toISOString();
  }

  // 返回响应
  const response = createResponse('hello', 'hub_main', {
    status: 'acknowledged',
    hub_node_id: 'hub_main',
    claim_code: node.claim_code,
    claim_url: node.claim_url,
    credit_balance: node.credits,
    survival_status: node.status,
    referral_code: sender_id,
    recommended_tasks: tasks.slice(0, 5).map(t => ({
      task_id: t.task_id,
      title: t.title,
      signals: t.signals
    })),
    network_manifest: {
      name: 'AgentNet',
      description: 'AI Agent 协作网络',
      stats: {
        total_agents: nodes.size,
        total_assets: assets.size
      }
    }
  });

  res.json(response);
});

// 发布资产
app.post('/a2a/publish', (req, res) => {
  const { sender_id, payload = {} } = req.body;
  const { assets: assetList = [] } = payload;

  if (!sender_id) {
    return res.status(400).json({ error: 'sender_id required' });
  }

  const node = nodes.get(sender_id);
  if (!node) {
    return res.status(404).json({ error: 'node not found' });
  }

  if (assetList.length === 0) {
    return res.status(400).json({ error: 'assets required' });
  }

  // 保存资产
  const savedAssets = [];
  for (const asset of assetList) {
    const assetId = generateId('asset');
    const saved = {
      asset_id: assetId,
      node_id: sender_id,
      asset_type: asset.asset_type,
      title: asset.title,
      description: asset.description,
      signals: asset.signals || [],
      content: asset.content,
      confidence: asset.confidence || 0.5,
      success_streak: asset.success_streak || 1,
      status: 'candidate',
      created_at: new Date().toISOString()
    };
    assets.set(assetId, saved);
    savedAssets.push(saved);

    // 更新节点计数
    if (asset.asset_type === 'Gene') node.gene_count++;
    if (asset.asset_type === 'Capsule') node.capsule_count++;
  }

  // 自动晋升检查（简化版）
  for (const asset of savedAssets) {
    if (asset.confidence >= 0.5 && node.reputation >= 30) {
      asset.status = 'promoted';
      node.credits += 100; // 晋升奖励
    }
  }

  const response = createResponse('publish', 'hub_main', {
    status: 'published',
    assets: savedAssets.map(a => ({
      asset_id: a.asset_id,
      status: a.status
    })),
    credit_balance: node.credits
  });

  res.json(response);
});

// 搜索资产
app.post('/a2a/fetch', (req, res) => {
  const { payload = {} } = req.body;
  const { query, signals = [], filters = {}, limit = 10 } = payload;

  let results = Array.from(assets.values());

  // 按信号过滤
  if (signals.length > 0) {
    results = results.filter(a => 
      signals.some(s => a.signals.includes(s))
    );
  }

  // 按类型过滤
  if (filters.asset_type) {
    results = results.filter(a => a.asset_type === filters.asset_type);
  }

  // 按信心度过滤
  if (filters.min_confidence) {
    results = results.filter(a => a.confidence >= filters.min_confidence);
  }

  // 只返回已晋升的
  results = results.filter(a => a.status === 'promoted');

  // 限制数量
  results = results.slice(0, limit);

  const response = createResponse('fetch', 'hub_main', {
    assets: results.map(a => ({
      asset_id: a.asset_id,
      asset_type: a.asset_type,
      title: a.title,
      description: a.description,
      signals: a.signals,
      confidence: a.confidence,
      node_id: a.node_id
    })),
    total: results.length
  });

  res.json(response);
});

// 查询节点信息
app.get('/a2a/nodes/:nodeId', (req, res) => {
  const node = nodes.get(req.params.nodeId);
  
  if (!node) {
    return res.status(404).json({ error: 'node not found' });
  }

  res.json({
    node_id: node.node_id,
    reputation: node.reputation,
    credit_balance: node.credits,
    survival_status: node.status,
    gene_count: node.gene_count,
    capsule_count: node.capsule_count,
    created_at: node.created_at,
    last_seen: node.last_seen
  });
});

// 启动服务
app.listen(PORT, () => {
  console.log(`🚀 AgentNet Hub v${VERSION} running on port ${PORT}`);
  console.log(`📡 Protocol: ${PROTOCOL}`);
});

module.exports = app;
