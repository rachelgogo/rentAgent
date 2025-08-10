import { NextRequest, NextResponse } from 'next/server';
import { openaiRealDataApiService } from '../../../services/openaiRealDataApi';
import { openaiApiService } from '../../../services/openaiApi';
import { UserRequirements } from '../../../types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      location, 
      count, 
      requirements, 
      type,
      query,
      searchType 
    } = body;

    console.log('OpenAI公寓API请求:', { location, count, type, query, searchType });

    let apartments: any[] = [];
    let marketAnalysis = '';
    let aiRecommendation = null;

    // 根据请求类型处理
    if (query && searchType) {
      // AI智能搜索
      const aiResponse = await handleAISearch(query, searchType, requirements);
      return NextResponse.json(aiResponse);
    }

    // 生成真实公寓数据
    if (type === 'personalized' && requirements) {
      apartments = await openaiRealDataApiService.generatePersonalizedApartments(
        requirements,
        count || 8
      );
    } else {
      apartments = await openaiRealDataApiService.generateRealApartments(
        location || 'San Francisco',
        count || 10,
        requirements
      );
    }

    // 生成市场分析
    marketAnalysis = await openaiRealDataApiService.generateMarketAnalysis(
      location || 'San Francisco'
    );

    // 如果有用户需求，生成AI推荐
    if (requirements) {
      aiRecommendation = await openaiApiService.recommendApartments(
        apartments,
        requirements
      );
    }

    console.log(`生成了 ${apartments.length} 套真实公寓数据`);

    return NextResponse.json({
      success: true,
      data: {
        apartments: apartments,
        marketAnalysis: marketAnalysis,
        aiRecommendation: aiRecommendation,
        total: apartments.length,
        location: location || 'San Francisco',
        generatedAt: new Date().toISOString()
      },
      message: `成功生成 ${apartments.length} 套真实公寓数据`
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
  requirements?: UserRequirements
) {
  try {
    let results: any = {};

    switch (searchType) {
      case 'natural_language':
        // 自然语言搜索
        const allApartments = await openaiRealDataApiService.generateRealApartments(
          'San Francisco',
          20
        );
        const matchedApartments = await openaiApiService.naturalLanguageSearch(
          query, 
          allApartments
        );
        results = {
          type: 'natural_language_search',
          apartments: matchedApartments,
          total: matchedApartments.length,
          query: query
        };
        break;
      
      case 'requirements_analysis':
        // 需求分析
        const analyzedRequirements = await openaiApiService.analyzeUserRequirements(query);
        const personalizedApartments = await openaiRealDataApiService.generatePersonalizedApartments(
          analyzedRequirements,
          10
        );
        results = {
          type: 'requirements_analysis',
          requirements: analyzedRequirements,
          apartments: personalizedApartments,
          total: personalizedApartments.length,
          analysis: {
            originalInput: query,
            extractedRequirements: analyzedRequirements
          }
        };
        break;
      
      case 'smart_recommendation':
        // 智能推荐
        const userRequirements = requirements || await openaiApiService.analyzeUserRequirements(query);
        const recommendedApartments = await openaiRealDataApiService.generatePersonalizedApartments(
          userRequirements,
          8
        );
        const recommendation = await openaiApiService.recommendApartments(
          recommendedApartments,
          userRequirements,
          query
        );
        results = {
          type: 'smart_recommendation',
          requirements: userRequirements,
          apartments: recommendedApartments,
          recommendation: recommendation,
          total: recommendedApartments.length
        };
        break;
      
      case 'market_analysis':
        // 市场分析
        const location = query || 'San Francisco';
        const marketApartments = await openaiRealDataApiService.generateRealApartments(
          location,
          15
        );
        const marketAnalysis = await openaiApiService.analyzeMarketTrends(
          location,
          marketApartments
        );
        results = {
          type: 'market_analysis',
          location: location,
          apartments: marketApartments,
          marketAnalysis: marketAnalysis,
          total: marketApartments.length,
          stats: {
            averagePrice: marketApartments.length > 0 
              ? Math.round(marketApartments.reduce((sum, apt) => sum + apt.price, 0) / marketApartments.length)
              : 0,
            priceRange: marketApartments.length > 0
              ? {
                  min: Math.min(...marketApartments.map(apt => apt.price)),
                  max: Math.max(...marketApartments.map(apt => apt.price))
                }
              : { min: 0, max: 0 }
          }
        };
        break;
      
      case 'qa':
        // 智能问答
        const sampleApartments = await openaiRealDataApiService.generateRealApartments(
          'San Francisco',
          10
        );
        const answer = await openaiApiService.answerQuestion(query, {
          apartments: sampleApartments
        });
        results = {
          type: 'qa',
          question: query,
          answer: answer,
          contextApartments: sampleApartments.slice(0, 5)
        };
        break;
      
      default:
        // 综合搜索
        const comprehensiveRequirements = await openaiApiService.analyzeUserRequirements(query);
        const comprehensiveApartments = await openaiRealDataApiService.generatePersonalizedApartments(
          comprehensiveRequirements,
          12
        );
        const comprehensiveRecommendation = await openaiApiService.recommendApartments(
          comprehensiveApartments,
          comprehensiveRequirements,
          query
        );
        const comprehensiveMarketAnalysis = await openaiApiService.analyzeMarketTrends(
          comprehensiveRequirements.location,
          comprehensiveApartments
        );
        results = {
          type: 'comprehensive_search',
          requirements: comprehensiveRequirements,
          apartments: comprehensiveApartments,
          recommendation: comprehensiveRecommendation,
          marketAnalysis: comprehensiveMarketAnalysis,
          total: comprehensiveApartments.length,
          query: query
        };
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
