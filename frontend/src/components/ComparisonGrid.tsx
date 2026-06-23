import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ComparisonResult {
  items: string[];
  attributes: string[];
  data: Record<string, string | number>[];
  recommendation: string;
}

export default function ComparisonGrid({ result }: { result: ComparisonResult }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparison Grid</CardTitle>
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
  );
}