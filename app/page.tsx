import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Welcome to the Auction App</h1>
      {session ? (
        <div>
          <p>Welcome, {session.user.name}!</p>
          <Link href="/auctions" className="text-blue-500 hover:underline">
            View Auctions
          </Link>
        </div>
      ) : (
        <Link
          href="/api/auth/signin"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Sign In
        </Link>
      )}
    </main>
  );
}
