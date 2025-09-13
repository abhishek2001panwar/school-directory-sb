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
    <Link href={href} className={clsx('px-3 py-2 rounded-xl text-sm font-medium transition', pathname === href ? 'bg-black text-white' : 'bg-white text-black border')}>
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
      <header className="w-full border-b bg-white/60 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold">School Directory</Link>
          <div className="flex items-center gap-2">
            <div className="px-3 py-2 text-sm">Loading...</div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="w-full border-b bg-white/60 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold">School Directory</Link>
        <nav className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              {link('/schools', 'Show Schools')}
              {link('/add-school', 'Add School')}
              <div className="flex items-center gap-2 ml-2">
                <span className="text-sm text-gray-600">
                  {user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-xl text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <Link 
              href="/auth/login"
              className="px-3 py-2 rounded-xl text-sm font-medium bg-black text-white hover:bg-gray-800 transition"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
