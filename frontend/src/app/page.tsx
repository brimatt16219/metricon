"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [items, setItems] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  const addItem = () => {
    if (inputValue.trim() && !items.includes(inputValue.trim())) {
      setItems([...items, inputValue.trim()]);
      setInputValue("");
    }
  };

  const removeItem = (item: string) => {
    setItems(items.filter((i) => i !== item));
  };

  const handleCompare = async () => {
    if (items.length < 2) return;
    setLoading(true);
    setAnalysis("");

    const res = await fetch("http://localhost:8000/compare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });

    const data = await res.json();
    setAnalysis(data.analysis);
    setLoading(false);
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-2">metricon</h1>
      <p className="text-muted-foreground mb-8">
        Compare anything — products, schools, services, and more.
      </p>

      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Add an item to compare..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addItem()}
        />
        <Button onClick={addItem}>Add</Button>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
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

      <Button
        onClick={handleCompare}
        disabled={items.length < 2 || loading}
        className="w-full mb-8"
      >
        {loading ? "Comparing..." : "Compare"}
      </Button>

      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle>Comparison Results</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <ReactMarkdown>{analysis}</ReactMarkdown>
          </CardContent>
        </Card>
      )}
    </main>
  );
}