import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <main>
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 pt-24 pb-20 text-center">
        <span className="inline-block text-sm font-medium text-muted-foreground border rounded-full px-4 py-1 mb-6">
          AI-powered comparisons
        </span>
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6 max-w-3xl mx-auto">
          Compare anything,
          <span className="text-primary"> instantly</span>.
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          metricon uses AI to research and compare products, schools, services —
          anything with attributes worth weighing. Get structured breakdowns,
          rich charts, and a clear recommendation in seconds.
        </p>
        <div className="flex gap-3 justify-center">
          <Button asChild size="lg">
            <Link href="/app">Start comparing</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="#features">Learn more</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-5xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Everything you need to decide with confidence
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              title: "AI-powered discovery",
              body: "Type a category and metricon searches the web to find the most relevant, current items to compare.",
            },
            {
              title: "Structured breakdowns",
              body: "Every comparison returns clean, consistent attributes across all items — no more juggling browser tabs.",
            },
            {
              title: "Rich visualizations",
              body: "Explore the data your way with bar, radar, scatter, heatmap, and many more chart types.",
            },
          ].map((f) => (
            <div key={f.title} className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <div className="rounded-2xl border bg-card px-8 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to compare?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Start your first comparison now — no sign-up required.
          </p>
          <Button asChild size="lg">
            <Link href="/app">Launch metricon</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}