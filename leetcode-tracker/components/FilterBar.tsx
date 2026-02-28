"use client";

import {
  Box,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
  Autocomplete,
  Typography,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface FilterBarProps {
  search: string;
  onSearchChange: (v: string) => void;
  difficulty: string;
  onDifficultyChange: (v: string) => void;
  company: string;
  onCompanyChange: (v: string) => void;
  companies: string[];
  resultCount: number;
}

export default function FilterBar({
  search,
  onSearchChange,
  difficulty,
  onDifficultyChange,
  company,
  onCompanyChange,
  companies,
  resultCount,
}: FilterBarProps) {
  return (
    <Box sx={{ px: { xs: 2, sm: 3 }, py: 2, display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, alignItems: { sm: "center" } }}>
      <TextField
        size="small"
        placeholder="Search questions..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          },
        }}
        sx={{ flex: 1, minWidth: 200 }}
      />

      <Autocomplete
        size="small"
        options={companies}
        value={company || null}
        onChange={(_, v) => onCompanyChange(v || "")}
        renderInput={(params) => (
          <TextField {...params} placeholder="All Companies" />
        )}
        sx={{ minWidth: 220 }}
        clearOnEscape
      />

      <ToggleButtonGroup
        size="small"
        exclusive
        value={difficulty || "All"}
        onChange={(_, v) => {
          if (v !== null) onDifficultyChange(v === "All" ? "" : v);
        }}
      >
        <ToggleButton value="All">All</ToggleButton>
        <ToggleButton value="Easy" sx={{ color: "success.main", "&.Mui-selected": { color: "success.main" } }}>Easy</ToggleButton>
        <ToggleButton value="Medium" sx={{ color: "warning.main", "&.Mui-selected": { color: "warning.main" } }}>Medium</ToggleButton>
        <ToggleButton value="Hard" sx={{ color: "error.main", "&.Mui-selected": { color: "error.main" } }}>Hard</ToggleButton>
      </ToggleButtonGroup>

      <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
        {resultCount.toLocaleString()} results
      </Typography>
    </Box>
  );
}
