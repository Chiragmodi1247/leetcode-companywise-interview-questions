"use client";

import { Box, Typography, Button, Grid } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import OverallProgressCard from "./cards/OverallProgressCard";
import TopCompaniesCard from "./cards/TopCompaniesCard";
import TrendingCard from "./cards/TrendingCard";
import GamificationCard from "./cards/GamificationCard";
import type { Question, TrendingQuestion } from "@/lib/types";
import type { ProgressMap, Status } from "@/lib/useProgress";
import type { GamificationStats } from "@/lib/useGamification";

interface DashboardProps {
  questions: Question[];
  progress: ProgressMap;
  topCompanies: string[];
  trending: TrendingQuestion[];
  isLoggedIn: boolean;
  onSignIn: () => void;
  onViewProblems: () => void;
  gamification: GamificationStats;
  onStatusChange: (questionId: number, status: Status) => void;
}

export default function Dashboard({
  questions,
  progress,
  topCompanies,
  trending,
  isLoggedIn,
  onSignIn,
  onViewProblems,
  gamification,
  onStatusChange,
}: DashboardProps) {
  if (!isLoggedIn) {
    return (
      <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, sm: 3 }, py: 5 }}>
        <Typography variant="h5" fontWeight={700} sx={{ color: "#e6edf3", mb: 1 }}>
          Dashboard
        </Typography>
        <Typography variant="body2" sx={{ color: "#8b949e", mb: 4 }}>
          Sign in to start tracking your progress.
        </Typography>
        <Box
          sx={{
            border: "1px solid #21262d",
            borderRadius: 2,
            p: 5,
            textAlign: "center",
            bgcolor: "#161b22",
          }}
        >
          <Typography variant="body1" sx={{ color: "#8b949e", mb: 2 }}>
            Sign in to see your dashboard
          </Typography>
          <Button
            variant="outlined"
            startIcon={<LoginIcon />}
            onClick={onSignIn}
            sx={{
              color: "#58a6ff",
              borderColor: "#30363d",
              "&:hover": { borderColor: "#58a6ff", bgcolor: "#0d1117" },
            }}
          >
            Sign in with Google
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, sm: 3 }, py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={700} sx={{ color: "#e6edf3" }}>
            Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: "#8b949e" }}>
            Track your LeetCode preparation across 662 companies.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          size="small"
          onClick={onViewProblems}
          sx={{
            color: "#58a6ff",
            borderColor: "#30363d",
            "&:hover": { borderColor: "#58a6ff", bgcolor: "#161b22" },
          }}
        >
          Browse Problems
        </Button>
      </Box>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 6 }}>
          <OverallProgressCard questions={questions} progress={progress} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <GamificationCard stats={gamification} questions={questions} progress={progress} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TrendingCard trending={trending} progress={progress} onStatusChange={onStatusChange} isLoggedIn={isLoggedIn} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TopCompaniesCard questions={questions} progress={progress} topCompanies={topCompanies} />
        </Grid>
      </Grid>
    </Box>
  );
}
