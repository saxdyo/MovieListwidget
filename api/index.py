from flask import Flask, request, jsonify, render_template
import requests
import json
import os
import re
from datetime import datetime

app = Flask(__name__)

# 环境变量配置
PICGO_API_KEY = os.environ.get('PICGO_API_KEY')
GIST_ID = os.environ.get('GIST_ID')
GITHUB_USER = os.environ.get('GITHUB_USER')
GITHUB_TOKEN = os.environ.get('GITHUB_TOKEN')

# PicGo API 配置
PICGO_API_URL = "https://api.picgo.net/api/upload"

@app.route('/')
def index():
    """渲染主页面"""
    return render_template('index.html')

@app.route('/api/upload', methods=['POST'])
def upload_image():
    """处理图片上传和Gist更新"""
    try:
        # 获取表单数据
        name = request.form.get('name', '').strip()
        file = request.files.get('image')
        
        # 验证输入
        if not name:
            return jsonify({'success': False, 'message': '请输入图标名称'}), 400
        
        if not file:
            return jsonify({'success': False, 'message': '请选择图片文件'}), 400
        
        # 验证文件类型
        allowed_extensions = {'png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'}
        file_extension = file.filename.rsplit('.', 1)[1].lower() if '.' in file.filename else ''
        
        if file_extension not in allowed_extensions:
            return jsonify({'success': False, 'message': '不支持的文件格式，请上传 PNG、JPG、GIF、SVG 或 WebP 格式的图片'}), 400
        
        # 上传图片到 PicGo
        files = {'file': (file.filename, file.read(), file.content_type)}
        headers = {'X-API-Key': PICGO_API_KEY}
        
        response = requests.post(PICGO_API_URL, files=files, headers=headers)
        
        if response.status_code != 200:
            return jsonify({'success': False, 'message': '图片上传失败，请检查 PicGo API 配置'}), 500
        
        upload_result = response.json()
        
        if upload_result.get('success'):
            image_url = upload_result['data'][0]['url']
            
            # 更新 Gist
            gist_update_result = update_gist(name, image_url)
            
            if gist_update_result['success']:
                return jsonify({
                    'success': True,
                    'message': '图标上传成功！',
                    'data': {
                        'name': name,
                        'url': image_url,
                        'gist_url': f"https://gist.github.com/{GITHUB_USER}/{GIST_ID}"
                    }
                })
            else:
                return jsonify({'success': False, 'message': f'Gist 更新失败: {gist_update_result["message"]}'}), 500
        else:
            return jsonify({'success': False, 'message': f'图片上传失败: {upload_result.get("message", "未知错误")}'}), 500
            
    except Exception as e:
        return jsonify({'success': False, 'message': f'服务器错误: {str(e)}'}), 500

def update_gist(name, image_url):
    """更新 GitHub Gist 中的图标数据"""
    try:
        # 获取当前 Gist 内容
        gist_url = f"https://api.github.com/gists/{GIST_ID}"
        headers = {
            'Authorization': f'token {GITHUB_TOKEN}',
            'Accept': 'application/vnd.github.v3+json'
        }
        
        response = requests.get(gist_url, headers=headers)
        
        if response.status_code != 200:
            return {'success': False, 'message': '无法获取 Gist 内容'}
        
        gist_data = response.json()
        icons_file = gist_data['files'].get('icons.json')
        
        if not icons_file:
            # 如果文件不存在，创建新的结构
            icons_data = {
                "name": "Icon Library",
                "description": "图标库 - 自助上传系统",
                "icons": []
            }
        else:
            # 解析现有数据
            try:
                icons_data = json.loads(icons_file['content'])
            except json.JSONDecodeError:
                return {'success': False, 'message': 'Gist 中的 JSON 格式错误'}
        
        # 检查名称唯一性并处理重复
        original_name = name
        counter = 1
        while any(icon['name'] == name for icon in icons_data['icons']):
            name = f"{original_name}_{counter}"
            counter += 1
        
        # 添加新图标
        new_icon = {
            "name": name,
            "url": image_url,
            "upload_time": datetime.now().isoformat()
        }
        
        icons_data['icons'].append(new_icon)
        
        # 更新 Gist
        update_data = {
            "description": f"图标库更新 - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
            "files": {
                "icons.json": {
                    "content": json.dumps(icons_data, ensure_ascii=False, indent=2)
                }
            }
        }
        
        update_response = requests.patch(gist_url, headers=headers, json=update_data)
        
        if update_response.status_code == 200:
            return {
                'success': True,
                'message': 'Gist 更新成功',
                'data': {
                    'name': name,
                    'url': image_url,
                    'is_duplicate': original_name != name
                }
            }
        else:
            return {'success': False, 'message': f'Gist 更新失败: {update_response.status_code}'}
            
    except Exception as e:
        return {'success': False, 'message': f'Gist 更新异常: {str(e)}'}

@app.route('/api/icons', methods=['GET'])
def get_icons():
    """获取所有图标列表"""
    try:
        gist_url = f"https://api.github.com/gists/{GIST_ID}"
        headers = {
            'Authorization': f'token {GITHUB_TOKEN}',
            'Accept': 'application/vnd.github.v3+json'
        }
        
        response = requests.get(gist_url, headers=headers)
        
        if response.status_code != 200:
            return jsonify({'success': False, 'message': '无法获取图标列表'}), 500
        
        gist_data = response.json()
        icons_file = gist_data['files'].get('icons.json')
        
        if not icons_file:
            return jsonify({'success': True, 'data': {'icons': []}})
        
        try:
            icons_data = json.loads(icons_file['content'])
            return jsonify({'success': True, 'data': icons_data})
        except json.JSONDecodeError:
            return jsonify({'success': False, 'message': '图标数据格式错误'}), 500
            
    except Exception as e:
        return jsonify({'success': False, 'message': f'获取图标列表失败: {str(e)}'}), 500

@app.route('/api/delete/<icon_name>', methods=['DELETE'])
def delete_icon(icon_name):
    """删除指定图标"""
    try:
        # 获取当前 Gist 内容
        gist_url = f"https://api.github.com/gists/{GIST_ID}"
        headers = {
            'Authorization': f'token {GITHUB_TOKEN}',
            'Accept': 'application/vnd.github.v3+json'
        }
        
        response = requests.get(gist_url, headers=headers)
        
        if response.status_code != 200:
            return jsonify({'success': False, 'message': '无法获取 Gist 内容'}), 500
        
        gist_data = response.json()
        icons_file = gist_data['files'].get('icons.json')
        
        if not icons_file:
            return jsonify({'success': False, 'message': '图标文件不存在'}), 404
        
        try:
            icons_data = json.loads(icons_file['content'])
        except json.JSONDecodeError:
            return jsonify({'success': False, 'message': 'Gist 中的 JSON 格式错误'}), 500
        
        # 查找并删除图标
        original_length = len(icons_data['icons'])
        icons_data['icons'] = [icon for icon in icons_data['icons'] if icon['name'] != icon_name]
        
        if len(icons_data['icons']) == original_length:
            return jsonify({'success': False, 'message': '图标不存在'}), 404
        
        # 更新 Gist
        update_data = {
            "description": f"删除图标 {icon_name} - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
            "files": {
                "icons.json": {
                    "content": json.dumps(icons_data, ensure_ascii=False, indent=2)
                }
            }
        }
        
        update_response = requests.patch(gist_url, headers=headers, json=update_data)
        
        if update_response.status_code == 200:
            return jsonify({'success': True, 'message': f'图标 {icon_name} 删除成功'})
        else:
            return jsonify({'success': False, 'message': f'删除失败: {update_response.status_code}'}), 500
            
    except Exception as e:
        return jsonify({'success': False, 'message': f'删除图标异常: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True)