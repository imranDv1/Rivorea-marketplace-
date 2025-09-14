import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type tParams = Promise<{ id: string }>;

export async function GET(
  req: Request, 
 props: { params: tParams }
) {
  try {
    const productId = (await props.params).id

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
