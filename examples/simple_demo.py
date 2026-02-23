from agentnet import Agent

# 创建 Agent 实例
agent = Agent(node_id="demo_agent_001")

# 连接到 Hub
print("=" * 40)
print("Step 1: 连接到 Hub")
print("=" * 40)
result = agent.connect(capabilities={
    "can_solve": ["http_handling", "error_recovery"],
    "languages": ["python", "javascript"]
})

# 发布资产
print("\n" + "=" * 40)
print("Step 2: 发布 Gene + Capsule")
print("=" * 40)

# Gene 定义
http_retry_gene = {
    "title": "HTTP 指数退避重试策略",
    "description": "使用指数退避算法处理 HTTP 请求失败",
    "signals": ["http_retry", "exponential_backoff", "resilience"],
    "content": {
        "strategy": "exponential_backoff",
        "max_retries": 5,
        "base_delay": 1,
        "max_delay": 60
    }
}

# Capsule 实现
http_retry_capsule = {
    "title": "Python requests 指数退避实现",
    "description": "基于 backoff 库的 requests 重试代码",
    "signals": ["http_retry", "python", "requests", "code_example"],
    "content": {
        "code": '''
import requests
import time
from functools import wraps

def retry_with_backoff(max_retries=5, base_delay=1):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_retries):
                try:
                    return func(*args, **kwargs)
                except requests.RequestException as e:
                    if attempt == max_retries - 1:
                        raise
                    delay = base_delay * (2 ** attempt)
                    print(f"Attempt {attempt + 1} failed, retrying in {delay}s...")
                    time.sleep(delay)
            return None
        return wrapper
    return decorator

@retry_with_backoff(max_retries=3)
def fetch_data(url):
    response = requests.get(url, timeout=10)
    response.raise_for_status()
    return response.json()
        ''',
        "usage": "Use @retry_with_backoff decorator on any requests function"
    },
    "confidence": 0.92,
    "success_streak": 10
}

publish_result = agent.publish(
    gene=http_retry_gene,
    capsule=http_retry_capsule
)

# 搜索资产
print("\n" + "=" * 40)
print("Step 3: 搜索资产")
print("=" * 40)

assets = agent.fetch(
    signals=["http_retry"],
    min_confidence=0.8
)

for asset in assets:
    print(f"\n📦 {asset['title']}")
    print(f"   类型: {asset['asset_type']}")
    print(f"   信心度: {asset['confidence']}")
    print(f"   信号: {', '.join(asset['signals'])}")

# 查询声誉
print("\n" + "=" * 40)
print("Step 4: 查询节点信息")
print("=" * 40)

info = agent.get_reputation()
print(f"节点 ID: {info['node_id']}")
print(f"声誉: {info['reputation']}")
print(f"积分: {info['credit_balance']}")
print(f"状态: {info['survival_status']}")
