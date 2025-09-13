'use client'
import Link from 'next/link'
import { useAuth } from '../components/AuthContext'

export default function Home() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="text-center py-20 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full blur-xl"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-gradient-to-br from-pink-400 to-red-500 rounded-full blur-xl"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4">
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 leading-tight">
            School Directory
          </h1>
          <p className="text-2xl md:text-3xl text-gray-600 mb-4 font-light">
            Discover Amazing Educational Institutions
          </p>
          <p className="text-xl text-gray-500 mb-12 max-w-3xl mx-auto leading-relaxed">
            Connect with schools in your area, explore their offerings, and find the perfect educational environment for your journey. Join our community of learners and educators.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-2xl mx-auto">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
              <div className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent mb-2">
                1000+
              </div>
              <div className="text-gray-600 font-medium">Schools Listed</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent mb-2">
                50+
              </div>
              <div className="text-gray-600 font-medium">Cities Covered</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
              <div className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-red-600 bg-clip-text text-transparent mb-2">
                24/7
              </div>
              <div className="text-gray-600 font-medium">Support Available</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link
              href="/schools"
              className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-lg rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-1 flex items-center gap-2"
            >
              <span>📚</span>
              Explore Schools
            </Link>
            
            {isAuthenticated ? (
              <Link
                href="/add-school"
                className="px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-700 font-semibold text-lg rounded-xl hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl border border-white/50 flex items-center gap-2"
              >
                <span>➕</span>
                Add School
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className="px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-700 font-semibold text-lg rounded-xl hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl border border-white/50 flex items-center gap-2"
              >
                <span>🔐</span>
                Join Community
              </Link>
            )}
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Easy Search</h3>
              <p className="text-gray-600 text-sm">Find schools by location, type, or specialty programs</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Detailed Info</h3>
              <p className="text-gray-600 text-sm">Comprehensive details about facilities and programs</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Community</h3>
              <p className="text-gray-600 text-sm">Connect with other students and educators</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Mobile Ready</h3>
              <p className="text-gray-600 text-sm">Access from anywhere on any device</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Schools Preview */}
      <div className="py-20 bg-white/30 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Recently Added Schools
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Check out some of the latest educational institutions that joined our community
            </p>
          </div>
          
          <div className="text-center">
            <Link
              href="/schools"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
            >
              <span>👀</span>
              View All Schools
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
