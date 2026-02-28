"use client";

import { useMemo, useState } from "react";
import { Box, Typography, Chip } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import DashboardCard from "./DashboardCard";
import ProblemDetailModal from "../ProblemDetailModal";
import type { TrendingQuestion } from "@/lib/types";
import type { ProgressMap, Status } from "@/lib/useProgress";

interface Props {
  trending: TrendingQuestion[];
  progress: ProgressMap;
  onStatusChange?: (questionId: number, status: Status) => void;
  isLoggedIn?: boolean;
}

const DIFF_COLOR: Record<string, { color: string; bg: string }> = {
  Easy: { color: "#3fb950", bg: "#0d2818" },
  Medium: { color: "#d29922", bg: "#2a1f04" },
  Hard: { color: "#f85149", bg: "#2a0a09" },
};

const STATUS_INDICATOR: Record<string, { color: string; label: string }> = {
  in_progress: { color: "#d29922", label: "In Progress" },
  done: { color: "#3fb950", label: "Done" },
  revisit: { color: "#bc8cff", label: "Revisit" },
  todo: { color: "#58a6ff", label: "Todo" },
};

const VISIBLE_COUNT = 12;

export default function TrendingCard({ trending, progress, onStatusChange, isLoggedIn = false }: Props) {
  const [showAll, setShowAll] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<TrendingQuestion | null>(null);

  const { sorted, randomPool } = useMemo(() => {
    const inProgress: TrendingQuestion[] = [];
    const rest: TrendingQuestion[] = [];

    for (const q of trending) {
      if (progress[q.id] === "in_progress") {
        inProgress.push(q);
      } else {
        rest.push(q);
      }
    }

    const sorted = [...inProgress, ...rest];
    const pool = sorted.filter((q) => progress[q.id] !== "done");
    return { sorted, randomPool: pool };
  }, [trending, progress]);

  const visible = showAll ? sorted : sorted.slice(0, VISIBLE_COUNT);

  const asQuestions = randomPool.map((q) => ({
    ...q,
    companies: q.trendingCompanies.map((c) => ({ ...c, isTop: true })),
  }));

  return (
    <>
      <DashboardCard title="Trending — Last 30 Days" randomPool={asQuestions}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
          <TrendingUpIcon sx={{ fontSize: 16, color: "#f0883e" }} />
          <Typography variant="caption" sx={{ color: "#8b949e" }}>
            {sorted.length} questions asked at top companies recently
          </Typography>
        </Box>

        <Box sx={{ maxHeight: 300, overflowY: "auto", pr: 0.5, "&::-webkit-scrollbar": { width: 4 }, "&::-webkit-scrollbar-thumb": { bgcolor: "#30363d", borderRadius: 2 } }}>
          {visible.map((q) => {
            const status = progress[q.id] || "";
            const isDone = status === "done";
            const isIP = status === "in_progress";
            const dm = DIFF_COLOR[q.difficulty] || DIFF_COLOR.Medium;
            const si = STATUS_INDICATOR[status];

            return (
              <Box
                key={q.id}
                onClick={() => setSelectedQuestion(q)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  py: 0.7,
                  px: 0.5,
                  borderBottom: "1px solid #21262d",
                  "&:last-child": { borderBottom: "none" },
                  opacity: isDone ? 0.4 : 1,
                  cursor: "pointer",
                  borderRadius: 1,
                  borderLeft: isIP ? "2px solid #d29922" : "2px solid transparent",
                  "&:hover": { bgcolor: "#1c2128" },
                  transition: "background-color 0.15s",
                }}
              >
                {isIP && (
                  <PlayArrowIcon sx={{ fontSize: 14, color: "#d29922", flexShrink: 0 }} />
                )}
                <Chip
                  label={q.difficulty[0]}
                  size="small"
                  sx={{
                    bgcolor: dm.bg,
                    color: dm.color,
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    width: 24,
                    height: 20,
                    "& .MuiChip-label": { px: 0 },
                    flexShrink: 0,
                  }}
                />
                <Typography
                  sx={{
                    color: isDone ? "#484f58" : "#e6edf3",
                    fontSize: "0.78rem",
                    fontWeight: 500,
                    flex: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    textDecoration: isDone ? "line-through" : "none",
                  }}
                >
                  {q.title}
                </Typography>
                {si && (
                  <Chip
                    label={si.label}
                    size="small"
                    sx={{
                      bgcolor: "transparent",
                      color: si.color,
                      fontSize: "0.6rem",
                      fontWeight: 600,
                      height: 18,
                      border: `1px solid ${si.color}44`,
                      "& .MuiChip-label": { px: 0.5 },
                      flexShrink: 0,
                    }}
                  />
                )}
                <Box sx={{ display: "flex", gap: 0.3, flexShrink: 0 }}>
                  {q.trendingCompanies.slice(0, 2).map((c) => (
                    <Chip
                      key={c.name}
                      label={c.name}
                      size="small"
                      sx={{
                        bgcolor: "#21262d",
                        color: "#8b949e",
                        fontSize: "0.6rem",
                        height: 18,
                        border: "1px solid #30363d",
                        "& .MuiChip-label": { px: 0.5 },
                      }}
                    />
                  ))}
                  {q.trendingCompanies.length > 2 && (
                    <Chip
                      label={`+${q.trendingCompanies.length - 2}`}
                      size="small"
                      sx={{
                        bgcolor: "transparent",
                        color: "#484f58",
                        fontSize: "0.6rem",
                        height: 18,
                        border: "1px solid #30363d",
                        "& .MuiChip-label": { px: 0.3 },
                      }}
                    />
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>

        {sorted.length > VISIBLE_COUNT && (
          <Chip
            label={showAll ? "Show less" : `+${sorted.length - VISIBLE_COUNT} more`}
            size="small"
            onClick={() => setShowAll(!showAll)}
            sx={{ mt: 1, bgcolor: "#21262d", color: "#8b949e", fontSize: "0.7rem", cursor: "pointer", border: "1px solid #30363d", "&:hover": { borderColor: "#f0883e" } }}
          />
        )}
      </DashboardCard>

      <ProblemDetailModal
        question={selectedQuestion}
        open={!!selectedQuestion}
        onClose={() => setSelectedQuestion(null)}
        status={selectedQuestion ? (progress[selectedQuestion.id] || "") : ""}
        onStatusChange={onStatusChange || (() => {})}
        isLoggedIn={isLoggedIn}
      />
    </>
  );
}
