"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Link,
  Button,
  Box,
  Typography,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import type { Question } from "@/lib/types";
import type { Status, ProgressMap } from "@/lib/useProgress";
import StatusBadge from "./StatusBadge";

interface QuestionTableProps {
  questions: Question[];
  progress: ProgressMap;
  onStatusChange: (id: number, status: Status) => void;
  isLoggedIn: boolean;
}

const DIFFICULTY_CHIP: Record<string, { bg: string; color: string }> = {
  Easy: { bg: "#0d2818", color: "#3fb950" },
  Medium: { bg: "#2a1f04", color: "#d29922" },
  Hard: { bg: "#2a0a09", color: "#f85149" },
};

const PAGE_SIZE = 50;

export default function QuestionTable({
  questions,
  progress,
  onStatusChange,
  isLoggedIn,
}: QuestionTableProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const visible = questions.slice(0, visibleCount);
  const hasMore = visibleCount < questions.length;

  if (questions.length === 0) {
    return (
      <Box sx={{ py: 10, textAlign: "center" }}>
        <Typography sx={{ color: "#484f58" }}>No questions match your filters.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1400, mx: "auto", px: { xs: 2, sm: 3 }, pb: 6 }}>
      <TableContainer sx={{ bgcolor: "transparent" }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ "& th": { fontWeight: 600, color: "#8b949e", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", borderColor: "#21262d" } }}>
              <TableCell width={50}>#</TableCell>
              <TableCell>Title</TableCell>
              <TableCell width={90}>Difficulty</TableCell>
              <TableCell width={90}>Acceptance</TableCell>
              <TableCell>Companies</TableCell>
              {isLoggedIn && <TableCell width={130}>Status</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {visible.map((q) => (
              <TableRow
                key={q.id}
                sx={{
                  "&:hover": { bgcolor: "#161b22" },
                  "& td": { borderColor: "#21262d", py: 1.2 },
                }}
              >
                <TableCell sx={{ fontFamily: "monospace", color: "#484f58", fontSize: "0.8rem" }}>
                  {q.id}
                </TableCell>
                <TableCell>
                  <Link
                    href={q.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="none"
                    sx={{
                      color: "#e6edf3",
                      fontWeight: 500,
                      fontSize: "0.85rem",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 0.5,
                      "&:hover": { color: "#58a6ff" },
                    }}
                  >
                    {q.title}
                    <OpenInNewIcon sx={{ fontSize: 12, color: "#484f58" }} />
                  </Link>
                </TableCell>
                <TableCell>
                  <Chip
                    label={q.difficulty}
                    size="small"
                    sx={{
                      bgcolor: DIFFICULTY_CHIP[q.difficulty]?.bg || "#21262d",
                      color: DIFFICULTY_CHIP[q.difficulty]?.color || "#8b949e",
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      height: 22,
                      border: "none",
                    }}
                  />
                </TableCell>
                <TableCell sx={{ color: "#8b949e", fontSize: "0.8rem" }}>{q.acceptance}</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {q.companies.slice(0, 3).map((c) => (
                      <Chip
                        key={c.name}
                        label={c.name}
                        size="small"
                        sx={{
                          bgcolor: "#21262d",
                          color: "#8b949e",
                          fontSize: "0.65rem",
                          height: 20,
                          border: "1px solid #30363d",
                        }}
                      />
                    ))}
                    {q.companies.length > 3 && (
                      <Chip
                        label={`+${q.companies.length - 3}`}
                        size="small"
                        sx={{
                          bgcolor: "transparent",
                          color: "#484f58",
                          fontSize: "0.65rem",
                          height: 20,
                          border: "1px solid #30363d",
                        }}
                      />
                    )}
                  </Box>
                </TableCell>
                {isLoggedIn && (
                  <TableCell>
                    <StatusBadge
                      status={progress[q.id] || ""}
                      onChange={(s) => onStatusChange(q.id, s)}
                    />
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {hasMore && (
        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            sx={{
              color: "#58a6ff",
              borderColor: "#30363d",
              "&:hover": { borderColor: "#58a6ff", bgcolor: "#161b22" },
            }}
          >
            Show more ({(questions.length - visibleCount).toLocaleString()} remaining)
          </Button>
        </Box>
      )}
    </Box>
  );
}
