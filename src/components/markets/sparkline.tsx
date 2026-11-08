"use client";

import { Line, LineChart, ResponsiveContainer, YAxis } from "recharts";

interface SparklineProps {
  data: { date: string; close: number }[];
  positive?: boolean;
  className?: string;
}

export function Sparkline({ data, positive = true, className }: SparklineProps) {
  if (!data.length) {
    return (
      <div
        className={`flex h-10 items-center text-[10px] text-muted-foreground ${className ?? ""}`}
      >
        —
      </div>
    );
  }

  return (
    <div className={`h-10 w-full ${className ?? ""}`}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <YAxis domain={["dataMin", "dataMax"]} hide />
          <Line
            type="monotone"
            dataKey="close"
            stroke={positive ? "var(--accent)" : "#e11d48"}
            strokeWidth={1.75}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
