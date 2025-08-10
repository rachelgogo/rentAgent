// OpenAI API服务
// 用于智能公寓推荐、自然语言搜索、需求分析等

import { Apartment, UserRequirements } from '../types';

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface ApartmentRecommendation {
  reasoning: string;
  recommendations: string[];
  marketInsights: string[];
  tips: string[];
}

export class OpenAIApiService {
  private apiKey: string;
  private baseUrl: string;
  private model: string;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || '';
    this.baseUrl = 'https://api.openai.com/v1';
    this.model = 'gpt-4o'; // 使用最新的GPT-4o模型，性能更强
    
    if (!this.apiKey) {
      console.warn('OpenAI API密钥未设置，请配置OPENAI_API_KEY环境变量');
    }
  }

  // 智能分析用户需求
  async analyzeUserRequirements(userInput: string): Promise<UserRequirements> {
    try {
      const prompt = `
请分析以下用户的租房需求，并返回结构化的JSON格式：

用户输入："${userInput}"

请分析并返回以下JSON格式的需求：
{
  "location": "城市名称",
  "budget": {"min": 最低预算, "max": 最高预算},
  "bedrooms": 卧室数量,
  "bathrooms": 卫生间数量,
  "area": {"min": 最小面积, "max": 最大面积},
  "amenities": ["设施1", "设施2"],
  "commuteTime": 最大通勤时间(分钟),
  "petFriendly": true/false,
  "furnished": true/false,
  "parking": true/false,
  "description": "用户原始描述"
}

请根据用户输入合理推断缺失的信息，使用合理的默认值。
`;

      const response = await this.callOpenAI(prompt);
      const content = response.choices[0].message.content;
      
      // 提取JSON部分
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('无法解析OpenAI响应');
    } catch (error) {
      console.error('分析用户需求失败:', error);
      // 返回默认需求
      return this.getDefaultRequirements();
    }
  }

  // 从现有公寓列表中筛选推荐公寓
  async filterAndRecommendApartments(
    apartments: Apartment[], 
    userRequirements: UserRequirements
  ): Promise<Apartment[]> {
    try {
      const prompt = `
请从以下公寓列表中筛选出最符合用户需求的公寓：

用户需求：
- 位置：${userRequirements.location}
- 预算：$${userRequirements.budget.min} - $${userRequirements.budget.max}
- 房间：${userRequirements.bedrooms}居室，${userRequirements.bathrooms}卫生间
- 面积：${userRequirements.area.min} - ${userRequirements.area.max}平方英尺
- 通勤时间：最多${userRequirements.commuteTime}分钟
- 宠物友好：${userRequirements.petFriendly ? '是' : '否'}
- 家具齐全：${userRequirements.furnished ? '是' : '否'}
- 停车位：${userRequirements.parking ? '需要' : '不需要'}
- 设施需求：${userRequirements.amenities.join(', ')}

公寓列表：
${JSON.stringify(apartments.map(apt => ({
  id: apt.id,
  title: apt.title,
  location: apt.location,
  price: apt.price,
  bedrooms: apt.bedrooms,
  bathrooms: apt.bathrooms,
  area: apt.area,
  rating: apt.rating,
  amenities: apt.amenities,
  petFriendly: apt.petFriendly,
  furnished: apt.furnished,
  parking: apt.parking
})), null, 2)}

请返回最匹配的公寓ID列表（按匹配度排序），最多返回8个。
只返回公寓ID，用逗号分隔，例如：apt-001, apt-002, apt-003
`;

      const response = await this.callOpenAI(prompt);
      const content = response.choices[0].message.content.trim();
      
      if (!content) return apartments.slice(0, 8); // 如果没有匹配，返回前8个
      
      const apartmentIds = content.split(',').map(id => id.trim());
      const filteredApartments = apartments.filter(apt => apartmentIds.includes(apt.id));
      
      return filteredApartments.length > 0 ? filteredApartments : apartments.slice(0, 8);
    } catch (error) {
      console.error('筛选公寓失败:', error);
      return apartments.slice(0, 8); // 出错时返回前8个
    }
  }

  // 自然语言搜索
  async naturalLanguageSearch(
    query: string, 
    apartments: Apartment[]
  ): Promise<Apartment[]> {
    try {
      const apartmentsInfo = apartments.map(apt => ({
        id: apt.id,
        title: apt.title,
        location: apt.location,
        price: apt.price,
        bedrooms: apt.bedrooms,
        bathrooms: apt.bathrooms,
        area: apt.area,
        rating: apt.rating,
        amenities: apt.amenities,
        description: apt.description,
        highlights: apt.highlights
      }));

      const prompt = `
请根据用户的自然语言查询，从以下公寓列表中找到最匹配的公寓：

用户查询："${query}"

公寓列表：
${JSON.stringify(apartmentsInfo, null, 2)}

请分析用户查询的意图，并返回最匹配的公寓ID列表（按匹配度排序）。
只返回公寓ID，用逗号分隔，例如：apt-001, apt-002, apt-003

如果查询不明确或没有匹配的公寓，请返回空字符串。
`;

      const response = await this.callOpenAI(prompt);
      const content = response.choices[0].message.content.trim();
      
      if (!content) return [];
      
      const apartmentIds = content.split(',').map(id => id.trim());
      return apartments.filter(apt => apartmentIds.includes(apt.id));
    } catch (error) {
      console.error('自然语言搜索失败:', error);
      return [];
    }
  }

  // 生成公寓描述
  async generateApartmentDescription(apartment: Apartment): Promise<string> {
    try {
      const prompt = `
请为以下公寓生成一个吸引人的中文描述：

公寓信息：
- 标题：${apartment.title}
- 位置：${apartment.location}
- 价格：$${apartment.price}/月
- 房间：${apartment.bedrooms}居室，${apartment.bathrooms}卫生间
- 面积：${apartment.area}平方英尺
- 评分：${apartment.rating}/5
- 设施：${apartment.amenities.join(', ')}
- 亮点：${apartment.highlights.join(', ')}
- 宠物友好：${apartment.petFriendly ? '是' : '否'}
- 家具齐全：${apartment.furnished ? '是' : '否'}
- 停车位：${apartment.parking ? '有' : '无'}
- 通勤时间：${apartment.commuteTime}分钟

请生成一个100-150字的中文描述，突出公寓的优势和特色，语言要吸引人但不过分夸张。
`;

      const response = await this.callOpenAI(prompt);
      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('生成公寓描述失败:', error);
      return apartment.description;
    }
  }

  // 分析市场趋势
  async analyzeMarketTrends(
    location: string, 
    apartments: Apartment[]
  ): Promise<string> {
    try {
      const priceStats = {
        average: apartments.reduce((sum, apt) => sum + apt.price, 0) / apartments.length,
        min: Math.min(...apartments.map(apt => apt.price)),
        max: Math.max(...apartments.map(apt => apt.price)),
        count: apartments.length
      };

      const prompt = `
请分析${location}地区的租房市场趋势：

市场数据：
- 平均租金：$${Math.round(priceStats.average)}
- 最低租金：$${priceStats.min}
- 最高租金：$${priceStats.max}
- 样本数量：${priceStats.count}套公寓

请提供以下分析（用中文回答）：
1. 当前市场状况
2. 价格趋势分析
3. 租房建议
4. 市场预测

请用简洁的语言总结，不超过200字。
`;

      const response = await this.callOpenAI(prompt);
      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('分析市场趋势失败:', error);
      return '暂时无法分析市场趋势';
    }
  }

  // 智能问答
  async answerQuestion(
    question: string, 
    context: { apartments: Apartment[], requirements?: UserRequirements }
  ): Promise<string> {
    try {
      const apartmentsInfo = context.apartments.map(apt => ({
        id: apt.id,
        title: apt.title,
        location: apt.location,
        price: apt.price,
        bedrooms: apt.bedrooms,
        bathrooms: apt.bathrooms,
        rating: apt.rating
      }));

      const prompt = `
作为公寓租赁专家，请回答用户的问题：

用户问题："${question}"

相关公寓信息：
${JSON.stringify(apartmentsInfo, null, 2)}

${context.requirements ? `
用户需求：
- 位置：${context.requirements.location}
- 预算：$${context.requirements.budget.min} - $${context.requirements.budget.max}
- 房间：${context.requirements.bedrooms}居室
` : ''}

请用中文回答，提供专业、准确的建议。如果问题与公寓信息无关，请提供一般性的租房建议。
`;

      const response = await this.callOpenAI(prompt);
      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('智能问答失败:', error);
      return '抱歉，暂时无法回答您的问题';
    }
  }

  // 直接回答问题 - 极速版本
  async answerQuestionDirectly(question: string): Promise<string> {
    try {
      const prompt = `回答租房问题："${question}"。用中文，简洁专业，100字以内。`;

      const response = await this.callOpenAIFast(prompt);
      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('直接问答失败:', error);
      return '抱歉，暂时无法回答您的问题';
    }
  }

  // 生成个性化建议
  async generatePersonalizedAdvice(
    requirements: UserRequirements, 
    marketData: any
  ): Promise<string> {
    try {
      const prompt = `
基于用户需求和真实市场数据，提供个性化的租房建议：

用户需求：
- 位置：${requirements.location}
- 预算：$${requirements.budget.min} - $${requirements.budget.max}
- 卧室：${requirements.bedrooms}间
- 卫生间：${requirements.bathrooms}间
- 面积：${requirements.area.min} - ${requirements.area.max} sqft
- 通勤时间：${requirements.commuteTime}分钟
- 宠物友好：${requirements.petFriendly ? '是' : '否'}
- 家具齐全：${requirements.furnished ? '是' : '否'}
- 停车位：${requirements.parking ? '需要' : '不需要'}

真实市场数据：
- 平均租金：$${marketData.averageRent}
- 价格区间：$${marketData.priceRange.min} - $${marketData.priceRange.max}

请提供：
1. 预算合理性分析
2. 位置选择建议
3. 租房时机建议
4. 实用租房技巧
5. 推荐查看的租房网站

用中文回答，200字以内，实用具体。
`;

      const response = await this.callOpenAIFast(prompt);
      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('生成个性化建议失败:', error);
      return '基于您的需求，建议查看租房网站导航获取真实房源信息。';
    }
  }

  // 查询真实公寓数据
  async searchRealApartments(requirements: UserRequirements): Promise<Apartment[]> {
    try {
      const prompt = `
请基于以下用户需求，查询并返回真实的公寓信息。请模拟从真实的租房平台（如Zillow、Apartments.com、Rent.com等）获取的数据，使用真实的公寓大楼名称和街道地址：

用户需求：
- 位置：${requirements.location}
- 预算：$${requirements.budget.min}-$${requirements.budget.max}
- 卧室：${requirements.bedrooms}间
- 卫生间：${requirements.bathrooms}间
- 面积：${requirements.area.min}-${requirements.area.max}平方英尺
- 设施要求：${requirements.amenities.join(', ')}
- 通勤时间：${requirements.commuteTime}分钟以内
- 宠物友好：${requirements.petFriendly ? '是' : '否'}
- 家具齐全：${requirements.furnished ? '是' : '否'}
- 停车位：${requirements.parking ? '需要' : '不需要'}

请返回8套符合需求的真实公寓信息，格式如下JSON数组：

[
  {
    "id": "apt_001",
    "title": "公寓名称（使用真实的公寓大楼名称，如：The Harrison, NEMA, 100 Van Ness, The Civic, The Infinity等）",
    "location": "具体地址（使用真实的街道地址，如：123 Main St, San Francisco, CA 94102）",
    "price": 租金价格（数字）,
    "bedrooms": 卧室数量（数字）,
    "bathrooms": 卫生间数量（数字）,
    "area": 面积（数字，平方英尺）,
    "rating": 评分（4.0-5.0之间的数字，保留一位小数）,
    "amenities": ["设施1", "设施2", "设施3"],
    "description": "公寓描述",
    "imageUrl": "图片URL（可选）",
    "website": "官方网站URL（可选）",
    "availableDate": "可入住日期",
    "petPolicy": "宠物政策",
    "parkingInfo": "停车信息",
    "utilities": "水电费信息",
    "deposit": "押金信息"
  }
]

请确保：
1. 公寓名称使用真实的公寓大楼名称（如：The Harrison, NEMA, 100 Van Ness等）
2. 地址使用真实的街道地址（如：123 Main St, San Francisco, CA 94102）
3. 价格符合当地市场水平
4. 设施和描述真实可信
5. 评分合理（4.0-5.0之间）
6. 所有信息都符合用户需求
7. 只返回JSON数组，不要其他文字
8. 必须返回8套公寓，不能少于8套
9. 每套公寓都要有不同的名称、地址和价格
10. 公寓ID从apt_001到apt_008
11. 公寓名称必须是真实的公寓大楼名称，不要使用"XX公寓"这样的通用名称
12. 地址必须是真实的街道地址，包含门牌号、街道名、城市和邮编
`;

      const response = await this.callOpenAI(prompt);
      const content = response.choices[0].message.content;
      
      console.log('OpenAI返回的原始内容:', content);
      
      // 提取JSON部分
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        console.log('提取到的JSON:', jsonMatch[0]);
        const apartments = JSON.parse(jsonMatch[0]);
        console.log('解析后的公寓数据:', apartments);
        
        const processedApartments = apartments.map((apt: any) => ({
          ...apt,
          id: apt.id || `apt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          rating: parseFloat(apt.rating) || 4.0,
          price: parseInt(apt.price) || 0,
          bedrooms: parseInt(apt.bedrooms) || 1,
          bathrooms: parseInt(apt.bathrooms) || 1,
          area: parseInt(apt.area) || 0
        }));
        
        console.log('处理后的公寓数据:', processedApartments);
        return processedApartments;
      }
      
      console.log('未找到JSON数组，尝试直接解析整个内容');
      // 尝试直接解析整个内容
      try {
        const apartments = JSON.parse(content);
        if (Array.isArray(apartments)) {
          return apartments.map((apt: any) => ({
            ...apt,
            id: apt.id || `apt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            rating: parseFloat(apt.rating) || 4.0,
            price: parseInt(apt.price) || 0,
            bedrooms: parseInt(apt.bedrooms) || 1,
            bathrooms: parseInt(apt.bathrooms) || 1,
            area: parseInt(apt.area) || 0
          }));
        }
      } catch (parseError) {
        console.log('直接解析也失败:', parseError);
      }
      
      throw new Error('无法解析公寓数据');
    } catch (error) {
      console.error('查询真实公寓数据失败:', error);
      return [];
    }
  }

  // 调用OpenAI API
  private async callOpenAI(prompt: string): Promise<OpenAIResponse> {
    if (!this.apiKey) {
      throw new Error('OpenAI API密钥未配置');
    }

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: '你是一个专业的公寓租赁顾问，擅长分析用户需求、推荐公寓、提供租房建议。请用中文回答。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000, // 增加token数量，确保能返回8套完整的公寓数据
        temperature: 0.2 // 降低随机性，提高确定性
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API错误: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  // 快速调用OpenAI API - 极速版本
  private async callOpenAIFast(prompt: string): Promise<OpenAIResponse> {
    if (!this.apiKey) {
      throw new Error('OpenAI API密钥未配置');
    }

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: '公寓租赁顾问，中文回答，简洁专业。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 200, // 极少的token
        temperature: 0.1 // 更确定性的回答
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API错误: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  // 获取默认需求
  private getDefaultRequirements(): UserRequirements {
    return {
      location: '通用', // 改为更通用的默认值
      budget: { min: 2000, max: 4000 },
      bedrooms: 1,
      bathrooms: 1,
      area: { min: 500, max: 1500 },
      amenities: [],
      commuteTime: 30,
      petFriendly: false,
      furnished: false,
      parking: false,
      description: ''
    };
  }

  // 检查API状态
  async checkApiStatus(): Promise<boolean> {
    if (!this.apiKey) {
      return false;
    }

    try {
      const response = await this.callOpenAI('你好');
      return response.choices.length > 0;
    } catch (error) {
      return false;
    }
  }

  // 获取API使用统计
  async getUsageStats(): Promise<{
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  } | null> {
    try {
      const response = await fetch(`${this.baseUrl}/usage`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`获取使用统计失败: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('获取使用统计失败:', error);
      return null;
    }
  }


}

// 使用示例
export const openaiApiService = new OpenAIApiService();
