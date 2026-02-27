"use client";

import type { User } from "firebase/auth";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Box,
  Chip,
  Skeleton,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import LogoutIcon from "@mui/icons-material/Logout";

interface HeaderProps {
  user: User | null;
  loading: boolean;
  onSignIn: () => void;
  onSignOut: () => void;
}

export default function Header({ user, loading, onSignIn, onSignOut }: HeaderProps) {
  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography variant="h6" fontWeight={700}>
            LeetCode Tracker
          </Typography>
          <Chip label="3,310 questions" size="small" color="warning" variant="outlined" />
        </Box>

        {loading ? (
          <Skeleton variant="rounded" width={120} height={36} />
        ) : user ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar
              src={user.photoURL || undefined}
              alt={user.displayName || ""}
              sx={{ width: 32, height: 32 }}
              imgProps={{ referrerPolicy: "no-referrer" }}
            />
            <Typography variant="body2" sx={{ display: { xs: "none", sm: "block" } }}>
              {user.displayName}
            </Typography>
            <Button
              size="small"
              variant="outlined"
              startIcon={<LogoutIcon />}
              onClick={onSignOut}
            >
              Sign out
            </Button>
          </Box>
        ) : (
          <Button variant="contained" startIcon={<GoogleIcon />} onClick={onSignIn}>
            Sign in with Google
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
