import MaxWidthWrapper from "@/components/MaxWidthWrapper";
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
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import DownloadButton from "../_component/DownloadAllFilesButton";

interface Props {
  params: {
    id: string;
  };
}

type tParams = { id: string };

export default async function MyProductDetails(props: { params: tParams }) {
     const { id } = props.params;

  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    redirect("/login");
  }

  const product = await prisma.product.findUnique({
    where: { id: id },
  });

  if (!product) {
    return <div>Product not found</div>;
  }

  const purchased = await prisma.purchase.findFirst({
    where: {
      userId: session.user.id,
      productId: product.id,
    },
  });

  if (!purchased) {
    redirect("/my-purchases");
  }

  const categoryProjects = await prisma.product.findMany({
    where: {
      category: product.category,
      NOT: { id: product.id },
    },
  });

  return (
    <div className="flex flex-col gap-20">
      <div className="w-[90%] mx-auto mt-20 grid grid-cols-1 md:grid-cols-2 items-center gap-20">
        <div className="flex flex-col gap-9">
          <h1 className="text-4xl font-bold">{product.title}</h1>
          <p className="text-2xl text-muted-foreground">{product.description}</p>
          <div className="flex items-center gap-7">
            <p className="text-lg">${product.price}</p>
            <p className="text-lg text-muted-foreground">{product.category}</p>
          </div>

          {product.productFiles.length > 0 && (
        <DownloadButton productFiles={product.productFiles} />
          )}
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
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>

      <div className="w-[90%] flex flex-col gap-5 mx-auto pb-20">
        <h1 className="text-3xl font-bold">Related Products</h1>
        <p className="text-lg text-muted-foreground">
          Explore more products from this category
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 justify-start">
          {categoryProjects.map((related) => (
            <Link href={`/product/details/${related.id}`} key={related.id}>
              <Card className="w-full md:w-[320px] bg-transparent border-0 p-0">
                <CardHeader className="p-0">
                  <div className="w-full h-[250px] overflow-hidden rounded-2xl">
                    <Image
                      src={related.thumbnails[0]}
                      alt={related.title}
                      width={400}
                      height={250}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-0 flex flex-col gap-2">
                  <h1 className="text-2xl font-bold">{related.title}</h1>
                  <p className="text-muted-foreground text-lg line-clamp-2">
                    {related.description}
                  </p>
                  <p className="font-bold">${related.price}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
