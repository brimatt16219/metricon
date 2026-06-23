"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  LineChart, Line, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Cell, Treemap,
} from "recharts";

interface ComparisonResult {
  items: string[];
  attributes: string[];
  data: Record<string, string | number>[];
  recommendation: string;
}

const COLORS = ["#6366f1", "#f59e0b", "#10b981", "#ef4444", "#3b82f6", "#ec4899"];

type ChartType = "bar" | "grouped-bar" | "radar" | "line" | "scatter" | "bubble" | "heatmap" | "treemap" | "lollipop";

const CHART_TYPES: { key: ChartType; label: string }[] = [
  { key: "bar", label: "Bar" },
  { key: "grouped-bar", label: "Grouped Bar" },
  { key: "radar", label: "Radar" },
  { key: "line", label: "Line" },
  { key: "scatter", label: "Scatter" },
  { key: "bubble", label: "Bubble" },
  { key: "heatmap", label: "Heatmap" },
  { key: "treemap", label: "Treemap" },
  { key: "lollipop", label: "Lollipop" },
];

export default function ComparisonCharts({ result }: { result: ComparisonResult }) {
  const [chartType, setChartType] = useState<ChartType>("bar");

  const numericalAttributes = result.attributes.filter((attr) =>
    result.data.every((item) => typeof item[attr] === "number")
  );

  const attributeData = numericalAttributes.map((attr) => {
    const entry: Record<string, string | number> = { attribute: attr };
    result.data.forEach((item) => {
      entry[item.name as string] = item[attr] as number;
    });
    return entry;
  });

  const scatterData = result.data.map((item, i) => ({
    name: item.name as string,
    x: item[numericalAttributes[0]] as number,
    y: item[numericalAttributes[1]] as number,
    z: numericalAttributes[2] ? (item[numericalAttributes[2]] as number) : 10 + i * 5,
  }));

  const heatmapMax = Math.max(
    ...result.data.flatMap((item) =>
      numericalAttributes.map((attr) => Number(item[attr]) || 0)
    )
  );

  const treemapData = result.data.map((item) => ({
    name: item.name as string,
    children: numericalAttributes.map((attr) => ({
      name: `${attr}`,
      size: Number(item[attr]) || 0,
    })),
  }));

  if (numericalAttributes.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No numerical attributes available for charting.
        </CardContent>
      </Card>
    );
  }

  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return (
          <BarChart data={attributeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="attribute" tick={{ fontSize: 10 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            {result.items.map((item, i) => (
              <Bar key={item} dataKey={item} fill={COLORS[i % COLORS.length]} />
            ))}
          </BarChart>
        );

      case "grouped-bar":
        return (
          <BarChart data={attributeData} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="attribute" tick={{ fontSize: 10 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            {result.items.map((item, i) => (
              <Bar key={item} dataKey={item} fill={COLORS[i % COLORS.length]} radius={[4, 4, 0, 0]} />
            ))}
          </BarChart>
        );

      case "radar":
        return (
          <RadarChart data={attributeData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="attribute" tick={{ fontSize: 10 }} />
            <PolarRadiusAxis />
            <Tooltip />
            <Legend />
            {result.items.map((item, i) => (
              <Radar
                key={item}
                dataKey={item}
                stroke={COLORS[i % COLORS.length]}
                fill={COLORS[i % COLORS.length]}
                fillOpacity={0.2}
              />
            ))}
          </RadarChart>
        );

      case "line":
        return (
          <LineChart data={attributeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="attribute" tick={{ fontSize: 10 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            {result.items.map((item, i) => (
              <Line
                key={item}
                dataKey={item}
                stroke={COLORS[i % COLORS.length]}
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            ))}
          </LineChart>
        );

      case "scatter":
        return (
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" name={numericalAttributes[0]} />
            <YAxis dataKey="y" name={numericalAttributes[1]} />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            <Legend />
            {scatterData.map((point, i) => (
              <Scatter
                key={point.name}
                name={point.name}
                data={[point]}
                fill={COLORS[i % COLORS.length]}
              />
            ))}
          </ScatterChart>
        );

      case "bubble":
        return (
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" name={numericalAttributes[0]} />
            <YAxis dataKey="y" name={numericalAttributes[1]} />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            <Legend />
            {scatterData.map((point, i) => (
              <Scatter
                key={point.name}
                name={point.name}
                data={[point]}
                fill={COLORS[i % COLORS.length]}
              >
                <Cell
                  key={point.name}
                  fill={COLORS[i % COLORS.length]}
                  fillOpacity={0.7}
                  style={{ transform: `scale(${point.z / 10})` }}
                />
              </Scatter>
            ))}
          </ScatterChart>
        );

      case "heatmap":
        return (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-center">
              <thead>
                <tr>
                  <th className="py-2 px-3 text-left text-muted-foreground">Attribute</th>
                  {result.data.map((item) => (
                    <th key={item.name as string} className="py-2 px-3 font-medium">
                      {item.name as string}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {numericalAttributes.map((attr) => (
                  <tr key={attr}>
                    <td className="py-2 px-3 text-left text-muted-foreground">{attr}</td>
                    {result.data.map((item) => {
                      const val = Number(item[attr]) || 0;
                      const intensity = heatmapMax > 0 ? val / heatmapMax : 0;
                      return (
                        <td
                          key={item.name as string}
                          className="py-2 px-3 rounded font-medium"
                          style={{
                            backgroundColor: `rgba(99, 102, 241, ${intensity})`,
                            color: intensity > 0.5 ? "white" : "inherit",
                          }}
                        >
                          {val}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case "treemap":
        return (
          <Treemap
            data={treemapData}
            dataKey="size"
            aspectRatio={4 / 3}
          >
            {treemapData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Treemap>
        );

      case "lollipop":
        return (
          <BarChart data={attributeData} barSize={2}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="attribute" tick={{ fontSize: 10 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            {result.items.map((item, i) => (
              <Bar key={item} dataKey={item} fill={COLORS[i % COLORS.length]} radius={[6, 6, 0, 0]} />
            ))}
          </BarChart>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Charts</CardTitle>
        <div className="flex gap-2 flex-wrap mt-2">
          {CHART_TYPES.map(({ key, label }) => (
            <Button
              key={key}
              size="sm"
              variant={chartType === key ? "default" : "outline"}
              onClick={() => setChartType(key)}
            >
              {label}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {chartType === "heatmap" ? (
          renderChart()
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            {renderChart() as React.ReactElement}
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}