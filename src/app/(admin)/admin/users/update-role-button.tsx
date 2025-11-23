"use client";

import { useState } from "react";
import { toast } from "sonner";
import { updateUserRoleAction } from "./action";

export function UpdateRoleButton({
  userId,
  currentRole,
  userName,
}: {
  userId: number;
  currentRole: string;
  userName: string;
}) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = async () => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    const message =
      newRole === "admin"
        ? `Make "${userName}" an admin?`
        : `Remove admin privileges from "${userName}"?`;

    if (!confirm(message)) return;

    setIsUpdating(true);
    try {
      const result = await updateUserRoleAction(userId, newRole);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(`User role updated to ${newRole}`);
      }
    } catch (error) {
      toast.error("Failed to update user role");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isUpdating}
      className="text-[var(--wood-brown)] hover:underline text-sm disabled:opacity-50"
    >
      {isUpdating
        ? "..."
        : currentRole === "admin"
        ? "Remove Admin"
        : "Make Admin"}
    </button>
  );
}