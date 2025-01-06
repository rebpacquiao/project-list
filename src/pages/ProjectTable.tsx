import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Modal,
  Box,
  TextField,
  Drawer,
  List,
  ListItem,
  ListItemText,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  ButtonBase,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import axios from "axios";

interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  manager: string;
  fav: boolean;
}

const drawerWidth = 240;

const ProjectTable: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [favoriteProjects, setFavoriteProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [newProjectName, setNewProjectName] = useState<string>("");
  const [newProjectDescription, setNewProjectDescription] =
    useState<string>("");
  const [newProjectStartDate, setNewProjectStartDate] = useState<Dayjs | null>(
    null
  );
  const [newProjectEndDate, setNewProjectEndDate] = useState<Dayjs | null>(
    null
  );
  const [newProjectManager, setNewProjectManager] = useState<string>("");
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showProjects, setShowProjects] = useState<boolean>(true);

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL;
    if (!apiUrl) {
      setError("API URL is not defined");
      return;
    }
    axios
      .get(`${apiUrl}/projects`)
      .then((response) => {
        setProjects(response.data);
        setFavoriteProjects(
          response.data.filter((project: Project) => project.fav)
        );
      })
      .catch((error) => {
        setError("Failed to fetch projects");
      });
  }, []);

  const handleOpen = (project: Project) => {
    setSelectedProject(project);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProject(null);
  };

  const handleDeleteOpen = (project: Project) => {
    setSelectedProject(project);
    setDeleteOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
    setSelectedProject(null);
  };

  const handleDelete = () => {
    if (selectedProject) {
      const apiUrl = process.env.REACT_APP_API_URL;
      axios
        .delete(`${apiUrl}/projects/${selectedProject.id}`)
        .then(() => {
          setProjects((prevProjects) =>
            prevProjects.filter((project) => project.id !== selectedProject.id)
          );
          setFavoriteProjects((prevFavoriteProjects) =>
            prevFavoriteProjects.filter(
              (project) => project.id !== selectedProject.id
            )
          );
          handleDeleteClose();
        })
        .catch((error) => {
          setError("Failed to delete project");
        });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedProject) {
      setSelectedProject({
        ...selectedProject,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleDateChange = (name: string, date: Dayjs | null) => {
    if (selectedProject && date) {
      setSelectedProject({
        ...selectedProject,
        [name]: date.format("YYYY-MM-DD"),
      });
    }
  };

  const handleSave = () => {
    if (selectedProject) {
      const apiUrl = process.env.REACT_APP_API_URL;
      axios
        .put(`${apiUrl}/projects/${selectedProject.id}`, selectedProject)
        .then((response) => {
          setProjects((prevProjects) =>
            prevProjects.map((project) =>
              project.id === selectedProject.id ? response.data : project
            )
          );
          handleClose();
        })
        .catch((error) => {
          setError("Failed to update project");
        });
    }
  };

  const handleCreateProject = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const newProject = {
      id: Date.now().toString(),
      name: newProjectName,
      description: newProjectDescription,
      startDate: newProjectStartDate
        ? newProjectStartDate.format("YYYY-MM-DD")
        : "",
      endDate: newProjectEndDate ? newProjectEndDate.format("YYYY-MM-DD") : "",
      manager: newProjectManager,
      fav: isFavorite,
    };
    axios
      .post(`${apiUrl}/projects`, newProject)
      .then((response) => {
        setProjects([...projects, response.data]);
        if (isFavorite) {
          setFavoriteProjects([...favoriteProjects, response.data]);
        }
        setNewProjectName("");
        setNewProjectDescription("");
        setNewProjectStartDate(null);
        setNewProjectEndDate(null);
        setNewProjectManager("");
        setIsFavorite(false);
        setShowForm(false);
      })
      .catch((error) => {
        setError("Failed to create project");
      });
  };

  const handleFavoriteProjectClick = (project: Project) => {
    setSelectedProject(project);
    setShowProjects(false);
    setShowForm(false);
  };

  const handleMenuClick = (menu: string) => {
    if (menu === "Projects") {
      setShowProjects(true);
      setSelectedProject(null);
    } else {
      setShowProjects(false);
      setSelectedProject(null);
    }
    setShowForm(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Project Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            {["Dashboard", "Projects", "Teams", "Settings"].map(
              (text, index) => (
                <ListItem
                  key={text}
                  component="li"
                  onClick={() => handleMenuClick(text)}
                >
                  <ButtonBase sx={{ width: "100%" }}>
                    <ListItemText primary={text} sx={{ textAlign: "left" }} />
                  </ButtonBase>
                </ListItem>
              )
            )}
          </List>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6">Favorite Projects</Typography>
            <List>
              {favoriteProjects.map((project) => (
                <ListItem
                  key={project.id}
                  component="li"
                  onClick={() => handleFavoriteProjectClick(project)}
                >
                  <ButtonBase sx={{ width: "100%" }}>
                    <ListItemText
                      primary={project.name}
                      sx={{ textAlign: "left" }}
                    />
                  </ButtonBase>
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
      >
        <Toolbar />
        {error && <div style={{ color: "red" }}>{error}</div>}
        {showForm ? (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6">Create New Project</Typography>
            <TextField
              label="Project Name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Description"
              value={newProjectDescription}
              onChange={(e) => setNewProjectDescription(e.target.value)}
              fullWidth
              margin="normal"
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Start Date"
                value={newProjectStartDate}
                onChange={(date) => setNewProjectStartDate(date)}
                slotProps={{ textField: { fullWidth: true, margin: "normal" } }}
              />
              <DatePicker
                label="End Date"
                value={newProjectEndDate}
                onChange={(date) => setNewProjectEndDate(date)}
                slotProps={{ textField: { fullWidth: true, margin: "normal" } }}
              />
            </LocalizationProvider>
            <TextField
              label="Project Manager"
              value={newProjectManager}
              onChange={(e) => setNewProjectManager(e.target.value)}
              fullWidth
              margin="normal"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={isFavorite}
                  onChange={(e) => setIsFavorite(e.target.checked)}
                  name="isFavorite"
                />
              }
              label="Mark as Favorite"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateProject}
            >
              Create Project
            </Button>
          </Box>
        ) : (
          <>
            {showProjects && (
              <>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">Project List</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setShowForm(true)}
                  >
                    Add New
                  </Button>
                </Box>
                <TableContainer component={Paper}>
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
                      {projects.map((project) => (
                        <TableRow key={project.id}>
                          <TableCell>{project.id}</TableCell>
                          <TableCell>{project.name}</TableCell>
                          <TableCell>{project.startDate}</TableCell>
                          <TableCell>{project.endDate}</TableCell>
                          <TableCell>{project.manager}</TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleOpen(project)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              onClick={() => handleDeleteOpen(project)}
                              sx={{ ml: 1 }}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
            {selectedProject && !showProjects && (
              <TableContainer component={Paper}>
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
                        Edit
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow key={selectedProject.id}>
                      <TableCell>{selectedProject.id}</TableCell>
                      <TableCell>{selectedProject.name}</TableCell>
                      <TableCell>{selectedProject.startDate}</TableCell>
                      <TableCell>{selectedProject.endDate}</TableCell>
                      <TableCell>{selectedProject.manager}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleOpen(selectedProject)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleDeleteOpen(selectedProject)}
                          sx={{ ml: 1 }}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        )}
        <Modal open={open} onClose={handleClose}>
          <Box
            component="form"
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
            }}
          >
            <TextField
              label="Project Name"
              name="name"
              value={selectedProject?.name || ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Description"
              name="description"
              value={selectedProject?.description || ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Start Date"
                value={
                  selectedProject?.startDate
                    ? dayjs(selectedProject.startDate)
                    : null
                }
                onChange={(date) => handleDateChange("startDate", date)}
                slotProps={{ textField: { fullWidth: true, margin: "normal" } }}
              />
              <DatePicker
                label="End Date"
                value={
                  selectedProject?.endDate
                    ? dayjs(selectedProject.endDate)
                    : null
                }
                onChange={(date) => handleDateChange("endDate", date)}
                slotProps={{ textField: { fullWidth: true, margin: "normal" } }}
              />
            </LocalizationProvider>
            <TextField
              label="Project Manager"
              name="manager"
              value={selectedProject?.manager || ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save
            </Button>
          </Box>
        </Modal>
        <Modal open={deleteOpen} onClose={handleDeleteClose}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              textAlign: "center",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Are you sure you want to delete this project?
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleDelete}
            >
              Delete
            </Button>
            <Button
              variant="contained"
              onClick={handleDeleteClose}
              sx={{ ml: 2 }}
            >
              Cancel
            </Button>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};

export default ProjectTable;
