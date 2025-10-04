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
  IconButton,
  Divider,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Add, Delete, Edit } from "@mui/icons-material";
import Autocomplete from "@mui/material/Autocomplete";

import useModuleApi from "../../hooks/useModuleApi";
import useCourseApi from "../../hooks/useCourseApi";
import { useAuth } from "../../contexts/AuthContext";

const STATUS_OPTIONS = ["draft", "wait_for_approval", "active", "inactive"];

export default function ModuleManagement() {
  const [modules, setModules] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingModuleIndex, setEditingModuleIndex] = useState(null);

  const { registerModule, updateModule } = useModuleApi();
  const { fetchAllModules, fetchAllCourses } = useCourseApi();
    const { loggedInUser } = useAuth();

  const [moduleForm, setModuleForm] = useState({
    courseID: "",
    title: "",
    description: "",
    moduleNumber: "",
    expectedHours: "",
    status: "draft",
    content: [],
  });

  const [pageForm, setPageForm] = useState({
    title: "",
    content: "",
    mediaUrl: "",
  });

  const [editingPageIndex, setEditingPageIndex] = useState(null);
  const [contentDialogOpen, setContentDialogOpen] = useState(false);

  // Load courses and modules on mount
  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const coursesResponse = await fetchAllCourses();
        const courseList = Array.isArray(coursesResponse)
          ? coursesResponse
          : coursesResponse?.courses || [];

        const modulesResponse = await fetchAllModules(loggedInUser?.id);
        const modulesList = Array.isArray(modulesResponse)
          ? modulesResponse
          : modulesResponse?.modules || [];

        if (!mounted) return;
        setCourses(courseList);
        setModules(modulesList);
      } catch (err) {
        console.error("Failed to load data", err);
        if (mounted) {
          setError("Failed to load courses and modules. Please try again.");
          setCourses([]);
          setModules([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, [fetchAllCourses, fetchAllModules]);

  // Module form handlers
  const handleModuleFormChange = (e) => {
    const { name, value } = e.target;
    setModuleForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCourseChange = (e) => {
    setModuleForm((prev) => ({ ...prev, courseID: e.target.value }));
  };

  // Page form handlers
  const handlePageFormChange = (e) => {
    const { name, value } = e.target;
    setPageForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenPageDialog = () => {
    setContentDialogOpen(true);
  };

  const handleClosePageDialog = () => {
    setContentDialogOpen(false);
    if (editingPageIndex === null) {
      setPageForm({ title: "", content: "", mediaUrl: "" });
    }
  };

  const handleSavePage = () => {
    const trimmedTitle = pageForm.title.trim();
    const trimmedContent = pageForm.content.trim();

    if (!trimmedTitle || !trimmedContent) {
      alert("Page title and content are required.");
      return;
    }

    // Check for duplicate page titles in current module
    const isDuplicate = moduleForm.content.some(
      (page, idx) =>
        idx !== editingPageIndex &&
        page.title.trim().toLowerCase() === trimmedTitle.toLowerCase()
    );

    if (isDuplicate) {
      alert("A page with this title already exists in this module.");
      return;
    }

    const newPage = {
      title: trimmedTitle,
      content: trimmedContent,
      mediaUrl: pageForm.mediaUrl.trim(),
      pageNumber:
        editingPageIndex !== null
          ? editingPageIndex + 1
          : moduleForm.content.length + 1,
    };

    if (editingPageIndex !== null) {
      const updatedcontent = [...moduleForm.content];
      updatedcontent[editingPageIndex] = newPage;
      setModuleForm((prev) => ({ ...prev, content: updatedcontent }));
    } else {
      setModuleForm((prev) => ({
        ...prev,
        content: [...prev.content, newPage],
      }));
    }

    setPageForm({ title: "", content: "", mediaUrl: "" });
    setEditingPageIndex(null);
    setContentDialogOpen(false);
  };

  const handleEditPage = (pageIndex) => {
    const page = moduleForm.content[pageIndex];
    setPageForm({
      title: page.title,
      content: page.content,
      mediaUrl: page.mediaUrl || "",
    });
    setEditingPageIndex(pageIndex);
    setContentDialogOpen(true);
  };

  const handleRemovePage = (pageIndex) => {
    const updatedcontent = moduleForm.content
      .filter((_, idx) => idx !== pageIndex)
      .map((page, idx) => ({ ...page, pageNumber: idx + 1 }));

    setModuleForm((prev) => ({ ...prev, content: updatedcontent }));
  };

  // Module submission
  const handleSubmitModule = async (e) => {
    e.preventDefault();

    if (!moduleForm.courseID) {
      alert("Please select a course.");
      return;
    }

    const payload = {
      courseID: moduleForm.courseID,
      title: moduleForm.title.trim(),
      description: moduleForm.description.trim(),
      moduleNumber: parseInt(moduleForm.moduleNumber, 10),
      expectedHours: moduleForm.expectedHours.trim() || null,
      status: moduleForm.status,
      content: moduleForm.content?.map((x, index) => ({
        ...x,
        description: x.content,
        pageNumber: index + 1,
        status: "inactive",
      })),
    };

    try {
      if (editingModuleIndex !== null) {
        const moduleToUpdate = modules[editingModuleIndex];

        const response = await updateModule(moduleToUpdate.moduleNumber, {
          title: payload.title,
          description: payload.description,
          moduleNumber: payload.moduleNumber,
          expectedHours: payload.expectedHours,
          status: payload.status,
          content: payload.content,
        });

        const updatedModule = response?.module || response || payload;
        const courseName =
          courses.find((c) => c.id === payload.courseID)?.title || "";

        setModules((prev) =>
          prev.map((mod, idx) =>
            idx === editingModuleIndex ? { ...updatedModule, courseName } : mod
          )
        );

        alert("Module updated successfully!");
      } else {
        const response = await registerModule(payload);
        const createdModule = response?.module || response || payload;
        const courseName =
          courses.find((c) => c.id === payload.courseID)?.title || "";

        setModules((prev) => [...prev, { ...createdModule, courseName }]);
        alert("Module created successfully!");
      }

      // resetForm();
    } catch (err) {
      console.error("Failed to save module", err);
      alert(
        `Failed to ${
          editingModuleIndex !== null ? "update" : "create"
        } module. Please try again.`
      );
    }
  };

  const handleEditModule = (index) => {
    const module = modules[index];
    setModuleForm({
      courseID: module.courseID,
      title: module.title,
      description: module.description || "",
      moduleNumber: module.moduleNumber,
      expectedHours: module.expectedHours || "",
      status: module.status,
      content: module.content || [],
    });
    setEditingModuleIndex(index);
  };

  // const resetForm = () => {
  //   setModuleForm({
  //     courseID: "",
  //     title: "",
  //     description: "",
  //     moduleNumber: "",
  //     expectedHours: "",
  //     status: "draft",
  //     content: [],
  //   });
  //   setPageForm({ title: "", content: "", mediaUrl: "" });
  //   setEditingModuleIndex(null);
  //   setEditingPageIndex(null);
  // };

  // Get existing module titles for autocomplete
  const existingModuleTitles = modules
    .filter((mod) => mod.courseID === moduleForm.courseID)
    .map((mod) => mod.title);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: "2rem", maxWidth: 1200, margin: "0 auto" }}>
      <Typography variant="h4" gutterBottom fontWeight={700}>
        Module Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Module Form */}
      <Paper
        sx={{
          padding: "1.5rem",
          marginBottom: "2rem",
          borderRadius: 3,
          boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
        }}
      >
        <Typography variant="h6" gutterBottom>
          {editingModuleIndex !== null ? "Edit Module" : "Create New Module"}
        </Typography>

        <form onSubmit={handleSubmitModule}>
          <Stack spacing={2.5}>
            <FormControl fullWidth required>
              <InputLabel>Course</InputLabel>
              <Select
                value={moduleForm.courseID}
                label="Course"
                onChange={handleCourseChange}
                disabled={editingModuleIndex !== null}
              >
                {courses.map((course) => (
                  <MenuItem key={course.courseID} value={course.courseID}>
                    {course.title || course.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Module Number"
              name="moduleNumber"
              type="number"
              value={moduleForm.moduleNumber}
              onChange={handleModuleFormChange}
              required
              fullWidth
            />

            <Autocomplete
              freeSolo
              options={existingModuleTitles}
              value={moduleForm.title}
              onChange={(_, newValue) =>
                setModuleForm((prev) => ({ ...prev, title: newValue || "" }))
              }
              onInputChange={(_, newInput) =>
                setModuleForm((prev) => ({ ...prev, title: newInput }))
              }
              renderInput={(params) => (
                <TextField {...params} label="Module Title" required />
              )}
            />

            <TextField
              label="Description"
              name="description"
              value={moduleForm.description}
              onChange={handleModuleFormChange}
              multiline
              rows={3}
              fullWidth
            />

            <TextField
              label="Expected Hours (HH:MM:SS)"
              name="expectedHours"
              value={moduleForm.expectedHours}
              onChange={handleModuleFormChange}
              placeholder="e.g., 02:30:00"
              fullWidth
              helperText="Format: HH:MM:SS (optional)"
            />

            <FormControl fullWidth required>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={moduleForm.status}
                label="Status"
                onChange={handleModuleFormChange}
              >
                {STATUS_OPTIONS.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status.replace(/_/g, " ").toUpperCase()}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Divider sx={{ my: 2 }} />

            {/* content Section */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Module Pages
              </Typography>

              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={handleOpenPageDialog}
                sx={{ mb: 2 }}
              >
                Add Page
              </Button>

              {moduleForm.content.length > 0 ? (
                <Stack spacing={2}>
                  {moduleForm.content.map((page, idx) => (
                    <Card key={idx} variant="outlined" sx={{ borderRadius: 2 }}>
                      <CardContent>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography variant="subtitle1" fontWeight={600}>
                            Page {page.pageNumber}: {page.title}
                          </Typography>
                          <Box>
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleEditPage(idx)}
                              sx={{ mr: 1 }}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleRemovePage(idx)}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                        <Divider sx={{ my: 1 }} />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          {page.content.substring(0, 150)}
                          {page.content.length > 150 && "..."}
                        </Typography>
                        {page.mediaUrl && (
                          <Typography variant="caption" color="primary">
                            Media: {page.mediaUrl}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No pages added yet.
                </Typography>
              )}
            </Box>

            <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
              <Button type="submit" variant="contained" color="primary">
                {editingModuleIndex !== null
                  ? "Update Module"
                  : "Create Module"}
              </Button>
              {/* <Button variant="outlined" color="secondary" onClick={resetForm}>
                {editingModuleIndex !== null ? "Cancel Edit" : "Clear Form"}
              </Button> */}
            </Stack>
          </Stack>
        </form>
      </Paper>

      {/* Existing Modules Table */}
      <Paper
        sx={{
          borderRadius: 3,
          boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
        }}
      >
        <Typography variant="h6" sx={{ padding: "1rem" }}>
          Existing Modules
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Course</TableCell>
              <TableCell>Module</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              {/* <TableCell>Expected Hours</TableCell> */}
              <TableCell>No of Pages</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {modules.map((module, index) => (
              <TableRow key={index} hover>
                <TableCell>
                  {courses?.find((x) => x.courseID === module.courseID)?.title}
                </TableCell>
                <TableCell>{module.moduleID}</TableCell>
                <TableCell>{module.title}</TableCell>
                <TableCell>
                  {module.description
                    ? module.description.substring(0, 50) +
                      (module.description.length > 50 ? "..." : "")
                    : "—"}
                </TableCell>
                {/* <TableCell>{module.expectedHours || "—"}</TableCell> */}
                <TableCell>{module.content?.length || 0}</TableCell>
                <TableCell>
                  <Typography
                    variant="caption"
                    sx={{
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      bgcolor:
                        module.status === "active"
                          ? "success.light"
                          : module.status === "draft"
                          ? "grey.300"
                          : "warning.light",
                      color:
                        module.status === "active"
                          ? "success.dark"
                          : module.status === "draft"
                          ? "grey.700"
                          : "warning.dark",
                    }}
                  >
                    {module.status.replace(/_/g, " ").toUpperCase()}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleEditModule(index)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {modules.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                  No modules found. Create your first module above.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* Page Content Dialog */}
      <Dialog
        open={contentDialogOpen}
        onClose={handleClosePageDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingPageIndex !== null ? "Edit Page" : "Add New Page"}
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <TextField
              label="Page Title"
              name="title"
              value={pageForm.title}
              onChange={handlePageFormChange}
              fullWidth
              required
            />
            <TextField
              label="Page Content"
              name="content"
              value={pageForm.content}
              onChange={handlePageFormChange}
              multiline
              rows={12}
              fullWidth
              required
            />
            <TextField
              label="Media URL (optional)"
              name="mediaUrl"
              value={pageForm.mediaUrl}
              onChange={handlePageFormChange}
              fullWidth
              placeholder="https://example.com/media.jpg"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePageDialog}>Cancel</Button>
          <Button onClick={handleSavePage} variant="contained" color="primary">
            {editingPageIndex !== null ? "Update Page" : "Add Page"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
