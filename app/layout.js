import './globals.css'
import Header from '../components/Header'
import { AuthProvider } from '../components/AuthContext'

export const metadata = {
  title: 'School Directory',
  description: 'Add and list schools using Supabase'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 text-gray-900">
        <AuthProvider>
          <div className="relative min-h-screen">
            {/* Background decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-40 -right-32 w-96 h-96 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-3xl"></div>
              <div className="absolute -bottom-40 -left-32 w-96 h-96 rounded-full bg-gradient-to-br from-blue-400/20 to-cyan-400/20 blur-3xl"></div>
            </div>
            
            <Header />
            <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
