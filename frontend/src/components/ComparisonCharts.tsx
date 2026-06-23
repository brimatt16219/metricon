"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  LineChart, Line, ScatterChart, Scatter, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, PolarRadiusAxis
} from "recharts";

interface ComparisonResult {
  items: string[];
  attributes: string[];
  data: Record<string, string | number>[];
  recommendation: string;
}

const COLORS = ["#6366f1", "#f59e0b", "#10b981", "#ef4444", "#3b82f6"];

type ChartType = "bar" | "radar" | "line" | "scatter";

export default function ComparisonCharts({ result }: { result: ComparisonResult }) {
  const [chartType, setChartType] = useState<ChartType>("bar");

  const numericalAttributes = result.attributes.filter((attr) =>
    result.data.every((item) => typeof item[attr] === "number")
  );

  const barAndLineData = numericalAttributes.map((attr) => {
    const entry: Record<string, string | number> = { attribute: attr };
    result.data.forEach((item) => {
      entry[item.name as string] = item[attr] as number;
    });
    return entry;
  });

  const radarData = numericalAttributes.map((attr) => {
    const entry: Record<string, string | number> = { attribute: attr };
    result.data.forEach((item) => {
      entry[item.name as string] = item[attr] as number;
    });
    return entry;
  });

  const scatterData = result.data.map((item) => ({
    name: item.name as string,
    x: item[numericalAttributes[0]] as number,
    y: item[numericalAttributes[1]] as number,
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Charts</CardTitle>
        <div className="flex gap-2 flex-wrap">
          {(["bar", "radar", "line", "scatter"] as ChartType[]).map((type) => (
            <Button
              key={type}
              size="sm"
              variant={chartType === type ? "default" : "outline"}
              onClick={() => setChartType(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          {chartType === "bar" ? (
            <BarChart data={barAndLineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="attribute" tick={{ fontSize: 11 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              {result.items.map((item, i) => (
                <Bar key={item} dataKey={item} fill={COLORS[i % COLORS.length]} />
              ))}
            </BarChart>
          ) : chartType === "line" ? (
            <LineChart data={barAndLineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="attribute" tick={{ fontSize: 11 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              {result.items.map((item, i) => (
                <Line key={item} dataKey={item} stroke={COLORS[i % COLORS.length]} />
              ))}
            </LineChart>
          ) : chartType === "radar" ? (
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="attribute" tick={{ fontSize: 11 }} />
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
          ) : (
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
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}