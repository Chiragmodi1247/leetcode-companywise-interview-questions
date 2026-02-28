"use client";

import { Box, Typography, Button } from "@mui/material";
import CasinoIcon from "@mui/icons-material/Casino";
import type { Question } from "@/lib/types";

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  randomPool?: Question[];
}

function pickRandom(pool: Question[]) {
  if (pool.length === 0) return;
  const q = pool[Math.floor(Math.random() * pool.length)];
  window.open(q.url, "_blank");
}

export default function DashboardCard({ title, children, randomPool }: DashboardCardProps) {
  return (
    <Box
      sx={{
        border: "1px solid #21262d",
        borderRadius: 2,
        bgcolor: "#161b22",
        p: 3,
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="subtitle1" fontWeight={700} sx={{ color: "#e6edf3" }}>
          {title}
        </Typography>
        {randomPool && randomPool.length > 0 && (
          <Button
            size="small"
            startIcon={<CasinoIcon sx={{ fontSize: 14 }} />}
            onClick={() => pickRandom(randomPool)}
            sx={{
              color: "#bc8cff",
              fontSize: "0.7rem",
              border: "1px solid #30363d",
              "&:hover": { borderColor: "#bc8cff", bgcolor: "#1c1229" },
            }}
          >
            Random
          </Button>
        )}
      </Box>
      <Box sx={{ flex: 1 }}>{children}</Box>
    </Box>
  );
}
