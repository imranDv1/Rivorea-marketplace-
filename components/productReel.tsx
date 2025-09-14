"use client"
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import Image from "next/image";
import Slider from "react-slick"; // carousel library
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
interface ProductReelProps {
  products: {
    id: string;
    title: string;
    description: string;
    price: number;
    thumbnails: string[];
  }[];
}


function ProductReel({ products }: ProductReelProps) {

    const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
  <div className="w-[90%] flex flex-wrap justify-center gap-5">
        {products.map((product) => (
          <Card key={product.id} className="w-[400px] flex flex-col h-[550px]">
            <CardHeader className="p-0 h-[250px]">
              <Slider {...settings}>
                {product.thumbnails.map((thumb: string, index: number) => (
                  <div key={index} className="relative w-full h-[250px]">
                    <Image
                      src={`${thumb}`}
                      alt={product.title}
                      fill
                      className="object-cover rounded-t-md"
                    />
                  </div>
                ))}
              </Slider>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col justify-between">
              <div>
                <h1 className="font-bold text-lg truncate">{product.title}</h1>
                <p className="text-muted-foreground line-clamp-3">
                  {product.description}
                </p>
              </div>
              <p className="mt-2 font-semibold">${product.price}</p>
            </CardContent>

            <CardFooter>
              <Link
                href={`/products/${product.id}`}
                className={cn(buttonVariants(), "w-full")}
              >
                Shop the collection
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
  );
}

export default ProductReel;
