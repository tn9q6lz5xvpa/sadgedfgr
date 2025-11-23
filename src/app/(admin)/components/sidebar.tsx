"use client";

import { cn } from "@/lib/utils";
import {
  HomeIcon,
  ShoppingCartIcon,
  BookOpenIcon,
  TagIcon,
  UsersIcon,
  StarIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: HomeIcon },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCartIcon },
  { href: "/admin/books", label: "Books", icon: BookOpenIcon },
  { href: "/admin/categories", label: "Categories", icon: TagIcon },
  { href: "/admin/users", label: "Users", icon: UsersIcon },
  { href: "/admin/reviews", label: "Reviews", icon: StarIcon },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[var(--wood-brown)] text-white p-6">
      <div className="mb-8">
        <Link href="/admin" className="text-2xl font-bold">
          Admin Panel
        </Link>
        <p className="text-sm text-white/70 mt-1">The Book Haven</p>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                isActive
                  ? "bg-white/20 text-white"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-6 left-6 right-6">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors"
        >
          <ArrowLeftOnRectangleIcon className="w-5 h-5" />
          Back to Store
        </Link>
      </div>
    </aside>
  );
}