'use client';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav
      className="w-full flex justify-between items-center px-6 py-4"
      style={{ backgroundColor: 'var(--color-accent-dark)', color: 'white' }}
    >
      <Link href="/" className="text-xl font-bold">
        📚 Classic Bookstore
      </Link>

      <div className="flex gap-6 text-base">
        <Link href="/products">Books</Link>
        <Link href="/orders">Orders</Link>
        <Link href="/account">My Account</Link>
        <Link href="/cart">🛒 Cart</Link>
      </div>
    </nav>
  );
}
