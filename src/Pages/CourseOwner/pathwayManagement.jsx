// src/Pages/CourseOwner/pathwayManagement.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
} from "@mui/material";

const STORAGE_KEY = "course_owner_pathways";
const COURSES_KEY = "course_owner_courses";

const PathwayManagement = () => {
  const [pathways, setPathways] = useState([]);
  const [coursesList, setCoursesList] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    courses: [],
    duration: "",
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [descDialogOpen, setDescDialogOpen] = useState(false);
  const [descDraft, setDescDraft] = useState("");
  const [coursesError, setCoursesError] = useState(false);

  useEffect(() => {
    const rawPathways = localStorage.getItem(STORAGE_KEY);
    if (rawPathways) setPathways(JSON.parse(rawPathways));

    const rawCourses = localStorage.getItem(COURSES_KEY);
    if (rawCourses) setCoursesList(JSON.parse(rawCourses));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pathways));
  }, [pathways]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openDescDialog = () => {
    setDescDraft(form.description || "");
    setDescDialogOpen(true);
  };
  const closeDescDialog = () => setDescDialogOpen(false);
  const saveDescription = () => {
    setForm((prev) => ({ ...prev, description: descDraft }));
    closeDescDialog();
  };

  const isEligibleForApproval = (pathway) => pathway?.courses?.length >= 3;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.description.trim() || !form.duration.trim()) {
      alert("❌ Please fill all fields");
      return;
    }

    if (form.courses.length < 3) {
      setCoursesError(true);
      return;
    } else {
      setCoursesError(false);
    }

    const duplicate = pathways.some(
      (p, idx) =>
        idx !== editingIndex &&
        p.title.trim().toLowerCase() === form.title.trim().toLowerCase()
    );
    if (duplicate) {
      alert("❌ A pathway with this title already exists.");
      return;
    }

    const newPathway = { ...form, status: "Draft" };

    if (editingIndex !== null) {
      const updated = [...pathways];
      updated[editingIndex] = newPathway;
      setPathways(updated);
      setEditingIndex(null);
    } else {
      setPathways([...pathways, newPathway]);
    }

    setForm({ title: "", description: "", courses: [], duration: "" });
  };

  const handleEdit = (index) => {
    const { title, description, courses, duration } = pathways[index];
    setForm({ title, description, courses, duration });
    setEditingIndex(index);
    setCoursesError(false);
  };

  const handleRequestApproval = (index) => {
    if (!isEligibleForApproval(pathways[index])) {
      alert("❌ Select at least 3 courses to request approval.");
      return;
    }
    const updated = [...pathways];
    updated[index].status = "Request for Approval";
    setPathways(updated);
  };

  const handleInactivate = (index) => {
    const updated = [...pathways];
    updated[index].status = "Inactive";
    setPathways(updated);
  };

  return (
    <Box sx={{ padding: "2rem", maxWidth: 1000, margin: "0 auto" }}>
      <Typography variant="h4" gutterBottom fontWeight={700}>
        Pathway Management
      </Typography>

      {/* Form */}
      <Paper sx={{ padding: "1.5rem", marginBottom: "2rem", borderRadius: 3, boxShadow: "0 6px 16px rgba(0,0,0,0.08)" }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Pathway Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
            <TextField
              label="Description"
              name="description"
              value={form.description}
              onClick={openDescDialog}
              multiline
              rows={2}
              fullWidth
              InputProps={{ readOnly: true }}
              required
            />
            <TextField
              label="Duration (e.g., 3 weeks)"
              name="duration"
              value={form.duration}
              onChange={handleChange}
              required
            />

            <Autocomplete
              multiple
              options={coursesList}
              getOptionLabel={(option) => option.name || option}
              value={form.courses}
              onChange={(event, newValue) => {
                setForm({ ...form, courses: newValue.map(c => (typeof c === "string" ? { name: c } : c)) });
                if (newValue.length >= 3) setCoursesError(false);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select 3 Courses"
                  placeholder="Choose courses"
                  error={coursesError}
                  helperText={coursesError ? "Select at least 3 courses" : ""}
                />
              )}
            />

            <Button type="submit" variant="contained" color="primary">
              {editingIndex !== null ? "Update Pathway" : "Add Pathway"}
            </Button>
          </Stack>
        </form>
      </Paper>

      {/* Existing Pathways Table */}
      <Paper sx={{ borderRadius: 3, boxShadow: "0 6px 16px rgba(0,0,0,0.08)" }}>
        <Typography variant="h6" sx={{ padding: "1rem" }}>
          Existing Pathways
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Courses</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pathways.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  No pathways added yet.
                </TableCell>
              </TableRow>
            ) : (
              pathways.map((pathway, index) => (
                <TableRow key={index} hover>
                  <TableCell>{pathway.title}</TableCell>
                  <TableCell
                    sx={{ maxWidth: 200, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                  >
                    {pathway.description}
                  </TableCell>
                  <TableCell>{pathway.duration}</TableCell>
                  <TableCell>{pathway.courses.map((c) => c.name || c).join(", ")}</TableCell>
                  <TableCell>{pathway.status}</TableCell>
                  <TableCell align="right">
                    {(pathway.status === "Draft" || pathway.status === "Inactive") && (
                      <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                        {/* Request Approval as primary action first */}
                        <Tooltip
                          title={isEligibleForApproval(pathway) ? "Submit for approval" : "Add at least 3 courses"}
                        >
                          <span>
                            <Button
                              variant="contained"
                              size="small"
                              color="success"
                              onClick={() => handleRequestApproval(index)}
                              disabled={!isEligibleForApproval(pathway)}
                            >
                              Request Approval
                            </Button>
                          </span>
                        </Tooltip>

                        <Button variant="outlined" size="small" onClick={() => handleEdit(index)}>
                          Edit
                        </Button>
                      </Box>
                    )}

                    {pathway.status === "Request for Approval" && (
                      <Typography variant="body2" color="text.secondary" sx={{ textAlign: "right" }}>
                        Pending Admin Approval
                      </Typography>
                    )}

                    {pathway.status === "Active" && (
                      <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                        <Button variant="outlined" size="small" onClick={() => handleEdit(index)}>
                          Edit
                        </Button>
                        <Button variant="outlined" size="small" color="error" onClick={() => handleInactivate(index)}>
                          Inactivate
                        </Button>
                      </Box>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* Description Dialog */}
      <Dialog open={descDialogOpen} onClose={closeDescDialog} maxWidth="md" fullWidth scroll="paper">
        <DialogTitle>Edit Description</DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Description"
            value={descDraft}
            onChange={(e) => setDescDraft(e.target.value)}
            multiline
            rows={15}
            fullWidth
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDescDialog}>Cancel</Button>
          <Button onClick={saveDescription} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PathwayManagement;
