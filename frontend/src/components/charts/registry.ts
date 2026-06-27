import type { EChartsOption } from "echarts";

export interface ChartPalette {
  colors: string[];
  text: string;
  axis: string;
}

// A user-selectable metric slot a chart exposes (e.g. scatter's X and Y).
export interface AxisRole {
  id: string;
  label: string;
}

export interface ChartContext {
  items: string[];
  data: Record<string, string | number>[];
  numericalAttributes: string[];
  palette: ChartPalette;
  axes: Record<string, string>; // roleId -> chosen attribute
}

export interface ChartDef {
  key: string;
  label: string;
  minNumeric: number;
  roles: AxisRole[]; // metric slots the user can reassign
  build: (ctx: ChartContext) => EChartsOption;
}

const val = (ctx: ChartContext, item: string, attr: string) =>
  Number(ctx.data.find((d) => d.name === item)?.[attr] ?? 0);

// Resolve a role to its chosen attribute, falling back to a sensible default.
const axis = (ctx: ChartContext, role: string, fallbackIndex: number) =>
  ctx.axes[role] ?? ctx.numericalAttributes[fallbackIndex] ?? ctx.numericalAttributes[0];

const base = (p: ChartPalette): EChartsOption => ({
  color: p.colors,
  textStyle: { color: p.text },
  legend: { textStyle: { color: p.text }, type: "scroll", top: 0, left: "center" },
});

const axisStyle = (p: ChartPalette) => ({ color: p.axis, fontSize: 10 });

export const CHART_REGISTRY: ChartDef[] = [
  {
    key: "bar",
    label: "Grouped Bar",
    minNumeric: 1,
    roles: [],
    build: (ctx) => ({
      ...base(ctx.palette),
      tooltip: { trigger: "axis" },
      grid: { left: 50, right: 20, top: 40, bottom: 40 },
      xAxis: { type: "category", data: ctx.numericalAttributes, axisLabel: axisStyle(ctx.palette) },
      yAxis: { type: "value", axisLabel: axisStyle(ctx.palette) },
      series: ctx.items.map((item) => ({
        name: item,
        type: "bar",
        data: ctx.numericalAttributes.map((a) => val(ctx, item, a)),
      })),
    }),
  },
  {
    key: "hbar",
    label: "Horizontal Bar",
    minNumeric: 1,
    roles: [],
    build: (ctx) => ({
      ...base(ctx.palette),
      tooltip: { trigger: "axis" },
      grid: { left: 90, right: 20, top: 40, bottom: 40 },
      xAxis: { type: "value", axisLabel: axisStyle(ctx.palette) },
      yAxis: { type: "category", data: ctx.numericalAttributes, axisLabel: axisStyle(ctx.palette) },
      series: ctx.items.map((item) => ({
        name: item,
        type: "bar",
        data: ctx.numericalAttributes.map((a) => val(ctx, item, a)),
      })),
    }),
  },
  {
    key: "line",
    label: "Line",
    minNumeric: 1,
    roles: [],
    build: (ctx) => ({
      ...base(ctx.palette),
      tooltip: { trigger: "axis" },
      grid: { left: 50, right: 20, top: 40, bottom: 40 },
      xAxis: { type: "category", data: ctx.numericalAttributes, axisLabel: axisStyle(ctx.palette) },
      yAxis: { type: "value", axisLabel: axisStyle(ctx.palette) },
      series: ctx.items.map((item) => ({
        name: item,
        type: "line",
        data: ctx.numericalAttributes.map((a) => val(ctx, item, a)),
      })),
    }),
  },
  {
    key: "area",
    label: "Area",
    minNumeric: 1,
    roles: [],
    build: (ctx) => ({
      ...base(ctx.palette),
      tooltip: { trigger: "axis" },
      grid: { left: 50, right: 20, top: 40, bottom: 40 },
      xAxis: { type: "category", data: ctx.numericalAttributes, axisLabel: axisStyle(ctx.palette) },
      yAxis: { type: "value", axisLabel: axisStyle(ctx.palette) },
      series: ctx.items.map((item) => ({
        name: item,
        type: "line",
        areaStyle: {},
        data: ctx.numericalAttributes.map((a) => val(ctx, item, a)),
      })),
    }),
  },
  {
    key: "radar",
    label: "Radar",
    minNumeric: 1,
    roles: [],
    build: (ctx) => ({
      ...base(ctx.palette),
      tooltip: {},
      radar: {
        indicator: ctx.numericalAttributes.map((a) => ({
          name: a,
          max: Math.max(...ctx.items.map((it) => val(ctx, it, a))) || 1,
        })),
        axisName: { color: ctx.palette.axis, fontSize: 10 },
      },
      series: [
        {
          type: "radar",
          emphasis: { disabled: true },
          data: ctx.items.map((item) => ({
            name: item,
            value: ctx.numericalAttributes.map((a) => val(ctx, item, a)),
          })),
        },
      ],
    }),
  },
  {
    key: "scatter",
    label: "Scatter",
    minNumeric: 2,
    roles: [
      { id: "x", label: "X" },
      { id: "y", label: "Y" },
    ],
    build: (ctx) => {
      const xa = axis(ctx, "x", 0);
      const ya = axis(ctx, "y", 1);
      return {
        ...base(ctx.palette),
        tooltip: { trigger: "item" },
        grid: { left: 60, right: 30, top: 40, bottom: 56 },
        xAxis: {
          type: "value",
          name: xa,
          nameLocation: "middle",
          nameGap: 32,
          nameTextStyle: { color: ctx.palette.axis },
          axisLabel: axisStyle(ctx.palette),
        },
        yAxis: {
          type: "value",
          name: ya,
          nameLocation: "middle",
          nameGap: 44,
          nameTextStyle: { color: ctx.palette.axis },
          axisLabel: axisStyle(ctx.palette),
        },
        series: ctx.items.map((item) => ({
          name: item,
          type: "scatter",
          symbolSize: 16,
          data: [[val(ctx, item, xa), val(ctx, item, ya)]],
        })),
      };
    },
  },
  {
    key: "pie",
    label: "Pie",
    minNumeric: 1,
    roles: [{ id: "value", label: "Value" }],
    build: (ctx) => {
      const attr = axis(ctx, "value", 0);
      return {
        ...base(ctx.palette),
        tooltip: { trigger: "item" },
        series: [
          {
            type: "pie",
            radius: "60%",
            data: ctx.items.map((item) => ({ name: item, value: val(ctx, item, attr) })),
            label: { color: ctx.palette.text },
          },
        ],
      };
    },
  },
  {
    key: "doughnut",
    label: "Doughnut",
    minNumeric: 1,
    roles: [{ id: "value", label: "Value" }],
    build: (ctx) => {
      const attr = axis(ctx, "value", 0);
      return {
        ...base(ctx.palette),
        tooltip: { trigger: "item" },
        series: [
          {
            type: "pie",
            radius: ["40%", "65%"],
            data: ctx.items.map((item) => ({ name: item, value: val(ctx, item, attr) })),
            label: { color: ctx.palette.text },
          },
        ],
      };
    },
  },
  {
    key: "funnel",
    label: "Funnel",
    minNumeric: 1,
    roles: [{ id: "value", label: "Value" }],
    build: (ctx) => {
      const attr = axis(ctx, "value", 0);
      return {
        ...base(ctx.palette),
        tooltip: { trigger: "item" },
        series: [
          {
            type: "funnel",
            data: ctx.items.map((item) => ({ name: item, value: val(ctx, item, attr) })),
            label: { color: ctx.palette.text },
          },
        ],
      };
    },
  },
  {
    key: "heatmap",
    label: "Heatmap",
    minNumeric: 1,
    roles: [],
    build: (ctx) => {
      const data: [number, number, number][] = [];
      ctx.items.forEach((it, xi) =>
        ctx.numericalAttributes.forEach((a, yi) => data.push([xi, yi, val(ctx, it, a)]))
      );
      const values = data.map((d) => d[2]);
      return {
        tooltip: { position: "top" },
        grid: { left: 110, right: 20, top: 10, bottom: 70 },
        xAxis: { type: "category", data: ctx.items, axisLabel: { ...axisStyle(ctx.palette), rotate: 30 } },
        yAxis: { type: "category", data: ctx.numericalAttributes, axisLabel: axisStyle(ctx.palette) },
        visualMap: {
          min: Math.min(...values),
          max: Math.max(...values),
          calculable: true,
          orient: "horizontal",
          left: "center",
          bottom: 0,
          inRange: { color: [ctx.palette.colors[2], ctx.palette.colors[0]] },
          textStyle: { color: ctx.palette.text },
        },
        series: [{ type: "heatmap", data, label: { show: false } }],
      };
    },
  },
  {
    key: "treemap",
    label: "Treemap",
    minNumeric: 1,
    roles: [{ id: "value", label: "Value" }],
    build: (ctx) => {
      const attr = axis(ctx, "value", 0);
      return {
        ...base(ctx.palette),
        tooltip: { trigger: "item" },
        series: [
          {
            type: "treemap",
            data: ctx.items.map((item) => ({ name: item, value: val(ctx, item, attr) })),
          },
        ],
      };
    },
  },
];

// Applied to every built chart: kills the hover-emphasis flicker and keeps
// long category-axis labels from overlapping each other.
export function finalizeOption(option: EChartsOption): EChartsOption {
  const seriesList = Array.isArray(option.series)
    ? option.series
    : option.series
    ? [option.series]
    : [];
  seriesList.forEach((s) => {
    (s as { emphasis?: { disabled: boolean } }).emphasis = { disabled: true };
  });

  const fixCategoryAxis = (ax: unknown) => {
    if (
      ax &&
      typeof ax === "object" &&
      (ax as { type?: string }).type === "category"
    ) {
      const a = ax as { axisLabel?: Record<string, unknown> };
      a.axisLabel = {
        ...(a.axisLabel ?? {}),
        interval: 0,
        rotate: 20,
        hideOverlap: true,
        margin: 16,
      };
      // Give the rotated labels room so they aren't clipped at the bottom.
      if (
        option.grid &&
        typeof option.grid === "object" &&
        !Array.isArray(option.grid)
      ) {
        (option.grid as { bottom?: number }).bottom = 70;
      }
    }
  };
  fixCategoryAxis(option.xAxis);

  return option;
}

export const DEFAULT_CHART_KEYS = ["bar", "line", "radar", "scatter", "pie"];