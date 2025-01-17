import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Modal,
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
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import axios from "axios";
import MenuIcon from "@mui/icons-material/Menu";
import FolderIcon from "@mui/icons-material/Folder";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import ProjectList from "../components/ProjectList";
import FavoriteProjects from "../components/FavoriteProjects";
import CreateProjectForm from "../components/CreateProjectForm";
import { Project } from "../types";

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
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL;
    if (!apiUrl) {
      setError("API URL is not defined");
      setSnackbarOpen(true);
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
        setError(
          "Failed to fetch projects. Please check your server connection."
        );
        setSnackbarOpen(true);
      });
  }, []);

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
      setLoading(true);
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
          setSnackbarOpen(true);
        })
        .finally(() => {
          setLoading(false);
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
      setLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL;
      axios
        .put(`${apiUrl}/projects/${selectedProject.id}`, selectedProject)
        .then((response) => {
          setProjects((prevProjects) =>
            prevProjects.map((project) =>
              project.id === selectedProject.id ? response.data : project
            )
          );
          setFavoriteProjects((prevFavoriteProjects) => {
            const updatedFavorites = response.data.fav
              ? [...prevFavoriteProjects, response.data]
              : prevFavoriteProjects.filter(
                  (project) => project.id !== response.data.id
                );
            return updatedFavorites;
          });
          handleClose();
        })
        .catch((error) => {
          setError("Failed to update project");
          setSnackbarOpen(true);
        })
        .finally(() => {
          setLoading(false);
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
        setProjects([response.data, ...projects]);
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
        setSnackbarOpen(true);
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
    }
    setShowForm(false);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleChangeFavorite = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedProject) {
      setSelectedProject({
        ...selectedProject,
        fav: e.target.checked,
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const drawer = (
    <Box sx={{ overflow: "auto" }}>
      <Box sx={{ p: 2, color: "white", bgcolor: "#1c2434" }}>
        <Typography sx={{ marginTop: 10 }} variant="h6">
          Menu
        </Typography>
      </Box>
      <List>
        {["Projects"].map((text, index) => (
          <ListItem
            key={text}
            component="li"
            onClick={() => handleMenuClick(text)}
            sx={{
              color: "rgb(138, 153, 175)",
              "&:hover": {
                color: "white",
              },
            }}
          >
            <ButtonBase sx={{ width: "100%" }}>
              {text === "Projects" ? <FolderIcon sx={{ mr: 1 }} /> : null}
              <ListItemText primary={text} sx={{ textAlign: "left" }} />
            </ButtonBase>
          </ListItem>
        ))}
      </List>
      <FavoriteProjects
        favoriteProjects={favoriteProjects}
        handleFavoriteProjectClick={handleFavoriteProjectClick}
      />
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Project Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
      >
        <Toolbar />
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity="error"
            sx={{ width: "100%" }}
          >
            {error}
          </Alert>
        </Snackbar>
        {showForm ? (
          <CreateProjectForm
            newProjectName={newProjectName}
            setNewProjectName={setNewProjectName}
            newProjectDescription={newProjectDescription}
            setNewProjectDescription={setNewProjectDescription}
            newProjectStartDate={newProjectStartDate}
            setNewProjectStartDate={setNewProjectStartDate}
            newProjectEndDate={newProjectEndDate}
            setNewProjectEndDate={setNewProjectEndDate}
            newProjectManager={newProjectManager}
            setNewProjectManager={setNewProjectManager}
            isFavorite={isFavorite}
            setIsFavorite={setIsFavorite}
            handleCreateProject={handleCreateProject}
          />
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
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <AddIcon />
                    Add New
                  </Button>
                </Box>
                <SearchBar
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
                <ProjectList
                  projects={filteredProjects}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  handleChangePage={handleChangePage}
                  handleChangeRowsPerPage={handleChangeRowsPerPage}
                  handleOpen={handleOpen}
                  handleDeleteOpen={handleDeleteOpen}
                />
              </>
            )}
            {selectedProject && !showProjects && (
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
                        Project Description
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
                      <TableCell>{selectedProject.description}</TableCell>
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
              width: 600,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Edit Project
            </Typography>
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
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedProject?.fav || false}
                  onChange={handleChangeFavorite}
                  name="fav"
                />
              }
              label="Mark as Favorite"
            />
            <Button variant="contained" color="primary" onClick={handleSave}>
              Update
            </Button>
            {loading && <CircularProgress size={24} sx={{ ml: 2 }} />}
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
              Delete Project
            </Typography>
            <Typography variant="body1" gutterBottom>
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
            {loading && <CircularProgress size={24} sx={{ mt: 2 }} />}
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};

export default ProjectTable;
