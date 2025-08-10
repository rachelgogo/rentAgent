'use client'

import { useState } from 'react'
import { 
  X, MapPin, Bed, Bath, Square, Car, Wifi, Star, Heart, Share2, 
  Phone, Mail, Calendar, DollarSign, Clock, Users
} from 'lucide-react'
import { Apartment } from '../types'

interface ApartmentDetailModalProps {
  apartment: Apartment | null
  isOpen: boolean
  onClose: () => void
}

export default function ApartmentDetailModal({ apartment, isOpen, onClose }: ApartmentDetailModalProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  if (!isOpen || !apartment) return null

  try {

  // 智能通勤时间计算函数
  const calculateCommuteTime = (apt: Apartment) => {
    const location = apt.location || '';
    const price = apt.price || 2500;
    const area = apt.area || 800;
    
    // 基于位置的基础通勤时间
    let baseTime = 25; // 默认25分钟
    
    if (location.includes('Downtown') || location.includes('Center')) {
      baseTime = 15; // 市中心位置，通勤时间短
    } else if (location.includes('Square') || location.includes('Plaza')) {
      baseTime = 20; // 商业区，通勤时间中等
    } else if (location.includes('Park') || location.includes('Garden')) {
      baseTime = 30; // 公园/花园区域，通勤时间较长
    } else if (location.includes('Hill') || location.includes('Mountain')) {
      baseTime = 35; // 山区，通勤时间更长
    }
    
    // 基于价格的调整（高价公寓通常在更好的位置）
    if (price > 3500) {
      baseTime -= 5; // 高价公寓位置更好
    } else if (price < 2000) {
      baseTime += 5; // 低价公寓位置可能较远
    }
    
    // 基于面积的调整（大户型通常在郊区）
    if (area > 1200) {
      baseTime += 3; // 大户型通常在郊区
    } else if (area < 600) {
      baseTime -= 2; // 小户型通常在市中心
    }
    
    // 确保通勤时间在合理范围内
    return Math.max(10, Math.min(45, baseTime));
  };

  // 简化的周边信息生成函数
  const generateConvenienceScore = (apt: Apartment) => {
    const location = apt.location || '';
    const price = apt.price || 2500;
    
    if (location.includes('Downtown') || price > 3000) return '优秀';
    if (location.includes('Center') || price > 2500) return '良好';
    return '一般';
  };

  const generateTargetAudience = (apt: Apartment) => {
    const bedrooms = apt.bedrooms || 1;
    const price = apt.price || 2500;
    
    if (bedrooms >= 2) return '家庭';
    if (price > 3000) return '高收入人群';
    return '年轻专业人士';
  };

  // 租金分析相关函数
  const generateMarketPrice = (apt: Apartment) => {
    const basePrice = apt.price || 2500;
    const location = apt.location || '';
    const locationFactor = location.includes('Downtown') ? 1.05 : 
                          location.includes('Center') ? 1.02 : 
                          location.includes('Square') ? 1.0 : 0.95;
    const area = apt.area || 800;
    const sizeFactor = area > 1000 ? 1.03 : area > 800 ? 1.0 : 0.97;
    return Math.round(basePrice * locationFactor * sizeFactor);
  };

  const generatePricePerSqft = (apt: Apartment) => {
    const price = apt.price || 2500;
    const area = apt.area || 800;
    const pricePerSqft = price / area;
    return (pricePerSqft * 100 / 100).toFixed(2);
  };

  const generateRentAdvice = (apt: Apartment) => {
    const marketPrice = generateMarketPrice(apt);
    const priceDiff = apt.price - marketPrice;
    const priceDiffPercent = priceDiff / marketPrice * 100;
    
    if (priceDiff > 200) {
      return `租金建议：此公寓价格比市场均价高${priceDiffPercent.toFixed(1)}%，建议考虑其他选择或与房东协商。`;
    } else if (priceDiff > 50) {
      return `租金建议：此公寓价格略高于市场均价${priceDiffPercent.toFixed(1)}%，但考虑到位置和设施，性价比尚可。`;
    } else if (priceDiff > -50) {
      return `租金建议：此公寓价格与市场均价相当，性价比不错，值得考虑。`;
    } else {
      return `租金建议：此公寓价格低于市场均价${Math.abs(priceDiffPercent).toFixed(1)}%，性价比很高，建议尽快联系。`;
    }
  };



  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: apartment.title,
        text: `${apartment.title} - ${apartment.location}`,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(`${apartment.title} - ${apartment.location}`)
      alert('链接已复制到剪贴板')
    }
  }



  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* 头部 */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{apartment.title || '公寓详情'}</h2>
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(apartment.location || '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                  title="在Google地图中查看"
                >
                  {apartment.location || '未知位置'}
                </a>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleFavorite}
                className={`p-2 rounded-full transition-colors ${
                  isFavorite 
                    ? 'bg-red-500 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-red-500 hover:text-white'
                }`}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleShare}
                className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-blue-500 hover:text-white transition-colors"
              >
                <Share2 className="h-5 w-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* 价格和基本信息 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
              <div className="flex items-center mb-2">
                <DollarSign className="h-6 w-6 text-green-600 mr-2" />
                <span className="text-3xl font-bold text-gray-900">{apartment.price}</span>
                <span className="text-lg text-gray-600 ml-1">/月</span>
              </div>
              <p className="text-sm text-gray-600">月租金</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <Bed className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                  <div className="text-sm text-gray-600">卧室</div>
                  <div className="font-semibold text-gray-900">{apartment.bedrooms}间</div>
                </div>
                <div>
                  <Bath className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                  <div className="text-sm text-gray-600">卫生间</div>
                  <div className="font-semibold text-gray-900">{apartment.bathrooms}间</div>
                </div>
                <div>
                  <Square className="h-6 w-6 text-orange-600 mx-auto mb-1" />
                  <div className="text-sm text-gray-600">面积</div>
                  <div className="font-semibold text-gray-900">{apartment.area} sqft</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="space-y-3">
                {apartment.rating && (
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 fill-current mr-2" />
                    <span className="font-semibold text-gray-900">{apartment.rating}</span>
                    <span className="text-sm text-gray-600 ml-1">评分</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-sm text-gray-600">可立即入住</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm text-gray-600">适合1-2人</span>
                </div>
              </div>
            </div>
          </div>

          {/* 设施 */}
          {apartment.amenities && apartment.amenities.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">设施</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {apartment.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center bg-gray-50 px-4 py-3 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 描述 */}
          {apartment.description && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">详细描述</h3>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 leading-relaxed">{apartment.description}</p>
              </div>
            </div>
          )}

          {/* 亮点 */}
          {apartment.highlights && apartment.highlights.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">亮点</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {apartment.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-green-800 font-medium">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 租房优惠 */}
          {apartment.promotions && apartment.promotions !== '暂无优惠' && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">租房优惠</h3>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-green-800 font-medium text-lg">{apartment.promotions}</span>
                </div>
              </div>
            </div>
          )}

          {/* 用户评价 */}
          {apartment.userReviews && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">用户评价</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h4 className="font-semibold text-green-800 mb-4 flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    优点
                  </h4>
                  <ul className="space-y-2">
                    {apartment.userReviews.pros && apartment.userReviews.pros.map((pro, index) => (
                      <li key={index} className="text-sm text-green-700 flex items-start">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h4 className="font-semibold text-red-800 mb-4 flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                    缺点
                  </h4>
                  <ul className="space-y-2">
                    {apartment.userReviews.cons && apartment.userReviews.cons.map((con, index) => (
                      <li key={index} className="text-sm text-red-700 flex items-start">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* 周边信息 */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">周边信息</h3>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <MapPin className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">通勤时间</div>
                  <div className="font-semibold text-gray-900">{calculateCommuteTime(apartment)}分钟</div>
                </div>
                <div className="text-center">
                  <Star className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">生活便利度</div>
                  <div className="font-semibold text-gray-900">{generateConvenienceScore(apartment)}</div>
                </div>
                <div className="text-center">
                  <Users className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">适合人群</div>
                  <div className="font-semibold text-gray-900">{generateTargetAudience(apartment)}</div>
                </div>
              </div>
            </div>
          </div>



          {/* 租金分析 */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">租金分析</h3>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">${apartment.price}</div>
                  <div className="text-sm text-gray-600">当前租金</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">${generateMarketPrice(apartment)}</div>
                  <div className="text-sm text-gray-600">市场均价</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">${generatePricePerSqft(apartment)}</div>
                  <div className="text-sm text-gray-600">每平方英尺</div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                <p className="text-sm text-blue-800">
                  💡 {generateRentAdvice(apartment)}
                </p>
              </div>
            </div>
          </div>

          {/* 联系信息 */}
          {apartment.contact && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">联系信息</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center bg-gray-50 p-4 rounded-lg">
                  <Phone className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <div className="text-sm text-gray-600">电话</div>
                    <div className="font-medium text-gray-900">{apartment.contact?.phone || '暂无'}</div>
                  </div>
                </div>
                <div className="flex items-center bg-gray-50 p-4 rounded-lg">
                  <Mail className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <div className="text-sm text-gray-600">邮箱</div>
                    <div className="font-medium text-gray-900">{apartment.contact?.email || '暂无'}</div>
                  </div>
                </div>
                <div className="flex items-center bg-gray-50 p-4 rounded-lg">
                  <Calendar className="h-5 w-5 text-purple-600 mr-3" />
                  <div>
                    <div className="text-sm text-gray-600">可入住</div>
                    <div className="font-medium text-gray-900">{apartment.availableDate || '立即入住'}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex justify-center space-x-4 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              关闭
            </button>
            {apartment.contact?.phone && (
              <a
                href={`tel:${apartment.contact.phone}`}
                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors inline-flex items-center"
              >
                <Phone className="h-4 w-4 mr-2" />
                立即联系
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
  } catch (error) {
    console.error('ApartmentDetailModal error:', error)
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <h2 className="text-xl font-bold text-gray-900 mb-4">出错了</h2>
          <p className="text-gray-600 mb-4">加载公寓详情时出现错误，请重试。</p>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            关闭
          </button>
        </div>
      </div>
    )
  }
}
