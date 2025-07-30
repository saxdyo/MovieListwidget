#!/usr/bin/env python3
"""
GitHub Secrets 设置助手
"""

import os
import json
import urllib.request
import urllib.parse
from datetime import datetime

def check_environment():
    """检查环境变量"""
    print("🔍 检查环境变量...")
    
    tmdb_key = os.environ.get('TMDB_API_KEY')
    github_token = os.environ.get('GITHUB_TOKEN')
    gist_id = os.environ.get('GIST_ID')
    
    if not tmdb_key:
        print("❌ 请设置 TMDB_API_KEY 环境变量")
        return None
    
    if not github_token:
        print("❌ 请设置 GITHUB_TOKEN 环境变量")
        return None
    
    if not gist_id:
        print("❌ 请设置 GIST_ID 环境变量")
        return None
    
    print("✅ 所有环境变量已设置")
    return {
        'tmdb_key': tmdb_key,
        'github_token': github_token,
        'gist_id': gist_id
    }

def make_request(url, headers=None, data=None, method='GET'):
    """发送 HTTP 请求"""
    try:
        if data:
            data = json.dumps(data).encode('utf-8')
            headers = headers or {}
            headers['Content-Type'] = 'application/json'
        
        req = urllib.request.Request(url, data=data, headers=headers, method=method)
        with urllib.request.urlopen(req) as response:
            response_text = response.read().decode('utf-8')
            return json.loads(response_text)
    except Exception as e:
        print(f"请求失败: {e}")
        return None

def setup_github_secrets(config):
    """设置 GitHub Secrets"""
    print("🔧 设置 GitHub Secrets...")
    
    # 仓库信息
    repo_owner = "saxdyo"
    repo_name = "MovieListwidget"
    
    # 需要设置的 secrets
    secrets = {
        "TMDB_API_KEY": config['tmdb_key'],
        "GITHUB_TOKEN": config['github_token'],
        "GIST_ID": config['gist_id']
    }
    
    print(f"📦 仓库: {repo_owner}/{repo_name}")
    print("🔑 需要设置的 Secrets:")
    
    for secret_name, secret_value in secrets.items():
        print(f"  - {secret_name}: {secret_value[:10]}...")
    
    print("\n📋 手动设置步骤:")
    print("1. 访问: https://github.com/saxdyo/MovieListwidget/settings/secrets/actions")
    print("2. 点击 'New repository secret'")
    print("3. 添加以下 Secrets:")
    
    for secret_name, secret_value in secrets.items():
        print(f"   - Name: {secret_name}")
        print(f"   - Value: {secret_value}")
        print()
    
    print("✅ 设置完成后，GitHub Actions 将自动运行")
    print("⏰ 每6小时自动更新一次数据")
    
    return True

def test_github_connection(config):
    """测试 GitHub 连接"""
    print("🔗 测试 GitHub 连接...")
    
    url = "https://api.github.com/user"
    headers = {
        'Authorization': f'token {config["github_token"]}',
        'Accept': 'application/vnd.github.v3+json'
    }
    
    response_data = make_request(url, headers=headers)
    if response_data and 'login' in response_data:
        print(f"✅ GitHub 连接成功，用户: {response_data['login']}")
        return True
    else:
        print("❌ GitHub 连接失败")
        return False

def test_gist_access(config):
    """测试 Gist 访问"""
    print("📄 测试 Gist 访问...")
    
    url = f"https://api.github.com/gists/{config['gist_id']}"
    headers = {
        'Authorization': f'token {config["github_token"]}',
        'Accept': 'application/vnd.github.v3+json'
    }
    
    response_data = make_request(url, headers=headers)
    if response_data and 'files' in response_data:
        print("✅ Gist 访问成功")
        return True
    else:
        print("❌ Gist 访问失败")
        return False

def main():
    print("🚀 GitHub Secrets 设置助手")
    print("=" * 40)
    
    # 检查环境变量
    config = check_environment()
    if not config:
        return
    
    # 测试连接
    if not test_github_connection(config):
        return
    
    if not test_gist_access(config):
        return
    
    # 设置 GitHub Secrets
    setup_github_secrets(config)
    
    print("\n🎉 设置指南完成！")
    print("=" * 50)
    print("📝 下一步:")
    print("1. 按照上面的步骤设置 GitHub Secrets")
    print("2. 推送代码到 GitHub")
    print("3. 在 Actions 页面查看自动更新")
    print("4. 您的 Widget 现在使用自己的数据包！")

if __name__ == '__main__':
    main()