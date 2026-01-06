import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export function slugify(title: string): string {
  return title
    .toLowerCase() // make lowercase
    .trim() // remove leading/trailing spaces
    .replace(/\s+/g, "-") // spaces → hyphens
    .replace(/[^\w\-]+/g, "") // remove all non-word chars except hyphen
    .replace(/\-\-+/g, "-"); // collapse multiple hyphens
}
