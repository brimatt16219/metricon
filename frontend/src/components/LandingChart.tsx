"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import {
  CHART_REGISTRY,
  finalizeOption,
  type ChartContext,
  type ChartPalette,
} from "@/components/charts/registry";

const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false });

// Hardcoded example comparison so the landing page shows a real, themed chart.
const EXAMPLE_ITEMS = ["EcoBoost X", "Voltedge Pro", "TerraDrive"];
const EXAMPLE_ATTRS = ["Range", "Speed", "Comfort", "Value"];
const EXAMPLE_DATA = [
  { name: "EcoBoost X", Range: 88, Speed: 72, Comfort: 90, Value: 80 },
  { name: "Voltedge Pro", Range: 95, Speed: 85, Comfort: 78, Value: 70 },
  { name: "TerraDrive", Range: 74, Speed: 80, Comfort: 85, Value: 92 },
];

function useChartPalette() {
  const [palette, setPalette] = useState<ChartPalette | null>(null);

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

export function LandingChart() {
  const palette = useChartPalette();

  if (!palette) return <div style={{ height: 360 }} />;

  const ctx: ChartContext = {
    items: EXAMPLE_ITEMS,
    data: EXAMPLE_DATA,
    numericalAttributes: EXAMPLE_ATTRS,
    palette,
    axes: {},
  };

  const def = CHART_REGISTRY.find((d) => d.key === "radar")!;

  return (
    <ReactECharts
      option={finalizeOption(def.build(ctx))}
      opts={{ renderer: "svg" }}
      style={{ height: 360 }}
      notMerge
    />
  );
}
