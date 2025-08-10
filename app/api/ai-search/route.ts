import { NextRequest, NextResponse } from 'next/server';
import { openaiApiService } from '../../services/openaiApi';
import { UserRequirements } from '../../types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, userPreferences, searchType } = body;

    if (!query) {
      return NextResponse.json(
        {
          success: false,
          error: '查询内容不能为空',
          message: '请提供搜索查询'
        },
        { status: 400 }
      );
    }

    console.log('AI搜索请求:', { query, searchType, userPreferences });

    let results: any = {};

    // 根据搜索类型执行不同的AI功能
    switch (searchType) {
      case 'natural_language':
        // 自然语言搜索
        results = await handleNaturalLanguageSearch(query);
        break;
      
      case 'requirements_analysis':
        // 需求分析
        results = await handleRequirementsAnalysis(query);
        break;
      
      case 'smart_recommendation':
        // 智能推荐
        results = await handleSmartRecommendation(query, userPreferences);
        break;
      
      case 'market_analysis':
        // 市场分析
        results = await handleMarketAnalysis(query);
        break;
      
      case 'qa':
        // 智能问答
        results = await handleQuestionAnswer(query);
        break;
      
      default:
        // 默认：综合分析
        results = await handleComprehensiveSearch(query, userPreferences);
    }

    return NextResponse.json({
      success: true,
      data: results,
      query: query,
      searchType: searchType,
      message: 'AI搜索完成'
    });

  } catch (error) {
    console.error('AI搜索失败:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'AI搜索失败',
        message: error instanceof Error ? error.message : '未知错误',
        data: null
      },
      { status: 500 }
    );
  }
}

// 自然语言搜索处理
async function handleNaturalLanguageSearch(query: string) {
  try {
    // 简化版本：直接返回空结果
    return {
      type: 'natural_language_search',
      apartments: [],
      total: 0,
      query: query,
      message: '此功能暂未实现'
    };
  } catch (error) {
    console.error('自然语言搜索失败:', error);
    return {
      type: 'natural_language_search',
      apartments: [],
      total: 0,
      error: '搜索失败'
    };
  }
}

// 需求分析处理
async function handleRequirementsAnalysis(userInput: string) {
  try {
    // 使用OpenAI分析用户需求
    const requirements = await openaiApiService.analyzeUserRequirements(userInput);
    
    return {
      type: 'requirements_analysis',
      requirements: requirements,
      apartments: [],
      total: 0,
      analysis: {
        originalInput: userInput,
        extractedRequirements: requirements
      },
      message: '公寓搜索功能暂未实现'
    };
  } catch (error) {
    console.error('需求分析失败:', error);
    return {
      type: 'requirements_analysis',
      requirements: null,
      apartments: [],
      total: 0,
      error: '分析失败'
    };
  }
}

// 智能推荐处理
async function handleSmartRecommendation(query: string, userPreferences?: string) {
  try {
    // 先分析用户需求
    const requirements = await openaiApiService.analyzeUserRequirements(query);
    
    // 获取智能推荐 - 使用新的筛选方法
    const filteredApartments = await openaiApiService.filterAndRecommendApartments(
      [], // 空数组，因为公寓搜索功能暂未实现
      requirements
    );

    return {
      type: 'smart_recommendation',
      requirements: requirements,
      apartments: filteredApartments,
      total: filteredApartments.length
    };
  } catch (error) {
    console.error('智能推荐失败:', error);
    return {
      type: 'smart_recommendation',
      requirements: null,
      apartments: [],
      recommendation: null,
      total: 0,
      error: '推荐失败'
    };
  }
}

// 市场分析处理
async function handleMarketAnalysis(location: string) {
  try {
    // 简化版本：直接返回空结果
    return {
      type: 'market_analysis',
      location: location,
      apartments: [],
      marketAnalysis: '市场分析功能暂未实现',
      total: 0,
      stats: {
        averagePrice: 0,
        priceRange: { min: 0, max: 0 }
      }
    };
  } catch (error) {
    console.error('市场分析失败:', error);
    return {
      type: 'market_analysis',
      location: location,
      apartments: [],
      marketAnalysis: '分析失败',
      total: 0,
      error: '分析失败'
    };
  }
}

// 智能问答处理
async function handleQuestionAnswer(question: string) {
  try {
    // 简化版本：直接返回空结果
    return {
      type: 'qa',
      question: question,
      answer: '智能问答功能暂未实现',
      contextApartments: []
    };
  } catch (error) {
    console.error('智能问答失败:', error);
    return {
      type: 'qa',
      question: question,
      answer: '抱歉，暂时无法回答您的问题',
      error: '回答失败'
    };
  }
}

// 综合搜索处理
async function handleComprehensiveSearch(query: string, userPreferences?: string) {
  try {
    // 1. 分析用户需求
    const requirements = await openaiApiService.analyzeUserRequirements(query);
    
    // 2. 获取智能推荐
    const filteredApartments = await openaiApiService.filterAndRecommendApartments(
      [], // 空数组，因为公寓搜索功能暂未实现
      requirements
    );

    // 3. 获取市场分析
    const marketAnalysis = await openaiApiService.analyzeMarketTrends(
      requirements.location, 
      []
    );

    return {
      type: 'comprehensive_search',
      requirements: requirements,
      apartments: filteredApartments,
      marketAnalysis: marketAnalysis,
      total: filteredApartments.length,
      query: query
    };
  } catch (error) {
    console.error('综合搜索失败:', error);
    return {
      type: 'comprehensive_search',
      requirements: null,
      apartments: [],
      recommendation: null,
      marketAnalysis: null,
      total: 0,
      error: '搜索失败'
    };
  }
}

// GET请求处理
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const searchType = searchParams.get('type') || 'comprehensive';

    if (!query) {
      return NextResponse.json(
        {
          success: false,
          error: '查询参数不能为空',
          message: '请提供查询参数 q'
        },
        { status: 400 }
      );
    }

    // 复用POST逻辑
    const body = { query, searchType };
    const mockRequest = new Request(request.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }) as NextRequest;
    
    const response = await POST(mockRequest);
    return response;

  } catch (error) {
    console.error('AI搜索GET请求失败:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'AI搜索失败',
        message: error instanceof Error ? error.message : '未知错误',
        data: null
      },
      { status: 500 }
    );
  }
}
