"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { formUrlQuery, removeKeysFromUrlQuery } from "@jsmastery/utils";
import { Input } from "./ui/input";

interface SearchInputProps {
  currentPathname: string;
}

const SearchInput = ({ currentPathname }: SearchInputProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState(() => {
    // Initialize from URL if present
    return searchParams.get("search") || "";
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const currentSearch = searchParams.get("search") || "";

      // Only update if the value actually changed
      if (searchQuery !== currentSearch) {
        if (searchQuery) {
          const newUrl = formUrlQuery({
            params: searchParams.toString(),
            key: "search",
            value: searchQuery,
          });
          router.push(newUrl, { scroll: false });
        } else {
          if (pathname === currentPathname) {
            const newUrl = removeKeysFromUrlQuery({
              params: searchParams.toString(),
              keysToRemove: ["search"],
            });
            router.push(newUrl, { scroll: false });
          }
        }
      }
    }, 500);

    // Cleanup function to clear the timeout
    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchParams, pathname, router, currentPathname]);

  return (
    <div className="relative flex-1">
      <Input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search courses, creators or topics..."
        className="pr-12 shadow-sm bg-background/50 backdrop-blur-sm transition-transform duration-200 ease-out hover:scale-[1.002] focus:scale-[1.005]"
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
        />
      </svg>
    </div>
  );
};

export default SearchInput;
