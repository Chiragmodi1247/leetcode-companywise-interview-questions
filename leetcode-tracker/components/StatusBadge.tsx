"use client";

import { Select, MenuItem } from "@mui/material";
import type { Status } from "@/lib/useProgress";

interface StatusBadgeProps {
  status: Status;
  onChange: (s: Status) => void;
  disabled?: boolean;
}

const STATUS_OPTIONS: { value: Status; label: string; color: string }[] = [
  { value: "", label: "—", color: "text.secondary" },
  { value: "todo", label: "Todo", color: "info.main" },
  { value: "in_progress", label: "In Progress", color: "warning.main" },
  { value: "done", label: "Done", color: "success.main" },
  { value: "revisit", label: "Revisit", color: "secondary.main" },
];

export default function StatusBadge({ status, onChange, disabled }: StatusBadgeProps) {
  const current = STATUS_OPTIONS.find((o) => o.value === status) || STATUS_OPTIONS[0];

  return (
    <Select
      size="small"
      value={status}
      onChange={(e) => onChange(e.target.value as Status)}
      disabled={disabled}
      variant="outlined"
      sx={{
        minWidth: 120,
        fontSize: "0.8rem",
        color: current.color,
        "& .MuiOutlinedInput-notchedOutline": { borderColor: current.color },
      }}
    >
      {STATUS_OPTIONS.map((opt) => (
        <MenuItem key={opt.value} value={opt.value} sx={{ fontSize: "0.8rem" }}>
          {opt.label}
        </MenuItem>
      ))}
    </Select>
  );
}
