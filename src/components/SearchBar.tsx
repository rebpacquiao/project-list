import React from "react";
import { TextField, Box } from "@mui/material";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <Box sx={{ mb: 2 }}>
      <TextField
        label="Search Projects"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        fullWidth
      />
    </Box>
  );
};

export default SearchBar;
