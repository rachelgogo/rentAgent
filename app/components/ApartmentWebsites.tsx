'use client'

import { useState, useEffect } from 'react'
import { ExternalLink, Globe, Star, MapPin, Search, Filter } from 'lucide-react'

interface Website {
  name: string
  url: string
  description: string
  features: string[]
}

interface RecommendedWebsite {
  name: string
  url: string
  reason: string
}

interface ApartmentWebsitesProps {
  location?: string
  criteria?: any
}

export default function ApartmentWebsites({ location = 'San Francisco', criteria }: ApartmentWebsitesProps) {
  const [websites, setWebsites] = useState<Website[]>([])
  const [recommendedWebsites, setRecommendedWebsites] = useState<RecommendedWebsite[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    fetchWebsites()
  }, [location, criteria])

  const fetchWebsites = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/apartment-websites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location: location,
          criteria: criteria
        }),
      })

      const data = await response.json()

      if (data.success) {
        setWebsites(data.data.allWebsites)
        setRecommendedWebsites(data.data.recommendedWebsites)
      } else {
        setError(data.message || '获取网站列表失败')
      }
    } catch (error) {
      console.error('获取网站列表出错:', error)
      setError('网络错误，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    { id: 'all', name: '全部网站', icon: Globe },
    { id: 'recommended', name: '推荐网站', icon: Star },
    { id: 'general', name: '综合平台', icon: Search },
    { id: 'local', name: '本地网站', icon: MapPin }
  ]

  const filteredWebsites = selectedCategory === 'all' 
    ? websites 
    : selectedCategory === 'recommended'
    ? websites.filter(site => recommendedWebsites.some(rec => rec.name === site.name))
    : selectedCategory === 'general'
    ? websites.filter(site => !site.name.includes('CURBED') && !site.name.includes('RACKED'))
    : websites.filter(site => site.name.includes('CURBED') || site.name.includes('RACKED'))

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">正在获取公寓网站列表...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-5 w-5 text-red-400">⚠️</div>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* 页面标题 */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {location} 租房网站导航
        </h1>
        <p className="text-lg text-gray-600">
          精选优质租房平台，助你找到理想的公寓
        </p>
        <div className="flex items-center justify-center mt-4 space-x-4">
          <div className="flex items-center px-3 py-1 bg-blue-100 rounded-full">
            <Globe className="h-4 w-4 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-blue-800">优质平台</span>
          </div>
          <div className="flex items-center px-3 py-1 bg-green-100 rounded-full">
            <Star className="h-4 w-4 text-green-600 mr-2" />
            <span className="text-sm font-medium text-green-800">精选推荐</span>
          </div>
        </div>
      </div>

      {/* 分类筛选 */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-purple-100 rounded-lg mr-4">
            <Filter className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">网站分类</h2>
            <p className="text-gray-600">按类型筛选租房网站</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedCategory === category.id
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50 text-gray-700'
                }`}
              >
                <Icon className="h-6 w-6 mx-auto mb-2" />
                <div className="text-sm font-medium">{category.name}</div>
              </button>
            )
          })}
        </div>
      </div>

      {/* 推荐网站 */}
      {selectedCategory === 'all' && recommendedWebsites.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-yellow-100 rounded-lg mr-4">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">推荐网站</h2>
              <p className="text-gray-600">根据你的需求精选的租房平台</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedWebsites.map((website, index) => (
              <div key={index} className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 border border-yellow-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{website.name}</h3>
                  <div className="flex items-center px-2 py-1 bg-yellow-100 rounded-full">
                    <Star className="h-3 w-3 text-yellow-600 mr-1" />
                    <span className="text-xs font-medium text-yellow-800">推荐</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">{website.reason}</p>
                <a
                  href={website.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  访问网站
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 所有网站列表 */}
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg mr-4">
              <Globe className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedCategory === 'all' ? '所有平台' : 
                 selectedCategory === 'recommended' ? '推荐平台' :
                 selectedCategory === 'general' ? '综合平台' : '本地平台'}
              </h2>
              <p className="text-gray-600">共 {filteredWebsites.length} 个租房平台</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWebsites.map((website, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors border border-gray-200">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">{website.name}</h3>
                {recommendedWebsites.some(rec => rec.name === website.name) && (
                  <div className="flex items-center px-2 py-1 bg-yellow-100 rounded-full">
                    <Star className="h-3 w-3 text-yellow-600 mr-1" />
                    <span className="text-xs font-medium text-yellow-800">推荐</span>
                  </div>
                )}
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{website.description}</p>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">主要功能：</h4>
                <div className="flex flex-wrap gap-1">
                  {website.features.map((feature, featureIndex) => (
                    <span
                      key={featureIndex}
                      className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
              
              <a
                href={website.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                访问网站
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* 使用提示 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-100">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-blue-100 rounded-lg mr-4">
            <Search className="h-6 w-6 text-blue-600" />
          </div>
                  <div>
          <h2 className="text-2xl font-bold text-gray-900">使用提示</h2>
          <p className="text-gray-600">如何更好地使用这些租房平台</p>
        </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 搜索技巧</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• 使用多个平台对比房源信息</li>
              <li>• 设置价格和位置筛选条件</li>
              <li>• 查看用户评价和社区信息</li>
              <li>• 关注平台的优惠活动</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">⚠️ 注意事项</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• 确认房源信息的真实性</li>
              <li>• 仔细阅读租约条款</li>
              <li>• 实地看房后再做决定</li>
              <li>• 保留所有沟通记录</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
