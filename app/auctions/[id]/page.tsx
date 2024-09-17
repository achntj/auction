"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AuctionPage({ params }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [auction, setAuction] = useState(null);
  const [bidAmount, setBidAmount] = useState("");

  useEffect(() => {
    fetchAuction();
  }, [params.id]);

  async function fetchAuction() {
    const res = await fetch(`/api/auctions/${params.id}`);
    const data = await res.json();
    setAuction(data);
  }

  async function placeBid(e) {
    e.preventDefault();
    const res = await fetch(`/api/auctions/${params.id}/bid`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: parseFloat(bidAmount) }),
    });
    if (res.ok) {
      fetchAuction();
      setBidAmount("");
    } else {
      alert("Failed to place bid");
    }
  }

  if (!auction) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">{auction.title}</h1>
      <p>{auction.description}</p>
      <p>Current Price: ${auction.currentPrice.toFixed(2)}</p>
      <p>Ends at: {new Date(auction.endTime).toLocaleString()}</p>
      {session ? (
        <form onSubmit={placeBid} className="mt-4">
          <input
            type="number"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            min={auction.currentPrice + 0.01}
            step="0.01"
            required
            className="border p-2 mr-2"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Place Bid
          </button>
        </form>
      ) : (
        <p>Please sign in to place a bid.</p>
      )}
    </div>
  );
}
