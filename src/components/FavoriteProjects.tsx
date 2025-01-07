import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  ButtonBase,
  Box,
  Typography,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { Project } from "../types";

interface FavoriteProjectsProps {
  favoriteProjects: Project[];
  handleFavoriteProjectClick: (project: Project) => void;
}

const FavoriteProjects: React.FC<FavoriteProjectsProps> = ({
  favoriteProjects,
  handleFavoriteProjectClick,
}) => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6">
        <StarIcon sx={{ mr: 1 }} />
        Favorite Projects
      </Typography>
      <List>
        {favoriteProjects.map((project) => (
          <ListItem
            key={project.id}
            component="li"
            onClick={() => handleFavoriteProjectClick(project)}
            sx={{
              color: "rgb(138, 153, 175)",
              "&:hover": {
                color: "white",
              },
            }}
          >
            <ButtonBase sx={{ width: "100%" }}>
              <ListItemText primary={project.name} sx={{ textAlign: "left" }} />
            </ButtonBase>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default FavoriteProjects;
