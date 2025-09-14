import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ShoppingCart } from "lucide-react";
import { headers } from "next/headers";

const Cart = async () => {
  const session = await auth.api.getSession({
    headers: await headers(), // <-- هنا استخدم await
  });

  if (!session) return null;

const items = await prisma.cartItem.findMany({
  where: {
    cart: {
      userId: session.user.id, // هنا نحدد المستخدم
    },
  },
  include: {
    product: true, // إذا أردت تفاصيل المنتج أيضاً
  },
});

  return (
    <>
      <span className="text-primary">{items.length}</span>
      <ShoppingCart />
    </>
  );
};

export default Cart;
