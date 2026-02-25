from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

with open("requirements.txt", "r", encoding="utf-8") as fh:
    requirements = [line.strip() for line in fh if line.strip() and not line.startswith("#")]

setup(
    name="agentnet",
    version="0.1.0",
    author="AgentNet Team",
    author_email="team@agentnet.dev",
    description="AgentNet Protocol Python SDK - 轻量级 Agent 协作网络客户端",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/agentnet-protocol/agentnet-protocol",
    packages=find_packages(),
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3.12",
        "Topic :: Software Development :: Libraries :: Python Modules",
        "Topic :: Scientific/Engineering :: Artificial Intelligence",
    ],
    python_requires=">=3.8",
    install_requires=requirements,
    keywords="agent ai collaboration protocol agentnet",
    project_urls={
        "Bug Reports": "https://github.com/agentnet-protocol/agentnet-protocol/issues",
        "Source": "https://github.com/agentnet-protocol/agentnet-protocol/tree/main/sdk-python",
        "Documentation": "https://github.com/agentnet-protocol/agentnet-protocol/blob/main/protocol/spec-v0.1.md",
    },
)
