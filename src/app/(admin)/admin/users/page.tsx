import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { desc } from "drizzle-orm";
import { Metadata } from "next";
import { format } from "date-fns";
import { UpdateRoleButton } from "./update-role-button";

async function getUsers() {
  return db.query.usersTable.findMany({
    orderBy: desc(usersTable.created_at),
    columns: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      role: true,
      city: true,
      country_code: true,
      created_at: true,
    },
  });
}

export default async function AdminUsersPage() {
  const users = await getUsers();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="text-gray-600">{users.length} total users</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {users.length === 0 ? (
          <p className="p-6 text-gray-500">No users yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">ID</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Name</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Email</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Location</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Role</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Joined</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t hover:bg-gray-50">
                    <td className="py-4 px-6 text-sm text-gray-500">#{user.id}</td>
                    <td className="py-4 px-6 font-medium">
                      {user.first_name} {user.last_name}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">{user.email}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {user.city && user.country_code
                        ? `${user.city}, ${user.country_code}`
                        : user.country_code || "—"}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.role || "user"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {format(new Date(user.created_at), "MMM d, yyyy")}
                    </td>
                    <td className="py-4 px-6">
                      <UpdateRoleButton
                        userId={user.id}
                        currentRole={user.role || "user"}
                        userName={`${user.first_name} ${user.last_name}`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Users - Admin - The Book Haven",
  robots: "noindex",
};