import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import AddToCartButton from "@/components/AddToCartButton";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { Suspense } from "react";

// --- SEO & Social Meta Helper ---
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ProductMeta({ product }: { product: any }) {
  // You may want to improve the fallback image URL!
  const image = product.thumbnails && product.thumbnails.length > 0 ? product.thumbnails[0] : "/default-og.png";
  const url = `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://yourdomain.com"}/product/details/${product.id}`;
  return (
    <>
      {/* SEO */}
      <title>{product.title} | Product Details</title>
      <meta name="description" content={product.description} />
      <meta name="keywords" content={`${product.title},${product.category},ecommerce,product`} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="product" />
      <meta property="og:title" content={product.title} />
      <meta property="og:description" content={product.description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={product.title} />
      <meta name="twitter:description" content={product.description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:url" content={url} />
    </>
  );
}

type tParams = { id: string };

export default async function ProductDetails(props: { params: tParams }) {
  const { id } = props.params;

  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    return redirect("/login")
  }

  const product = await prisma.product.findUnique({
    where: { id: id },
  });

  if (!product) return <div>Product not found</div>;

  // 🔎 الكارت الخاص بالمستخدم
  const userCart = await prisma.cart.findUnique({
    where: {
      userId: session.user.id,
    },
    include: {
      items: true,
    },
  });

  // ✅ تحقق إذا المنتج في الكارت
  const isInCart =
    userCart?.items.some((item) => item.productId === product.id) ?? false;

  const productCategory = product.category;

  const categoryProjects = await prisma.product.findMany({
    where: {
      category: productCategory,
      NOT: { id: product.id },
    },
  });

  if (!categoryProjects) return null;

  const hasPurchased = await prisma.purchase.findFirst({
    where: {
      userId: session.user.id,
      productId: product.id,
    },
  });

  const isPurchased = Boolean(hasPurchased);

  // --- Add SEO & Social Meta ---
  // You can use next/head or do it this way in app directory:
  return (
    <>
      {/* SEO & Social meta tags for this product */}
      <Suspense fallback={null}>
        <ProductMeta product={product} />
      </Suspense>
      <div className=" flex flex-col gap-20">
        <div className="w-[90%] mx-auto mt-20 grid grid-cols-1 md:grid-cols-2  items-center gap-20">
          <div className="flex flex-col  gap-9">
            <h1 className="text-4xl font-bold">{product.title}</h1>
            <p className="text-2xl text-muted-foreground">
              {product.description}
            </p>
            <div className="flex items-center gap-7">
              <p className="text-lg ">${product.price}</p>
              <p className="text-lg text-muted-foreground">{product.category}</p>
            </div>
            <AddToCartButton productId={product.id} state={isInCart} purchased={isPurchased} />
          </div>
          <Carousel className="w-full md:w-[80%] mx-auto">
            <CarouselContent>
              {product.thumbnails.map((thumb, i) => (
                <CarouselItem key={i}>
                  <div className="w-full h-64 sm:h-72 md:h-80 relative rounded-md overflow-hidden">
                    <Image
                      src={thumb}
                      alt={`Thumbnail ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Hide on small screens, show on md+ */}
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>

        <div className="w-[90%] flex flex-col gap-5 mx-auto pb-20">
          <h1 className="text-3xl font-bold text-primary">Similar Products</h1>
          <p className="text-lg text-muted-foreground">
            You might also like these items based on what you’re viewing.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 justify-start">
            {categoryProjects.map((product) => (
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
      </div>
    </>
  );
}