"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "@/types";
import { useState } from "react";
import { toast } from "sonner";
import { submitContactForm } from "./action";

export function ContactForm({ user }: { user: User | null }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const result = await submitContactForm(formData);

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Message sent successfully! We'll get back to you soon.");
        setSubmitted(true);
      }
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <h3 className="text-lg font-semibold text-green-800 mb-2">Thank you!</h3>
        <p className="text-green-700">
          Your message has been sent. We'll respond within 24-48 hours.
        </p>
        <Button
          variant="secondary"
          className="mt-4"
          onClick={() => setSubmitted(false)}
        >
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">First Name</label>
          <Input
            type="text"
            name="first_name"
            placeholder="First Name"
            defaultValue={user?.first_name ?? ""}
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Last Name</label>
          <Input
            type="text"
            name="last_name"
            placeholder="Last Name"
            defaultValue={user?.last_name ?? ""}
            required
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Email</label>
        <Input
          type="email"
          name="email"
          placeholder="Email"
          defaultValue={user?.email ?? ""}
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Subject</label>
        <select
          name="subject"
          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--wood-brown)]"
          required
        >
          <option value="">Select a topic</option>
          <option value="order">Order Issue</option>
          <option value="shipping">Shipping Question</option>
          <option value="returns">Returns & Refunds</option>
          <option value="account">Account Help</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Message</label>
        <textarea
          name="message"
          placeholder="How can we help you?"
          rows={5}
          required
          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--wood-brown)] resize-none"
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}