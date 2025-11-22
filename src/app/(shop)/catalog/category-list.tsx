"use client";

import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Category } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function CategoryList({
  categoryId,
  categories,
  searchQuery,
}: {
  categoryId?: string;
  categories: Category[];
  searchQuery?: string;
}) {
  const options = [
    { label: "All Books", value: "all", href: "/catalog" },
    ...categories.map((category) => ({
      label: category.name,
      value: category.id,
      href:
        `/catalog?category=${category.id}` +
        (searchQuery ? `&q=${searchQuery}` : ""),
    })),
  ];

  const router = useRouter();

  const onOptionSelect = (value: string) => {
    const option = options.find((option) => option.value === value);
    if (!option) return;
    router.push(option.href);
  };

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-neutral-500">Categories</h3>
      <div className="md:hidden">
        <Select
          options={options}
          value={categoryId ?? "all"}
          className="w-full"
          onChange={(ev) => onOptionSelect(ev.currentTarget.value)}
          aria-label="Select a category"
        />
      </div>
      <ul className="hidden md:flex md:flex-col gap-2">
        {options.map((option) => {
          const isSelected = option.value === (categoryId ?? "all");
          return (
            <li key={option.value} className="text-black">
              <Link
                href={option.href}
                className={cn(
                  "w-full text-sm hover:underline underline-offset-4",
                  isSelected && "font-bold",
                )}
              >
                {option.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}