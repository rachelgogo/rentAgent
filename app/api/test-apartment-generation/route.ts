import { NextRequest, NextResponse } from 'next/server';
import { openaiRealDataApiService } from '../../services/openaiRealDataApi';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 开始测试公寓数据生成...');
    
    // 直接调用公寓数据生成服务
    const apartments = await openaiRealDataApiService.generateRealApartments(
      'San Francisco',
      2,
      undefined,
      true // forceRealData = true
    );
    
    console.log(`✅ 成功生成${apartments.length}套公寓数据`);
    console.log('公寓数据示例:', JSON.stringify(apartments[0], null, 2));
    
    return NextResponse.json({
      success: true,
      data: {
        apartments: apartments,
        total: apartments.length,
        testType: 'apartment_generation',
        timestamp: new Date().toISOString()
      },
      message: '公寓数据生成测试成功'
    });
    
  } catch (error) {
    console.error('❌ 公寓数据生成测试失败:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: '测试失败',
        message: error instanceof Error ? error.message : '未知错误',
        data: null
      },
      { status: 500 }
    );
  }
}
