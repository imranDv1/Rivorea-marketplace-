import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";


export async function GET() {
    const cart = await prisma.cartItem.findMany()
    return NextResponse.json(cart)
}