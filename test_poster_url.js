// 测试海报URL生成
console.log("=== 测试海报URL生成 ===");

// 模拟OptimizedImageManager
class OptimizedImageManager {
  constructor() {
    this.cache = new Map();
  }
  
  createOptimizedImageUrl(path, type = 'poster', size = null) {
    if (!path) return '';
    
    // 根据类型选择最佳尺寸
    if (!size) {
      size = type === 'poster' ? 'w500' : 'w1280';
    }
    
    // 确保路径以/开头
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    
    // 构建完整URL
    const baseUrl = `https://image.tmdb.org/t/p/${size}`;
    
    return `${baseUrl}${cleanPath}`;
  }
}

// 模拟createSmartPosterUrl函数
function createSmartPosterUrl(item, preferredSize = null) {
    if (!item || !item.poster_path) return '';
    
    const size = preferredSize || 'w500';
    const imageManager = new OptimizedImageManager();
    return imageManager.createOptimizedImageUrl(item.poster_path, 'poster', size);
}

// 测试数据
const testItems = [
    {
        id: 1,
        title: "测试电影1",
        poster_path: "/test-poster-1.jpg",
        backdrop_path: "/test-backdrop-1.jpg",
        media_type: "movie"
    },
    {
        id: 2,
        title: "测试电影2",
        poster_path: null,
        backdrop_path: "/test-backdrop-2.jpg",
        media_type: "movie"
    },
    {
        id: 3,
        title: "测试电影3",
        poster_path: "test-poster-3.jpg", // 没有前导斜杠
        backdrop_path: "/test-backdrop-3.jpg",
        media_type: "movie"
    },
    {
        id: 4,
        title: "测试电影4",
        poster_path: "",
        backdrop_path: "/test-backdrop-4.jpg",
        media_type: "movie"
    }
];

// 测试海报URL生成
console.log("\n=== 测试海报URL生成 ===");
testItems.forEach((item, index) => {
    console.log(`\n项目 ${index + 1}: ${item.title}`);
    console.log(`  原始海报路径: ${item.poster_path || '无'}`);
    
    const posterUrl = createSmartPosterUrl(item);
    console.log(`  生成的海报URL: ${posterUrl || '无'}`);
    
    if (posterUrl) {
        console.log(`  URL是否有效: ${posterUrl.startsWith('https://image.tmdb.org/t/p/') ? '是' : '否'}`);
    }
});

// 测试不同尺寸
console.log("\n=== 测试不同尺寸 ===");
const testItem = testItems[0];
if (testItem.poster_path) {
    const imageManager = new OptimizedImageManager();
    
    const sizes = ['w92', 'w154', 'w185', 'w342', 'w500', 'w780', 'original'];
    sizes.forEach(size => {
        const url = imageManager.createOptimizedImageUrl(testItem.poster_path, 'poster', size);
        console.log(`  ${size}: ${url}`);
    });
}

console.log("\n=== 测试完成 ===");