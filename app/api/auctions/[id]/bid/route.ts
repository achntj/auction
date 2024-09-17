import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { amount } = await request.json();
  const auctionId = params.id;

  const auction = await prisma.auction.findUnique({
    where: { id: auctionId },
  });

  if (!auction) {
    return NextResponse.json({ error: "Auction not found" }, { status: 404 });
  }

  if (amount <= auction.currentPrice) {
    return NextResponse.json(
      { error: "Bid must be higher than current price" },
      { status: 400 }
    );
  }

  const bid = await prisma.bid.create({
    data: {
      amount,
      user: {
        connect: { email: session.user.email },
      },
      auction: {
        connect: { id: auctionId },
      },
    },
  });

  await prisma.auction.update({
    where: { id: auctionId },
    data: { currentPrice: amount },
  });

  return NextResponse.json(bid);
}
