"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Navigation() {
  const { data: session } = useSession();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Auction App
        </Link>
        <div>
          <Link href="/auctions" className="mr-4">
            Auctions
          </Link>
          {session ? (
            <>
              <span className="mr-4">Hello, {session.user.name}</span>
              <button onClick={() => signOut()}>Sign out</button>
            </>
          ) : (
            <button onClick={() => signIn("github")}>
              Sign in with GitHub
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
