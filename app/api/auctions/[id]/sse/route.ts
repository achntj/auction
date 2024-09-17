import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auctionId = params.id;

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      while (true) {
        const auction = await prisma.auction.findUnique({
          where: { id: auctionId },
          include: { bids: { orderBy: { createdAt: "desc" }, take: 1 } },
        });

        if (!auction) {
          controller.close();
          return;
        }

        const data = JSON.stringify({
          currentPrice: auction.currentPrice,
          lastBid: auction.bids[0],
        });

        controller.enqueue(encoder.encode(`data: ${data}\n\n`));

        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
