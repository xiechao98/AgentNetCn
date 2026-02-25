const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'agentnet.db');

// 中间件
app.use(cors());
app.use(express.json());

// 协议常量
const PROTOCOL = 'agentnet-a2a';
const VERSION = '0.1.0';
const STARTER_CREDITS = 500;

// 初始化数据库
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('📦 Connected to SQLite database');
    initDatabase();
  }
});

// 创建表
function initDatabase() {
  db.serialize(() => {
    // 节点表
    db.run(`CREATE TABLE IF NOT EXISTS nodes (
      node_id TEXT PRIMARY KEY,
      claim_code TEXT UNIQUE,
      claim_url TEXT,
      credits INTEGER DEFAULT ${STARTER_CREDITS},
      reputation INTEGER DEFAULT 30,
      status TEXT DEFAULT 'alive',
      created_at TEXT,
      last_seen TEXT,
      capabilities TEXT,
      gene_count INTEGER DEFAULT 0,
      capsule_count INTEGER DEFAULT 0,
      referrer TEXT
    )`);

    // 资产表
    db.run(`CREATE TABLE IF NOT EXISTS assets (
      asset_id TEXT PRIMARY KEY,
      node_id TEXT,
      asset_type TEXT,
      title TEXT,
      description TEXT,
      signals TEXT,
      content TEXT,
      confidence REAL DEFAULT 0.5,
      success_streak INTEGER DEFAULT 1,
      status TEXT DEFAULT 'candidate',
      created_at TEXT,
      FOREIGN KEY (node_id) REFERENCES nodes(node_id)
    )`);

    // 任务表
    db.run(`CREATE TABLE IF NOT EXISTS tasks (
      task_id TEXT PRIMARY KEY,
      title TEXT,
      description TEXT,
      signals TEXT,
      reward INTEGER,
      status TEXT DEFAULT 'open',
      created_at TEXT,
      assigned_to TEXT
    )`);

    console.log('✅ Database tables initialized');
  });
}

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

// Promise 包装的数据库操作
function dbGet(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function dbAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function dbRun(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

// ========== 路由 ==========

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', version: VERSION });
});

// 节点注册
app.post('/a2a/hello', async (req, res) => {
  try {
    const { sender_id, payload = {} } = req.body;
    
    if (!sender_id) {
      return res.status(400).json({ error: 'sender_id required' });
    }

    // 检查是否已注册
    let node = await dbGet('SELECT * FROM nodes WHERE node_id = ?', [sender_id]);
    
    if (!node) {
      // 新节点
      const claimCode = generateClaimCode();
      const now = new Date().toISOString();
      const capabilities = JSON.stringify(payload.capabilities || {});
      
      await dbRun(
        `INSERT INTO nodes (node_id, claim_code, claim_url, credits, reputation, status, 
         created_at, last_seen, capabilities, gene_count, capsule_count, referrer)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [sender_id, claimCode, `http://localhost:${PORT}/claim/${claimCode}`, 
         STARTER_CREDITS, 30, 'alive', now, now, capabilities, 0, 0, 
         payload.referrer || null]
      );
      
      node = await dbGet('SELECT * FROM nodes WHERE node_id = ?', [sender_id]);
    } else {
      // 更新最后活跃时间
      await dbRun('UPDATE nodes SET last_seen = ? WHERE node_id = ?', 
        [new Date().toISOString(), sender_id]);
    }

    // 获取推荐任务
    const tasks = await dbAll('SELECT * FROM tasks WHERE status = "open" LIMIT 5');

    // 获取网络统计
    const stats = await dbGet('SELECT COUNT(*) as total_agents FROM nodes');
    const assetStats = await dbGet('SELECT COUNT(*) as total_assets FROM assets');

    const response = createResponse('hello', 'hub_main', {
      status: 'acknowledged',
      hub_node_id: 'hub_main',
      claim_code: node.claim_code,
      claim_url: node.claim_url,
      credit_balance: node.credits,
      survival_status: node.status,
      referral_code: sender_id,
      recommended_tasks: tasks.map(t => ({
        task_id: t.task_id,
        title: t.title,
        signals: JSON.parse(t.signals || '[]')
      })),
      network_manifest: {
        name: 'AgentNet',
        description: 'AI Agent 协作网络',
        stats: {
          total_agents: stats.total_agents,
          total_assets: assetStats.total_assets
        }
      }
    });

    res.json(response);
  } catch (err) {
    console.error('Hello error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 发布资产
app.post('/a2a/publish', async (req, res) => {
  try {
    const { sender_id, payload = {} } = req.body;
    const { assets: assetList = [] } = payload;

    if (!sender_id) {
      return res.status(400).json({ error: 'sender_id required' });
    }

    const node = await dbGet('SELECT * FROM nodes WHERE node_id = ?', [sender_id]);
    if (!node) {
      return res.status(404).json({ error: 'node not found' });
    }

    if (assetList.length === 0) {
      return res.status(400).json({ error: 'assets required' });
    }

    const savedAssets = [];
    let newCredits = node.credits;

    for (const asset of assetList) {
      const assetId = generateId('asset');
      const now = new Date().toISOString();
      
      // 自动晋升检查
      let status = 'candidate';
      const confidence = asset.confidence || 0.5;
      if (confidence >= 0.5 && node.reputation >= 30) {
        status = 'promoted';
        newCredits += 100; // 晋升奖励
      }

      await dbRun(
        `INSERT INTO assets (asset_id, node_id, asset_type, title, description, 
         signals, content, confidence, success_streak, status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [assetId, sender_id, asset.asset_type, asset.title, asset.description,
         JSON.stringify(asset.signals || []), JSON.stringify(asset.content || {}),
         confidence, asset.success_streak || 1, status, now]
      );

      savedAssets.push({
        asset_id: assetId,
        asset_type: asset.asset_type,
        status: status
      });

      // 更新节点计数
      if (asset.asset_type === 'Gene') {
        await dbRun('UPDATE nodes SET gene_count = gene_count + 1 WHERE node_id = ?', [sender_id]);
      }
      if (asset.asset_type === 'Capsule') {
        await dbRun('UPDATE nodes SET capsule_count = capsule_count + 1 WHERE node_id = ?', [sender_id]);
      }
    }

    // 更新积分
    if (newCredits !== node.credits) {
      await dbRun('UPDATE nodes SET credits = ? WHERE node_id = ?', [newCredits, sender_id]);
    }

    const response = createResponse('publish', 'hub_main', {
      status: 'published',
      assets: savedAssets,
      credit_balance: newCredits
    });

    res.json(response);
  } catch (err) {
    console.error('Publish error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 搜索资产
app.post('/a2a/fetch', async (req, res) => {
  try {
    const { payload = {} } = req.body;
    const { query, signals = [], filters = {}, limit = 10 } = payload;

    let sql = 'SELECT * FROM assets WHERE status = "promoted"';
    const params = [];

    // 按类型过滤
    if (filters.asset_type) {
      sql += ' AND asset_type = ?';
      params.push(filters.asset_type);
    }

    // 按信心度过滤
    if (filters.min_confidence) {
      sql += ' AND confidence >= ?';
      params.push(filters.min_confidence);
    }

    sql += ' ORDER BY confidence DESC LIMIT ?';
    params.push(limit);

    const results = await dbAll(sql, params);

    // 按信号过滤（在后处理中实现，因为 SQLite 不支持数组操作）
    let filtered = results;
    if (signals.length > 0) {
      filtered = results.filter(a => {
        const assetSignals = JSON.parse(a.signals || '[]');
        return signals.some(s => assetSignals.includes(s));
      });
    }

    const response = createResponse('fetch', 'hub_main', {
      assets: filtered.map(a => ({
        asset_id: a.asset_id,
        asset_type: a.asset_type,
        title: a.title,
        description: a.description,
        signals: JSON.parse(a.signals || '[]'),
        confidence: a.confidence,
        node_id: a.node_id
      })),
      total: filtered.length
    });

    res.json(response);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 查询节点信息
app.get('/a2a/nodes/:nodeId', async (req, res) => {
  try {
    const node = await dbGet('SELECT * FROM nodes WHERE node_id = ?', [req.params.nodeId]);
    
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
  } catch (err) {
    console.error('Node query error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 启动服务
app.listen(PORT, () => {
  console.log(`🚀 AgentNet Hub v${VERSION} running on port ${PORT}`);
  console.log(`📡 Protocol: ${PROTOCOL}`);
  console.log(`💾 Database: ${DB_PATH}`);
});

// 优雅关闭
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) console.error('Database close error:', err);
    else console.log('📦 Database connection closed');
    process.exit(0);
  });
});

module.exports = { app, db };
