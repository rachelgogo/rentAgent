# OpenAI API 智能公寓搜索指南


## 🤖 为什么使用 OpenAI API？

OpenAI API 可以为你的公寓搜索应用添加强大的AI功能：

- **智能需求分析**: 从自然语言描述中提取结构化需求
- **智能推荐**: 基于用户偏好和公寓特征进行个性化推荐
- **自然语言搜索**: 支持"找便宜的宠物友好公寓"这样的自然语言查询
- **市场分析**: 分析租房市场趋势和价格走势
- **智能问答**: 回答租房相关问题
- **内容生成**: 自动生成公寓描述和推荐理由

## 🔑 获取 OpenAI API 密钥

### 步骤 1: 注册 OpenAI 账户
1. 访问 [OpenAI 官网](https://platform.openai.com/)
2. 点击 "Sign up" 注册账户
3. 验证邮箱地址

### 步骤 2: 获取 API 密钥
1. 登录后进入 [API Keys 页面](https://platform.openai.com/api-keys)
2. 点击 "Create new secret key"
3. 复制生成的 API 密钥（注意保存，只显示一次）

### 步骤 3: 设置付费方式
1. 进入 [Billing 页面](https://platform.openai.com/account/billing)
2. 添加支付方式（信用卡或 PayPal）
3. 设置使用限制（可选）

## ⚙️ 环境配置

### 1. 添加环境变量
在 `.env.local` 文件中添加：

```bash
# OpenAI API 配置
OPENAI_API_KEY=sk-your-api-key-here
```

### 2. 验证配置
```typescript
import { openaiApiService } from './services/openaiApi';

// 检查 API 状态
const isWorking = await openaiApiService.checkApiStatus();
console.log('OpenAI API 状态:', isWorking);
```

## 🚀 功能使用

### 1. 智能需求分析
```typescript
// 从自然语言描述中提取结构化需求
const userInput = "我想在旧金山找一套2居室公寓，预算3000-5000美元，需要宠物友好，最好有停车位";
const requirements = await openaiApiService.analyzeUserRequirements(userInput);

console.log('分析结果:', requirements);
// 输出: {
//   location: "San Francisco",
//   budget: { min: 3000, max: 5000 },
//   bedrooms: 2,
//   bathrooms: 1,
//   petFriendly: true,
//   parking: true,
//   ...
// }
```

### 2. 智能推荐
```typescript
// 基于用户需求和偏好推荐公寓
const recommendation = await openaiApiService.recommendApartments(
  apartments, 
  userRequirements,
  "我喜欢安静的环境，最好靠近公园"
);

console.log('推荐理由:', recommendation.reasoning);
console.log('具体推荐:', recommendation.recommendations);
console.log('市场洞察:', recommendation.marketInsights);
console.log('实用建议:', recommendation.tips);
```

### 3. 自然语言搜索
```typescript
// 使用自然语言搜索公寓
const query = "找便宜的宠物友好公寓，最好有健身房";
const matchedApartments = await openaiApiService.naturalLanguageSearch(query, allApartments);

console.log('匹配结果:', matchedApartments);
```

### 4. 市场分析
```typescript
// 分析特定地区的市场趋势
const marketAnalysis = await openaiApiService.analyzeMarketTrends("San Francisco", apartments);

console.log('市场分析:', marketAnalysis);
```

### 5. 智能问答
```typescript
// 回答租房相关问题
const question = "在旧金山租房需要注意什么？";
const answer = await openaiApiService.answerQuestion(question, {
  apartments: sampleApartments
});

console.log('AI回答:', answer);
```

## 📡 API 端点使用

### 综合搜索
```bash
curl -X POST http://localhost:3000/api/ai-search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "我想在旧金山找便宜的2居室公寓",
    "searchType": "comprehensive"
  }'
```

### 自然语言搜索
```bash
curl -X POST http://localhost:3000/api/ai-search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "找宠物友好的公寓",
    "searchType": "natural_language"
  }'
```

### 需求分析
```bash
curl -X POST http://localhost:3000/api/ai-search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "预算3000-5000，需要2居室，宠物友好",
    "searchType": "requirements_analysis"
  }'
```

### 智能推荐
```bash
curl -X POST http://localhost:3000/api/ai-search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "我想找性价比高的公寓",
    "searchType": "smart_recommendation",
    "userPreferences": "我喜欢安静的环境，最好有健身房"
  }'
```

### 市场分析
```bash
curl -X GET "http://localhost:3000/api/ai-search?q=San Francisco&type=market_analysis"
```

### 智能问答
```bash
curl -X POST http://localhost:3000/api/ai-search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "租房时如何避免被骗？",
    "searchType": "qa"
  }'
```

## 💰 成本控制

### 模型选择
```typescript
// 在 openaiApi.ts 中修改模型
private model = 'gpt-3.5-turbo'; // 更便宜，适合大多数场景
// private model = 'gpt-4'; // 更智能，但成本更高
```

### 使用限制
```typescript
// 设置最大 token 数量
max_tokens: 500, // 减少输出长度以节省成本

// 设置温度参数
temperature: 0.3, // 更确定性的回答，减少重复
```

### 缓存策略
```typescript
// 缓存常见查询结果
const cacheKey = `openai:${hash(query)}`;
const cached = await redis.get(cacheKey);
if (cached) {
  return JSON.parse(cached);
}

const result = await openaiApiService.analyzeUserRequirements(query);
await redis.setex(cacheKey, 3600, JSON.stringify(result)); // 缓存1小时
```

## 📊 使用统计

### 获取使用情况
```typescript
// 获取 API 使用统计
const usage = await openaiApiService.getUsageStats();
console.log('Token 使用情况:', usage);
```

### 监控成本
```typescript
// 计算成本（GPT-3.5-turbo 价格）
const costPer1kTokens = 0.002; // $0.002 per 1K tokens
const totalCost = (usage.total_tokens / 1000) * costPer1kTokens;
console.log('当前成本: $', totalCost);
```

## 🔧 故障排除

### 常见问题

#### 1. API 密钥无效
```
错误: 401 Unauthorized
解决: 检查 OPENAI_API_KEY 是否正确设置
```

#### 2. 超出配额
```
错误: 429 Too Many Requests
解决: 检查账户余额，设置使用限制
```

#### 3. 模型不可用
```
错误: 400 Bad Request - model not found
解决: 检查模型名称是否正确
```

### 调试技巧

1. **启用详细日志**:
```typescript
// 在开发环境中记录请求详情
if (process.env.NODE_ENV === 'development') {
  console.log('OpenAI 请求:', {
    model: this.model,
    prompt: prompt.substring(0, 200) + '...',
    maxTokens: 1000
  });
}
```

2. **实现重试机制**:
```typescript
async function callOpenAIWithRetry(prompt: string, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await openaiApiService.callOpenAI(prompt);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

## 🎯 最佳实践

### 1. 提示词优化
```typescript
// 使用清晰的系统提示
const systemPrompt = '你是一个专业的公寓租赁顾问，擅长分析用户需求、推荐公寓、提供租房建议。请用中文回答，保持专业和准确。';

// 结构化用户输入
const userPrompt = `
用户需求：${userInput}
公寓数据：${JSON.stringify(apartments, null, 2)}
请分析并推荐最合适的公寓。
`;
```

### 2. 错误处理
```typescript
try {
  const result = await openaiApiService.analyzeUserRequirements(userInput);
  return result;
} catch (error) {
  console.error('OpenAI API 错误:', error);
  // 回退到默认逻辑
  return getDefaultRequirements();
}
```

### 3. 性能优化
```typescript
// 并行处理多个请求
const [requirements, marketAnalysis] = await Promise.all([
  openaiApiService.analyzeUserRequirements(userInput),
  openaiApiService.analyzeMarketTrends(location, apartments)
]);
```

## 📞 技术支持

### 官方资源
- **API 文档**: https://platform.openai.com/docs
- **定价页面**: https://openai.com/pricing
- **状态页面**: https://status.openai.com

### 社区支持
- **OpenAI 论坛**: https://community.openai.com
- **Stack Overflow**: 搜索 `openai-api` 标签
- **GitHub**: https://github.com/openai/openai-node

## 🎉 开始使用

1. **获取 API 密钥**: 在 OpenAI 平台注册并获取密钥
2. **配置环境变量**: 在 `.env.local` 中添加 `OPENAI_API_KEY`
3. **测试基本功能**: 运行示例代码验证配置
4. **集成到应用**: 在你的公寓搜索应用中使用 AI 功能
5. **监控使用情况**: 定期检查 API 使用量和成本

祝你使用愉快！🚀
