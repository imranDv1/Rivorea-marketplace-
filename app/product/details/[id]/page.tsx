import { PrismaClient } from "@/lib/generated/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

type tParams = Promise<{ id: string }>;

export async function generateMetadata(props: { params: tParams }) {
  const prisma = new PrismaClient();
  const { id } = await props.params;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
    };
  }

  const baseUrl = "https://rivorea-marketplace.vercel.app";
  const imageUrl = product.thumbnails[0].startsWith("http")
    ? product.thumbnails[0]
    : `${baseUrl}${product.thumbnails[0]}`;

  return {
    title: product.title,
    description: product.description.slice(0, 150),
    openGraph: {
      title: product.title,
      description: product.description.slice(0, 150),
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 600,
          alt: product.title,
        },
      ],
      type: "product",
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description: product.description.slice(0, 150),
      images: [imageUrl],
    },
  };
}

export default async function ProductDetails(props: { params: tParams }) {
  const { id } = await props.params;
  const prisma = new PrismaClient();

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) return notFound();

  const similarProducts = await prisma.product.findMany({
    where: { category: product.category, NOT: { id: product.id } },
    take: 4,
  });

  const baseUrl = "https://rivorea-marketplace.vercel.app";

  return (
    <div className="w-full h-max bg-black flex items-center justify-center pt-20 pb-10">
      <div className="w-full lg:w-[95%] h-full flex flex-col items-center gap-10">
        <Link
          href={product.thumbnails[0]}
          target="_blank"
          className="w-full h-full lg:h-[80%]"
        >
          <Image
            src={product.thumbnails[0].startsWith("http") ? product.thumbnails[0] : `${baseUrl}${product.thumbnails[0]}`}
            alt={product.title}
            width={800}
            height={600}
            className="w-[95%] lg:w-full h-full object-cover rounded-lg object-center"
          />
        </Link>

        <div className="w-[90%] flex flex-col gap-3 text-white">
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <p className="text-lg text-gray-400">{product.description}</p>
          <p className="text-xl font-semibold mt-2">${product.price}</p>
          <p className="text-gray-500 mt-1">Category: {product.category}</p>
        </div>

        <h1 className="text-2xl font-semibold text-white">
          Similar <span className="text-gray-400 italic font-light">Products</span>
        </h1>

        <div className="w-[90%] flex flex-col lg:flex-row items-center gap-3">
          {similarProducts.map((prod) => (
            <Link href={`/product/details/${prod.id}`} key={prod.id}>
              <div className="w-[100%] lg:w-[300px] h-[400px] lg:h-[300px] p-4 rounded-lg bg-gradient-to-b from-[#111] via-[#000] to-[#000] border-2 border-[#333] flex flex-col group">
                <div className="overflow-hidden rounded-lg">
                  <Image
                    src={prod.thumbnails[0].startsWith("http") ? prod.thumbnails[0] : `${baseUrl}${prod.thumbnails[0]}`}
                    alt={prod.title}
                    width={800}
                    height={600}
                    className="w-full h-[200px] object-cover rounded-lg transition-all duration-300 group-hover:scale-105"
                  />
                </div>
                <h2 className="font-semibold text-white mt-4">{prod.title}</h2>
                <p className="text-gray-400 font-semibold">${prod.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
