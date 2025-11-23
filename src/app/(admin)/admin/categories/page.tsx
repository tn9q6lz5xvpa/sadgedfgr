import { db } from "@/db";
import { categoriesTable, bookCategoriesTable } from "@/db/schema";
import { count, eq } from "drizzle-orm";
import { Metadata } from "next";
import { CategoryForm } from "./category-form";
import { DeleteCategoryButton } from "./delete-button";
import { EditCategoryButton } from "./edit-button";

async function getCategories() {
  const categories = await db.query.categoriesTable.findMany();
  
  // Get book count for each category
  const categoriesWithCount = await Promise.all(
    categories.map(async (category) => {
      const bookCount = await db
        .select({ count: count() })
        .from(bookCategoriesTable)
        .where(eq(bookCategoriesTable.category_id, category.id));
      return {
        ...category,
        bookCount: bookCount[0]?.count ?? 0,
      };
    })
  );

  return categoriesWithCount;
}

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Categories</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Category Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Add Category</h2>
            <CategoryForm />
          </div>
        </div>

        {/* Categories List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {categories.length === 0 ? (
              <p className="p-6 text-gray-500">No categories yet.</p>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Name</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">ID</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Books</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id} className="border-t hover:bg-gray-50">
                      <td className="py-4 px-6 font-medium">{category.name}</td>
                      <td className="py-4 px-6 text-sm text-gray-500">{category.id}</td>
                      <td className="py-4 px-6 text-sm text-gray-600">{category.bookCount}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <EditCategoryButton category={category} />
                          <DeleteCategoryButton
                            categoryId={category.id}
                            categoryName={category.name}
                            bookCount={category.bookCount}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Categories - Admin - The Book Haven",
  robots: "noindex",
};