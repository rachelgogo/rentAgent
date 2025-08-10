# OpenAI API 真实公寓信息使用指南

## 概述

本项目集成了OpenAI API来生成真实可信的公寓信息，包括智能搜索、需求分析、市场分析等功能。

## 功能特性

### 1. 真实公寓数据生成
- 使用OpenAI GPT-4生成基于真实市场数据的公寓信息
- 包含详细的公寓描述、价格、设施、联系方式等
- 支持多个城市的公寓数据生成

### 2. 智能搜索功能
- **自然语言搜索**: 用中文描述需求，AI理解并匹配公寓
- **需求分析**: AI分析用户输入，提取结构化需求
- **智能推荐**: 基于用户需求提供个性化推荐
- **市场分析**: 分析租房市场趋势和价格走势
- **智能问答**: 回答租房相关问题

### 3. 综合搜索
- 结合多种AI功能，提供全面的公寓搜索体验
- 自动生成市场分析和推荐建议

## API端点

### 1. OpenAI公寓搜索 API
```
POST /api/openai-apartments
```

**请求参数:**
```json
{
  "query": "我想在San Jose找一个1居室公寓，预算3000美元",
  "searchType": "comprehensive",
  "location": "San Francisco",
  "count": 10,
  "requirements": {
    "location": "San Francisco",
    "budget": {"min": 2000, "max": 4000},
    "bedrooms": 2,
    "bathrooms": 1,
    "area": {"min": 800, "max": 1500},
    "amenities": [],
    "commuteTime": 30,
    "petFriendly": false,
    "furnished": false,
    "parking": false,
    "description": ""
  }
}
```

**搜索类型 (searchType):**
- `comprehensive`: 综合搜索（默认）
- `natural_language`: 自然语言搜索
- `requirements_analysis`: 需求分析
- `smart_recommendation`: 智能推荐
- `market_analysis`: 市场分析
- `qa`: 智能问答

### 2. 真实公寓数据生成 API
```
POST /api/real-apartments
```

**请求参数:**
```json
{
  "location": "San Francisco",
  "count": 10,
  "type": "general",
  "requirements": {
    // 用户需求对象
  }
}
```

### 3. AI搜索 API
```
POST /api/ai-search
```

**请求参数:**
```json
{
  "query": "搜索查询",
  "searchType": "comprehensive",
  "userPreferences": "用户偏好描述"
}
```

### 4. 测试API
```
GET /api/test-openai
POST /api/test-openai
```

## 环境变量配置

在项目根目录创建 `.env.local` 文件：

```env
# OpenAI API配置
OPENAI_API_KEY=your_openai_api_key_here

# 其他API配置（可选）
APARTMENT_API_KEY=your_apartment_api_key
RENT_DATA_API_KEY=your_rent_data_api_key
```

## 使用示例

### 1. 前端使用

```typescript
// 使用OpenAI智能搜索
const searchWithAI = async (query: string) => {
  const response = await fetch('/api/openai-apartments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: query,
      searchType: 'comprehensive'
    }),
  });
  
  const data = await response.json();
  return data;
};

// 生成真实公寓数据
const generateRealApartments = async (location: string, count: number) => {
  const response = await fetch('/api/real-apartments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      location: location,
      count: count,
      type: 'general'
    }),
  });
  
  const data = await response.json();
  return data;
};
```

### 2. 直接API调用

```bash
# 测试OpenAI API
curl http://localhost:3000/api/test-openai

# 生成公寓数据
curl -X POST http://localhost:3000/api/openai-apartments \
  -H "Content-Type: application/json" \
  -d '{
    "query": "我想San Jose在找一个1居室公寓",
    "searchType": "comprehensive"
  }'

# 生成真实公寓数据
curl -X POST http://localhost:3000/api/real-apartments \
  -H "Content-Type: application/json" \
  -d '{
    "location": "San Francisco",
    "count": 5,
    "type": "general"
  }'
```

## 搜索类型详解

### 1. 自然语言搜索
用户可以输入自然语言描述，AI会理解并匹配相关公寓：

```
"我想在San Jose找一个1居室公寓，预算3000美元，需要宠物友好"
"找一个靠近地铁的1居室公寓，预算2500美元以下"
"需要带停车位的3居室公寓，预算4000美元"
```

### 2. 需求分析
AI会分析用户输入，提取结构化的需求信息：

```
输入: "我是一个学生，想在大学附近找一个便宜的1居室公寓"
输出: {
  "location": "大学附近",
  "budget": {"min": 1000, "max": 2000},
  "bedrooms": 1,
  "bathrooms": 1,
  "amenities": ["WiFi", "学习空间"],
  "commuteTime": 15
}
```

### 3. 智能推荐
基于用户需求和偏好，提供个性化的公寓推荐：

- 分析用户需求
- 生成符合需求的公寓
- 提供推荐理由
- 包含市场洞察和实用建议

### 4. 市场分析
分析特定地区的租房市场情况：

- 价格趋势分析
- 热门区域推荐
- 市场预测
- 租房建议

### 5. 智能问答
回答用户关于租房的各类问题：

```
"旧金山的租金趋势如何？"
"如何选择合适的公寓？"
"租房时需要注意什么？"
"哪个区域的公寓性价比最高？"
```

## 数据格式

### 公寓数据格式
```typescript
interface Apartment {
  id: string;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  description: string;
  amenities: string[];
  images: string[];
  rating: number;
  distance: number;
  commuteTime: number;
  petFriendly: boolean;
  furnished: boolean;
  parking: boolean;
  contact: {
    phone: string;
    email: string;
  };
  availableDate: string;
  highlights: string[];
}
```

### AI推荐格式
```typescript
interface AIRecommendation {
  reasoning: string;
  recommendations: string[];
  marketInsights: string[];
  tips: string[];
}
```

## 注意事项

1. **API密钥**: 确保正确设置OpenAI API密钥
2. **请求限制**: OpenAI API有请求频率限制，建议合理使用
3. **成本控制**: GPT-4比GPT-3.5-turbo成本更高，可根据需要调整
4. **数据真实性**: 生成的数据基于真实市场情况，但仅供参考
5. **错误处理**: 建议实现适当的错误处理和重试机制

## 故障排除

### 常见问题

1. **API密钥错误**
   - 检查环境变量是否正确设置
   - 验证API密钥是否有效

2. **请求超时**
   - 增加请求超时时间
   - 检查网络连接

3. **响应解析错误**
   - 检查OpenAI返回的JSON格式
   - 实现更健壮的错误处理

4. **数据生成失败**
   - 检查提示词是否清晰
   - 调整模型参数

### 调试方法

1. 使用测试API检查连接
2. 查看服务器日志
3. 使用浏览器开发者工具检查网络请求
4. 验证请求参数格式

## 扩展功能

### 1. 多语言支持
可以扩展支持其他语言的搜索和生成

### 2. 更多数据源
集成更多真实的公寓数据源

### 3. 个性化推荐
基于用户历史行为提供更精准的推荐

### 4. 实时数据
集成实时房价和可用性数据

### 5. 图像生成
使用DALL-E生成公寓图片

## 技术支持

如有问题，请检查：
1. 环境变量配置
2. API密钥有效性
3. 网络连接状态
4. 服务器日志

更多信息请参考项目文档或联系技术支持。
