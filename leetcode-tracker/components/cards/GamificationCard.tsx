"use client";

import { Box, Typography, LinearProgress, Chip } from "@mui/material";
import BoltIcon from "@mui/icons-material/Bolt";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import StarIcon from "@mui/icons-material/Star";
import DashboardCard from "./DashboardCard";
import type { GamificationStats } from "@/lib/useGamification";
import { xpForLevel, XP_VALUES } from "@/lib/useGamification";
import type { Question } from "@/lib/types";
import type { ProgressMap } from "@/lib/useProgress";

interface Props {
  stats: GamificationStats;
  questions: Question[];
  progress: ProgressMap;
}

function LevelRing({
  level,
  xp,
  size = 120,
  strokeWidth = 8,
}: {
  level: number;
  xp: number;
  size?: number;
  strokeWidth?: number;
}) {
  const currentLevelXP = xpForLevel(level);
  const nextLevelXP = xpForLevel(level + 1);
  const progressInLevel = xp - currentLevelXP;
  const xpNeeded = nextLevelXP - currentLevelXP;
  const pct = xpNeeded > 0 ? progressInLevel / xpNeeded : 0;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
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
          stroke="#bc8cff"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <Box sx={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <Typography variant="caption" sx={{ color: "#8b949e", fontSize: "0.6rem" }}>LEVEL</Typography>
        <Typography variant="h4" fontWeight={800} sx={{ color: "#bc8cff", lineHeight: 1 }}>
          {level}
        </Typography>
      </Box>
    </Box>
  );
}

export default function GamificationCard({ stats, questions, progress }: Props) {
  const currentLevelXP = xpForLevel(stats.level);
  const nextLevelXP = xpForLevel(stats.level + 1);
  const progressInLevel = stats.totalXP - currentLevelXP;
  const xpNeeded = nextLevelXP - currentLevelXP;

  const solvedCounts = { Easy: 0, Medium: 0, Hard: 0 };
  for (const q of questions) {
    if (progress[q.id] === "done" && solvedCounts[q.difficulty as keyof typeof solvedCounts] !== undefined) {
      solvedCounts[q.difficulty as keyof typeof solvedCounts]++;
    }
  }

  const xpBreakdown = [
    { label: "Easy", count: solvedCounts.Easy, xpEach: XP_VALUES.Easy, color: "#3fb950" },
    { label: "Medium", count: solvedCounts.Medium, xpEach: XP_VALUES.Medium, color: "#d29922" },
    { label: "Hard", count: solvedCounts.Hard, xpEach: XP_VALUES.Hard, color: "#f85149" },
  ];

  return (
    <DashboardCard title="XP & Level">
      <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
        <LevelRing level={stats.level} xp={stats.totalXP} />

        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <BoltIcon sx={{ fontSize: 16, color: "#bc8cff" }} />
            <Typography variant="body2" fontWeight={700} sx={{ color: "#e6edf3" }}>
              {stats.totalXP.toLocaleString()} XP
            </Typography>
          </Box>

          <Box sx={{ mb: 1.5 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.3 }}>
              <Typography variant="caption" sx={{ color: "#8b949e" }}>
                Next level
              </Typography>
              <Typography variant="caption" sx={{ color: "#484f58" }}>
                {progressInLevel}/{xpNeeded} XP
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={xpNeeded > 0 ? (progressInLevel / xpNeeded) * 100 : 0}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: "#21262d",
                "& .MuiLinearProgress-bar": { bgcolor: "#bc8cff", borderRadius: 3 },
              }}
            />
          </Box>

          {stats.dailyStreak > 0 && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1.5 }}>
              <LocalFireDepartmentIcon sx={{ fontSize: 16, color: "#f85149" }} />
              <Typography variant="caption" fontWeight={700} sx={{ color: "#f85149" }}>
                {stats.dailyStreak}-day streak
              </Typography>
            </Box>
          )}

          {xpBreakdown.map((d) => (
            <Box key={d.label} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 0.3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <StarIcon sx={{ fontSize: 12, color: d.color }} />
                <Typography variant="caption" sx={{ color: d.color }}>{d.label}</Typography>
              </Box>
              <Typography variant="caption" sx={{ color: "#484f58" }}>
                {d.count} x {d.xpEach} = <Box component="span" sx={{ color: "#8b949e" }}>{d.count * d.xpEach} XP</Box>
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </DashboardCard>
  );
}
