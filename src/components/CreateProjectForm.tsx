import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";

interface CreateProjectFormProps {
  newProjectName: string;
  setNewProjectName: (name: string) => void;
  newProjectDescription: string;
  setNewProjectDescription: (description: string) => void;
  newProjectStartDate: Dayjs | null;
  setNewProjectStartDate: (date: Dayjs | null) => void;
  newProjectEndDate: Dayjs | null;
  setNewProjectEndDate: (date: Dayjs | null) => void;
  newProjectManager: string;
  setNewProjectManager: (manager: string) => void;
  isFavorite: boolean;
  setIsFavorite: (fav: boolean) => void;
  handleCreateProject: () => void;
}

const CreateProjectForm: React.FC<CreateProjectFormProps> = ({
  newProjectName,
  setNewProjectName,
  newProjectDescription,
  setNewProjectDescription,
  newProjectStartDate,
  setNewProjectStartDate,
  newProjectEndDate,
  setNewProjectEndDate,
  newProjectManager,
  setNewProjectManager,
  isFavorite,
  setIsFavorite,
  handleCreateProject,
}) => {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
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
            slotProps={{
              textField: { fullWidth: true, margin: "normal" },
            }}
          />
          <DatePicker
            label="End Date"
            value={newProjectEndDate}
            onChange={(date) => setNewProjectEndDate(date)}
            slotProps={{
              textField: { fullWidth: true, margin: "normal" },
            }}
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
      </CardContent>
    </Card>
  );
};

export default CreateProjectForm;
