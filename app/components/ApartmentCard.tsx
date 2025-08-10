'use client'

import { useState } from 'react'
import { MapPin, Bed, Bath, Square, Car, Wifi, Star, Heart, Share2, Phone, Calendar, DollarSign } from 'lucide-react'
import { Apartment } from '../types'

interface ApartmentCardProps {
  apartment: Apartment
  onViewDetails: (apartment: Apartment) => void
}

export default function ApartmentCard({ apartment, onViewDetails }: ApartmentCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsFavorite(!isFavorite)
  }

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
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
    <div 
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 cursor-pointer group"
      onClick={() => onViewDetails(apartment)}
    >
      {/* 图片区域 */}
      <div className="relative h-48 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-t-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        <div className="absolute top-3 right-3 flex space-x-2">
          <button
            onClick={toggleFavorite}
            className={`p-2 rounded-full transition-colors ${
              isFavorite 
                ? 'bg-red-500 text-white' 
                : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
            }`}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleShare}
            className="p-2 rounded-full bg-white/80 text-gray-600 hover:bg-blue-500 hover:text-white transition-colors"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
        
        {/* 价格标签 */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 text-green-600 mr-1" />
            <span className="text-xl font-bold text-gray-900">{apartment.price}</span>
            <span className="text-sm text-gray-600 ml-1">/月</span>
          </div>
        </div>

        {/* 可用性标签 */}
        <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
          可立即入住
        </div>
      </div>

      {/* 内容区域 */}
      <div className="p-6">
        {/* 标题和位置 */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {apartment.title}
          </h3>
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-1" />
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(apartment.location || '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
              title="在Google地图中查看"
              onClick={(e) => e.stopPropagation()}
            >
              {apartment.location}
            </a>
          </div>
        </div>

        {/* 基本信息 */}
        <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1" />
            <span>{apartment.bedrooms}室</span>
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1" />
            <span>{apartment.bathrooms}卫</span>
          </div>
          <div className="flex items-center">
            <Square className="h-4 w-4 mr-1" />
            <span>{apartment.area} sqft</span>
          </div>
        </div>

        {/* 设施标签 */}
        {apartment.amenities && apartment.amenities.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {apartment.amenities.slice(0, 3).map((amenity, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {amenity}
                </span>
              ))}
              {apartment.amenities.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{apartment.amenities.length - 3} 更多
                </span>
              )}
            </div>
          </div>
        )}

        {/* 描述 */}
        {apartment.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {apartment.description}
          </p>
        )}

        {/* 底部操作 */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            {apartment.rating && (
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600 ml-1">{apartment.rating}</span>
              </div>
            )}
            <span className="text-sm text-gray-500">(用户评价)</span>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation()
              onViewDetails(apartment)
            }}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            查看详情
          </button>
        </div>
      </div>
    </div>
  )
}
