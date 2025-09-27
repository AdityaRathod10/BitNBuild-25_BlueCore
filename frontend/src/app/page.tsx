"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function Home() {
  const { data, isLoading } = useQuery({
    queryKey: ["hello"],
    queryFn: async () => {
      const res = await axios.get("http://127.0.0.1:8000/");
      return res.data;
    },
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Next.js + FastAPI</h1>
      <p className="mt-4">{data?.message}</p>
    </main>
  );
}
