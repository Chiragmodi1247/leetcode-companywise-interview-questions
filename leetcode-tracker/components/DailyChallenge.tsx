"use client";

import { useMemo } from "react";
import { Box, Typography, Button, Chip, Link } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import BoltIcon from "@mui/icons-material/Bolt";
import type { TrendingQuestion } from "@/lib/types";
import { XP_VALUES, DAILY_BONUS } from "@/lib/useGamification";

interface DailyChallengeProps {
  trending: TrendingQuestion[];
  isDailyCompleted: boolean;
  streak: number;
  onComplete: (questionId: number, difficulty: string) => void;
}

function getDailyChallenge(trending: TrendingQuestion[]): TrendingQuestion | null {
  const mediums = trending.filter((q) => q.difficulty === "Medium");
  if (mediums.length === 0) return null;
  const date = new Date().toISOString().slice(0, 10);
  let hash = 0;
  for (const ch of date) hash = (hash * 31 + ch.charCodeAt(0)) | 0;
  return mediums[Math.abs(hash) % mediums.length];
}

const DIFF_COLORS: Record<string, { color: string; bg: string }> = {
  Easy: { color: "#3fb950", bg: "#0d2818" },
  Medium: { color: "#d29922", bg: "#2a1f04" },
  Hard: { color: "#f85149", bg: "#2a0a09" },
};

export default function DailyChallenge({
  trending,
  isDailyCompleted,
  streak,
  onComplete,
}: DailyChallengeProps) {
  const challenge = useMemo(() => getDailyChallenge(trending), [trending]);

  if (!challenge) return null;

  const dc = DIFF_COLORS[challenge.difficulty] || DIFF_COLORS.Medium;
  const reward = (XP_VALUES[challenge.difficulty] || 0) + DAILY_BONUS;

  return (
    <Box
      sx={{
        maxWidth: 1400,
        mx: "auto",
        px: { xs: 2, sm: 3 },
        pt: 2,
      }}
    >
      <Box
        sx={{
          border: "1px solid #21262d",
          borderRadius: 2,
          bgcolor: "#161b22",
          px: 3,
          py: 2,
          display: "flex",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <BoltIcon sx={{ color: "#f0883e", fontSize: 20 }} />
          <Typography variant="body2" fontWeight={700} sx={{ color: "#f0883e" }}>
            Daily Challenge
          </Typography>
        </Box>

        <Chip
          label={challenge.difficulty}
          size="small"
          sx={{ bgcolor: dc.bg, color: dc.color, fontSize: "0.7rem", fontWeight: 600, height: 22 }}
        />

        <Link
          href={challenge.url}
          target="_blank"
          rel="noopener noreferrer"
          underline="none"
          sx={{
            color: "#e6edf3",
            fontWeight: 500,
            fontSize: "0.9rem",
            flex: 1,
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
            "&:hover": { color: "#58a6ff" },
          }}
        >
          {challenge.title}
          <OpenInNewIcon sx={{ fontSize: 12, color: "#484f58" }} />
        </Link>

        <Chip
          label={`+${reward} XP`}
          size="small"
          sx={{ bgcolor: "#1c1229", color: "#bc8cff", fontSize: "0.7rem", fontWeight: 600, height: 22 }}
        />

        {streak > 0 && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.3 }}>
            <LocalFireDepartmentIcon sx={{ fontSize: 16, color: "#f85149" }} />
            <Typography variant="caption" fontWeight={700} sx={{ color: "#f85149" }}>
              {streak}
            </Typography>
          </Box>
        )}

        {isDailyCompleted ? (
          <Chip
            icon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
            label="Completed"
            size="small"
            sx={{ bgcolor: "#0d2818", color: "#3fb950", fontSize: "0.7rem", fontWeight: 600, height: 26 }}
          />
        ) : (
          <Button
            size="small"
            variant="outlined"
            onClick={() => onComplete(challenge.id, challenge.difficulty)}
            sx={{
              color: "#f0883e",
              borderColor: "#f0883e44",
              fontSize: "0.75rem",
              "&:hover": { borderColor: "#f0883e", bgcolor: "#2a1a0a" },
            }}
          >
            Complete
          </Button>
        )}
      </Box>
    </Box>
  );
}
