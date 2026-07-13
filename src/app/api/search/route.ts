import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  if (!q || q.trim() === "") {
    return NextResponse.json([]);
  }

  try {
    const isAll = q === "ALL";
    const whereClause = isAll ? {} : {
      OR: [
        { name: { contains: q, mode: "insensitive" } as any },
        { description: { contains: q, mode: "insensitive" } as any },
        { searchKeywords: { contains: q, mode: "insensitive" } as any },
      ],
    };

    const products = await db.product.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        compareAtPrice: true,
        images: true,
        colors: true
      },
      ...(isAll ? {} : { take: 5 }),
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: "Failed to search products" }, { status: 500 });
  }
}
