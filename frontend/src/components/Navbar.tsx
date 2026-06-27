import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Navbar() {
  return (
    <header className="w-full border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="font-bold text-lg tracking-tight hover:opacity-80 transition-opacity"
        >
          metricon
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}