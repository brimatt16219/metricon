import { ThemeToggle } from "@/components/ThemeToggle";

export function Navbar() {
  return (
    <header className="w-full border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <span className="font-bold text-lg tracking-tight">metricon</span>
        <ThemeToggle />
      </div>
    </header>
  );
}