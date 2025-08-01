// ========== 优化工具与结构集成（见注释区分，原有业务逻辑保留） ==========

// ========== TVB播出平台优化模块 ==========

// TVB专用缓存系统
class TvbCache {
  constructor(maxSize = 50) {
    this.maxSize = maxSize;
    this.cache = new Map();
    this.hits = 0;
    this.misses = 0;
    this.lastCleanup = Date.now();
  }

  get(key) {
    const item = this.cache.get(key);
    if (item && Date.now() - item.timestamp < item.ttl) {
      this.hits++;
      return item.data;
    }
    if (item) {
      this.cache.delete(key);
    }
    this.misses++;
    return null;
  }

  set(key, data, ttl = 30 * 60 * 1000) {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  stats() {
    const total = this.hits + this.misses;
    return {
      size: this.cache.size,
      hits: this.hits,
      misses: this.misses,
      hitRate: total > 0 ? ((this.hits / total) * 100).toFixed(2) : '0.00'
    };
  }
}


// === 第366行的getBeijingDate函数 ===
function getBeijingDate() {
  const date = new Date();
  const tzOffset = 480; // 北京时间与UTC时间差为8小时，即480分钟
  const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
  const bjDate = new Date(utc + (tzOffset * 60000));
  const year = bjDate.getFullYear();
  const month = String(bjDate.getMonth() + 1).padStart(2, '0');
  const day = String(bjDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// === 第2787行的重复getBeijingDate函数 ===
function getBeijingDate() {
  const now = new Date();
  const beijingTime = now.getTime() + (8 * 60 * 60 * 1000);
  const beijingDate = new Date(beijingTime);
  return `${beijingDate.getUTCFullYear()}-${String(beijingDate.getUTCMonth() + 1).padStart(2, '0')}-${String(beijingDate.getUTCDate()).padStart(2, '0')}`;
}
