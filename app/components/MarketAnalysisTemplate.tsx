'use client'

import { TrendingUp, DollarSign, MapPin, BarChart3, Info, AlertTriangle, Calendar, Users, Home } from 'lucide-react'
import { Apartment } from '../types'

interface MarketAnalysisData {
  type: 'market_analysis'
  location: string
  apartments: Apartment[]
  marketAnalysis: string
  total: number
  stats: {
    averagePrice: number
    priceRange: {
      min: number
      max: number
    }
  }
  dataSource?: string
}

interface MarketAnalysisTemplateProps {
  data: MarketAnalysisData
}

export default function MarketAnalysisTemplate({ data }: MarketAnalysisTemplateProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const getPriceTrend = () => {
    const avg = data.stats.averagePrice
    if (avg > 4000) return { trend: 'high', color: 'text-red-600', bgColor: 'bg-red-50', icon: AlertTriangle, label: '租金较高' }
    if (avg > 3000) return { trend: 'medium', color: 'text-yellow-600', bgColor: 'bg-yellow-50', icon: Info, label: '租金中等' }
    return { trend: 'low', color: 'text-green-600', bgColor: 'bg-green-50', icon: TrendingUp, label: '租金合理' }
  }

  // 基于价格区间跨度动态计算市场活跃度
  const getMarketActivityLevel = () => {
    const priceRange = data.stats.priceRange.max - data.stats.priceRange.min
    const avgPrice = data.stats.averagePrice
    
    // 基于价格区间跨度占平均价格的比例来判断市场活跃度
    const rangeRatio = priceRange / avgPrice
    
    if (rangeRatio > 0.8) return '高'
    if (rangeRatio > 0.5) return '中等'
    return '低'
  }

  const priceTrend = getPriceTrend()

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* 页面标题 */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {data.location} 租房市场分析
        </h1>
        <p className="text-lg text-gray-600">
          基于OpenAI实时市场数据的深度分析
        </p>
        <div className="flex items-center justify-center mt-4 space-x-4">
          <div className="flex items-center px-3 py-1 bg-blue-100 rounded-full">
            <TrendingUp className="h-4 w-4 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-blue-800">实时数据</span>
          </div>
          <div className="flex items-center px-3 py-1 bg-green-100 rounded-full">
            <Info className="h-4 w-4 text-green-600 mr-2" />
            <span className="text-sm font-medium text-green-800">AI分析</span>
          </div>
        </div>
      </div>

      {/* 关键指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* 平均租金 */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${priceTrend.bgColor} ${priceTrend.color}`}>
              {priceTrend.label}
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-2">平均租金</h3>
          <p className="text-3xl font-bold text-gray-900 mb-2">
            {formatPrice(data.stats.averagePrice)}
          </p>
          <p className="text-sm text-gray-500">每月</p>
        </div>

        {/* 价格区间 */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
            <div className="px-2 py-1 bg-green-100 rounded-full text-xs font-medium text-green-800">
              价格范围
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-2">价格区间</h3>
          <p className="text-2xl font-bold text-gray-900 mb-1">
            {formatPrice(data.stats.priceRange.min)}
          </p>
          <p className="text-lg text-gray-600 mb-1">至</p>
          <p className="text-2xl font-bold text-gray-900 mb-2">
            {formatPrice(data.stats.priceRange.max)}
          </p>
          <p className="text-sm text-gray-500">
            差异: {formatPrice(data.stats.priceRange.max - data.stats.priceRange.min)}
          </p>
        </div>

        {/* 市场活跃度 */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="px-2 py-1 bg-purple-100 rounded-full text-xs font-medium text-purple-800">
              活跃房源
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-2">市场活跃度</h3>
          <p className="text-3xl font-bold text-gray-900 mb-2">
            {getMarketActivityLevel()}
          </p>
          <p className="text-sm text-gray-500">市场活跃程度</p>
        </div>

        {/* 市场趋势 */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
            <div className="px-2 py-1 bg-orange-100 rounded-full text-xs font-medium text-orange-800">
              市场趋势
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-2">当前趋势</h3>
          <div className="flex items-center mb-2">
            <priceTrend.icon className={`h-5 w-5 mr-2 ${priceTrend.color}`} />
            <span className={`text-lg font-semibold ${priceTrend.color}`}>
              {priceTrend.label}
            </span>
          </div>
          <p className="text-sm text-gray-500">基于最新数据</p>
        </div>
      </div>

      {/* 市场分析报告 */}
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-blue-100 rounded-lg mr-4">
            <TrendingUp className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">市场分析报告</h2>
            <p className="text-gray-600">AI深度分析的市场趋势和洞察</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
          <div className="prose max-w-none">
            <div className="text-gray-800 whitespace-pre-line leading-relaxed text-base">
              {data.marketAnalysis}
            </div>
          </div>
        </div>
      </div>



      {/* 推荐公寓 - 只在有真实公寓数据时显示 */}
      {data.apartments && data.apartments.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-purple-100 rounded-lg mr-4">
              <Home className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">市场推荐公寓</h2>
              <p className="text-gray-600">精选的代表性房源推荐</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.apartments.slice(0, 6).map((apartment, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors border border-gray-200">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-gray-900 text-sm leading-tight">{apartment.title}</h3>
                  <span className="text-lg font-bold text-blue-600">
                    {formatPrice(apartment.price)}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(apartment.location || '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                      title="在Google地图中查看"
                    >
                      {apartment.location}
                    </a>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                  <span className="flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    {apartment.bedrooms} 卧
                  </span>
                  <span className="flex items-center">
                    <Home className="h-3 w-3 mr-1" />
                    {apartment.bathrooms} 卫
                  </span>
                  <span>{apartment.area} sqft</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {apartment.petFriendly && (
                    <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      宠物友好
                    </span>
                  )}
                  {apartment.furnished && (
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      家具齐全
                    </span>
                  )}
                  {apartment.parking && (
                    <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                      停车位
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 市场建议 */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-8 border border-blue-100">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-blue-100 rounded-lg mr-4">
            <Info className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">市场建议</h2>
            <p className="text-gray-600">基于市场分析的实用建议</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-green-600" />
              预算建议
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                平均租金: <span className="font-semibold">{formatPrice(data.stats.averagePrice)}/月</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                建议预算: <span className="font-semibold">{formatPrice(Math.round(data.stats.averagePrice * 0.8))} - {formatPrice(Math.round(data.stats.averagePrice * 1.2))}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                性价比区间: <span className="font-semibold">{formatPrice(data.stats.priceRange.min)} - {formatPrice(Math.round(data.stats.averagePrice))}</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              租房时机
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                价格区间跨度: <span className="font-semibold">{formatPrice(data.stats.priceRange.max - data.stats.priceRange.min)}</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                市场活跃度: <span className="font-semibold">中等</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                建议: 根据预算选择合适的房源
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
