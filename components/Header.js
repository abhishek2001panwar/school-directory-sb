'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

export default function Header() {
  const pathname = usePathname()
  const link = (href, label) => (
    <Link href={href} className={clsx('px-3 py-2 rounded-xl text-sm font-medium transition', pathname === href ? 'bg-black text-white' : 'bg-white text-black border')}>
      {label}
    </Link>
  )

  return (
    <header className="w-full border-b bg-white/60 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold">School Directory</Link>
        <nav className="flex items-center gap-2">
          {link('/schools', 'Show Schools')}
          {link('/add-school', 'Add School')}
        </nav>
      </div>
    </header>
  )
}
