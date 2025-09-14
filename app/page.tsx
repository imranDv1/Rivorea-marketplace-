import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button, buttonVariants } from "@/components/ui/button";

import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

import { prisma } from "@/lib/db";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import {
  ArrowDownToLine,
  ArrowUpRight,
  ArrowUpRightSquare,
  CheckCircle,
  Leaf,
} from "lucide-react";
import FooterSection from "@/components/footer";
import { Separator } from "@/components/ui/separator";

const perks = [
  {
    name: "Instant Delivery",
    Icon: ArrowDownToLine,
    description:
      "Get your assets delivered to your email in seconds and download them right away.",
  },
  {
    name: "Guaranteed Quality",
    Icon: CheckCircle,
    description:
      "Every asset on our platform is verified by our team to ensure our highest quality standards. Not happy? We offer a 30-day refund guarantee.",
  },
  {
    name: "For the Planet",
    Icon: Leaf,
    description:
      "We've pledged 1% of sales to the preservation and restoration of the natural environment.",
  },
];

export default async function Home() {
  const newProducts = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc", // or 'updatedAt' depending on your schema
    },
    take: 4, // limit to 4 products
  });

  const UiKit = await prisma.product.findMany({
    where: {
      category: "ui-kit",
    },
  });

  const Icons = await prisma.product.findMany({
    where: {
      category: "icons",
    },
    orderBy: {
      createdAt: "asc", // أقدم المنتجات أولاً
    },
    take: 4, // اختر أول 4 منتجات
  });

  if (!Icons) return null;
  if (!UiKit) return null;
  if (!newProducts) return null;

  return (
    <>
      <MaxWidthWrapper>
        <div className="py-20 mx-auto text-center flex flex-col items-center max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Your marketplace for high-quality{" "}
            <span className="text-primary">digital assets</span>.
          </h1>
          <p className="mt-6 text-lg max-w-prose text-muted-foreground">
            Welcome to Rivorea. Every asset on our platform is verified by our
            team to ensure our highest quality standards.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Link href="/icons" className={buttonVariants()}>
              Find your broducts
            </Link>
           
            <Link href="https://imran-iota.vercel.app" className={buttonVariants({variant:"secondary"})}>
              The market owwner &rarr;
            </Link>
          </div>
        </div>

        {/* products cards hrere */}
      </MaxWidthWrapper>

      <section className="border  mb-10 ">
        <MaxWidthWrapper className="py-20">
          <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-0">
            {perks.map((perk) => (
              <div
                key={perk.name}
                className="text-center md:flex md:items-start md:text-left lg:block lg:text-center"
              >
                <div className="md:flex-shrink-0 flex justify-center">
                  <div className="h-16 w-16 flex items-center justify-center rounded-full bg-primary/20 border text-primary">
                    {<perk.Icon className="w-1/3 h-1/3" />}
                  </div>
                </div>

                <div className="mt-6 md:ml-4 md:mt-0 lg:ml-0 lg:mt-6">
                  <h3 className="text-base font-medium ">{perk.name}</h3>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {perk.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </MaxWidthWrapper>
      </section>

      <div className="w-[90%] flex flex-col gap-5 mx-auto pb-20">
        <h1 className="text-3xl font-bold text-primary">Brand New</h1>
        <p className="text-lg text-muted-foreground">
          Discover the latest icons and UI kits, updated regularly for your projects.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 justify-start">
          {newProducts.map((product) => (
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

      <div className="w-[90%] flex flex-col gap-5 mx-auto pb-20">
        <h1 className="text-3xl font-bold text-primary">UI Kit</h1>
        <div className="w-full flex flex-col lg:flex-row lg:justify-between">
          <p className="text-lg text-muted-foreground">
           Access a full collection of UI components to build beautiful interfaces.
          </p>
          <Link href="/ui-kit" className="text-primary">
            brows more Ui-kit &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 justify-start">
          {UiKit.map((product) => (
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

      <div className="w-[90%] flex flex-col gap-5 mx-auto pb-20">
        <h1 className="text-3xl font-bold text-primary">Icons</h1>
        <div className="w-full flex flex-col lg:flex-row lg:justify-between">
          <p className="text-lg text-muted-foreground">
            Browse over 10,000 unique icons to enhance your apps and designs.
          </p>
          <Link href="/icons" className="text-primary">
            brows more icons &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 justify-start">
          {Icons.map((product) => (
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

      <Separator/>

      <FooterSection/>
    </>
  );
}
