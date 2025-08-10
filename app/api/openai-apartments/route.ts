import { NextRequest, NextResponse } from 'next/server';
import { openaiRealDataApiService } from '../../services/openaiRealDataApi';
import { openaiApiService } from '../../services/openaiApi';
import { UserRequirements } from '../../types';

// 优化的内存缓存
const cache = new Map();
const CACHE_DURATION = 2 * 60 * 1000; // 减少到2分钟缓存，增加结果多样性
const QA_CACHE_DURATION = 30 * 60 * 1000; // 问答功能30分钟缓存

// 简单的位置提取函数
function extractLocationFromQuery(query: string): string {
  const locationKeywords = [
    '旧金山', 'San Francisco', 'SF',
    '圣何塞', 'San Jose', 'SJ',
    '奥克兰', 'Oakland',
    '帕罗奥图', 'Palo Alto',
    '山景城', 'Mountain View',
    '库比蒂诺', 'Cupertino',
    '圣克拉拉', 'Santa Clara',
    '森尼维尔', 'Sunnyvale',
    '弗里蒙特', 'Fremont',
    '伯克利', 'Berkeley',
    '雷德伍德城', 'Redwood City',
    '门洛帕克', 'Menlo Park'
  ];
  
  for (const keyword of locationKeywords) {
    if (query.includes(keyword)) {
      return keyword;
    }
  }
  
  return 'San Francisco'; // 默认位置
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      location, 
      count, 
      requirements, 
      type,
      query,
      searchType,
      model,
      useRealData = true, // 新增参数，控制是否使用真实数据
      forceRealData = false // 强制使用真实数据，忽略错误
    } = body;

    console.log('OpenAI公寓API请求:', { location, count, type, query, searchType, useRealData, forceRealData });

    let apartments: any[] = [];
    let marketAnalysis = '';
    let aiRecommendation = null;

    // 根据请求类型处理
    if (query && searchType) {
      // 检查缓存 - 为智能搜索添加随机性，避免总是返回相同结果
      const cacheKey = searchType === 'comprehensive_search' 
        ? `${query}-${searchType}-${model || 'default'}-${Math.floor(Date.now() / (2 * 60 * 1000))}` // 每2分钟生成新的缓存键
        : `${query}-${searchType}-${model || 'default'}`;
      const cachedResult = cache.get(cacheKey);
      
      if (cachedResult && Date.now() - cachedResult.timestamp < CACHE_DURATION && !forceRealData && searchType !== 'comprehensive_search') {
        console.log('📦 使用缓存结果');
        return NextResponse.json(cachedResult.data);
      }
      
      // AI智能搜索
      const aiResponse = await handleAISearch(query, searchType, requirements, model, useRealData, forceRealData);
      
      // 缓存结果
      if (aiResponse.success) {
        cache.set(cacheKey, {
          data: aiResponse,
          timestamp: Date.now()
        });
        console.log('💾 缓存结果');
      }
      
      return NextResponse.json(aiResponse);
    }

    // 使用OpenAI生成基于真实市场数据的公寓信息
    console.log('使用OpenAI生成基于真实市场数据的公寓信息...');
    
    if (type === 'personalized' && requirements) {
      apartments = await openaiRealDataApiService.generatePersonalizedApartments(
        requirements,
        count || 8
      );
    } else {
      apartments = await openaiRealDataApiService.generateRealApartments(
        location || 'San Francisco',
        count || 10,
        requirements,
        forceRealData
      );
    }

    // 生成市场分析
    marketAnalysis = await openaiRealDataApiService.generateMarketAnalysis(
      location || 'San Francisco'
    );

    // 如果有用户需求，筛选推荐公寓
    if (requirements) {
      apartments = await openaiApiService.filterAndRecommendApartments(
        apartments,
        requirements
      );
    }

    console.log(`生成了 ${apartments.length} 套公寓数据`);

    return NextResponse.json({
      success: true,
      data: {
        apartments: apartments,
        marketAnalysis: marketAnalysis,
        aiRecommendation: aiRecommendation,
        total: apartments.length,
        location: location || 'San Francisco',
        generatedAt: new Date().toISOString(),
        dataSource: 'openai_real_data'
      },
      message: `成功生成 ${apartments.length} 套公寓数据`
    });

  } catch (error) {
    console.error('OpenAI公寓API失败:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: '生成失败',
        message: error instanceof Error ? error.message : '未知错误',
        data: null
      },
      { status: 500 }
    );
  }
}

// AI智能搜索处理
async function handleAISearch(
  query: string, 
  searchType: string, 
  requirements?: UserRequirements,
  model?: string,
  useRealData: boolean = true,
  forceRealData: boolean = false
) {
  try {
    let results: any = {};

    switch (searchType) {
      
      case 'market_analysis':
        // 市场分析 - 基于真实市场数据，不依赖生成的公寓
        const marketLocation = query || 'San Francisco';
        
        // 直接生成市场分析
        const marketAnalysis = await openaiRealDataApiService.generateMarketAnalysis(marketLocation);
        
        // 获取真实的市场统计数据
        const marketData = openaiRealDataApiService['getLocationMarketData'](marketLocation);
        
        // 市场分析不需要公寓推荐，只提供真实的市场数据
        results = {
          type: 'market_analysis',
          location: marketLocation,
          apartments: [], // 不显示公寓推荐，避免假数据
          marketAnalysis: marketAnalysis,
          total: 0, // 不显示公寓数量
          stats: {
            averagePrice: marketData.averageRent, // 使用真实市场平均租金
            priceRange: marketData.priceRange // 使用真实市场价格区间
          },
          dataSource: 'openai_real_data'
        };
        break;
      
      case 'qa':
        // 智能问答 - 极速版本，只回答问题，不生成公寓数据
        const answer = await openaiApiService.answerQuestionDirectly(query);
        
        results = {
          type: 'qa',
          question: query,
          answer: answer,
          contextApartments: [], // 不生成公寓数据，节省时间
          dataSource: 'openai_direct'
        };
        break;
      
      default:
        console.log('处理智能搜索:', searchType, query);
        // 智能搜索 - 通过OpenAI查询真实公寓数据
        const comprehensiveRequirements = await openaiApiService.analyzeUserRequirements(query);
        console.log('用户需求分析:', comprehensiveRequirements);
        
        // 通过OpenAI查询真实公寓数据
        const realApartments = await openaiApiService.searchRealApartments(comprehensiveRequirements);
        console.log('查询到的真实公寓:', realApartments);
        
        results = {
          type: 'comprehensive_search',
          requirements: comprehensiveRequirements,
          apartments: realApartments, // 提供通过OpenAI查询的真实公寓
          total: realApartments.length, // 显示公寓数量
          location: comprehensiveRequirements.location,
          query: query,
          dataSource: 'openai_real_data'
        };
        
        console.log('智能搜索结果:', results);
    }

    return {
      success: true,
      data: results,
      query: query,
      searchType: searchType,
      message: 'AI搜索完成'
    };

  } catch (error) {
    console.error('AI搜索失败:', error);
    return {
      success: false,
      error: 'AI搜索失败',
      message: error instanceof Error ? error.message : '未知错误',
      data: null
    };
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location') || 'San Francisco';
    const count = parseInt(searchParams.get('count') || '10');
    const type = searchParams.get('type') || 'general';
    const query = searchParams.get('q');
    const searchType = searchParams.get('searchType');

    console.log('GET请求OpenAI公寓API:', { location, count, type, query, searchType });

    // 如果有查询参数，执行AI搜索
    if (query && searchType) {
      const aiResponse = await handleAISearch(query, searchType);
      return NextResponse.json(aiResponse);
    }

    // 否则生成一般公寓数据
    let apartments: any[] = [];
    let marketAnalysis = '';

    if (type === 'personalized') {
      const defaultRequirements: UserRequirements = {
        location: location,
        budget: { min: 2000, max: 5000 },
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
      
      apartments = await openaiRealDataApiService.generatePersonalizedApartments(
        defaultRequirements,
        count
      );
    } else {
      apartments = await openaiRealDataApiService.generateRealApartments(location, count);
    }

    marketAnalysis = await openaiRealDataApiService.generateMarketAnalysis(location);

    return NextResponse.json({
      success: true,
      data: {
        apartments: apartments,
        marketAnalysis: marketAnalysis,
        total: apartments.length,
        location: location,
        generatedAt: new Date().toISOString()
      },
      message: `成功生成 ${apartments.length} 套真实公寓数据`
    });

  } catch (error) {
    console.error('GET请求OpenAI公寓API失败:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: '生成失败',
        message: error instanceof Error ? error.message : '未知错误',
        data: null
      },
      { status: 500 }
    );
  }
}
