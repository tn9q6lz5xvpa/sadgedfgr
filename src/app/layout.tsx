import './globals.css'
import { Merriweather } from 'next/font/google'   // ✅ dòng import quan trọng này
import Link from 'next/link'

const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-serif',
})

export const metadata = {
  title: 'The Book Haven',
  description: 'A classic online bookstore',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={merriweather.className}>
      <body>
        <header className="bg-[var(--beige-cream)] border-b border-[rgba(78,59,49,0.06)] sticky top-0 z-40 header-shadow">
          <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--wood-brown)]"
              >
                The Book Haven
              </Link>
              <nav className="hidden md:flex items-center gap-4 text-sm text-[var(--dark-coffee)]">
                <Link href="/" className="px-3 py-2 rounded-md hover:bg-[var(--warm-white)]">
                  Home
                </Link>
                <Link href="/catalog" className="px-3 py-2 rounded-md hover:bg-[var(--warm-white)]">
                  Catalog
                </Link>
                <Link href="/about" className="px-3 py-2 rounded-md hover:bg-[var(--warm-white)]">
                  About
                </Link>
                <Link href="/policy" className="px-3 py-2 rounded-md hover:bg-[var(--warm-white)]">
                  Policies
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/search" className="px-3 py-2 rounded-md text-sm">
                Search
              </Link>
              <Link href="/account" className="px-3 py-2 rounded-md text-sm">
                Account
              </Link>
              <Link
                href="/checkout"
                className="px-3 py-2 rounded-md text-sm border border-[rgba(78,59,49,0.06)]"
              >
                Cart
              </Link>
            </div>
          </div>
        </header>

        <main className="min-h-[80vh]">{children}</main>

        <footer className="bg-[var(--wood-brown)] text-[var(--warm-white)] mt-12">
          <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-xl font-semibold">The Book Haven</h4>
              <p className="mt-2 text-sm text-[rgba(255,248,243,0.9)]">
                A curated collection of timeless books. Craftsmanship in reading.
              </p>
            </div>
            <div>
              <h5 className="font-semibold">Customer</h5>
              <ul className="mt-3 text-sm space-y-2 text-[rgba(255,248,243,0.9)]">
                <li>Shipping & Returns</li>
                <li>Payment Methods</li>
                <li>Help Center</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold">Contact</h5>
              <p className="mt-3 text-sm text-[rgba(255,248,243,0.9)]">hello@bookhaven.example</p>
            </div>
          </div>
          <div className="text-center text-[rgba(255,248,243,0.7)] py-4 border-t border-[rgba(255,248,243,0.06)]">
            © {new Date().getFullYear()} The Book Haven
          </div>
        </footer>
      </body>
    </html>
  )
}
