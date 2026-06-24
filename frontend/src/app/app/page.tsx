"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import ComparisonGrid from "@/components/ComparisonGrid";
import ComparisonCharts from "@/components/ComparisonCharts";

interface ComparisonResult {
  items: string[];
  attributes: string[];
  data: Record<string, string | number>[];
  recommendation: string;
}

export default function Home() {
  const [category, setCategory] = useState("");
  const [itemInput, setItemInput] = useState("");
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [items, setItems] = useState<string[]>([]);
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"grid" | "charts">("grid");
  const [discovering, setDiscovering] = useState(false);

  const addItem = () => {
    if (itemInput.trim() && !items.includes(itemInput.trim())) {
      setItems([...items, itemInput.trim()]);
      setItemInput("");
    }
  };

  const removeItem = (item: string) => {
    setItems(items.filter((i) => i !== item));
  };

  const handleCompare = async () => {
    if (items.length < 2) return;
    setLoading(true);
    setResult(null);
    setError("");

    try {
      const res = await fetch("http://localhost:8000/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, category: category || null }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Comparison failed.");
      }

      const data = await res.json();
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Comparison failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleDiscover = async () => {
    if (!category.trim()) return;
    setDiscovering(true);
    setError("");

    try {
      const res = await fetch("http://localhost:8000/discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Search failed.");
      }

      const data = await res.json();
      setItems(data.items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Search failed.");
    } finally {
      setDiscovering(false);
    }
  };

  const removeResultItem = (name: string) => {
    if (!result) return;
    setResult({
      ...result,
      items: result.items.filter((i) => i !== name),
      data: result.data.filter((row) => row.name !== name),
    });
  };

  const removeAttribute = (attr: string) => {
    if (!result) return;
    setResult({
      ...result,
      attributes: result.attributes.filter((a) => a !== attr),
    });
  };

  const handleAddItem = async (name: string) => {
    if (!result || !name.trim()) return;
    setEditing(true);
    setError("");

    try {
      const res = await fetch("http://localhost:8000/compare/add-item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          item: name.trim(),
          attributes: result.attributes,
          category: category || null,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Could not add that item.");
      }

      const data = await res.json();
      setResult({
        ...result,
        items: [...result.items, name.trim()],
        data: [...result.data, data.item],
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not add that item.");
    } finally {
      setEditing(false);
    }
  };

  const handleAddAttribute = async (attr: string) => {
    if (!result || !attr.trim()) return;
    setEditing(true);
    setError("");

    try {
      const res = await fetch("http://localhost:8000/compare/add-attribute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: result.items,
          attribute: attr.trim(),
          category: category || null,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Could not add that attribute.");
      }

      const data = await res.json();
      setResult({
        ...result,
        attributes: [...result.attributes, attr.trim()],
        data: result.data.map((row) => ({
          ...row,
          [attr.trim()]: data.values[row.name as string] ?? "—",
        })),
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not add that attribute.");
    } finally {
      setEditing(false);
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-2">metricon</h1>
      <p className="text-muted-foreground mb-8">
        Compare anything — products, schools, services, and more.
      </p>

      <div className="space-y-4 mb-6">
        <div className="flex gap-2">
          <Input
            placeholder="Category (e.g. GPU, university, electric car...)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleDiscover()}
          />
          <Button onClick={handleDiscover} disabled={!category.trim() || discovering}>
            {discovering ? "Searching..." : "Search"}
          </Button>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Add a specific item to compare..."
            value={itemInput}
            onChange={(e) => setItemInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addItem()}
          />
          <Button onClick={addItem}>Add</Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <Badge
              key={item}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => removeItem(item)}
            >
              {item} ✕
            </Badge>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 mb-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <Button
        onClick={handleCompare}
        disabled={items.length < 2 || loading}
        className="w-full mb-8"
      >
        {loading ? "Comparing..." : "Compare"}
      </Button>

      {result && (
        <div className="space-y-6">
          <div className="flex gap-2">
            <Button
              variant={view === "grid" ? "default" : "outline"}
              onClick={() => setView("grid")}
            >
              Grid
            </Button>
            <Button
              variant={view === "charts" ? "default" : "outline"}
              onClick={() => setView("charts")}
            >
              Charts
            </Button>
          </div>

          {view === "grid" && (
            <ComparisonGrid
              result={result}
              editing={editing}
              onRemoveItem={removeResultItem}
              onRemoveAttribute={removeAttribute}
              onAddItem={handleAddItem}
              onAddAttribute={handleAddAttribute}
            />
          )}
          {view === "charts" && <ComparisonCharts result={result} />}

          <div className="rounded-lg border p-4 bg-muted/50">
            <p className="text-sm font-medium mb-1">Recommendation</p>
            <p className="text-sm text-muted-foreground">{result.recommendation}</p>
          </div>
        </div>
      )}
    </main>
  );
}