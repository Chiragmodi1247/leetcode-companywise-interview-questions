"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Link,
  Button,
  Box,
  Typography,
} from "@mui/material";
import type { Question } from "@/lib/types";
import type { Status, ProgressMap } from "@/lib/useProgress";
import StatusBadge from "./StatusBadge";

interface QuestionTableProps {
  questions: Question[];
  progress: ProgressMap;
  onStatusChange: (id: number, status: Status) => void;
  isLoggedIn: boolean;
}

const DIFFICULTY_COLOR: Record<string, "success" | "warning" | "error"> = {
  Easy: "success",
  Medium: "warning",
  Hard: "error",
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
      <Box sx={{ py: 8, textAlign: "center" }}>
        <Typography color="text.secondary">No questions match your filters.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ px: { xs: 2, sm: 3 }, pb: 4 }}>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow sx={{ "& th": { fontWeight: 700 } }}>
              <TableCell width={60}>#</TableCell>
              <TableCell>Title</TableCell>
              <TableCell width={100}>Difficulty</TableCell>
              <TableCell width={100}>Acceptance</TableCell>
              <TableCell>Companies</TableCell>
              {isLoggedIn && <TableCell width={140}>Status</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {visible.map((q) => (
              <TableRow key={q.id} hover>
                <TableCell sx={{ fontFamily: "monospace", color: "text.secondary" }}>
                  {q.id}
                </TableCell>
                <TableCell>
                  <Link
                    href={q.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="hover"
                    fontWeight={500}
                  >
                    {q.title}
                  </Link>
                </TableCell>
                <TableCell>
                  <Chip
                    label={q.difficulty}
                    size="small"
                    color={DIFFICULTY_COLOR[q.difficulty] || "default"}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell sx={{ color: "text.secondary" }}>{q.acceptance}</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {q.companies.slice(0, 3).map((c) => (
                      <Chip key={c.name} label={c.name} size="small" variant="filled" sx={{ fontSize: "0.7rem" }} />
                    ))}
                    {q.companies.length > 3 && (
                      <Chip label={`+${q.companies.length - 3}`} size="small" variant="outlined" sx={{ fontSize: "0.7rem" }} />
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
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Button variant="outlined" onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}>
            Show more ({(questions.length - visibleCount).toLocaleString()} remaining)
          </Button>
        </Box>
      )}
    </Box>
  );
}
