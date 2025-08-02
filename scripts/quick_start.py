#!/usr/bin/env python3
"""
TMDB增强数据爬取模块快速启动脚本
"""

import os
import sys
import subprocess
import json
from pathlib import Path

def print_banner():
    """打印横幅"""
    print("🎬" + "="*60 + "🎬")
    print("    TMDB增强数据爬取模块 - 快速启动")
    print("🎬" + "="*60 + "🎬")
    print()

def check_python_version():
    """检查Python版本"""
    print("🐍 检查Python版本...")
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("❌ Python版本过低，需要Python 3.8+")
        print(f"   当前版本: {version.major}.{version.minor}.{version.micro}")
        return False
    
    print(f"✅ Python版本: {version.major}.{version.minor}.{version.micro}")
    return True

def check_dependencies():
    """检查依赖包"""
    print("\n📦 检查依赖包...")
    
    required_packages = [
        "requests",
        "pytz",
        "beautifulsoup4",
        "lxml",
        "urllib3"
    ]
    
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package)
            print(f"✅ {package}")
        except ImportError:
            print(f"❌ {package} (缺失)")
            missing_packages.append(package)
    
    if missing_packages:
        print(f"\n⚠️ 缺少依赖包: {', '.join(missing_packages)}")
        install = input("是否自动安装缺失的依赖包? (y/n): ").lower().strip()
        
        if install == 'y':
            print("📦 安装依赖包...")
            try:
                subprocess.check_call([sys.executable, "-m", "pip", "install"] + missing_packages)
                print("✅ 依赖包安装完成")
                return True
            except subprocess.CalledProcessError:
                print("❌ 依赖包安装失败")
                return False
        else:
            print("❌ 请手动安装依赖包后重试")
            return False
    
    return True

def check_api_key():
    """检查API密钥"""
    print("\n🔑 检查TMDB API密钥...")
    
    api_key = os.getenv("TMDB_API_KEY")
    if api_key:
        print("✅ 找到环境变量 TMDB_API_KEY")
        return True
    
    # 检查是否有配置文件
    config_file = Path("config.json")
    if config_file.exists():
        try:
            with open(config_file, 'r') as f:
                config = json.load(f)
                if config.get("TMDB_API_KEY"):
                    print("✅ 找到配置文件中的API密钥")
                    os.environ["TMDB_API_KEY"] = config["TMDB_API_KEY"]
                    return True
        except:
            pass
    
    print("❌ 未找到TMDB API密钥")
    print("💡 获取API密钥:")
    print("   1. 访问 https://www.themoviedb.org/settings/api")
    print("   2. 注册账号并申请API密钥")
    print("   3. 设置环境变量: export TMDB_API_KEY='your_key'")
    
    setup_key = input("\n是否现在设置API密钥? (y/n): ").lower().strip()
    if setup_key == 'y':
        api_key = input("请输入TMDB API密钥: ").strip()
        if api_key:
            os.environ["TMDB_API_KEY"] = api_key
            print("✅ API密钥已设置")
            return True
    
    return False

def check_data_file():
    """检查数据文件"""
    print("\n📁 检查数据文件...")
    
    data_file = Path("data/TMDB_Trending.json")
    if data_file.exists():
        try:
            with open(data_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            last_updated = data.get("last_updated", "未知")
            print(f"✅ 数据文件存在，最后更新: {last_updated}")
            
            # 检查数据格式
            all_items = []
            all_items.extend(data.get("today_global", []))
            all_items.extend(data.get("week_global_all", []))
            all_items.extend(data.get("popular_movies", []))
            
            if all_items:
                is_new_format = "type" in all_items[0] and "genreTitle" in all_items[0]
                if is_new_format:
                    print("✅ 数据格式: 增强版（包含Logo和背景图）")
                else:
                    print("⚠️ 数据格式: 旧版（需要升级到增强版）")
            
            return True
        except Exception as e:
            print(f"❌ 数据文件损坏: {e}")
            return False
    else:
        print("❌ 数据文件不存在")
        return False

def run_enhanced_script():
    """运行增强脚本"""
    print("\n🚀 运行增强版TMDB数据爬取脚本...")
    
    script_path = Path("scripts/get_tmdb_data_enhanced.py")
    if not script_path.exists():
        print("❌ 增强脚本不存在")
        return False
    
    try:
        result = subprocess.run([sys.executable, str(script_path)], 
                              capture_output=True, text=True, timeout=300)
        
        if result.returncode == 0:
            print("✅ 增强脚本运行成功")
            print(result.stdout)
            return True
        else:
            print("❌ 增强脚本运行失败")
            print("错误信息:")
            print(result.stderr)
            return False
            
    except subprocess.TimeoutExpired:
        print("❌ 脚本运行超时")
        return False
    except Exception as e:
        print(f"❌ 运行脚本时出错: {e}")
        return False

def run_tests():
    """运行测试"""
    print("\n🧪 运行测试...")
    
    test_script = Path("scripts/test_enhanced_tmdb.py")
    if not test_script.exists():
        print("❌ 测试脚本不存在")
        return False
    
    try:
        result = subprocess.run([sys.executable, str(test_script)], 
                              capture_output=True, text=True, timeout=60)
        
        if result.returncode == 0:
            print("✅ 测试通过")
            print(result.stdout)
            return True
        else:
            print("⚠️ 测试失败")
            print(result.stdout)
            print(result.stderr)
            return False
            
    except Exception as e:
        print(f"❌ 运行测试时出错: {e}")
        return False

def show_demo():
    """显示演示"""
    print("\n🎬 运行演示...")
    
    demo_script = Path("scripts/demo_enhanced_tmdb.py")
    if not demo_script.exists():
        print("❌ 演示脚本不存在")
        return False
    
    try:
        result = subprocess.run([sys.executable, str(demo_script)], 
                              capture_output=True, text=True, timeout=60)
        
        if result.returncode == 0:
            print("✅ 演示完成")
            print(result.stdout)
            return True
        else:
            print("❌ 演示失败")
            print(result.stderr)
            return False
            
    except Exception as e:
        print(f"❌ 运行演示时出错: {e}")
        return False

def show_next_steps():
    """显示后续步骤"""
    print("\n📋 === 后续步骤 ===")
    print("1. 🚀 手动运行增强脚本:")
    print("   python3 scripts/get_tmdb_data_enhanced.py")
    print()
    print("2. 🧪 运行测试:")
    print("   python3 scripts/test_enhanced_tmdb.py")
    print()
    print("3. 🎬 查看演示:")
    print("   python3 scripts/demo_enhanced_tmdb.py")
    print()
    print("4. 📖 查看文档:")
    print("   cat TMDB_Enhanced_Setup_Guide.md")
    print()
    print("5. 🔄 设置GitHub Actions自动更新:")
    print("   - 在GitHub仓库设置中添加TMDB_API_KEY密钥")
    print("   - 推送代码到GitHub")
    print("   - 工作流将自动运行（每30分钟）")
    print()
    print("6. 💡 使用数据:")
    print("   - 数据文件: data/TMDB_Trending.json")
    print("   - 包含Logo背景图和标题背景图")
    print("   - 支持前端和后端集成")

def main():
    """主函数"""
    print_banner()
    
    # 检查环境
    if not check_python_version():
        return 1
    
    if not check_dependencies():
        return 1
    
    if not check_api_key():
        print("\n⚠️ 没有API密钥，将使用空数据模式")
    
    # 检查数据文件
    has_data = check_data_file()
    
    # 询问是否运行增强脚本
    if has_data:
        run_script = input("\n是否运行增强脚本更新数据? (y/n): ").lower().strip()
        if run_script == 'y':
            if run_enhanced_script():
                # 运行测试
                run_tests()
                # 显示演示
                show_demo()
    else:
        print("\n📝 数据文件不存在，需要运行增强脚本获取数据")
        run_script = input("是否现在运行增强脚本? (y/n): ").lower().strip()
        if run_script == 'y':
            if run_enhanced_script():
                run_tests()
                show_demo()
    
    # 显示后续步骤
    show_next_steps()
    
    print("\n🎉 快速启动完成！")
    return 0

if __name__ == "__main__":
    exit(main())