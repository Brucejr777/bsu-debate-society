"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export interface TrendDataPoint {
  date: string; // e.g., "Week 1", "Oct 2023", or "2023-10-01"
  Bathala: number;
  Kabunian: number;
  Laon: number;
  Manama: number;
}

interface PointTrendChartProps {
  data: TrendDataPoint[];
}

// Adjusted for optimal visibility on a dark background while respecting house identities
const HOUSE_COLORS = {
  Bathala: "#FF8C00", // Orange
  Kabunian: "#E2E8F0", // Lighter Silver (original #C0C0C0 is too dark)
  Laon: "#4ADE80",    // Brighter Green (original #228B22)
  Manama: "#D946EF",  // Brighter Magenta (original #8B008B)
};

export default function PointTrendChart({ data }: PointTrendChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 text-center text-neutral-400 shadow-xl shadow-black/30">
        <p>No trend data available yet. Point accumulation will be visualized here over time.</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-xl shadow-black/30">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          Point Accumulation Trend
        </h3>
        <p className="text-xs text-neutral-500">
          Tracking cumulative points over time
        </p>
        </div>
        
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
            
            <XAxis
              dataKey="date"
              stroke="#737373"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: "#404040" }}
              tickMargin={10}
            />
            
            <YAxis
              stroke="#737373"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: "#404040" }}
              tickMargin={10}
              tickFormatter={(value) => `${value}`}
            />
            
            <Tooltip
              contentStyle={{
                backgroundColor: "#171717", // neutral-900
                border: "1px solid #262626", // neutral-800
                borderRadius: "0.75rem", // rounded-xl
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
              }}
              itemStyle={{ color: "#ffffff", fontWeight: 600 }}
              labelStyle={{ color: "#a3a3a3", marginBottom: "0.25rem", fontSize: "0.875rem" }}
              formatter={(value: number) => [`${value} pts`, ""]}
            />
            
            <Legend
              wrapperStyle={{ color: "#d4d4d8", paddingTop: "1rem", fontSize: "0.875rem" }}
              iconType="circle"
            />
            
            <Line
              type="monotone"
              dataKey="Bathala"
              stroke={HOUSE_COLORS.Bathala}
              strokeWidth={2.5}
              dot={{ r: 3, strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              name="House of Bathala"
            />
            <Line
              type="monotone"
              dataKey="Kabunian"
              stroke={HOUSE_COLORS.Kabunian}
              strokeWidth={2.5}
              dot={{ r: 3, strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              name="House of Kabunian"
            />
            <Line
              type="monotone"
              dataKey="Laon"
              stroke={HOUSE_COLORS.Laon}
              strokeWidth={2.5}
              dot={{ r: 3, strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              name="House of Laon"
            />
            <Line
              type="monotone"
              dataKey="Manama"
              stroke={HOUSE_COLORS.Manama}
              strokeWidth={2.5}
              dot={{ r: 3, strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              name="House of Manama"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}