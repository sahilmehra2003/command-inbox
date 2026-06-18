"use client";

import { useState, KeyboardEvent } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { FILTER_QUERIES } from "@/lib/constants/mail-filters";
import { Button } from "../ui/button";



const TopNavbar = () => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const filter = searchParams.get("filter");
  const q = searchParams.get("q");

  const filterQuery =filter && filter in FILTER_QUERIES ? FILTER_QUERIES[filter as keyof typeof FILTER_QUERIES] : "";

  const displayValue =
  [filterQuery, q]
    .filter(Boolean)
    .join(" ");  

    const [draft, setDraft] = useState("");

  const handleSearch = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
          router.push(`/inbox?q=${encodeURIComponent(draft)}`);
        }
  };

  return (
    <header className="flex h-16 items-center border-b px-6">
      {/* Logo */}
      <div className="flex w-64 items-center gap-3">
        <h1 className="font-semibold">Command Inbox</h1>
      </div>

      {/* Search */}
      <div className="flex flex-1 justify-center">
        <div className="relative w-full max-w-2xl">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search mail..."
            className="pl-10"
            value={draft || displayValue}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e)=>handleSearch(e)}
          />
        </div>
      </div>
      
      <Button
      variant="outline"
      size="sm"
      onClick={() => router.push("/")}
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      Back to Home
    </Button>
      {/* Right Side Placeholder */}
      <div className="w-64" />
    </header>
  );
};

export default TopNavbar;