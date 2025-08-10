'use client'

import { useState } from 'react'
import { Search, Brain, TrendingUp, MessageCircle, Star, MapPin, DollarSign, Users, Car, Wifi } from 'lucide-react'
import ApartmentCard from './ApartmentCard'
import MarketAnalysisTemplate from './MarketAnalysisTemplate'
import QuestionAnswerTemplate from './QuestionAnswerTemplate'
import { Apartment, UserRequirements } from '../types'

interface AIRecommendation {
  reasoning: string;
  recommendations: string[];
  marketInsights: string[];
  tips: string[];
}

interface SearchResult {
  apartments: Apartment[];
  marketAnalysis?: string;
  aiRecommendation?: AIRecommendation;
  recommendation?: string; // 新增：个性化建议
  total: number;
  location: string;
  type: string;
  dataSource?: string;
  answer?: string;
  contextApartments?: Apartment[];
  note?: string; // 新增：提示信息
  stats?: {
    averagePrice: number;
    priceRange: {
      min: number;
      max: number;
    };
  };
}

export default function OpenAIApartmentSearch() {
  const [query, setQuery] = useState('')
  const [searchType, setSearchType] = useState('comprehensive_search')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<SearchResult | null>(null)
  const [error, setError] = useState('')

  const searchTypes = [
    {
      id: 'comprehensive_search',
      name: '智能搜索',
      icon: Search,
      description: 'AI分析需求并提供建议'
    },
    {
      id: 'natural_language',
      name: '自然语言搜索',
      icon: MessageCircle,
      description: '用自然语言描述你的需求'
    },
    {
      id: 'requirements_analysis',
      name: '需求分析',
      icon: Brain,
      description: 'AI分析你的租房需求'
    },
    {
      id: 'smart_recommendation',
      name: '智能推荐',
      icon: Star,
      description: '基于AI的个性化推荐'
    },
    {
      id: 'market_analysis',
      name: '市场分析',
      icon: TrendingUp,
      description: '分析租房市场趋势'
    },
    {
      id: 'qa',
      name: '智能问答',
      icon: MessageCircle,
      description: '回答租房相关问题'
    }
  ]

  const handleSearch = async () => {
    if (!query.trim()) {
      setError('请输入搜索内容')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/openai-apartments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query.trim(),
          searchType: searchType
        }),
      })

      const data = await response.json()

      if (data.success) {
        console.log('搜索结果:', data.data) // 添加调试信息
        console.log('搜索类型:', searchType)
        console.log('结果类型:', data.data?.type)
        console.log('个性化建议:', data.data?.recommendation)
        console.log('市场分析:', data.data?.marketAnalysis)
        setResults(data.data)
      } else {
        setError(data.message || '搜索失败')
      }
    } catch (error) {
      console.error('搜索出错:', error)
      setError('网络错误，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 搜索区域 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
          <Brain className="h-6 w-6 mr-2 text-blue-600" />
          OpenAI智能公寓搜索
        </h2>

        {/* 搜索类型选择 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            选择搜索类型
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {searchTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSearchType(type.id)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  searchType === type.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <type.icon className="h-5 w-5 mx-auto mb-2" />
                <div className="text-xs font-medium">{type.name}</div>
                <div className="text-xs text-gray-500 mt-1">{type.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 搜索输入 */}
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                searchType === 'natural_language' 
                  ? "例如：我想在旧金山找一个2居室公寓，预算3000美元，需要宠物友好"
                  : searchType === 'market_analysis'
                  ? "例如：旧金山的租房市场趋势如何？"
                  : searchType === 'qa'
                  ? "例如：如何判断租金是否合理？"
                  : "输入你的搜索需求..."
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                搜索中...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                搜索
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}
      </div>

      {/* 搜索结果 */}
      {results && (
        <div className="space-y-8">
          {/* 搜索结果统计 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                搜索结果
              </h3>
              <div className="flex items-center space-x-4">
                {results.total > 0 ? (
                  <div className="text-sm text-gray-600">
                    找到 {results.total} 套公寓
                  </div>
                ) : (
                  <div className="text-sm text-gray-600">
                    智能分析完成
                  </div>
                )}
                <div className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                  OpenAI真实数据
                </div>
              </div>
            </div>
          </div>

          {/* 市场分析结果 */}
          {results.type === 'market_analysis' && results.marketAnalysis && (
            <MarketAnalysisTemplate 
              data={{
                type: 'market_analysis',
                location: results.location,
                apartments: results.apartments || [],
                marketAnalysis: results.marketAnalysis,
                total: results.total,
                stats: results.stats || {
                  averagePrice: 0,
                  priceRange: { min: 0, max: 0 }
                },
                dataSource: results.dataSource
              }}
            />
          )}

          {/* 问答结果 */}
          {results.type === 'qa' && results.answer && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">问答结果</h3>
              <p className="text-gray-700">{results.answer}</p>
            </div>
          )}

          {/* 个性化建议 - 智能搜索时显示 */}
          {results.type === 'comprehensive_search' && results.recommendation && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Star className="h-5 w-5 mr-2 text-blue-600" />
                个性化建议
              </h3>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">{results.recommendation}</p>
              </div>
              {results.note && (
                <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                  <p className="text-sm text-blue-800 flex items-center">
                    <span className="mr-2">💡</span>
                    {results.note}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 市场分析 - 智能搜索时显示 */}
          {results.type === 'comprehensive_search' && results.marketAnalysis && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                市场分析
              </h3>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-line">{results.marketAnalysis}</p>
              </div>
            </div>
          )}

          {/* 公寓列表 - 只在有公寓时显示 */}
          {results.apartments && results.apartments.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.apartments.map((apartment, index) => (
                <ApartmentCard 
                  key={index} 
                  apartment={apartment} 
                  onViewDetails={(apt) => {
                    // 这里可以添加查看详情的逻辑
                    console.log('查看公寓详情:', apt);
                  }}
                />
              ))}
            </div>
          )}

          {/* 上下文公寓 - 问答功能的相关公寓 */}
          {results.contextApartments && results.contextApartments.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">相关公寓参考</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.contextApartments.map((apartment, index) => (
                  <ApartmentCard 
                    key={index} 
                    apartment={apartment} 
                    onViewDetails={(apt) => {
                      // 这里可以添加查看详情的逻辑
                      console.log('查看公寓详情:', apt);
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 使用说明 */}
      {!results && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Brain className="h-16 w-16 text-blue-600 mx-auto mb-6" />
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            使用OpenAI智能搜索
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            我们的AI助手可以理解自然语言，分析你的需求，并提供个性化的公寓推荐。
            你可以用中文描述你的租房需求，AI会为你找到最合适的公寓。
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg">
              <MessageCircle className="h-8 w-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">自然语言</span>
              <span className="text-xs text-gray-600 mt-1">用中文描述需求</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg">
              <Brain className="h-8 w-8 text-green-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">智能分析</span>
              <span className="text-xs text-gray-600 mt-1">AI理解并分析需求</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-purple-50 rounded-lg">
              <Star className="h-8 w-8 text-purple-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">个性化推荐</span>
              <span className="text-xs text-gray-600 mt-1">推荐最适合的公寓</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
