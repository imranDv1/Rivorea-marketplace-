"use client";

import { X } from "lucide-react";

export default function RemoveButtonFromCart({ productId }: { productId: string }) {
  const handleRemove = async () => {
    try {
      await fetch("/api/cart/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      // refresh cart after removing item
      window.location.reload();
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  return (
    <X
      onClick={handleRemove}
      className="cursor-pointer hover:text-red-500"
    />
  );
}
