WidgetMetadata = {
  id: "test.script",
  title: "测试脚本",
  description: "测试脚本",
  author: "test",
  site: "https://test.com",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  detailCacheDuration: 60,
  modules: [
    {
      title: "测试模块",
      description: "测试模块",
      requiresWebView: false,
      functionName: "testFunction",
      cacheDuration: 60,
      params: []
    }
  ]
};

async function testFunction(params = {}) {
  return [
    {
      id: "1",
      type: "test",
      title: "测试项目",
      description: "这是一个测试项目"
    }
  ];
}

console.log("测试脚本加载完成");