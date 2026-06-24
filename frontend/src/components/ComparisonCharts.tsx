"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false });

interface ComparisonResult {
  items: string[];
  attributes: string[];
  data: Record<string, string | number>[];
  recommendation: string;
}

// Reads the theme's chart colors from CSS variables, re-reading whenever the
// html element's class changes (i.e. when dark mode is toggled).
function useChartPalette() {
  const [palette, setPalette] = useState<{
    colors: string[];
    text: string;
    axis: string;
  } | null>(null);

  useEffect(() => {
    const read = () => {
      const root = getComputedStyle(document.documentElement);
      const v = (name: string) => root.getPropertyValue(name).trim();
      setPalette({
        colors: [
          v("--chart-1"),
          v("--chart-2"),
          v("--chart-3"),
          v("--chart-4"),
          v("--chart-5"),
        ],
        text: v("--foreground"),
        axis: v("--muted-foreground"),
      });
    };

    read();

    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return palette;
}

export default function ComparisonCharts({ result }: { result: ComparisonResult }) {
  const palette = useChartPalette();

  const numericalAttributes = result.attributes.filter((attr) =>
    result.data.every((item) => typeof item[attr] === "number")
  );

  if (numericalAttributes.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No numerical attributes available for charting.
        </CardContent>
      </Card>
    );
  }

  if (!palette) return null;

  const option = {
    color: palette.colors,
    textStyle: { color: palette.text },
    tooltip: { trigger: "axis" },
    legend: { textStyle: { color: palette.text } },
    grid: { left: 50, right: 20, top: 40, bottom: 40 },
    xAxis: {
      type: "category",
      data: numericalAttributes,
      axisLabel: { color: palette.axis, fontSize: 10 },
    },
    yAxis: {
      type: "value",
      axisLabel: { color: palette.axis },
    },
    series: result.items.map((item) => {
      const row = result.data.find((d) => d.name === item);
      return {
        name: item,
        type: "bar",
        data: numericalAttributes.map((attr) => Number(row?.[attr] ?? 0)),
      };
    }),
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Charts</CardTitle>
      </CardHeader>
      <CardContent>
        <ReactECharts
          option={option}
          opts={{ renderer: "svg" }}
          style={{ height: 400 }}
        />
      </CardContent>
    </Card>
  );
}