import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

interface Params {
  productId: string;
}

export async function GET(
  req: Request, 
  { params }: { params: Params }
) {
  try {
    const productId = params.productId;

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const downloadLinks = product.productFiles.map((url) =>
      url.includes("fl_attachment") ? url : `${url}?fl_attachment`
    );

    return NextResponse.json({ files: downloadLinks });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch product files" },
      { status: 500 }
    );
  }
}
