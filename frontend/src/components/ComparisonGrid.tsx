import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface ComparisonResult {
  items: string[];
  attributes: string[];
  data: Record<string, string | number>[];
  recommendation: string;
}

interface ComparisonGridProps {
  result: ComparisonResult;
  editing: boolean;
  onRemoveItem: (name: string) => void;
  onRemoveAttribute: (attr: string) => void;
  onAddItem: (name: string) => Promise<void>;
  onAddAttribute: (attr: string) => Promise<void>;
}

export default function ComparisonGrid({
  result,
  editing,
  onRemoveItem,
  onRemoveAttribute,
  onAddItem,
  onAddAttribute,
}: ComparisonGridProps) {
  const [view, setView] = useState<"table" | "cards">("cards");
  const [newItem, setNewItem] = useState("");
  const [newAttr, setNewAttr] = useState("");

  const submitItem = async () => {
    if (!newItem.trim()) return;
    await onAddItem(newItem);
    setNewItem("");
  };

  const submitAttr = async () => {
    if (!newAttr.trim()) return;
    await onAddAttribute(newAttr);
    setNewAttr("");
  };

  return (
    <div className="space-y-4">
      {/* Toolbar: view toggle + add controls */}
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={view === "table" ? "default" : "outline"}
            onClick={() => setView("table")}
          >
            Table
          </Button>
          <Button
            size="sm"
            variant={view === "cards" ? "default" : "outline"}
            onClick={() => setView("cards")}
          >
            Cards
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex gap-1">
            <Input
              className="h-9 w-40"
              placeholder="Add item..."
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitItem()}
              disabled={editing}
            />
            <Button size="sm" variant="secondary" onClick={submitItem} disabled={editing}>
              +
            </Button>
          </div>
          <div className="flex gap-1">
            <Input
              className="h-9 w-40"
              placeholder="Add attribute..."
              value={newAttr}
              onChange={(e) => setNewAttr(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitAttr()}
              disabled={editing}
            />
            <Button size="sm" variant="secondary" onClick={submitAttr} disabled={editing}>
              +
            </Button>
          </div>
        </div>
      </div>

      {editing && (
        <p className="text-xs text-muted-foreground">Updating comparison...</p>
      )}

      {view === "table" ? (
        <Card>
          <CardHeader>
            <CardTitle>Comparison Table</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-4 font-medium text-muted-foreground w-40">
                      Attribute
                    </th>
                    {result.items.map((item) => (
                      <th key={item} className="text-left py-2 px-4 font-medium">
                        <span className="inline-flex items-center gap-1">
                          {item}
                          <button
                            onClick={() => onRemoveItem(item)}
                            className="text-muted-foreground hover:text-destructive"
                            aria-label={`Remove ${item}`}
                          >
                            ✕
                          </button>
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.attributes.map((attr) => (
                    <tr key={attr} className="border-b last:border-0">
                      <td className="py-2 pr-4 text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          {attr}
                          <button
                            onClick={() => onRemoveAttribute(attr)}
                            className="hover:text-destructive"
                            aria-label={`Remove ${attr}`}
                          >
                            ✕
                          </button>
                        </span>
                      </td>
                      {result.data.map((item) => (
                        <td key={item.name as string} className="py-2 px-4">
                          {item[attr] ?? "—"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {result.data.map((item) => (
            <Card key={item.name as string}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  {item.name as string}
                  <button
                    onClick={() => onRemoveItem(item.name as string)}
                    className="text-muted-foreground hover:text-destructive text-sm"
                    aria-label={`Remove ${item.name}`}
                  >
                    ✕
                  </button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {result.attributes.map((attr) => (
                  <div key={attr} className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground inline-flex items-center gap-1">
                      {attr}
                      <button
                        onClick={() => onRemoveAttribute(attr)}
                        className="hover:text-destructive"
                        aria-label={`Remove ${attr}`}
                      >
                        ✕
                      </button>
                    </span>
                    <Badge variant="secondary">{item[attr] ?? "—"}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}