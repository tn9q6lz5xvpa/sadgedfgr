"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { updateOrderStatusAction } from "./action";

const statuses = ["processing", "completed", "cancelled"] as const;

export function UpdateOrderStatus({
  orderId,
  currentStatus,
}: {
  orderId: number;
  currentStatus: string;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (status === currentStatus) {
      toast.info("Status is unchanged");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const result = await updateOrderStatusAction(orderId, status);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Order status updated successfully!");
      }
    } catch (error) {
      toast.error("Failed to update order status");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--wood-brown)]"
      >
        {statuses.map((s) => (
          <option key={s} value={s}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </option>
        ))}
      </select>
      <Button
        onClick={handleSubmit}
        disabled={isSubmitting || status === currentStatus}
        className="w-full"
      >
        {isSubmitting ? "Updating..." : "Update Status"}
      </Button>
    </div>
  );
}