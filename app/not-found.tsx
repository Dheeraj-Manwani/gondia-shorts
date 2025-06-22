"use client";
import { useRouter } from "nextjs-toploader/app";
import { Button } from "@/components/ui/button"; // Assuming Button component is from ShadCN

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-semibold text-gray-800">
          The page you are looking for is not available.
        </h1>
        <Button
          onClick={() => router.push("/")}
          className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
        >
          Go to Feed
        </Button>
      </div>
    </div>
  );
}
