import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.email) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { cart: { include: { items: true } } },
    });

    if (!user || !user.cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    const existingItem = user.cart.items.find((item) => item.productId === productId);

    if (!existingItem) {
      return NextResponse.json({ error: "Item not in cart" }, { status: 404 });
    }

    // if you want to decrease quantity first
    if (existingItem.quantity > 1) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity - 1 },
      });
    } else {
      // remove item completely if quantity = 1
      await prisma.cartItem.delete({
        where: { id: existingItem.id },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
