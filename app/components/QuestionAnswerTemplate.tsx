'use client'

import { MessageCircle, HelpCircle, Lightbulb, BookOpen, MapPin, Clock, Users, Star, CheckCircle, AlertCircle } from 'lucide-react'
import { Apartment } from '../types'

interface QuestionAnswerData {
  type: 'qa'
  question: string
  answer: string
  contextApartments?: Apartment[]
  dataSource?: string
}

interface QuestionAnswerTemplateProps {
  data: QuestionAnswerData
}

export default function QuestionAnswerTemplate({ data }: QuestionAnswerTemplateProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  // 分析问题类型
  const getQuestionType = (question: string) => {
    const lowerQuestion = question.toLowerCase()
    if (lowerQuestion.includes('价格') || lowerQuestion.includes('租金') || lowerQuestion.includes('cost')) {
      return { 
        type: 'price', 
        icon: '💰', 
        color: 'text-green-600', 
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        label: '价格咨询',
        description: '关于租金、费用、预算等问题'
      }
    }
    if (lowerQuestion.includes('区域') || lowerQuestion.includes('位置') || lowerQuestion.includes('location')) {
      return { 
        type: 'location', 
        icon: '📍', 
        color: 'text-blue-600', 
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        label: '位置咨询',
        description: '关于区域、交通、周边设施等问题'
      }
    }
    if (lowerQuestion.includes('合同') || lowerQuestion.includes('租约') || lowerQuestion.includes('lease')) {
      return { 
        type: 'contract', 
        icon: '📋', 
        color: 'text-purple-600', 
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200',
        label: '合同咨询',
        description: '关于租约、条款、法律问题等'
      }
    }
    if (lowerQuestion.includes('宠物') || lowerQuestion.includes('pet')) {
      return { 
        type: 'pet', 
        icon: '🐾', 
        color: 'text-orange-600', 
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        label: '宠物政策',
        description: '关于宠物友好、宠物费用等问题'
      }
    }
    if (lowerQuestion.includes('设施') || lowerQuestion.includes('amenity')) {
      return { 
        type: 'amenity', 
        icon: '🏠', 
        color: 'text-indigo-600', 
        bgColor: 'bg-indigo-50',
        borderColor: 'border-indigo-200',
        label: '设施咨询',
        description: '关于公寓设施、服务等问题'
      }
    }
    return { 
      type: 'general', 
      icon: '❓', 
      color: 'text-gray-600', 
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      label: '一般咨询',
      description: '其他租房相关问题'
    }
  }

  const questionType = getQuestionType(data.question)

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* 页面标题 */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          租房问答助手
        </h1>
        <p className="text-lg text-gray-600">
          AI智能回答你的租房问题，提供专业建议
        </p>
        <div className="flex items-center justify-center mt-4 space-x-4">
          <div className="flex items-center px-3 py-1 bg-blue-100 rounded-full">
            <MessageCircle className="h-4 w-4 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-blue-800">智能问答</span>
          </div>
          <div className="flex items-center px-3 py-1 bg-green-100 rounded-full">
            <Lightbulb className="h-4 w-4 text-green-600 mr-2" />
            <span className="text-sm font-medium text-green-800">专业建议</span>
          </div>
        </div>
      </div>

      {/* 问答主区域 */}
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg mr-4">
              <MessageCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">智能问答</h2>
              <p className="text-gray-600">AI专业回答你的租房问题</p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-full text-sm font-medium ${questionType.bgColor} ${questionType.color} border ${questionType.borderColor}`}>
            {questionType.icon} {questionType.label}
          </div>
        </div>

        {/* 问题展示 */}
        <div className="mb-8">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <HelpCircle className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">你的问题</h3>
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                <p className="text-gray-800 leading-relaxed text-base">{data.question}</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI回答 */}
        <div className="mb-8">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Lightbulb className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">AI专业回答</h3>
              <div className="bg-green-50 rounded-lg p-6 border border-green-100">
                <div className="prose max-w-none">
                  <div className="text-gray-800 whitespace-pre-line leading-relaxed text-base">
                    {data.answer}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 相关提示 */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 border border-yellow-200">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-yellow-100 rounded-lg mr-3">
              <BookOpen className="h-5 w-5 text-yellow-600" />
            </div>
            <h3 className="text-lg font-semibold text-yellow-800">💡 相关提示</h3>
          </div>
          <div className="text-sm text-yellow-700 space-y-3">
            {questionType.type === 'price' && (
              <>
                <div className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-yellow-600" />
                  <span>租金通常包含基本设施，但水电费可能需要额外支付</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-yellow-600" />
                  <span>建议预留1-2个月租金作为押金</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-yellow-600" />
                  <span>可以尝试与房东协商租金，特别是在淡季</span>
                </div>
              </>
            )}
            {questionType.type === 'location' && (
              <>
                <div className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-yellow-600" />
                  <span>考虑通勤时间和交通便利性</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-yellow-600" />
                  <span>查看周边安全指数和生活便利设施</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-yellow-600" />
                  <span>了解社区环境和邻居情况</span>
                </div>
              </>
            )}
            {questionType.type === 'contract' && (
              <>
                <div className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-yellow-600" />
                  <span>仔细阅读租约条款，特别是违约条款</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-yellow-600" />
                  <span>确认租期、租金调整机制和续租条件</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-yellow-600" />
                  <span>保留所有书面沟通记录</span>
                </div>
              </>
            )}
            {questionType.type === 'pet' && (
              <>
                <div className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-yellow-600" />
                  <span>确认宠物政策，包括宠物押金</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-yellow-600" />
                  <span>了解宠物大小、品种限制</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-yellow-600" />
                  <span>考虑宠物对邻居的影响</span>
                </div>
              </>
            )}
            {questionType.type === 'amenity' && (
              <>
                <div className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-yellow-600" />
                  <span>确认设施的使用条件和时间</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-yellow-600" />
                  <span>了解设施维护责任</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-yellow-600" />
                  <span>检查设施的实际状况</span>
                </div>
              </>
            )}
            {questionType.type === 'general' && (
              <>
                <div className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-yellow-600" />
                  <span>实地看房很重要，不要只看照片</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-yellow-600" />
                  <span>了解房东或管理公司的信誉</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-yellow-600" />
                  <span>确认入住时间和交接流程</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 相关公寓推荐 */}
      {data.contextApartments && data.contextApartments.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-purple-100 rounded-lg mr-4">
              <MapPin className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">相关公寓推荐</h2>
              <p className="text-gray-600">与你的问题相关的精选房源</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.contextApartments.map((apartment, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors border border-gray-200">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-gray-900 text-sm leading-tight">{apartment.title}</h3>
                  <span className="text-lg font-bold text-blue-600">
                    {formatPrice(apartment.price)}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  {apartment.location}
                </div>
                <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                  <span className="flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    {apartment.bedrooms} 卧
                  </span>
                  <span className="flex items-center">
                    <Star className="h-3 w-3 mr-1" />
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

      {/* 常见问题 */}
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-orange-100 rounded-lg mr-4">
            <HelpCircle className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">常见问题</h2>
            <p className="text-gray-600">租房相关的热门问题解答</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[
            {
              question: "如何判断租金是否合理？",
              answer: "可以对比同区域类似房源的租金，查看历史价格趋势，考虑交通便利性和设施配套。",
              icon: "💰"
            },
            {
              question: "租房合同需要注意什么？",
              answer: "仔细阅读租期、租金、押金、违约条款、维修责任等关键条款，确保理解所有条款。",
              icon: "📋"
            },
            {
              question: "宠物友好公寓怎么找？",
              answer: "在搜索时明确标注宠物友好需求，了解宠物押金和限制条件。",
              icon: "🐾"
            },
            {
              question: "如何与房东协商租金？",
              answer: "了解市场行情，准备充分的理由，选择合适时机，保持礼貌和专业的沟通态度。",
              icon: "🤝"
            }
          ].map((faq, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:bg-gray-100 transition-colors">
              <div className="flex items-start mb-3">
                <span className="text-2xl mr-3">{faq.icon}</span>
                <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                  {faq.question}
                </h3>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 租房指南 */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-8 border border-blue-100">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-blue-100 rounded-lg mr-4">
            <BookOpen className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">租房指南</h2>
            <p className="text-gray-600">完整的租房流程和实用技巧</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-blue-600" />
              租房流程
            </h3>
            <ol className="space-y-4">
              {[
                "确定预算和需求",
                "搜索合适房源",
                "实地看房",
                "签订租约",
                "入住交接"
              ].map((step, index) => (
                <li key={index} className="flex items-start">
                  <span className="bg-blue-600 text-white text-sm rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 font-medium">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{step}</span>
                </li>
              ))}
            </ol>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Star className="h-5 w-5 mr-2 text-yellow-600" />
              租房技巧
            </h3>
            <ul className="space-y-3">
              {[
                "提前准备所需文件和押金",
                "拍照记录房屋现状",
                "了解周边环境和交通",
                "确认所有费用明细",
                "保持良好的租客记录"
              ].map((tip, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-yellow-600 mr-2 mt-0.5">•</span>
                  <span className="text-gray-700">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
