import Link from "next/link";
import prisma from "@/lib/prisma";

export default async function AuctionsPage() {
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

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Active Auctions</h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {auctions.map((auction) => (
          <li key={auction.id} className="border p-4 rounded-lg">
            <Link href={`/auctions/${auction.id}`}>
              <h2 className="text-xl font-semibold">{auction.title}</h2>
              <p>Current Price: ${auction.currentPrice.toFixed(2)}</p>
              <p>Ends at: {auction.endTime.toLocaleString()}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
