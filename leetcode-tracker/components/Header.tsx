"use client";

import type { User } from "firebase/auth";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Box,
  Skeleton,
  IconButton,
  Chip,
  LinearProgress,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import ListAltIcon from "@mui/icons-material/ListAlt";
import BoltIcon from "@mui/icons-material/Bolt";
import type { GamificationStats } from "@/lib/useGamification";
import { xpForLevel } from "@/lib/useGamification";

interface HeaderProps {
  user: User | null;
  loading: boolean;
  onSignIn: () => void;
  onSignOut: () => void;
  view: "dashboard" | "problems";
  onViewChange: (v: "dashboard" | "problems") => void;
  gamification?: GamificationStats;
}

export default function Header({ user, loading, onSignIn, onSignOut, view, onViewChange, gamification }: HeaderProps) {
  const currentLevelXP = gamification ? xpForLevel(gamification.level) : 0;
  const nextLevelXP = gamification ? xpForLevel(gamification.level + 1) : 1;
  const pct = gamification
    ? ((gamification.totalXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100
    : 0;

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{ bgcolor: "#0d1117", borderBottom: "1px solid #21262d" }}
    >
      <Toolbar sx={{ justifyContent: "space-between", maxWidth: 1400, width: "100%", mx: "auto" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Button
            startIcon={<HomeIcon sx={{ fontSize: 18 }} />}
            onClick={() => onViewChange("dashboard")}
            sx={{
              color: view === "dashboard" ? "#58a6ff" : "#8b949e",
              fontWeight: 600,
              fontSize: "0.9rem",
              "&:hover": { bgcolor: "#161b22" },
            }}
          >
            Home
          </Button>
          <Button
            startIcon={<ListAltIcon sx={{ fontSize: 18 }} />}
            onClick={() => onViewChange("problems")}
            sx={{
              color: view === "problems" ? "#58a6ff" : "#8b949e",
              fontWeight: 600,
              fontSize: "0.9rem",
              "&:hover": { bgcolor: "#161b22" },
            }}
          >
            Problems
          </Button>
        </Box>

        {loading ? (
          <Skeleton variant="rounded" width={100} height={34} sx={{ bgcolor: "#21262d" }} />
        ) : user ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {gamification && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mr: 1 }}>
                <Chip
                  label={`Lv ${gamification.level}`}
                  size="small"
                  sx={{
                    bgcolor: "#1c1229",
                    color: "#bc8cff",
                    fontWeight: 700,
                    fontSize: "0.7rem",
                    height: 22,
                    border: "1px solid #bc8cff33",
                  }}
                />
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, width: 80 }}>
                  <BoltIcon sx={{ fontSize: 14, color: "#bc8cff" }} />
                  <LinearProgress
                    variant="determinate"
                    value={pct}
                    sx={{
                      flex: 1,
                      height: 4,
                      borderRadius: 2,
                      bgcolor: "#21262d",
                      "& .MuiLinearProgress-bar": { bgcolor: "#bc8cff", borderRadius: 2 },
                    }}
                  />
                </Box>
                <Typography variant="caption" sx={{ color: "#484f58", display: { xs: "none", md: "block" } }}>
                  {gamification.totalXP} XP
                </Typography>
              </Box>
            )}
            <Avatar
              src={user.photoURL || undefined}
              alt={user.displayName || ""}
              sx={{ width: 28, height: 28, border: "1px solid #30363d" }}
              imgProps={{ referrerPolicy: "no-referrer" }}
            />
            <Typography variant="body2" sx={{ color: "#8b949e", display: { xs: "none", sm: "block" } }}>
              {user.displayName}
            </Typography>
            <IconButton size="small" onClick={onSignOut} sx={{ color: "#8b949e", "&:hover": { color: "#f85149" } }}>
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Box>
        ) : (
          <Button
            variant="outlined"
            size="small"
            startIcon={<LoginIcon />}
            onClick={onSignIn}
            sx={{
              color: "#58a6ff",
              borderColor: "#30363d",
              "&:hover": { borderColor: "#58a6ff", bgcolor: "#161b22" },
            }}
          >
            Sign In
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
