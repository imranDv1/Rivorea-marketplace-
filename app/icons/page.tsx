import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { prisma } from "@/lib/db";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const page = async () => {
  const products = await prisma.product.findMany({
    where: {
      category: "icons",
    },
  });
  return (
    <div className="w-[90%]  flex flex-col gap-5 mx-auto pb-20">
      <h1 className="text-3xl font-bold text-primary">Icons</h1>
      <p className="text-lg text-muted-foreground">
        Browse over 10,000 unique icons to enhance your apps and designs.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 justify-start">
        {products.map((product) => (
          <Link href={`/product/details/${product.id}`} key={product.id}>
            <Card className="w-full md:w-[320px] bg-transparent border-0 p-0">
              <CardHeader className="p-0">
                <div className="w-full h-[250px] overflow-hidden rounded-2xl">
                  <Image
                    src={product.thumbnails[0]}
                    alt={product.title}
                    width={400}
                    height={250}
                    className="w-full h-full object-cover"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0 flex flex-col gap-2">
                <h1 className="text-2xl font-bold">{product.title}</h1>
                <p className="text-muted-foreground text-lg line-clamp-2">
                  {product.description}
                </p>
                <p className="font-bold">${product.price}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default page;
