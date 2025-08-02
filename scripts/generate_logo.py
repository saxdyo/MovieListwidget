#!/usr/bin/env python3
"""
TMDB Logo 背景图生成器
Generate Logo and Background Images for TMDB Trending Crawler
"""

import os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import math
import colorsys

# 项目配置
PROJECT_ROOT = Path(__file__).parent.parent
ICONS_DIR = PROJECT_ROOT / "icons"
OUTPUT_DIR = ICONS_DIR / "generated"

# 确保输出目录存在
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# 颜色配置
TMDB_BLUE = "#01B4E4"
TMDB_GREEN = "#90CEA1" 
TMDB_DARK_BLUE = "#0D253F"
TMDB_LIGHT_BLUE = "#01D277"

# 渐变色配置
GRADIENT_COLORS = [
    (1, 180, 228),    # TMDB Blue
    (1, 210, 119),    # TMDB Green  
    (13, 37, 63),     # TMDB Dark Blue
    (144, 206, 161),  # Light Green
]

def create_gradient_background(width, height, colors, direction="diagonal"):
    """创建渐变背景"""
    image = Image.new('RGB', (width, height))
    draw = ImageDraw.Draw(image)
    
    if direction == "diagonal":
        # 对角线渐变
        for y in range(height):
            for x in range(width):
                # 计算位置比例 (0-1)
                ratio = (x + y) / (width + height)
                ratio = min(1.0, max(0.0, ratio))
                
                # 在颜色之间插值
                color_index = ratio * (len(colors) - 1)
                color1_idx = int(color_index)
                color2_idx = min(color1_idx + 1, len(colors) - 1)
                
                # 插值比例
                blend_ratio = color_index - color1_idx
                
                # 颜色插值
                color1 = colors[color1_idx]
                color2 = colors[color2_idx]
                
                r = int(color1[0] * (1 - blend_ratio) + color2[0] * blend_ratio)
                g = int(color1[1] * (1 - blend_ratio) + color2[1] * blend_ratio)
                b = int(color1[2] * (1 - blend_ratio) + color2[2] * blend_ratio)
                
                draw.point((x, y), (r, g, b))
    
    elif direction == "radial":
        # 径向渐变
        center_x, center_y = width // 2, height // 2
        max_distance = math.sqrt(center_x**2 + center_y**2)
        
        for y in range(height):
            for x in range(width):
                distance = math.sqrt((x - center_x)**2 + (y - center_y)**2)
                ratio = distance / max_distance
                ratio = min(1.0, max(0.0, ratio))
                
                # 颜色插值
                color_index = ratio * (len(colors) - 1)
                color1_idx = int(color_index)
                color2_idx = min(color1_idx + 1, len(colors) - 1)
                
                blend_ratio = color_index - color1_idx
                
                color1 = colors[color1_idx]
                color2 = colors[color2_idx]
                
                r = int(color1[0] * (1 - blend_ratio) + color2[0] * blend_ratio)
                g = int(color1[1] * (1 - blend_ratio) + color2[1] * blend_ratio)
                b = int(color1[2] * (1 - blend_ratio) + color2[2] * blend_ratio)
                
                draw.point((x, y), (r, g, b))
    
    return image

def create_logo_icon(size=512):
    """创建Logo图标"""
    # 创建背景
    background = create_gradient_background(size, size, GRADIENT_COLORS, "radial")
    draw = ImageDraw.Draw(background)
    
    # 添加圆形边框
    border_width = size // 20
    draw.ellipse([border_width, border_width, size-border_width, size-border_width], 
                outline=(255, 255, 255, 200), width=border_width//2)
    
    # 添加电影胶片图案
    film_width = size // 8
    film_height = size // 3
    film_x = size // 4
    film_y = size // 3
    
    # 绘制胶片主体
    draw.rectangle([film_x, film_y, film_x + film_width, film_y + film_height], 
                  fill=(255, 255, 255, 230))
    
    # 绘制胶片孔
    hole_size = film_width // 4
    hole_spacing = film_height // 6
    for i in range(5):
        hole_y = film_y + i * hole_spacing + hole_spacing // 2
        draw.ellipse([film_x - hole_size//2, hole_y - hole_size//2, 
                     film_x + hole_size//2, hole_y + hole_size//2], 
                    fill=(13, 37, 63))
        draw.ellipse([film_x + film_width - hole_size//2, hole_y - hole_size//2, 
                     film_x + film_width + hole_size//2, hole_y + hole_size//2], 
                    fill=(13, 37, 63))
    
    # 添加第二个胶片
    film_x2 = size // 2
    draw.rectangle([film_x2, film_y, film_x2 + film_width, film_y + film_height], 
                  fill=(255, 255, 255, 200))
    
    for i in range(5):
        hole_y = film_y + i * hole_spacing + hole_spacing // 2
        draw.ellipse([film_x2 - hole_size//2, hole_y - hole_size//2, 
                     film_x2 + hole_size//2, hole_y + hole_size//2], 
                    fill=(13, 37, 63))
        draw.ellipse([film_x2 + film_width - hole_size//2, hole_y - hole_size//2, 
                     film_x2 + film_width + hole_size//2, hole_y + hole_size//2], 
                    fill=(13, 37, 63))
    
    # 添加标题文字 (如果可能)
    try:
        font_size = size // 12
        font = ImageFont.truetype("arial.ttf", font_size)
    except:
        font = ImageFont.load_default()
    
    # 添加TMDB文字
    text_y = size - size // 6
    draw.text((size//4, text_y), "TMDB", fill=(255, 255, 255), font=font, anchor="ma")
    draw.text((size*3//4, text_y), "热门", fill=(255, 255, 255), font=font, anchor="ma")
    
    return background

def create_banner_background(width=1200, height=400):
    """创建横幅背景图"""
    background = create_gradient_background(width, height, GRADIENT_COLORS, "diagonal")
    draw = ImageDraw.Draw(background)
    
    # 添加装饰图案
    for i in range(10):
        x = (i * width // 10) + (width // 20)
        y = height // 4 + (i % 2) * (height // 4)
        size = width // 30
        
        # 添加小圆点装饰
        draw.ellipse([x-size, y-size, x+size, y+size], 
                    fill=(255, 255, 255, 100))
    
    # 添加主标题
    try:
        title_font = ImageFont.truetype("arial.ttf", width//20)
        subtitle_font = ImageFont.truetype("arial.ttf", width//30)
    except:
        title_font = ImageFont.load_default()
        subtitle_font = ImageFont.load_default()
    
    # 主标题
    title_text = "TMDB 标题海报热门爬取"
    title_bbox = draw.textbbox((0, 0), title_text, font=title_font)
    title_width = title_bbox[2] - title_bbox[0]
    title_x = (width - title_width) // 2
    title_y = height // 3
    
    # 添加文字阴影
    draw.text((title_x + 3, title_y + 3), title_text, fill=(0, 0, 0, 150), font=title_font)
    draw.text((title_x, title_y), title_text, fill=(255, 255, 255), font=title_font)
    
    # 副标题
    subtitle_text = "TMDB Trending Movie & TV Poster Crawler"
    subtitle_bbox = draw.textbbox((0, 0), subtitle_text, font=subtitle_font)
    subtitle_width = subtitle_bbox[2] - subtitle_bbox[0]
    subtitle_x = (width - subtitle_width) // 2
    subtitle_y = title_y + height // 8
    
    draw.text((subtitle_x + 2, subtitle_y + 2), subtitle_text, fill=(0, 0, 0, 100), font=subtitle_font)
    draw.text((subtitle_x, subtitle_y), subtitle_text, fill=(255, 255, 255, 220), font=subtitle_font)
    
    return background

def create_github_social_preview(width=1280, height=640):
    """创建GitHub社交预览图"""
    background = create_gradient_background(width, height, GRADIENT_COLORS, "diagonal")
    draw = ImageDraw.Draw(background)
    
    # 添加Logo
    logo_size = height // 3
    logo = create_logo_icon(logo_size)
    logo_x = width // 6
    logo_y = (height - logo_size) // 2
    background.paste(logo, (logo_x, logo_y))
    
    # 添加文字内容
    try:
        title_font = ImageFont.truetype("arial.ttf", width//25)
        desc_font = ImageFont.truetype("arial.ttf", width//40)
        feature_font = ImageFont.truetype("arial.ttf", width//45)
    except:
        title_font = ImageFont.load_default()
        desc_font = ImageFont.load_default()
        feature_font = ImageFont.load_default()
    
    # 主标题
    text_x = logo_x + logo_size + width // 15
    text_y = height // 6
    
    title = "TMDB 标题海报热门爬取"
    draw.text((text_x + 2, text_y + 2), title, fill=(0, 0, 0, 150), font=title_font)
    draw.text((text_x, text_y), title, fill=(255, 255, 255), font=title_font)
    
    # 描述
    desc_y = text_y + height // 8
    desc = "自动爬取 TMDB 热门电影电视剧数据"
    draw.text((text_x + 1, desc_y + 1), desc, fill=(0, 0, 0, 100), font=desc_font)
    draw.text((text_x, desc_y), desc, fill=(255, 255, 255, 200), font=desc_font)
    
    # 功能特性
    features = [
        "✨ 实时热门数据获取",
        "🎬 标题背景图抓取", 
        "🔄 自动定时更新",
        "📊 JSON 格式输出"
    ]
    
    feature_y = desc_y + height // 6
    line_height = height // 20
    
    for i, feature in enumerate(features):
        y = feature_y + i * line_height
        draw.text((text_x + 1, y + 1), feature, fill=(0, 0, 0, 100), font=feature_font)
        draw.text((text_x, y), feature, fill=(255, 255, 255, 180), font=feature_font)
    
    return background

def main():
    """主函数"""
    print("🎨 开始生成 TMDB Logo 和背景图...")
    
    # 生成不同尺寸的Logo
    logo_sizes = [64, 128, 256, 512, 1024]
    for size in logo_sizes:
        print(f"📱 生成 {size}x{size} Logo...")
        logo = create_logo_icon(size)
        logo_path = OUTPUT_DIR / f"tmdb_logo_{size}x{size}.png"
        logo.save(logo_path, "PNG")
        print(f"   ✅ 保存到: {logo_path}")
    
    # 生成横幅背景
    print("🖼️ 生成横幅背景图...")
    banner = create_banner_background(1200, 400)
    banner_path = OUTPUT_DIR / "tmdb_banner_1200x400.png"
    banner.save(banner_path, "PNG")
    print(f"   ✅ 保存到: {banner_path}")
    
    # 生成GitHub社交预览图
    print("🐙 生成 GitHub 社交预览图...")
    preview = create_github_social_preview(1280, 640)
    preview_path = OUTPUT_DIR / "github_social_preview.png"
    preview.save(preview_path, "PNG")
    print(f"   ✅ 保存到: {preview_path}")
    
    # 生成更多尺寸的背景图
    background_sizes = [
        (1920, 1080),  # Full HD
        (1600, 900),   # 16:9
        (1280, 720),   # HD
        (800, 600),    # 4:3
    ]
    
    for width, height in background_sizes:
        print(f"🌅 生成 {width}x{height} 背景图...")
        bg = create_gradient_background(width, height, GRADIENT_COLORS, "diagonal")
        bg_path = OUTPUT_DIR / f"tmdb_background_{width}x{height}.png"
        bg.save(bg_path, "PNG")
        print(f"   ✅ 保存到: {bg_path}")
    
    print("")
    print("🎉 所有图片生成完成!")
    print(f"📁 输出目录: {OUTPUT_DIR}")
    print("")
    print("生成的文件:")
    for file in sorted(OUTPUT_DIR.glob("*.png")):
        file_size = file.stat().st_size / 1024  # KB
        print(f"   📄 {file.name} ({file_size:.1f} KB)")

if __name__ == "__main__":
    try:
        main()
    except ImportError as e:
        print("❌ 缺少依赖库，请安装 Pillow:")
        print("   pip install Pillow")
        print(f"   错误详情: {e}")
    except Exception as e:
        print(f"❌ 生成图片时发生错误: {e}")