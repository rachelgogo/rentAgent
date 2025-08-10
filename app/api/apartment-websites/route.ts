import { NextRequest, NextResponse } from 'next/server';
import { openaiRealDataApiService } from '../../services/openaiRealDataApi';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const location = searchParams.get('location');
    const petFriendly = searchParams.get('petFriendly') === 'true';
    const budget = searchParams.get('budget');
    const commuteTime = searchParams.get('commuteTime');

    // 构建搜索条件
    const criteria: any = {};
    if (petFriendly) criteria.petFriendly = true;
    if (budget) criteria.budget = { max: parseInt(budget) };
    if (commuteTime) criteria.commuteTime = parseInt(commuteTime);

    const targetLocation = city || location || 'San Francisco';

    // 获取所有公寓网站
    const allWebsites = openaiRealDataApiService.getApartmentWebsites(targetLocation);
    
    // 获取推荐的网站
    const recommendedWebsites = openaiRealDataApiService.getRecommendedWebsites(targetLocation, criteria);

    return NextResponse.json({
      success: true,
      data: {
        location: targetLocation,
        allWebsites: allWebsites,
        recommendedWebsites: recommendedWebsites,
        totalWebsites: allWebsites.length,
        message: `为${targetLocation}地区找到${allWebsites.length}个公寓网站`
      },
      message: '成功获取公寓官方网址列表'
    });

  } catch (error) {
    console.error('获取公寓网站失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '获取公寓网站失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { location, criteria } = body;

    if (!location) {
      return NextResponse.json(
        {
          success: false,
          error: '位置信息不能为空',
          message: '请提供位置信息'
        },
        { status: 400 }
      );
    }

    // 获取所有公寓网站
    const allWebsites = openaiRealDataApiService.getApartmentWebsites(location);
    
    // 获取推荐的网站
    const recommendedWebsites = openaiRealDataApiService.getRecommendedWebsites(location, criteria);

    return NextResponse.json({
      success: true,
      data: {
        location: location,
        allWebsites: allWebsites,
        recommendedWebsites: recommendedWebsites,
        totalWebsites: allWebsites.length,
        message: `为${location}地区找到${allWebsites.length}个公寓网站`
      },
      message: '成功获取公寓官方网址列表'
    });

  } catch (error) {
    console.error('获取公寓网站失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '获取公寓网站失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}
