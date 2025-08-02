#!/usr/bin/env python3
"""
TMDB增强版模块快速启动脚本
"""

import os
import sys
import subprocess
import json
from pathlib import Path

def check_python_version():
    """检查Python版本"""
    if sys.version_info < (3, 8):
        print("❌ 需要Python 3.8或更高版本")
        print(f"   当前版本: {sys.version}")
        return False
    print(f"✅ Python版本检查通过: {sys.version}")
    return True

def check_dependencies():
    """检查依赖包"""
    required_packages = ['requests', 'pytz', 'beautifulsoup4', 'lxml', 'urllib3']
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package)
            print(f"✅ {package} 已安装")
        except ImportError:
            missing_packages.append(package)
            print(f"❌ {package} 未安装")
    
    if missing_packages:
        print(f"\n📦 需要安装以下依赖包: {', '.join(missing_packages)}")
        install_choice = input("是否自动安装依赖包? (y/n): ").lower().strip()
        
        if install_choice == 'y':
            try:
                subprocess.check_call([
                    sys.executable, '-m', 'pip', 'install', 
                    '--break-system-packages' if '--break-system-packages' in sys.argv else '',
                    *missing_packages
                ])
                print("✅ 依赖包安装完成")
                return True
            except subprocess.CalledProcessError:
                print("❌ 依赖包安装失败")
                print("请手动运行: pip install requests pytz beautifulsoup4 lxml urllib3")
                return False
        else:
            print("请手动安装依赖包后重新运行此脚本")
            return False
    
    return True

def check_api_key():
    """检查API密钥"""
    api_key = os.getenv("TMDB_API_KEY")
    if not api_key:
        print("⚠️  未设置TMDB_API_KEY环境变量")
        print("\n📝 获取TMDB API密钥的步骤:")
        print("1. 访问 https://www.themoviedb.org/")
        print("2. 注册并登录账户")
        print("3. 进入设置页面申请API密钥")
        print("4. 复制API密钥")
        
        api_key = input("\n请输入你的TMDB API密钥 (或按Enter跳过): ").strip()
        
        if api_key:
            # 设置环境变量
            os.environ["TMDB_API_KEY"] = api_key
            print("✅ API密钥已设置")
            return True
        else:
            print("⚠️  未设置API密钥，脚本将以演示模式运行")
            return False
    else:
        print("✅ TMDB_API_KEY已设置")
        return True

def create_directories():
    """创建必要的目录"""
    directories = ['data', 'scripts']
    
    for directory in directories:
        Path(directory).mkdir(exist_ok=True)
        print(f"✅ 目录 {directory} 已创建/确认存在")

def run_test():
    """运行测试"""
    print("\n🧪 运行功能测试...")
    try:
        result = subprocess.run([
            sys.executable, 'scripts/test_enhanced_tmdb.py'
        ], capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✅ 测试通过")
            return True
        else:
            print("❌ 测试失败")
            print("错误信息:", result.stderr)
            return False
    except Exception as e:
        print(f"❌ 运行测试时出错: {e}")
        return False

def run_main_script():
    """运行主脚本"""
    print("\n🚀 运行增强版TMDB数据获取脚本...")
    try:
        result = subprocess.run([
            sys.executable, 'scripts/get_tmdb_data_enhanced.py'
        ], capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✅ 脚本运行成功")
            print("输出:", result.stdout)
            return True
        else:
            print("❌ 脚本运行失败")
            print("错误信息:", result.stderr)
            return False
    except Exception as e:
        print(f"❌ 运行脚本时出错: {e}")
        return False

def show_data_structure():
    """显示数据结构"""
    print("\n📊 数据结构说明:")
    print("每个媒体项目包含以下字段:")
    print("• id: 媒体ID")
    print("• title: 标题")
    print("• type: 类型 (movie/tv)")
    print("• genreTitle: 类型标签")
    print("• rating: 评分")
    print("• release_date: 发布日期")
    print("• overview: 简介")
    print("• poster_url: 海报图片URL")
    print("• title_backdrop: 标题背景图URL")
    print("• logo_url: Logo图片URL (新增)")

def show_usage():
    """显示使用说明"""
    print("\n📖 使用说明:")
    print("1. 手动运行: python3 scripts/get_tmdb_data_enhanced.py")
    print("2. 运行测试: python3 scripts/test_enhanced_tmdb.py")
    print("3. 查看数据: cat data/TMDB_Trending.json")
    print("4. 设置GitHub Actions: 推送代码到仓库")

def main():
    """主函数"""
    print("🎬 TMDB增强版模块快速启动")
    print("=" * 50)
    
    # 检查Python版本
    if not check_python_version():
        return
    
    # 检查依赖
    if not check_dependencies():
        return
    
    # 创建目录
    create_directories()
    
    # 检查API密钥
    has_api_key = check_api_key()
    
    # 显示数据结构
    show_data_structure()
    
    # 运行测试
    if run_test():
        print("\n✅ 所有检查通过!")
        
        # 询问是否运行主脚本
        if has_api_key:
            run_choice = input("\n是否运行主脚本获取数据? (y/n): ").lower().strip()
            if run_choice == 'y':
                run_main_script()
        else:
            print("\n⚠️  由于未设置API密钥，跳过数据获取")
            print("   设置API密钥后可以重新运行此脚本")
    
    # 显示使用说明
    show_usage()
    
    print("\n" + "=" * 50)
    print("🎉 快速启动完成!")

if __name__ == "__main__":
    main()