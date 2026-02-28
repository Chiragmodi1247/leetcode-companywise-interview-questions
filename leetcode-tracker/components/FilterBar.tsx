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

const inputSx = {
  "& .MuiOutlinedInput-root": {
    bgcolor: "#0d1117",
    "& fieldset": { borderColor: "#30363d" },
    "&:hover fieldset": { borderColor: "#58a6ff55" },
    "&.Mui-focused fieldset": { borderColor: "#58a6ff" },
  },
  "& .MuiInputBase-input": { color: "#e6edf3", fontSize: "0.85rem" },
  "& .MuiInputBase-input::placeholder": { color: "#484f58" },
};

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
    <Box
      sx={{
        maxWidth: 1400,
        mx: "auto",
        px: { xs: 2, sm: 3 },
        py: 2,
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        gap: 1.5,
        alignItems: { sm: "center" },
      }}
    >
      <TextField
        size="small"
        placeholder="Search questions..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#484f58", fontSize: 18 }} />
              </InputAdornment>
            ),
          },
        }}
        sx={{ flex: 1, minWidth: 200, ...inputSx }}
      />

      <Autocomplete
        size="small"
        options={companies}
        value={company || null}
        onChange={(_, v) => onCompanyChange(v || "")}
        renderInput={(params) => (
          <TextField {...params} placeholder="All Companies" sx={inputSx} />
        )}
        sx={{ minWidth: 220 }}
        clearOnEscape
        slotProps={{
          paper: { sx: { bgcolor: "#161b22", border: "1px solid #30363d" } },
        }}
      />

      <ToggleButtonGroup
        size="small"
        exclusive
        value={difficulty || "All"}
        onChange={(_, v) => {
          if (v !== null) onDifficultyChange(v === "All" ? "" : v);
        }}
        sx={{
          "& .MuiToggleButton-root": {
            color: "#8b949e",
            borderColor: "#30363d",
            fontSize: "0.8rem",
            px: 1.5,
            "&.Mui-selected": {
              bgcolor: "#21262d",
              color: "#58a6ff",
              "&:hover": { bgcolor: "#30363d" },
            },
            "&:hover": { bgcolor: "#161b22" },
          },
        }}
      >
        <ToggleButton value="All">All</ToggleButton>
        <ToggleButton value="Easy" sx={{ "&.Mui-selected": { color: "#3fb950 !important" } }}>Easy</ToggleButton>
        <ToggleButton value="Medium" sx={{ "&.Mui-selected": { color: "#d29922 !important" } }}>Medium</ToggleButton>
        <ToggleButton value="Hard" sx={{ "&.Mui-selected": { color: "#f85149 !important" } }}>Hard</ToggleButton>
      </ToggleButtonGroup>

      <Typography variant="caption" sx={{ color: "#484f58", whiteSpace: "nowrap" }}>
        {resultCount.toLocaleString()} results
      </Typography>
    </Box>
  );
}
