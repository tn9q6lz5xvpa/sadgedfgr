"use client";

import { CountrySelect } from "@/components/country-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "@/types";
import { useState } from "react";
import { toast } from "sonner";
import { updateAccountAction } from "./action";

export function UpdateAccountForm({ user }: { user: User }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const result = await updateAccountAction(formData);

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Account information updated successfully!");
      }
    } catch (error) {
      toast.error("Failed to update account information");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Name</label>
        <div className="flex gap-2">
          <Input
            type="text"
            name="first_name"
            placeholder="First Name"
            defaultValue={user.first_name}
            required
            className="flex-1"
          />
          <Input
            type="text"
            name="last_name"
            placeholder="Last Name"
            defaultValue={user.last_name}
            required
            className="flex-1"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Email</label>
        <Input
          type="email"
          name="email"
          placeholder="Email"
          defaultValue={user.email}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Phone Number</label>
        <Input
          type="tel"
          name="phone_number"
          placeholder="Phone Number"
          defaultValue={user.phone_number ?? ""}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Address</label>
        <Input
          type="text"
          name="address"
          placeholder="Street Address"
          defaultValue={user.address ?? ""}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">City</label>
        <Input
          type="text"
          name="city"
          placeholder="City"
          defaultValue={user.city ?? ""}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Country</label>
        <CountrySelect
          name="country_code"
          defaultValue={user.country_code ?? "VN"}
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="mt-4">
        {isSubmitting ? "Updating..." : "Update Information"}
      </Button>
    </form>
  );
}