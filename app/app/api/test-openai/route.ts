import { NextRequest, NextResponse } from 'next/server';
import { openaiRealDataApiService } from '../../../services/openaiRealDataApi';

export async function GET(request: NextRequest) {
  try {
    console.log('测试OpenAI API...');

    // 检查API状态
    const isAvailable = await openaiRealDataApiService.checkApiStatus();
    
    if (!isAvailable) {
      return NextResponse.json({
        success: false,
        error: 'OpenAI API不可用',
        message: '请检查OPENAI_API_KEY环境变量是否正确设置',
        data: null
      }, { status: 500 });
    }

    // 生成一个简单的公寓数据作为测试
    const testApartments = await openaiRealDataApiService.generateRealApartments(
      'San Francisco',
      2
    );

    // 生成市场分析
    const marketAnalysis = await openaiRealDataApiService.generateMarketAnalysis('San Francisco');

    return NextResponse.json({
      success: true,
      data: {
        apiStatus: 'available',
        testApartments: testApartments,
        marketAnalysis: marketAnalysis,
        message: 'OpenAI API工作正常'
      },
      message: '测试成功'
    });

  } catch (error) {
    console.error('OpenAI API测试失败:', error);
    
    return NextResponse.json({
      success: false,
      error: '测试失败',
      message: error instanceof Error ? error.message : '未知错误',
      data: null
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { location, count } = body;

    console.log('测试生成公寓数据:', { location, count });

    // 生成公寓数据
    const apartments = await openaiRealDataApiService.generateRealApartments(
      location || 'San Francisco',
      count || 3
    );

    return NextResponse.json({
      success: true,
      data: {
        apartments: apartments,
        total: apartments.length,
        location: location || 'San Francisco'
      },
      message: `成功生成 ${apartments.length} 套测试公寓数据`
    });

  } catch (error) {
    console.error('测试生成公寓数据失败:', error);
    
    return NextResponse.json({
      success: false,
      error: '生成失败',
      message: error instanceof Error ? error.message : '未知错误',
      data: null
    }, { status: 500 });
  }
}
