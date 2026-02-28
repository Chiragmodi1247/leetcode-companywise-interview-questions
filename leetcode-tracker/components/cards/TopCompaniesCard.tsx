"use client";

import { useMemo, useState } from "react";
import { Box, Typography, LinearProgress, Chip } from "@mui/material";
import DashboardCard from "./DashboardCard";
import type { Question } from "@/lib/types";
import type { ProgressMap } from "@/lib/useProgress";

interface Props {
  questions: Question[];
  progress: ProgressMap;
  topCompanies: string[];
}

const VISIBLE_COUNT = 10;

export default function TopCompaniesCard({ questions, progress, topCompanies }: Props) {
  const [showAll, setShowAll] = useState(false);

  const { companyStats, unsolved } = useMemo(() => {
    const map: Record<string, { total: number; done: number }> = {};
    for (const name of topCompanies) {
      map[name] = { total: 0, done: 0 };
    }

    const unsolvedList: Question[] = [];

    for (const q of questions) {
      const isTopQ = q.companies.some((c) => c.isTop);
      if (!isTopQ) continue;

      if (progress[q.id] !== "done") {
        unsolvedList.push(q);
      }

      for (const c of q.companies) {
        if (!c.isTop) continue;
        const entry = map[c.name];
        if (entry) {
          entry.total++;
          if (progress[q.id] === "done") entry.done++;
        }
      }
    }

    const sorted = Object.entries(map)
      .filter(([, v]) => v.total > 0)
      .sort((a, b) => b[1].total - a[1].total);

    return { companyStats: sorted, unsolved: unsolvedList };
  }, [questions, progress, topCompanies]);

  const visible = showAll ? companyStats : companyStats.slice(0, VISIBLE_COUNT);

  return (
    <DashboardCard title="Top Companies" randomPool={unsolved}>
      <Box sx={{ maxHeight: 320, overflowY: "auto", pr: 0.5, "&::-webkit-scrollbar": { width: 4 }, "&::-webkit-scrollbar-thumb": { bgcolor: "#30363d", borderRadius: 2 } }}>
        {visible.map(([name, s]) => {
          const pct = s.total > 0 ? (s.done / s.total) * 100 : 0;
          return (
            <Box key={name} sx={{ mb: 1.5 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.3 }}>
                <Typography variant="caption" fontWeight={500} sx={{ color: "#e6edf3" }}>
                  {name}
                </Typography>
                <Typography variant="caption" sx={{ color: "#484f58" }}>
                  {s.done}/{s.total}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={pct}
                sx={{
                  height: 5,
                  borderRadius: 3,
                  bgcolor: "#21262d",
                  "& .MuiLinearProgress-bar": { bgcolor: "#388bfd", borderRadius: 3 },
                }}
              />
            </Box>
          );
        })}
      </Box>
      {companyStats.length > VISIBLE_COUNT && (
        <Chip
          label={showAll ? "Show less" : `+${companyStats.length - VISIBLE_COUNT} more`}
          size="small"
          onClick={() => setShowAll(!showAll)}
          sx={{ mt: 1, bgcolor: "#21262d", color: "#8b949e", fontSize: "0.7rem", cursor: "pointer", border: "1px solid #30363d", "&:hover": { borderColor: "#58a6ff" } }}
        />
      )}
    </DashboardCard>
  );
}
