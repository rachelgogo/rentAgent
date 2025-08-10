'use client'

import { useState } from 'react'
import { MapPin, DollarSign, Bed, Bath, Square, Clock, Heart, Car, Wifi, Star } from 'lucide-react'
import { UserRequirements } from '../types'

interface RentalFormProps {
  onSubmit: (requirements: UserRequirements) => void
  loading: boolean
}

const amenitiesOptions = [
  { id: 'wifi', label: 'WiFi', icon: Wifi },
  { id: 'parking', label: '停车位', icon: Car },
  { id: 'gym', label: '健身房', icon: Star },
  { id: 'pool', label: '游泳池', icon: Star },
  { id: 'security', label: '安保', icon: Star },
  { id: 'elevator', label: '电梯', icon: Star },
]

export default function RentalForm({ onSubmit, loading }: RentalFormProps) {
  const [formData, setFormData] = useState<UserRequirements>({
    location: '',
    budget: { min: 2000, max: 5000 },
    bedrooms: 1,
    bathrooms: 1,
    area: { min: 500, max: 1500 },
    amenities: [],
    commuteTime: 30,
    petFriendly: false,
    furnished: false,
    parking: false,
    description: '',
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNestedChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof UserRequirements] as any),
        [field]: value
      }
    }))
  }

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 位置 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
          <MapPin className="h-4 w-4 mr-2 text-blue-600" />
          期望位置
        </label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => handleInputChange('location', e.target.value)}
          placeholder="例如：San Francisco、Palo Alto、Mountain View、San Jose等"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          required
        />
      </div>

      {/* 预算范围 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
          <DollarSign className="h-4 w-4 mr-2 text-green-600" />
          月租金预算 (美元)
        </label>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            value={formData.budget.min || ''}
            onChange={(e) => handleNestedChange('budget', 'min', parseInt(e.target.value) || 0)}
            placeholder="最低"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            required
          />
          <input
            type="number"
            value={formData.budget.max || ''}
            onChange={(e) => handleNestedChange('budget', 'max', parseInt(e.target.value) || 0)}
            placeholder="最高"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            required
          />
        </div>
      </div>

      {/* 房间数量 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Bed className="h-4 w-4 mr-2 text-purple-600" />
            卧室数量
          </label>
          <select
            value={formData.bedrooms}
            onChange={(e) => handleInputChange('bedrooms', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          >
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>{num}间</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Bath className="h-4 w-4 mr-2 text-blue-600" />
            卫生间数量
          </label>
          <select
            value={formData.bathrooms}
            onChange={(e) => handleInputChange('bathrooms', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          >
            {[1, 2, 3, 4].map(num => (
              <option key={num} value={num}>{num}间</option>
            ))}
          </select>
        </div>
      </div>

      {/* 面积范围 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
          <Square className="h-4 w-4 mr-2 text-orange-600" />
          面积范围 (平方英尺)
        </label>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            value={formData.area.min || ''}
            onChange={(e) => handleNestedChange('area', 'min', parseInt(e.target.value) || 0)}
            placeholder="最小"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
          <input
            type="number"
            value={formData.area.max || ''}
            onChange={(e) => handleNestedChange('area', 'max', parseInt(e.target.value) || 0)}
            placeholder="最大"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
        </div>
      </div>

      {/* 通勤时间 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
          <Clock className="h-4 w-4 mr-2 text-red-600" />
          可接受通勤时间 (分钟)
        </label>
        <input
          type="range"
          min="10"
          max="120"
          step="10"
          value={formData.commuteTime}
          onChange={(e) => handleInputChange('commuteTime', parseInt(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>10分钟</span>
          <span>{formData.commuteTime}分钟</span>
          <span>120分钟</span>
        </div>
      </div>

      {/* 设施偏好 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">设施偏好</label>
        <div className="grid grid-cols-2 gap-2">
          {amenitiesOptions.map(amenity => {
            const Icon = amenity.icon
            return (
              <label key={amenity.id} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.amenities.includes(amenity.id)}
                  onChange={() => handleAmenityToggle(amenity.id)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <Icon className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-700">{amenity.label}</span>
              </label>
            )
          })}
        </div>
      </div>

      {/* 特殊需求 */}
      <div className="space-y-3">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.petFriendly}
            onChange={(e) => handleInputChange('petFriendly', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <Heart className="h-4 w-4 text-pink-600" />
          <span className="text-sm text-gray-700">允许养宠物</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.furnished}
            onChange={(e) => handleInputChange('furnished', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <Star className="h-4 w-4 text-yellow-600" />
          <span className="text-sm text-gray-700">需要家具</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.parking}
            onChange={(e) => handleInputChange('parking', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <Car className="h-4 w-4 text-gray-600" />
          <span className="text-sm text-gray-700">需要停车位</span>
        </label>
      </div>

      {/* 详细描述 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          其他需求描述
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="请描述你的其他特殊需求，比如朝向、楼层、装修风格等..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
        />
      </div>

      {/* 提交按钮 */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'AI正在分析...' : '开始寻找公寓'}
      </button>
    </form>
  )
}
