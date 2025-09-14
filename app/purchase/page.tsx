import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.user.id;

  if (!userId) return <div>Please log in to view your purchases</div>;

  // Fetch user purchases with product details
  const myProducts = await prisma.purchase.findMany({
    where: {
      userId: userId,
    },
    include: {
      product: true, // Include product data
    },
  });

  if (!myProducts || myProducts.length === 0) {
    return <div>You haven&apos;t purchased any products yet.</div>;
  }

  return (
    <div className="w-[90%] flex flex-col gap-5 mx-auto pb-20 mt-7">
      <h1 className="text-3xl font-bold">My Purchases</h1>
      <div className="w-full flex justify-between">
        <p className="text-lg text-muted-foreground">
          Browse all the products you have purchased
        </p>
    
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 justify-start">
        {myProducts.map((purchase) => (
          <Link
            href={`/MyProductDetails/${purchase.product.id}`}
            key={purchase.product.id}
          >
            <Card className="w-full md:w-[320px] bg-transparent border-0 p-0">
              <CardHeader className="p-0">
                <div className="w-full h-[250px] overflow-hidden rounded-2xl">
                  <Image
                    src={purchase.product.thumbnails[0]}
                    alt={purchase.product.title}
                    width={400}
                    height={250}
                    className="w-full h-full object-cover"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0 flex flex-col gap-2">
                <h1 className="text-2xl font-bold">
                  {purchase.product.title}
                </h1>
                <p className="text-muted-foreground text-lg line-clamp-2">
                  {purchase.product.description}
                </p>
                <p className="font-bold">${purchase.product.price}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default page;
