import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import Image from "next/image";
import { Separator } from "./ui/separator";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import Cart from "./ui/cart";
import { ThemeToggle } from "./ui/themeToggle";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Link from "next/link";
import { X } from "lucide-react";
import RemoveButtonFromCart from "./ui/removeButtonFromCart";
import CheckoutButton from "./ui/CheckoutButton";

const CartSheet = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    return null;
  }

  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: { items: { include: { product: true } } },
  });

  const items = cart?.items || [];

  const totalPrice = items.reduce((sum, item) => sum + item.product.price, 0);

  return (
    <div className="flex items-center gap-2">
      <ThemeToggle />

      <Sheet>
        <SheetTrigger
          className={cn(
            "flex items-center gap-3",
            buttonVariants({ variant: "ghost" })
          )}
        >
          <Cart />
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Your Cart</SheetTitle>
            <Separator />
          </SheetHeader>

          <div className="w-full h-full flex flex-col overflow-scroll hide-scrollbar">
            {items.length > 0 ? (
              <div className="w-full flex flex-col gap-3">
                {items.map((item) => (
                  <Card
                    key={item.id}
                    className="p-4 flex flex-row justify-between items-center"
                  >
                    <Link href={`/product/details/${item.product.id}`} className="flex items-center gap-4">
                      {item.product.thumbnails.length > 0 && (
                        <Image
                          src={item.product.thumbnails[0]}
                          alt={item.product.title}
                          width={80}
                          height={80}
                          className="rounded-md size-10"
                        />
                      )}
                      <div className="flex flex-col">
                        <h2 className="font-semibold line-clamp-1">
                          {item.product.title}
                        </h2>

                        <p className="font-medium">
                          ${item.product.price.toFixed(2)}
                        </p>
                      </div>
                    </Link>
                    {/* remove from cart  */}
                    <RemoveButtonFromCart productId={item.product.id}  />
                  </Card>
                ))}

                <Card className="w-full flex  items-center gap-4">
                  <CardContent className="w-full flex flex-col gap-4">
                    <div className=" w-full flex items-start justify-between">
                      <span>Shipping </span>
                      <p className="text-primary">0</p>
                    </div>

                    <div className=" w-full flex items-start justify-between">
                      <span>Total Price: </span>
                      <p className="text-primary">{totalPrice}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="w-full">
                  <CheckoutButton productIds={items.map((item) => item.product.id)} />

                  </CardFooter>
                </Card>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center">
                <Image
                  src="/images/emptyCart.png"
                  alt=""
                  width={100}
                  height={100}
                  className="w-64"
                />
                <h1 className="text-lg font-semibold">Your cart is empty</h1>
                <p className="text-sm text-muted-foreground">
                  Add items to your cart to checkout
                </p>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CartSheet;
