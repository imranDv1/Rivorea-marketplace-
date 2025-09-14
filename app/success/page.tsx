import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Stripe from "stripe";
import GoHomeButton from "./_component/GoHomeButton";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Props {
  searchParams: { session_id: string };
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export default async function SuccessPage({ searchParams }: Props) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) redirect("/login");

  const sessionId = searchParams.session_id;
  if (!sessionId) redirect("/");

  // Check Stripe session
  const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);

  if (!stripeSession || stripeSession.payment_status !== "paid") {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="max-w-md w-full">
          <CardContent className="flex flex-col items-center">
            <CardTitle className="text-red-600">
              Payment was not successful
            </CardTitle>
            <CardDescription className="text-gray-500 mt-2">
              Please try again or contact support if the issue persists.
            </CardDescription>
            <GoHomeButton />
          </CardContent>
        </Card>
      </div>
    );
  }

  // ✅ Check metadata before comparing
  if (
    !stripeSession.metadata ||
    stripeSession.metadata.userId !== session.user.id
  ) {
    redirect("/");
  }

  // Fetch user's cart
  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: { items: { include: { product: true } } },
  });

  if (!cart || cart.items.length === 0) {
  redirect("/")
  }

  // Move products to Purchases and clear cart
  await prisma.$transaction(async (tx) => {
    for (const item of cart.items) {
      await tx.purchase.create({
        data: { userId: session.user.id, productId: item.productId },
      });
    }
    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
  });

  return (
    <div className="w-full min-h-[80vh] flex items-center justify-center">
      <Card className="w-[350px]">
        <div className="p-6">
          <div className="w-full flex justify-center">
            <Check className="w-12 h-12 rounded-full bg-green-500/30 text-green-500 p-2" />
          </div>

          <div className="mt-3 text-center sm:mt-5 w-full">
            <h3 className="text-lg leading-6 font-medium">
              Payment Successfull
            </h3>
            <div className="mt-2">
              <p className="text-sm text-muted-foreground">
                Congrats on your subscription, please check your email for
                further instructions
              </p>
            </div>

            <div className="mt-5 sm:mt-6 w-full">
              <GoHomeButton />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
