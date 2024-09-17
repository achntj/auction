"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateAuction() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startPrice: "",
    endTime: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/auctions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
        startPrice: parseFloat(formData.startPrice),
      }),
    });

    if (res.ok) {
      router.push("/auctions");
    } else {
      alert("Failed to create auction");
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create New Auction</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label htmlFor="description" className="block mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          ></textarea>
        </div>
        <div>
          <label htmlFor="startPrice" className="block mb-1">
            Start Price
          </label>
          <input
            type="number"
            id="startPrice"
            name="startPrice"
            value={formData.startPrice}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label htmlFor="endTime" className="block mb-1">
            End Time
          </label>
          <input
            type="datetime-local"
            id="endTime"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create Auction
        </button>
      </form>
    </div>
  );
}
