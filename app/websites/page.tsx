import ApartmentWebsites from '../components/ApartmentWebsites'
import { Home, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function WebsitesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link 
                href="/"
                className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                <span className="font-medium">返回主页</span>
              </Link>
            </div>
            <div className="flex items-center">
              <Home className="h-6 w-6 text-blue-600" />
              <span className="ml-2 text-lg font-semibold text-gray-900">租房AI助手</span>
            </div>
          </div>
        </div>
      </nav>
      
      <div className="py-8">
        <ApartmentWebsites />
      </div>
    </div>
  )
}
