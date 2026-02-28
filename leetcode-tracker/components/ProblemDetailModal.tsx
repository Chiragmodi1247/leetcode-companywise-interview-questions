"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Chip,
  Link,
  IconButton,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import BusinessIcon from "@mui/icons-material/Business";
import StatusBadge from "./StatusBadge";
import type { TrendingQuestion } from "@/lib/types";
import type { Status } from "@/lib/useProgress";

interface Props {
  question: TrendingQuestion | null;
  open: boolean;
  onClose: () => void;
  status: Status;
  onStatusChange: (questionId: number, status: Status) => void;
  isLoggedIn: boolean;
}

const DIFF_COLORS: Record<string, { color: string; bg: string }> = {
  Easy: { color: "#3fb950", bg: "#0d2818" },
  Medium: { color: "#d29922", bg: "#2a1f04" },
  Hard: { color: "#f85149", bg: "#2a0a09" },
};

export default function ProblemDetailModal({
  question,
  open,
  onClose,
  status,
  onStatusChange,
  isLoggedIn,
}: Props) {
  if (!question) return null;

  const dc = DIFF_COLORS[question.difficulty] || DIFF_COLORS.Medium;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "#161b22",
          border: "1px solid #30363d",
          borderRadius: 2,
          backgroundImage: "none",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flex: 1, minWidth: 0 }}>
          <Chip
            label={question.difficulty}
            size="small"
            sx={{
              bgcolor: dc.bg,
              color: dc.color,
              fontSize: "0.7rem",
              fontWeight: 700,
              height: 24,
              flexShrink: 0,
            }}
          />
          <Typography
            variant="subtitle1"
            fontWeight={700}
            sx={{
              color: "#e6edf3",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {question.title}
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose} sx={{ color: "#8b949e", ml: 1 }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2.5 }}>
          <Link
            href={question.url}
            target="_blank"
            rel="noopener noreferrer"
            underline="none"
            sx={{
              color: "#58a6ff",
              fontSize: "0.85rem",
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5,
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Open on LeetCode
            <OpenInNewIcon sx={{ fontSize: 14 }} />
          </Link>

          {question.acceptance && (
            <Typography variant="caption" sx={{ color: "#484f58" }}>
              Acceptance: {question.acceptance}
            </Typography>
          )}
        </Box>

        {isLoggedIn && (
          <Box sx={{ mb: 2.5 }}>
            <Typography variant="caption" sx={{ color: "#8b949e", mb: 0.5, display: "block" }}>
              Status
            </Typography>
            <StatusBadge
              status={status}
              onChange={(s) => onStatusChange(question.id, s)}
            />
          </Box>
        )}

        <Divider sx={{ borderColor: "#21262d", mb: 2 }} />

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1.5 }}>
          <BusinessIcon sx={{ fontSize: 16, color: "#8b949e" }} />
          <Typography variant="body2" fontWeight={600} sx={{ color: "#e6edf3" }}>
            Companies ({question.trendingCompanies.length})
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8 }}>
          {question.trendingCompanies.map((c) => (
            <Chip
              key={c.name}
              label={`${c.name} (${c.frequency})`}
              size="small"
              sx={{
                bgcolor: "#21262d",
                color: "#8b949e",
                fontSize: "0.75rem",
                border: "1px solid #30363d",
                "&:hover": { borderColor: "#58a6ff" },
              }}
            />
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
