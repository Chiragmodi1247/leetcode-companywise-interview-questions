"use client";

import { useMemo } from "react";
import { Box, Typography, LinearProgress } from "@mui/material";
import DashboardCard from "./DashboardCard";
import type { Question } from "@/lib/types";
import type { ProgressMap } from "@/lib/useProgress";

interface Props {
  questions: Question[];
  progress: ProgressMap;
}

function CircularRing({
  solved,
  total,
  size = 140,
  strokeWidth = 8,
}: {
  solved: number;
  total: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = total > 0 ? solved / total : 0;
  const offset = circumference * (1 - pct);

  return (
    <Box sx={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#21262d" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#58a6ff"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <Box sx={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <Typography variant="h4" fontWeight={700} sx={{ color: "#e6edf3", lineHeight: 1 }}>
          {solved}
        </Typography>
        <Typography variant="caption" sx={{ color: "#484f58", mt: 0.5 }}>
          / {total}
        </Typography>
      </Box>
    </Box>
  );
}

const DIFFICULTIES = [
  { key: "Easy", color: "#3fb950", bg: "#238636", track: "#0d2818" },
  { key: "Medium", color: "#d29922", bg: "#9e6a03", track: "#2a1f04" },
  { key: "Hard", color: "#f85149", bg: "#da3633", track: "#2a0a09" },
] as const;

export default function OverallProgressCard({ questions, progress }: Props) {
  const { stats, totalDone, unsolved } = useMemo(() => {
    const s: Record<string, { total: number; done: number }> = {
      Easy: { total: 0, done: 0 },
      Medium: { total: 0, done: 0 },
      Hard: { total: 0, done: 0 },
    };
    let done = 0;
    const unsolvedList: Question[] = [];

    for (const q of questions) {
      if (s[q.difficulty]) {
        s[q.difficulty].total++;
        if (progress[q.id] === "done") {
          s[q.difficulty].done++;
          done++;
        } else {
          unsolvedList.push(q);
        }
      }
    }
    return { stats: s, totalDone: done, unsolved: unsolvedList };
  }, [questions, progress]);

  return (
    <DashboardCard title="Overall Progress" randomPool={unsolved}>
      <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
        <CircularRing solved={totalDone} total={questions.length} />
        <Box sx={{ flex: 1 }}>
          {DIFFICULTIES.map((d) => {
            const pct = stats[d.key].total > 0 ? (stats[d.key].done / stats[d.key].total) * 100 : 0;
            return (
              <Box key={d.key} sx={{ mb: 1.5 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.3 }}>
                  <Typography variant="caption" fontWeight={600} sx={{ color: d.color }}>
                    {d.key}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#8b949e" }}>
                    <Box component="span" sx={{ color: d.color, fontWeight: 700 }}>{stats[d.key].done}</Box>
                    {" / "}{stats[d.key].total}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={pct}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    bgcolor: d.track,
                    "& .MuiLinearProgress-bar": { bgcolor: d.bg, borderRadius: 3 },
                  }}
                />
              </Box>
            );
          })}
        </Box>
      </Box>
    </DashboardCard>
  );
}
