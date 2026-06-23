import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ComparisonResult {
  items: string[];
  attributes: string[];
  data: Record<string, string | number>[];
  recommendation: string;
}

export default function ComparisonGrid({ result }: { result: ComparisonResult }) {
  const [view, setView] = useState<"table" | "cards">("cards");

  return (
    <div className="space-y-4">
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
                        {item}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.attributes.map((attr) => (
                    <tr key={attr} className="border-b last:border-0">
                      <td className="py-2 pr-4 text-muted-foreground">{attr}</td>
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
                <CardTitle className="text-lg">{item.name as string}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {result.attributes.map((attr) => (
                  <div key={attr} className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">{attr}</span>
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