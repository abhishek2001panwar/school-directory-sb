'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link.js'
import SchoolCard from '../../components/SchoolCard'
import { supabase } from '../../lib/supabaseClient.js'

export default function SchoolsPage() {
  const [schools, setSchools] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()

  const fetchSchools = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error: fetchError } = await supabase
        .from('schools')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) {
        throw fetchError
      }

      setSchools(data || [])
    } catch (err) {
      console.error('Error fetching schools:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSchools()
  }, [])

  // Refresh schools when navigating back to this page
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchSchools()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Hero Section Skeleton */}
        <div className="text-center py-16">
          <div className="h-12 bg-gray-200 rounded-xl shimmer mx-auto max-w-md mb-4"></div>
          <div className="h-6 bg-gray-200 rounded-lg shimmer mx-auto max-w-lg mb-8"></div>
        </div>
        
        {/* Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg overflow-hidden">
              <div className="h-48 bg-gray-200 shimmer"></div>
              <div className="p-6 space-y-3">
                <div className="h-6 bg-gray-200 rounded shimmer"></div>
                <div className="h-4 bg-gray-200 rounded shimmer w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded shimmer w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">😔</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">We couldn't load the schools. Please try again.</p>
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
          <button 
            onClick={fetchSchools}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:-translate-y-0.5"
          >
            🔄 Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center py-16 relative">
        <div className="relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            🏫 School Directory
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover amazing educational institutions in your area. Find the perfect school for your journey.
          </p>
          
          {/* Stats */}
          <div className="flex justify-center items-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                {schools.length}
              </div>
              <div className="text-sm text-gray-500">Schools Listed</div>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
                ∞
              </div>
              <div className="text-sm text-gray-500">Opportunities</div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            
            <Link 
              href="/add-school" 
              className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
            >
              ➕ Add New School
            </Link>
          </div>
        </div>
      </div>
      
      {/* Schools Grid */}
      {schools.length === 0 ? (
        <div className="text-center py-20">
          <div className="max-w-md mx-auto">
            <div className="w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <span className="text-6xl">🏫</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">No schools yet</h2>
            <p className="text-gray-600 mb-8 text-lg">
              Be the first to add a school to our directory and help others discover great educational institutions!
            </p>
            <Link 
              href="/add-school" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-1 text-lg"
            >
              <span>🚀</span>
              Add First School
            </Link>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-8">
            
            <div className="text-sm text-gray-500">
              Showing all schools • Updated recently
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {schools.map(s => <SchoolCard key={s.id} school={s} />)}
          </div>
        </div>
      )}
    </div>
  )
}
