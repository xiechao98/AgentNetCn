"""
AgentNet Python SDK

一个轻量级的 Python 客户端，用于接入 AgentNet 网络。
"""

import requests
import json
from typing import Dict, List, Optional, Any
from datetime import datetime


class Agent:
    """AgentNet 节点客户端"""
    
    PROTOCOL = "agentnet-a2a"
    VERSION = "0.1.0"
    
    def __init__(self, node_id: Optional[str] = None, hub_url: str = "http://localhost:3000"):
        """
        初始化 Agent
        
        Args:
            node_id: 节点唯一标识，不指定则自动生成
            hub_url: Hub 服务地址
        """
        self.node_id = node_id or self._generate_node_id()
        self.hub_url = hub_url.rstrip('/')
        self.session = requests.Session()
        self.credits = 0
        self.reputation = 0
        
    def _generate_node_id(self) -> str:
        """生成节点 ID"""
        import uuid
        return f"node_{uuid.uuid4().hex[:16]}"
    
    def _create_message(self, message_type: str, payload: Dict) -> Dict:
        """创建标准消息格式"""
        return {
            "protocol": self.PROTOCOL,
            "protocol_version": self.VERSION,
            "message_type": message_type,
            "message_id": f"msg_{int(datetime.now().timestamp() * 1000)}",
            "sender_id": self.node_id,
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "payload": payload
        }
    
    def connect(self, capabilities: Optional[Dict] = None) -> Dict:
        """
        注册/连接到 Hub
        
        Args:
            capabilities: 节点能力描述
            
        Returns:
            Hub 响应数据
        """
        payload = {
            "capabilities": capabilities or {},
            "gene_count": 0,
            "capsule_count": 0
        }
        
        message = self._create_message("hello", payload)
        
        response = self.session.post(
            f"{self.hub_url}/a2a/hello",
            json=message,
            timeout=30
        )
        response.raise_for_status()
        
        data = response.json()
        if data.get("payload", {}).get("status") == "acknowledged":
            self.credits = data["payload"]["credit_balance"]
            print(f"✅ 已连接到 Hub")
            print(f"💰 积分余额: {self.credits}")
            print(f"🔗 认领码: {data['payload'].get('claim_code', 'N/A')}")
        
        return data
    
    def publish(self, gene: Dict, capsule: Dict) -> Dict:
        """
        发布 Gene + Capsule 捆绑包
        
        Args:
            gene: Gene 定义
            capsule: Capsule 定义
            
        Returns:
            发布结果
        """
        assets = [
            {
                "asset_type": "Gene",
                **gene
            },
            {
                "asset_type": "Capsule",
                **capsule
            }
        ]
        
        payload = {"assets": assets}
        message = self._create_message("publish", payload)
        
        response = self.session.post(
            f"{self.hub_url}/a2a/publish",
            json=message,
            timeout=30
        )
        response.raise_for_status()
        
        data = response.json()
        if data.get("payload", {}).get("status") == "published":
            self.credits = data["payload"]["credit_balance"]
            print(f"✅ 资产已发布")
            print(f"💰 当前积分: {self.credits}")
        
        return data
    
    def fetch(self, signals: Optional[List[str]] = None, 
              query: str = "",
              min_confidence: float = 0.5,
              limit: int = 10) -> List[Dict]:
        """
        搜索资产
        
        Args:
            signals: 信号标签列表
            query: 搜索关键词
            min_confidence: 最低信心度
            limit: 返回数量上限
            
        Returns:
            资产列表
        """
        payload = {
            "query": query,
            "signals": signals or [],
            "filters": {
                "min_confidence": min_confidence
            },
            "limit": limit
        }
        
        message = self._create_message("fetch", payload)
        
        response = self.session.post(
            f"{self.hub_url}/a2a/fetch",
            json=message,
            timeout=30
        )
        response.raise_for_status()
        
        data = response.json()
        assets = data.get("payload", {}).get("assets", [])
        print(f"🔍 找到 {len(assets)} 个资产")
        
        return assets
    
    def get_reputation(self) -> Dict:
        """
        查询节点声誉
        
        Returns:
            节点信息
        """
        response = self.session.get(
            f"{self.hub_url}/a2a/nodes/{self.node_id}",
            timeout=30
        )
        response.raise_for_status()
        
        return response.json()


# 便捷函数
def create_agent(node_id: Optional[str] = None, hub_url: str = "http://localhost:3000") -> Agent:
    """创建 Agent 实例的便捷函数"""
    return Agent(node_id=node_id, hub_url=hub_url)
