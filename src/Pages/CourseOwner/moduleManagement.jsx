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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Menu,
} from "@mui/material";
import { Add, Delete, Edit, MoreVert } from "@mui/icons-material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Autocomplete from "@mui/material/Autocomplete";

import useModuleApi from "../../hooks/useModuleApi";
import useCourseApi from "../../hooks/useCourseApi";
import { useAuth } from "../../contexts/AuthContext";

const STATUS_LABEL = {
  wait_for_approval: "Wait For Approval",
  draft: "Draft",
  active: "Active",
  inactive: "Inactive",
};

const DEFAULT_STATUS = "draft";

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
    expectedHours: "",
    contents: [],
  });
  const [pageForm, setPageForm] = useState({ title: "", content: "" });
  const [editingPageIndex, setEditingPageIndex] = useState(null);
  const [contentDialogOpen, setContentDialogOpen] = useState(false);

  // Dropdown menu for actions
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuModule, setMenuModule] = useState(null);
  const handleMenuOpen = (e, module) => {
    setMenuAnchor(e.currentTarget);
    setMenuModule(module);
  };
  const handleMenuClose = () => {
    setMenuAnchor(null);
    setMenuModule(null);
  };

  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      try {
        setLoading(true);
        const [coursesResponse, modulesResponse] = await Promise.all([
          fetchAllCourses(),
          fetchAllModules(loggedInUser?.id),
        ]);

        const courseList = Array.isArray(coursesResponse)
          ? coursesResponse
          : coursesResponse?.courses || [];
        const moduleList = Array.isArray(modulesResponse)
          ? modulesResponse
          : modulesResponse?.modules || [];

        if (!mounted) return;
        const filteredCourses = courseList.filter(
          (c) => c.userID === loggedInUser?.id
        );
        setCourses(filteredCourses);
        setModules(moduleList);
      } catch (err) {
        console.error("Failed to load modules/courses", err);
        if (mounted) setError("Failed to load modules or courses.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadData();
    return () => (mounted = false);
  }, [fetchAllModules, fetchAllCourses, loggedInUser?.id]);

  // Utility
  const toHHMMSS = (hhmm) => {
    if (!hhmm) return null;
    const [hh = "00", mm = "00"] = hhmm.split(":");
    return `${hh.padStart(2, "0")}:${mm.padStart(2, "0")}:00`;
  };

  // Form handlers
  // Safe form change handler
  const handleModuleFormChange = (e) => {
    const { name, value } = e.target;

    setModuleForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCourseChange = (e) =>
    setModuleForm((prev) => ({ ...prev, courseID: e.target.value }));

  const handlePageFormChange = (e) => {
    const { name, value } = e.target;
    setPageForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenPageDialog = () => setContentDialogOpen(true);
  const handleClosePageDialog = () => {
    setContentDialogOpen(false);
    if (editingPageIndex === null) setPageForm({ title: "", content: "" });
  };

  const handleSavePage = () => {
    const trimmedTitle = pageForm.title.trim();
    const trimmedContent = pageForm.content.trim();
    if (!trimmedTitle || !trimmedContent) {
      alert("Page title and content are required.");
      return;
    }

    const duplicate = moduleForm.contents.some(
      (p, idx) =>
        idx !== editingPageIndex &&
        p.title.trim().toLowerCase() === trimmedTitle.toLowerCase()
    );
    if (duplicate) {
      alert("Duplicate page title in module.");
      return;
    }

    const newPage = {
      title: trimmedTitle,
      content: trimmedContent,
      pageNumber:
        editingPageIndex !== null
          ? editingPageIndex + 1
          : moduleForm.contents.length + 1,
    };

    const updated =
      editingPageIndex !== null
        ? moduleForm.contents.map((p, i) =>
            i === editingPageIndex ? newPage : p
          )
        : [...moduleForm.contents, newPage];
    setModuleForm((prev) => ({ ...prev, contents: updated }));
    setEditingPageIndex(null);
    setPageForm({ title: "", content: "" });
    setContentDialogOpen(false);
  };

  const handleEditPage = (idx) => {
    const page = moduleForm.contents[idx];
    setPageForm({
      title: page.title || "",
      content: page.content || page.description || "",
    });
    setEditingPageIndex(idx);
    setContentDialogOpen(true);
  };

  const handleRemovePage = (idx) => {
    setModuleForm((prev) => ({
      ...prev,
      contents: prev.contents
        .filter((_, i) => i !== idx)
        .map((p, i) => ({ ...p, pageNumber: i + 1 })),
    }));
  };

  const resetForm = () => {
    setModuleForm({
      courseID: "",
      title: "",
      description: "",
      expectedHours: "",
      contents: [],
    });
    setPageForm({ title: "", content: "" });
    setEditingModuleIndex(null);
    setEditingPageIndex(null);
  };

  const handleSubmitModule = async (e) => {
    e.preventDefault();
    if (!moduleForm.courseID) {
      alert("Please select a course.");
      return;
    }

    const payload = {
      ...moduleForm,
      title: moduleForm.title?.trim(),
      description: moduleForm.description?.trim(),
      expectedHours: toHHMMSS(moduleForm.expectedHours),
      status: moduleForm?.status || DEFAULT_STATUS,
      contents: moduleForm.contents.map((x, i) => ({
        ...x,
        description: x.content,
        pageNumber: i + 1,
        status: moduleForm?.status || DEFAULT_STATUS,
      })),
    };

    try {
      if (editingModuleIndex !== null) {
        await updateModule(editingModuleIndex, payload);
        alert("✅ Module updated successfully!");
      } else {
        payload.moduleNumber = Math.floor(100000 + Math.random() * 900000);
        await registerModule(payload);
        alert("✅ Module created successfully!");
      }
    } catch (err) {
      console.error("❌ Failed to save module:", err);
      alert("Failed to save module. Please try again.");
    } finally {
      resetForm();
      const refreshed = await fetchAllModules(loggedInUser?.id);
      setModules(refreshed);
    }
  };

  const handleEditModule = (mod) => {
    setModuleForm(mod);
    setEditingModuleIndex(mod.moduleID);
  };

  const handleRequestApproval = async (mod) => {
    await updateModule(mod.moduleID, { ...mod, status: "wait_for_approval" });
    const refreshed = await fetchAllModules(loggedInUser?.id);
    setModules(refreshed);
  };

  const handleInactivate = async (mod) => {
    await updateModule(mod.moduleID, { ...mod, status: "inactive" });
    const refreshed = await fetchAllModules(loggedInUser?.id);
    setModules(refreshed);
  };

  if (loading)
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

      {/*Module Form */}
      <Paper
        sx={{
          padding: "1.5rem",
          mb: "2rem",
          borderRadius: 3,
          boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
        }}
      >
        <Stack direction="row" justifyContent="space-between" mb={1}>
          <Typography variant="h6">
            {editingModuleIndex !== null ? "Edit Module" : "Create New Module"}
          </Typography>
          {editingModuleIndex !== null && (
            <Button variant="text" color="secondary" onClick={resetForm}>
              Cancel Edit
            </Button>
          )}
        </Stack>

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
                {courses.map((c) => (
                  <MenuItem key={c.courseID} value={c.courseID}>
                    {c.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Autocomplete
              freeSolo
              options={modules
                .filter((m) => m.courseID === moduleForm.courseID)
                .map((m) => m.title)}
              value={moduleForm.title}
              onInputChange={(_, val) =>
                setModuleForm((p) => ({ ...p, title: val }))
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

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                ampm={false}
                views={["hours", "minutes", "seconds"]}
                format="HH:mm:ss"
                label="Expected Hours"
                value={
                  moduleForm.expectedHours
                    ? dayjs(moduleForm.expectedHours, "HH:mm:ss")
                    : null
                }
                onChange={(val) =>
                  setModuleForm((p) => ({
                    ...p,
                    expectedHours: val ? val.format("HH:mm:ss") : "",
                  }))
                }
              />
            </LocalizationProvider>

            <Divider sx={{ my: 2 }} />

            {/* Pages Section */}
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

            {moduleForm.contents.length > 0 ? (
              moduleForm.contents.map((p, i) => (
                <Card key={i} variant="outlined" sx={{ mb: 1 }}>
                  <CardContent>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="subtitle1">
                        Page {p.pageNumber}: {p.title}
                      </Typography>
                      <Box>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEditPage(i)}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleRemovePage(i)}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No pages added yet.
              </Typography>
            )}

            <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
              <Button type="submit" variant="contained">
                {editingModuleIndex !== null
                  ? "Update Module"
                  : "Create Module"}
              </Button>
              {editingModuleIndex !== null && (
                <Button variant="outlined" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </Stack>
          </Stack>
        </form>
      </Paper>

      {/* Grouped Modules */}
      <Paper
        sx={{
          borderRadius: 3,
          boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
        }}
      >
        <Typography variant="h6" sx={{ p: 2 }}>
          Existing Modules
        </Typography>

        {(() => {
          const grouped = Object.keys(STATUS_LABEL).reduce((acc, k) => {
            acc[k] = modules.filter(
              (m) => (m.status || DEFAULT_STATUS).toLowerCase() === k
            );
            return acc;
          }, {});
          return Object.entries(grouped).map(([key, group]) => (
            <Accordion key={key} defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontWeight={600}>
                  {STATUS_LABEL[key]} ({group.length})
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {group.length === 0 ? (
                  <Typography
                    sx={{ textAlign: "center", py: 2 }}
                    color="text.secondary"
                  >
                    No modules in this status.
                  </Typography>
                ) : (
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Course</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Pages</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {group.map((m, i) => (
                        <TableRow key={m.moduleID ?? i}>
                          <TableCell>
                            {courses.find((c) => c.courseID === m.courseID)
                              ?.title || "-"}
                          </TableCell>
                          <TableCell>{m.title}</TableCell>
                          <TableCell
                            sx={{ whiteSpace: "pre-line", maxWidth: 300 }}
                          >
                            {m.description || "-"}
                          </TableCell>

                          <TableCell>{m.contents?.length || 0}</TableCell>
                          <TableCell>{STATUS_LABEL[m.status] || "-"}</TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              onClick={(e) => handleMenuOpen(e, m)}
                            >
                              <MoreVert fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </AccordionDetails>
            </Accordion>
          ));
        })()}

        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          {menuModule && (
            <>
              <MenuItem
                onClick={() => {
                  handleEditModule(menuModule);
                  handleMenuClose();
                }}
              >
                Edit
              </MenuItem>
              {String(menuModule.status).toLowerCase() === "draft" && (
                <MenuItem
                  onClick={() => {
                    handleRequestApproval(menuModule);
                    handleMenuClose();
                  }}
                >
                  Request Approval
                </MenuItem>
              )}
              {String(menuModule.status).toLowerCase() === "active" && (
                <MenuItem
                  onClick={() => {
                    handleInactivate(menuModule);
                    handleMenuClose();
                  }}
                >
                  Inactivate
                </MenuItem>
              )}
            </>
          )}
        </Menu>
      </Paper>

      {/*Page Dialog  */}
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
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePageDialog}>Cancel</Button>
          <Button onClick={handleSavePage} variant="contained">
            {editingPageIndex !== null ? "Update Page" : "Add Page"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
