"use client";

import { useMemo } from "react";
import { Box, Typography, Link, Chip } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import DashboardCard from "./DashboardCard";
import type { Question } from "@/lib/types";
import type { ProgressMap } from "@/lib/useProgress";

interface Props {
  questions: Question[];
  progress: ProgressMap;
}

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  todo: { label: "Todo", color: "#58a6ff" },
  in_progress: { label: "In Progress", color: "#d29922" },
  done: { label: "Done", color: "#3fb950" },
  revisit: { label: "Revisit", color: "#bc8cff" },
};

export default function RecentActivityCard({ questions, progress }: Props) {
  const { tracked, revisitPool } = useMemo(() => {
    const qMap = new Map<number, Question>();
    for (const q of questions) qMap.set(q.id, q);

    const items: { question: Question; status: string }[] = [];
    const revisit: Question[] = [];

    for (const [idStr, status] of Object.entries(progress)) {
      if (!status) continue;
      const id = parseInt(idStr, 10);
      const q = qMap.get(id);
      if (!q) continue;
      items.push({ question: q, status });
      if (status === "revisit") revisit.push(q);
    }

    return { tracked: items.slice(0, 10), revisitPool: revisit };
  }, [questions, progress]);

  if (tracked.length === 0) {
    return (
      <DashboardCard title="Recent Activity">
        <Box sx={{ py: 4, textAlign: "center" }}>
          <Typography variant="body2" sx={{ color: "#484f58" }}>
            No activity yet. Start solving problems!
          </Typography>
        </Box>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard title="Recent Activity" randomPool={revisitPool.length > 0 ? revisitPool : undefined}>
      <Box sx={{ maxHeight: 320, overflowY: "auto", pr: 0.5, "&::-webkit-scrollbar": { width: 4 }, "&::-webkit-scrollbar-thumb": { bgcolor: "#30363d", borderRadius: 2 } }}>
        {tracked.map(({ question: q, status }) => {
          const meta = STATUS_LABEL[status] || STATUS_LABEL.todo;
          return (
            <Box
              key={q.id}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                py: 0.8,
                borderBottom: "1px solid #21262d",
                "&:last-child": { borderBottom: "none" },
              }}
            >
              <Link
                href={q.url}
                target="_blank"
                rel="noopener noreferrer"
                underline="none"
                sx={{
                  color: "#e6edf3",
                  fontSize: "0.78rem",
                  fontWeight: 500,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.5,
                  flex: 1,
                  minWidth: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  "&:hover": { color: "#58a6ff" },
                }}
              >
                {q.title}
                <OpenInNewIcon sx={{ fontSize: 10, color: "#484f58", flexShrink: 0 }} />
              </Link>
              <Chip
                label={meta.label}
                size="small"
                sx={{
                  ml: 1,
                  bgcolor: "transparent",
                  color: meta.color,
                  fontSize: "0.65rem",
                  height: 20,
                  border: `1px solid ${meta.color}44`,
                  flexShrink: 0,
                }}
              />
            </Box>
          );
        })}
      </Box>
      {revisitPool.length > 0 && (
        <Typography variant="caption" sx={{ color: "#bc8cff", mt: 1.5, display: "block" }}>
          {revisitPool.length} question{revisitPool.length !== 1 ? "s" : ""} marked for revisit
        </Typography>
      )}
    </DashboardCard>
  );
}
