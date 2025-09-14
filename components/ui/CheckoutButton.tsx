"use client";

import React, { useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CheckoutButton({ productIds }: { productIds: string[] }) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productIds }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url; // ✅ redirect to Stripe
      } else {
        alert("Something went wrong");
      }
    } catch (err) {
      console.error("Checkout error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      className={cn("w-full", buttonVariants())}
      disabled={loading}
    >
      {loading ? "Processing..." : "Continue to checkout"}
    </button>
  );
}
