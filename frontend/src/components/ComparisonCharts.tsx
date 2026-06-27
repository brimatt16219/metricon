"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CHART_REGISTRY,
  DEFAULT_CHART_KEYS,
  finalizeOption,
  type ChartContext,
  type ChartPalette,
} from "@/components/charts/registry";

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

// A single chart slot: a type picker plus the rendered chart.
function ChartSlot({
  chartKey,
  ctx,
  applicableKeys,
  onChangeType,
  onRemove,
}: {
  chartKey: string;
  ctx: ChartContext;
  applicableKeys: string[];
  onChangeType: (key: string) => void;
  onRemove: () => void;
}) {
  const def = CHART_REGISTRY.find((d) => d.key === chartKey);
  const numKey = ctx.numericalAttributes.join(",");
  const [axes, setAxes] = useState<Record<string, string>>({});

  // Reset metric choices to defaults when the chart type or numeric columns change.
  useEffect(() => {
    if (!def) return;
    const next: Record<string, string> = {};
    def.roles.forEach((role, i) => {
      next[role.id] = ctx.numericalAttributes[i] ?? ctx.numericalAttributes[0];
    });
    setAxes(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartKey, numKey]);

  const usable = def && ctx.numericalAttributes.length >= def.minNumeric;
  const slotCtx: ChartContext = { ...ctx, axes };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={chartKey}
            onChange={(e) => onChangeType(e.target.value)}
            className="h-9 rounded-md border bg-background px-2 text-sm"
          >
            {applicableKeys.map((key) => {
              const d = CHART_REGISTRY.find((c) => c.key === key)!;
              return (
                <option key={key} value={key}>
                  {d.label}
                </option>
              );
            })}
          </select>

          {def?.roles.map((role) => (
            <select
              key={role.id}
              value={axes[role.id] ?? ""}
              onChange={(e) => setAxes({ ...axes, [role.id]: e.target.value })}
              className="h-9 rounded-md border bg-background px-2 text-xs"
              title={role.label}
            >
              {ctx.numericalAttributes.map((attr) => (
                <option key={attr} value={attr}>
                  {role.label}: {attr}
                </option>
              ))}
            </select>
          ))}
        </div>

        <button
          onClick={onRemove}
          className="text-muted-foreground hover:text-destructive text-sm"
          aria-label="Remove chart"
        >
          ✕
        </button>
      </CardHeader>
      <CardContent>
        {usable ? (
          <ReactECharts
            key={chartKey}
            option={finalizeOption(def!.build(slotCtx))}
            opts={{ renderer: "svg" }}
            style={{ height: 400 }}
            notMerge
          />
        ) : (
          <p className="py-12 text-center text-sm text-muted-foreground">
            This chart needs more numerical attributes.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default function ComparisonCharts({ result }: { result: ComparisonResult }) {
  const palette = useChartPalette();

  const numericalAttributes = result.attributes.filter((attr) =>
    result.data.every((item) => typeof item[attr] === "number")
  );

  const applicableKeys = CHART_REGISTRY.filter(
    (d) => numericalAttributes.length >= d.minNumeric
  ).map((d) => d.key);

  const [slots, setSlots] = useState<string[]>(() =>
    DEFAULT_CHART_KEYS.filter((k) => CHART_REGISTRY.some((d) => d.key === k))
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

  const ctx: ChartContext = {
    items: result.items,
    data: result.data,
    numericalAttributes,
    palette,
    axes: {},
  };

  const addChart = () => {
    if (applicableKeys.length > 0) setSlots([...slots, applicableKeys[0]]);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" variant="secondary" onClick={addChart}>
          + Add chart
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {slots.map((key, i) => (
          <ChartSlot
            key={i}
            chartKey={key}
            ctx={ctx}
            applicableKeys={applicableKeys}
            onChangeType={(newKey) =>
              setSlots(slots.map((s, idx) => (idx === i ? newKey : s)))
            }
            onRemove={() => setSlots(slots.filter((_, idx) => idx !== i))}
          />
        ))}
      </div>
    </div>
  );
}