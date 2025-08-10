'use client'

import { useState, useCallback, useRef } from 'react'
import { Search, Home as HomeIcon, MapPin, DollarSign, Users, Car, Wifi, Star, Brain, Settings, Globe, TrendingUp } from 'lucide-react'
import OpenAIApartmentSearch from './components/OpenAIApartmentSearch'
import MarketAnalysisTemplate from './components/MarketAnalysisTemplate'
import QuestionAnswerTemplate from './components/QuestionAnswerTemplate'
import ApartmentCard from './components/ApartmentCard'
import ApartmentDetailModal from './components/ApartmentDetailModal'
import { UserRequirements, Apartment } from './types'
import { getAllModels, getModelConfig, DEFAULT_MODEL } from './services/modelConfig'

export default function Home() {
  const [requirements, setRequirements] = useState<UserRequirements | null>(null)
  const [apartments, setApartments] = useState<Apartment[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL)
  const [showModelSelector, setShowModelSelector] = useState(false)
  const [selectedSearchType, setSelectedSearchType] = useState('comprehensive_search')
  const [searchResults, setSearchResults] = useState<any>(null)
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  
  // 性能优化：添加防抖和缓存
  const searchTimeoutRef = useRef<NodeJS.Timeout>()
  const searchCache = useRef<Map<string, any>>(new Map())

  // 处理AI查询 - 优化版本
  const handleAIQuery = useCallback(async (query: string) => {
    // 清除之前的超时
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    
    // 创建缓存键
    const cacheKey = `ai-query-${query}-${selectedSearchType}-${selectedModel}`
    
    // 检查缓存
    if (searchCache.current.has(cacheKey)) {
      const cachedData = searchCache.current.get(cacheKey)
      setApartments(cachedData.apartments || [])
      setSearchResults(cachedData.searchResults)
      setRequirements({
        location: 'Santa Clara',
        budget: { min: 2000, max: 4000 },
        bedrooms: 1,
        bathrooms: 1,
        area: { min: 500, max: 1500 },
        amenities: [],
        commuteTime: 30,
        petFriendly: false,
        furnished: false,
        parking: false,
        description: query
      })
      return
    }
    
    setLoading(true)
    setRequirements({
      location: 'San Francisco',
      budget: { min: 2000, max: 4000 },
      bedrooms: 1,
      bathrooms: 1,
      area: { min: 500, max: 1500 },
      amenities: [],
      commuteTime: 30,
      petFriendly: false,
      furnished: false,
      parking: false,
      description: query
    })
    
    // 防抖：延迟300ms执行搜索
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch('/api/openai-apartments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: query,
            searchType: selectedSearchType,
            model: selectedModel,
            forceRealData: false,
            useRealData: true
          }),
        })
        
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data) {
            const apartmentsData = data.data.apartments || []
            setApartments(apartmentsData)
            setSearchResults(data.data)
            
            // 缓存结果
            searchCache.current.set(cacheKey, {
              apartments: apartmentsData,
              searchResults: data.data,
              timestamp: Date.now()
            })
          }
        } else {
          console.error('搜索失败')
        }
      } catch (error) {
        console.error('搜索出错:', error)
      } finally {
        setLoading(false)
      }
    }, 300)
  }, [selectedSearchType, selectedModel])

  // 处理搜索类型变更
  function handleSearchTypeChange(searchType: string) {
    setSelectedSearchType(searchType)
    console.log('搜索类型变更为:', searchType)
  }

  // 处理公寓详情查看
  const handleViewApartmentDetails = (apartment: Apartment) => {
    setSelectedApartment(apartment)
    setShowDetailModal(true)
  }

  // 关闭详情模态框
  const handleCloseDetailModal = () => {
    setShowDetailModal(false)
    setSelectedApartment(null)
  }

  const handleRequirementsSubmit = useCallback(async (req: UserRequirements) => {
    // 清除之前的超时
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    
    // 创建缓存键
    const cacheKey = `requirements-${JSON.stringify(req)}`
    
    // 检查缓存
    if (searchCache.current.has(cacheKey)) {
      const cachedData = searchCache.current.get(cacheKey)
      setApartments(cachedData.apartments || [])
      setSearchResults(cachedData.searchResults)
      setRequirements(req)
      return
    }
    
    setLoading(true)
    setRequirements(req)
    
    // 防抖：延迟500ms执行搜索
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch('/api/openai-apartments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `我想在${req.location}找一个${req.bedrooms}居室公寓，预算${req.budget.min}-${req.budget.max}美元，${req.petFriendly ? '需要宠物友好' : ''}${req.furnished ? '需要家具齐全' : ''}${req.parking ? '需要停车位' : ''}`,
            searchType: 'comprehensive_search',
            forceRealData: false,
            useRealData: true
          }),
        })
        
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data) {
            const apartmentsData = data.data.apartments || []
            setApartments(apartmentsData)
            setSearchResults(data.data)
            
            // 缓存结果
            searchCache.current.set(cacheKey, {
              apartments: apartmentsData,
              searchResults: data.data,
              timestamp: Date.now()
            })
          }
        } else {
          console.error('搜索失败')
        }
      } catch (error) {
        console.error('搜索出错:', error)
      } finally {
        setLoading(false)
      }
    }, 500)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <HomeIcon className="h-8 w-8 text-blue-600" />
              <h1 className="ml-3 text-2xl font-bold text-gray-900">租房AI助手</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Brain className="h-6 w-6 text-blue-600" />
              <span className="text-sm text-gray-600">OpenAI智能公寓推荐</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧表单 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Brain className="h-5 w-5 mr-2 text-blue-600" />
                OpenAI智能搜索
              </h2>
              
              {/* 快速搜索输入 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  智能搜索
                </label>
                <div className="space-y-3">
                  <textarea
                    placeholder={
                      selectedSearchType === 'market_analysis' 
                        ? "例如：旧金山的租房市场趋势如何？"
                        : selectedSearchType === 'qa'
                        ? "例如：如何判断租金是否合理？"
                        : "例如：我想在旧金山找一个2居室公寓，预算3000美元，需要宠物友好"
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 resize-none"
                    rows={3}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        const input = e.target as HTMLTextAreaElement;
                        if (input.value.trim()) {
                          handleAIQuery(input.value.trim());
                        }
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      const input = document.querySelector('textarea[placeholder*="例如"]') as HTMLTextAreaElement;
                      if (input?.value.trim()) {
                        handleAIQuery(input.value.trim());
                      }
                    }}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    开始搜索
                  </button>
                </div>
              </div>

              {/* 搜索类型选择 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  搜索类型
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'comprehensive_search', name: '智能搜索', desc: 'AI分析需求并推荐公寓' },
                    { id: 'market_analysis', name: '市场分析', desc: '查看租房市场趋势和价格' },
                    { id: 'qa', name: '租房问答', desc: '回答租房相关问题' }
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => handleSearchTypeChange(type.id)}
                      className={`w-full p-3 text-left border rounded-lg transition-colors ${
                        selectedSearchType === type.id
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      <div className="font-medium text-gray-900">{type.name}</div>
                      <div className="text-sm text-gray-600">{type.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 模型选择器 */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    AI模型选择
                  </label>
                  <button
                    onClick={() => setShowModelSelector(!showModelSelector)}
                    className="flex items-center text-sm text-blue-600 hover:text-blue-700"
                  >
                    <Settings className="h-4 w-4 mr-1" />
                    设置
                  </button>
                </div>
                
                {showModelSelector ? (
                  <div className="space-y-2">
                    {getAllModels().map((model) => (
                      <button
                        key={model.id}
                        onClick={() => {
                          setSelectedModel(model.id);
                          setShowModelSelector(false);
                        }}
                        className={`w-full p-3 text-left border rounded-lg transition-colors ${
                          selectedModel === model.id
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                        }`}
                      >
                        <div className="font-medium text-gray-900">{model.name}</div>
                        <div className="text-sm text-gray-600">{model.description}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          成本: ${model.costPer1kTokens * 1000}/1M tokens
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="font-medium text-gray-900">
                      {getModelConfig(selectedModel).name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {getModelConfig(selectedModel).description}
                    </div>
                  </div>
                )}
              </div>

              {/* 使用说明 */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">💡 使用提示</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• 用自然语言描述你的需求</li>
                  <li>• 可以指定位置、预算、房间数</li>
                  <li>• 支持宠物友好、停车位等要求</li>
                  <li>• AI会智能分析并推荐合适公寓</li>
                  <li>• 当前使用: {getModelConfig(selectedModel).name}</li>
                </ul>
              </div>

              {/* 租房网站导航 */}
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-medium text-green-900 mb-2">🌐 租房网站导航</h3>
                <p className="text-sm text-green-800 mb-3">
                  精选优质租房平台，获取更多房源信息
                </p>
                <a
                  href="/websites"
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  查看租房网站
                </a>
              </div>
            </div>
          </div>

          {/* 右侧结果 */}
          <div className="lg:col-span-2">
            {requirements && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">AI搜索结果</h3>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">AI正在智能搜索公寓...</span>
                    <div className="mt-4 text-sm text-gray-500">
                      正在优化搜索速度，请稍候...
                    </div>
                    <div className="mt-2 text-xs text-gray-400">
                      已启用缓存和防抖优化
                    </div>
                  </div>
                ) : searchResults ? (
                  <div>
                    {/* 根据搜索类型显示不同的模板 */}
                    {selectedSearchType === 'market_analysis' && searchResults.type === 'market_analysis' ? (
                      <MarketAnalysisTemplate data={searchResults} />
                    ) : selectedSearchType === 'qa' && searchResults.type === 'qa' ? (
                      <QuestionAnswerTemplate data={searchResults} />
                    ) : selectedSearchType === 'comprehensive_search' && searchResults.type === 'comprehensive_search' ? (
                      <div className="space-y-6">
                        {/* 公寓推荐 */}
                        {searchResults.apartments && searchResults.apartments.length > 0 ? (
                          <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                              <HomeIcon className="h-5 w-5 mr-2 text-blue-600" />
                              推荐公寓 ({searchResults.apartments.length}套)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {searchResults.apartments.map((apartment: any, index: number) => (
                                <ApartmentCard
                                  key={index}
                                  apartment={apartment}
                                  onViewDetails={handleViewApartmentDetails}
                                />
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <HomeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">暂无推荐公寓，请尝试其他搜索条件</p>
                          </div>
                        )}
                      </div>
                    ) : apartments.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {apartments.map((apartment, index) => (
                          <ApartmentCard
                            key={index}
                            apartment={apartment}
                            onViewDetails={handleViewApartmentDetails}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <HomeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">暂无搜索结果，请尝试其他搜索条件</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <HomeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">暂无搜索结果，请尝试其他搜索条件</p>
                  </div>
                )}
              </div>
            )}

            {!requirements && (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <Brain className="h-16 w-16 text-blue-600 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  欢迎使用OpenAI智能租房助手
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  使用AI智能搜索，用自然语言描述你的租房需求，我们将为你推荐最适合的公寓选择
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                  <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg">
                    <Brain className="h-8 w-8 text-blue-600 mb-2" />
                    <span className="text-sm font-medium text-gray-900">AI智能</span>
                    <span className="text-xs text-gray-600 mt-1">自然语言理解</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg">
                    <Star className="h-8 w-8 text-green-600 mb-2" />
                    <span className="text-sm font-medium text-gray-900">智能推荐</span>
                    <span className="text-xs text-gray-600 mt-1">个性化匹配</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-purple-50 rounded-lg">
                    <MapPin className="h-8 w-8 text-purple-600 mb-2" />
                    <span className="text-sm font-medium text-gray-900">真实数据</span>
                    <span className="text-xs text-gray-600 mt-1">基于市场情况</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 公寓详情模态框 */}
      <ApartmentDetailModal
        apartment={selectedApartment}
        isOpen={showDetailModal}
        onClose={handleCloseDetailModal}
      />
    </div>
  )
}
