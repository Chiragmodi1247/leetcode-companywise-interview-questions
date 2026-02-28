"use client";

import { Select, MenuItem } from "@mui/material";
import type { Status } from "@/lib/useProgress";

interface StatusBadgeProps {
  status: Status;
  onChange: (s: Status) => void;
  disabled?: boolean;
}

const STATUS_OPTIONS: { value: Status; label: string; color: string }[] = [
  { value: "", label: "—", color: "#484f58" },
  { value: "todo", label: "Todo", color: "#58a6ff" },
  { value: "in_progress", label: "In Progress", color: "#d29922" },
  { value: "done", label: "Done", color: "#3fb950" },
  { value: "revisit", label: "Revisit", color: "#bc8cff" },
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
        minWidth: 110,
        fontSize: "0.75rem",
        color: current.color,
        bgcolor: "#0d1117",
        "& .MuiOutlinedInput-notchedOutline": { borderColor: "#30363d" },
        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: `${current.color}55` },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: current.color },
        "& .MuiSelect-icon": { color: "#484f58" },
      }}
      MenuProps={{
        PaperProps: { sx: { bgcolor: "#161b22", border: "1px solid #30363d" } },
      }}
    >
      {STATUS_OPTIONS.map((opt) => (
        <MenuItem key={opt.value} value={opt.value} sx={{ fontSize: "0.75rem", color: opt.color }}>
          {opt.label}
        </MenuItem>
      ))}
    </Select>
  );
}
