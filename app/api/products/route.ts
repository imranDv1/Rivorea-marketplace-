/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { uploadToCloudinary } from "@/lib/cloudinary";

export const runtime = "nodejs";

// Sanitize file name for cloudinary
function sanitizeFileName(name: string) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_.-]/g, "");
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const title = form.get("title") as string;
    const description = form.get("description") as string;
    const price = parseFloat(form.get("price") as string);
    const category = form.get("category") as string;

    // Get files
    const thumbnails = form.getAll("thumbnails") as File[];
    const productFiles = form.getAll("productFiles") as File[];

    // Upload thumbnails
    const thumbUrls: string[] = [];
    for (const file of thumbnails) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const safeName = sanitizeFileName(file.name);
      const { url } = await uploadToCloudinary(
        buffer,
        safeName,
        "products/thumbnails"
      );
      thumbUrls.push(url);
    }

    // Upload product files (zip/pdf/exe/raw/auto handled inside)
    const fileUrls: string[] = [];
    for (const file of productFiles) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const safeName = sanitizeFileName(file.name);
      const { url } = await uploadToCloudinary(
        buffer,
        safeName,
        "products/files"
      );
      fileUrls.push(url);
    }

    // Insert into Neon (Postgres via Prisma)
    const product = await prisma.product.create({
      data: {
        title,
        description,
        price,
        category,
        thumbnails: thumbUrls,
        productFiles: fileUrls,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Unknown error occurred" },
      { status: 500 }
    );
  }
}
