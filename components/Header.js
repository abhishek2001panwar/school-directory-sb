'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from './AuthContext'
import clsx from 'clsx'

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout, isAuthenticated, loading } = useAuth()

  const link = (href, label) => (
    <Link 
      href={href} 
      onClick={() => {
        // Small delay to allow navigation, then refresh
        setTimeout(() => router.refresh(), 100);
      }}
      className={clsx(
        'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
        pathname === href 
          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25' 
          : 'bg-white/70 text-gray-700 hover:bg-white/90 hover:shadow-md backdrop-blur-sm'
      )}
    >
      {label}
    </Link>
  )

  const handleLogout = async () => {
    try {
      // Call the logout API endpoint
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Always logout on client side regardless of API response
      logout();
      router.push('/auth/login');
    }
  }

  if (loading) {
    return (
      <header className="w-full backdrop-blur-lg bg-white/80 border-b border-white/20 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            🏫 School Directory
          </Link>
          <div className="flex items-center gap-2">
            <div className="px-4 py-2 text-sm text-gray-500 animate-pulse">Loading...</div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="w-full backdrop-blur-lg bg-white/80 border-b border-white/20 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:scale-105 transition-transform">
          🏫 School Directory
        </Link>
        <nav className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {link('/schools', '📚 Show Schools')}
              {link('/add-school', '➕ Add School')}
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user?.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm text-gray-600 hidden sm:block">
                    {user?.email}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:-translate-y-0.5"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <Link 
              href="/auth/login"
              className="px-6 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
            >
              🔐 Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
