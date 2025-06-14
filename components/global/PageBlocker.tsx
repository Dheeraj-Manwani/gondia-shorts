"use client";

// TODO: to implement
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { LoaderCircle } from "lucide-react";

export default function PageBlocker() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-white/70 backdrop-blur-sm z-[9999] flex items-center justify-center">
      <LoaderCircle className="animate-spin w-8 h-8 text-blue-500" />
    </div>
  );
}
