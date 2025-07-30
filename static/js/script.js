// 全局变量
let iconsData = [];

// DOM 元素
const uploadForm = document.getElementById('uploadForm');
const iconNameInput = document.getElementById('iconName');
const iconFileInput = document.getElementById('iconFile');
const uploadBtn = document.getElementById('uploadBtn');
const iconsContainer = document.getElementById('iconsContainer');
const searchInput = document.getElementById('searchInput');
const refreshBtn = document.getElementById('refreshBtn');
const successModal = document.getElementById('successModal');
const errorModal = document.getElementById('errorModal');

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    loadIcons();
});

// 初始化事件监听器
function initializeEventListeners() {
    // 文件输入处理
    iconFileInput.addEventListener('change', handleFileSelect);
    
    // 表单提交
    uploadForm.addEventListener('submit', handleUpload);
    
    // 搜索功能
    searchInput.addEventListener('input', handleSearch);
    
    // 刷新按钮
    refreshBtn.addEventListener('click', loadIcons);
    
    // 模态框关闭
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal();
            closeErrorModal();
        }
    });
}

// 处理文件选择
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        const display = document.querySelector('.file-input-text');
        display.textContent = file.name;
        
        // 预览图片
        const reader = new FileReader();
        reader.onload = function(e) {
            // 可以在这里添加图片预览功能
        };
        reader.readAsDataURL(file);
    }
}

// 处理上传
async function handleUpload(e) {
    e.preventDefault();
    
    const name = iconNameInput.value.trim();
    const file = iconFileInput.files[0];
    
    if (!name || !file) {
        showError('请填写图标名称并选择图片文件');
        return;
    }
    
    // 显示加载状态
    setUploadLoading(true);
    
    try {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('image', file);
        
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            showSuccess(result.data);
            uploadForm.reset();
            document.querySelector('.file-input-text').textContent = '点击选择文件';
            loadIcons(); // 重新加载图标列表
        } else {
            showError(result.message);
        }
    } catch (error) {
        showError('上传失败，请检查网络连接');
        console.error('Upload error:', error);
    } finally {
        setUploadLoading(false);
    }
}

// 设置上传加载状态
function setUploadLoading(loading) {
    const btnText = uploadBtn.querySelector('.btn-text');
    const btnLoading = uploadBtn.querySelector('.btn-loading');
    
    if (loading) {
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
        uploadBtn.disabled = true;
    } else {
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        uploadBtn.disabled = false;
    }
}

// 加载图标列表
async function loadIcons() {
    try {
        iconsContainer.innerHTML = '<div class="loading">加载中...</div>';
        
        const response = await fetch('/api/icons');
        const result = await response.json();
        
        if (result.success) {
            iconsData = result.data.icons || [];
            renderIcons(iconsData);
        } else {
            iconsContainer.innerHTML = '<div class="loading">加载失败: ' + result.message + '</div>';
        }
    } catch (error) {
        iconsContainer.innerHTML = '<div class="loading">加载失败，请检查网络连接</div>';
        console.error('Load icons error:', error);
    }
}

// 渲染图标列表
function renderIcons(icons) {
    if (icons.length === 0) {
        iconsContainer.innerHTML = '<div class="loading">暂无图标</div>';
        return;
    }
    
    iconsContainer.innerHTML = icons.map(icon => `
        <div class="icon-card" data-name="${icon.name}">
            <img src="${icon.url}" alt="${icon.name}" class="icon-image" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🖼️</text></svg>'">
            <div class="icon-name">${icon.name}</div>
            <div class="icon-actions">
                <button class="action-btn copy-btn" onclick="copyIconUrl('${icon.url}')">复制链接</button>
                <button class="action-btn delete-btn" onclick="deleteIcon('${icon.name}')">删除</button>
            </div>
        </div>
    `).join('');
}

// 处理搜索
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredIcons = iconsData.filter(icon => 
        icon.name.toLowerCase().includes(searchTerm)
    );
    renderIcons(filteredIcons);
}

// 复制图标URL
async function copyIconUrl(url) {
    try {
        await navigator.clipboard.writeText(url);
        showToast('链接已复制到剪贴板');
    } catch (error) {
        // 降级方案
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('链接已复制到剪贴板');
    }
}

// 删除图标
async function deleteIcon(iconName) {
    if (!confirm(`确定要删除图标 "${iconName}" 吗？`)) {
        return;
    }
    
    try {
        const response = await fetch(`/api/delete/${encodeURIComponent(iconName)}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
            showToast('图标删除成功');
            loadIcons(); // 重新加载图标列表
        } else {
            showError(result.message);
        }
    } catch (error) {
        showError('删除失败，请检查网络连接');
        console.error('Delete icon error:', error);
    }
}

// 显示成功模态框
function showSuccess(data) {
    document.getElementById('successName').textContent = data.name;
    document.getElementById('successUrl').value = data.url;
    document.getElementById('successImage').src = data.url;
    document.getElementById('gistLink').href = data.gist_url;
    
    successModal.style.display = 'flex';
}

// 显示错误模态框
function showError(message) {
    document.getElementById('errorMessage').textContent = message;
    errorModal.style.display = 'flex';
}

// 关闭成功模态框
function closeModal() {
    successModal.style.display = 'none';
}

// 关闭错误模态框
function closeErrorModal() {
    errorModal.style.display = 'none';
}

// 复制URL
function copyUrl() {
    const urlInput = document.getElementById('successUrl');
    urlInput.select();
    document.execCommand('copy');
    showToast('URL已复制到剪贴板');
}

// 显示提示消息
function showToast(message) {
    // 创建提示元素
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #333;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 10000;
        font-size: 14px;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    // 显示动画
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // 自动隐藏
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// 错误处理
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    showError('发生未知错误，请刷新页面重试');
});

// 网络状态检测
window.addEventListener('online', function() {
    showToast('网络连接已恢复');
});

window.addEventListener('offline', function() {
    showToast('网络连接已断开');
});

// 键盘快捷键
document.addEventListener('keydown', function(e) {
    // ESC 键关闭模态框
    if (e.key === 'Escape') {
        closeModal();
        closeErrorModal();
    }
    
    // Ctrl/Cmd + F 聚焦搜索框
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        searchInput.focus();
    }
    
    // Ctrl/Cmd + R 刷新图标列表
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        loadIcons();
    }
});

// 图片加载错误处理
function handleImageError(img) {
    img.onerror = null; // 防止无限循环
    img.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🖼️</text></svg>';
}

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 节流函数
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 优化搜索性能
const debouncedSearch = debounce(handleSearch, 300);
searchInput.addEventListener('input', debouncedSearch);

// 优化滚动性能
const throttledScroll = throttle(function() {
    // 可以在这里添加无限滚动等功能
}, 100);

window.addEventListener('scroll', throttledScroll);