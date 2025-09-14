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
import Head from "next/head";

type tParams = { id: string };

export default async function ProductDetails(props: { params: tParams }) {
  const { id } = props.params;

  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    return redirect("/login");
  }

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) return <div>Product not found</div>;

  // User cart
  const userCart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: { items: true },
  });
  const isInCart = userCart?.items.some((item) => item.productId === product.id) ?? false;

  // Similar products
  const productCategory = product.category;
  const categoryProjects = await prisma.product.findMany({
    where: { category: productCategory, NOT: { id: product.id } },
  });

  const hasPurchased = await prisma.purchase.findFirst({
    where: { userId: session.user.id, productId: product.id },
  });
  const isPurchased = Boolean(hasPurchased);

  // Absolute URL for sharing
  const productUrl = `https://rivorea-marketplace.vercel.app/product/details/${product.id}`;
  const productImage = product.thumbnails[0];

  return (
    <>
      {/* SEO & Social Sharing */}
      <Head>
        <title>{product.title} | Rivorea Marketplace</title>
        <meta name="description" content={product.description} />

        {/* Open Graph */}
        <meta property="og:title" content={product.title} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={productImage} />
        <meta property="og:type" content="product" />
        <meta property="og:url" content={productUrl} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={product.title} />
        <meta name="twitter:description" content={product.description} />
        <meta name="twitter:image" content={productImage} />
      </Head>

      <div className="flex flex-col gap-20">
        {/* Product Info */}
        <div className="w-[90%] mx-auto mt-20 grid grid-cols-1 md:grid-cols-2 items-center gap-20">
          <div className="flex flex-col gap-9">
            <h1 className="text-4xl font-bold">{product.title}</h1>
            <p className="text-2xl text-muted-foreground">{product.description}</p>
            <div className="flex items-center gap-7">
              <p className="text-lg">${product.price}</p>
              <p className="text-lg text-muted-foreground">{product.category}</p>
            </div>

            {/* Add to Cart */}
            <AddToCartButton productId={product.id} state={isInCart} purchased={isPurchased} />

            {/* Share Buttons */}
            <div className="flex gap-4 mt-4">
              {/* WhatsApp */}
              <a
                href={`https://api.whatsapp.com/send?text=Check out this product: ${productUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 px-4 py-2 rounded text-white hover:bg-green-600 transition"
              >
                WhatsApp
              </a>

              {/* X / Twitter */}
              <a
                href={`https://twitter.com/intent/tweet?url=${productUrl}&text=Check out this product!`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500 px-4 py-2 rounded text-white hover:bg-blue-600 transition"
              >
                X
              </a>

              {/* Discord */}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(productUrl);
                  alert("Product link copied! Share it on Discord.");
                }}
                className="bg-indigo-500 px-4 py-2 rounded text-white hover:bg-indigo-600 transition"
              >
                Discord
              </button>
            </div>
          </div>

          {/* Carousel */}
          <Carousel className="w-full md:w-[80%] mx-auto">
            <CarouselContent>
              {product.thumbnails.map((thumb, i) => (
                <CarouselItem key={i}>
                  <div className="w-full h-64 sm:h-72 md:h-80 relative rounded-md overflow-hidden">
                    <Image src={thumb} alt={`Thumbnail ${i + 1}`} fill className="object-cover" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>

        {/* Similar Products */}
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
                    <p className="text-muted-foreground text-lg line-clamp-2">{product.description}</p>
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
