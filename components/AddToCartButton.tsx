"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface AddToCartButtonProps {
  productId: string;
  state: boolean; // إذا المنتج موجود بالكارت
  purchased?: boolean; // إذا المستخدم اشترى المنتج مسبقًا
}

export default function AddToCartButton({ productId, state, purchased = false }: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false);
  const [inCart, setInCart] = useState(state);

  async function handleAddToCart() {
    if (purchased) return; // لا نفعل أي شيء إذا المنتج مشتراه
    setLoading(true);
    try {
      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();

      if (!res.ok) toast.error(data.error || "Failed to add to cart");
      else {
        toast.success("Product added to cart!");
        setInCart(true);
        window.dispatchEvent(new CustomEvent("cartUpdated"));
      }

      window.location.reload();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove() {
    setLoading(true);
    try {
      const res = await fetch("/api/cart/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();

      if (!res.ok) toast.error(data.error || "Failed to remove from cart");
      else {
        toast.success("Product removed from cart!");
        setInCart(false);
        window.dispatchEvent(new CustomEvent("cartUpdated"));
      }

      window.location.reload();
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  }

  // إذا المنتج مشتراه نخلي الزر معطل
  return (
    <Button
      onClick={inCart ? handleRemove : handleAddToCart}
      disabled={loading || purchased}
    >
      {purchased
        ? "Already Purchased"
        : loading
        ? inCart
          ? "Removing..."
          : "Adding..."
        : inCart
        ? "Remove from Cart"
        : "Add to Cart"}
    </Button>
  );
}
