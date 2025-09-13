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
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <AuthProvider>
          <Header />
          <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
        </AuthProvider>
      </body>
    </html>
  )
}
