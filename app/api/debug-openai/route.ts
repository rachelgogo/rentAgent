import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 开始调试OpenAI API...');
    
    // 检查环境变量
    const apiKey = process.env.OPENAI_API_KEY;
    console.log('API密钥:', apiKey ? '已配置' : '未配置');
    console.log('API密钥长度:', apiKey ? apiKey.length : 0);
    console.log('API密钥前缀:', apiKey ? apiKey.substring(0, 10) + '...' : '无');
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'OpenAI API密钥未配置',
        data: null
      }, { status: 500 });
    }

    // 测试简单API调用
    console.log('📡 测试OpenAI API调用...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: '请简单回复"API测试成功"'
          }
        ],
        max_tokens: 50
      })
    });

    console.log('API响应状态:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API错误:', errorText);
      return NextResponse.json({
        success: false,
        error: `API调用失败: ${response.status}`,
        details: errorText,
        data: null
      }, { status: 500 });
    }

    const data = await response.json();
    console.log('✅ API调用成功');
    
    return NextResponse.json({
      success: true,
      data: {
        response: data.choices[0].message.content,
        usage: data.usage,
        model: data.model
      },
      message: 'OpenAI API调试成功'
    });
    
  } catch (error) {
    console.error('❌ 调试过程中发生错误:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: '调试失败',
        message: error instanceof Error ? error.message : '未知错误',
        data: null
      },
      { status: 500 }
    );
  }
}
