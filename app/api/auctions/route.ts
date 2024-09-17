import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const auctions = await prisma.auction.findMany({
    where: {
      endTime: {
        gt: new Date(),
      },
    },
    orderBy: {
      endTime: "asc",
    },
  });

  return NextResponse.json(auctions);
}

export async function POST(request: Request) {
  const { title, description, startPrice, endTime } = await request.json();

  const auction = await prisma.auction.create({
    data: {
      title,
      description,
      startPrice,
      currentPrice: startPrice,
      endTime: new Date(endTime),
    },
  });

  return NextResponse.json(auction);
}
