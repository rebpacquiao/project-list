import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  Typography,
  TablePagination,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import { Project } from "../types";

interface ProjectListProps {
  projects: Project[];
  page: number;
  rowsPerPage: number;
  handleChangePage: (event: unknown, newPage: number) => void;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleOpen: (project: Project) => void;
  handleDeleteOpen: (project: Project) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
  handleOpen,
  handleDeleteOpen,
}) => {
  const currentProjects = projects.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ bgcolor: "black", color: "white" }}>
                Project ID
              </TableCell>
              <TableCell sx={{ bgcolor: "black", color: "white" }}>
                Project Name
              </TableCell>
              <TableCell sx={{ bgcolor: "black", color: "white" }}>
                Start Date
              </TableCell>
              <TableCell sx={{ bgcolor: "black", color: "white" }}>
                End Date
              </TableCell>
              <TableCell sx={{ bgcolor: "black", color: "white" }}>
                Project Manager
              </TableCell>
              <TableCell sx={{ bgcolor: "black", color: "white" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentProjects.map((project, index) => (
              <TableRow
                key={project.id}
                sx={{
                  bgcolor: index % 2 === 0 ? "grey.100" : "white",
                }}
              >
                <TableCell>{project.id}</TableCell>
                <TableCell>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    {project.fav && <StarIcon sx={{ color: "yellow" }} />}
                    {project.name}
                  </Box>
                </TableCell>
                <TableCell>{project.startDate}</TableCell>
                <TableCell>{project.endDate}</TableCell>
                <TableCell>{project.manager}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpen(project)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteOpen(project)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={projects.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </TableContainer>
    </>
  );
};

export default ProjectList;
