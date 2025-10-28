import React, { useState, useEffect, useRef } from "react";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import useCourseApi from "../../hooks/useCourseApi";
import usePathwayApi from "../../hooks/usePathwayApi";
import { useAuth } from "../../contexts/AuthContext";

// UI labels
const STATUS_LABEL = {
  wait_for_approval: "Wait For Approval",
  draft: "Draft",
  active: "Active",
  inactive: "Inactive",
};
const LEVEL_LABEL = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export default function CourseManagement() {
  const { loggedInUser } = useAuth();
  const { fetchAllCourses, registerCourse, updateCourse } = useCourseApi();
  const { fetchAllPathways } = usePathwayApi();

  const [courses, setCourses] = useState([]);
  const [pathways, setPathways] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "",
    outline: "",
    level: "",
    pathwayId: "",
  });
  const [editingIndex, setEditingIndex] = useState(null);

  // Outline dialog
  const [outlineDialogOpen, setOutlineDialogOpen] = useState(false);
  const [outlinedraft, setOutlinedraft] = useState("");
  const outlineFieldRef = useRef(null);
  const focusGuardRef = useRef(false);

  // ---- Load courses + pathways ----
  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        // --- Load COURSES ---
        const resCourses = await fetchAllCourses();
        const listCourses = Array.isArray(resCourses)
          ? resCourses
          : resCourses?.courses || [];

        const normalized = listCourses.map((c, idx) => ({
          ...c,
          level: (c.level || "").toLowerCase(),
          status: (c.status || "draft").toLowerCase(),
          pathwayID: c.pathwayID?.toString() || "",
          courseID: c.courseID || idx + 1,
        }));

        if (mounted) {
          setCourses(normalized);
          // auto-extract unique categories
          const uniqueCategories = [
            ...new Set(normalized.map((c) => c.category).filter(Boolean)),
          ];
          setCategories(uniqueCategories);
        }
      } catch (err) {
        console.error("❌ Failed to load courses:", err);
      }

      try {
        // --- Load PATHWAYS ---
        const resPathways = await fetchAllPathways();
        const listPathways = Array.isArray(resPathways)
          ? resPathways
          : resPathways?.pathways || [];

        if (mounted) {
          setPathways(
            listPathways.map((p, idx) => ({
              ...p,
              pathwayID: p.pathwayID?.toString() || String(idx + 1),
            }))
          );
        }
      } catch (err) {
        console.error("❌ Failed to load pathways:", err);
      }
    };

    loadData();
    return () => {
      mounted = false;
    };
  }, [fetchAllCourses, fetchAllPathways]);

  // ---- Helpers ----
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const clearForm = () => {
    setForm({
      name: "",
      category: "",
      outline: "",
      level: "",
      pathwayId: "",
    });
    setEditingIndex(null);
  };

  // ---- Submit (create/update) ----
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, category, outline, level, pathwayId } = form;

    if (!name?.trim() || !category?.trim() || !outline?.trim() || !level) {
      alert("❌ Please fill out all fields.");
      return;
    }

    const duplicate = courses.some(
      (c, idx) =>
        idx !== editingIndex &&
        (c.title || "").trim().toLowerCase() === name.trim().toLowerCase()
    );
    if (duplicate) {
      alert("❌ A course with this name already exists.");
      return;
    }

    const payload = {
      title: name,
      category,
      level,
      outline,
      userID: loggedInUser?.id || 1, // fallback
      pathwayID: pathwayId || null,
      status: "draft",
    };

    try {
      let savedCourse;
      if (editingIndex !== null) {
        // --- UPDATE ---
        const courseId = courses[editingIndex]?.courseID;
        if (!courseId) return alert("Missing course ID");

        const res = await updateCourse(courseId, payload);
        savedCourse = res?.course || res || { ...payload, courseID: courseId };

        const normalized = {
          ...savedCourse,
          level: (savedCourse.level || "").toLowerCase(),
          status: (savedCourse.status || "draft").toLowerCase(),
          pathwayID: savedCourse.pathwayID?.toString() || "",
        };

        const updatedCourses = courses.map((c, i) =>
          i === editingIndex ? normalized : c
        );
        setCourses(updatedCourses);
      } else {
        // --- CREATE ---
        const res = await registerCourse(payload);
        savedCourse = res?.course || res || payload;

        const normalized = {
          ...savedCourse,
          level: (savedCourse.level || "").toLowerCase(),
          status: (savedCourse.status || "draft").toLowerCase(),
          pathwayID: savedCourse.pathwayID?.toString() || "",
        };
        setCourses((prev) => [...prev, normalized]);
      }

      if (category && !categories.includes(category)) {
        setCategories((prev) => [...prev, category]);
      }

      clearForm();
    } catch (err) {
      console.error("❌ Failed to save course:", err);
      alert("Failed to save course");
    }
  };

  const handleEdit = (index) => {
    const c = courses[index];
    setForm({
      name: c.title || "",
      category: c.category || "",
      outline: c.outline || "",
      level: (c.level || "").toLowerCase(),
      pathwayId: c.pathwayID || "",
    });
    setEditingIndex(index);
  };

  const handleInactivate = async (index) => {
    const target = courses[index];
    const courseId = target?.courseID;
    if (!courseId) return alert("Missing course id");
    try {
      const res = await updateCourse(courseId, { status: "inactive" });
      const updated = res?.course || res || { ...target, status: "inactive" };
      const normalized = {
        ...updated,
        level: (updated.level || "").toLowerCase(),
        status: (updated.status || "inactive").toLowerCase(),
        pathwayID: updated.pathwayID?.toString() || "",
      };
      const updatedCourses = courses.map((c, i) =>
        i === index ? normalized : c
      );
      setCourses(updatedCourses);
    } catch (err) {
      console.error("Failed to inactivate:", err);
      alert("Failed to inactivate course");
    }
  };

  const handleRequestApproval = async (index) => {
    const target = courses[index];
    const courseId = target?.courseID;
    if (!courseId) return alert("Missing course id");
    try {
      const res = await updateCourse(courseId, { status: "wait_for_approval" });
      const updated = res?.course || res || {
        ...target,
        status: "wait_for_approval",
      };
      const normalized = {
        ...updated,
        level: (updated.level || "").toLowerCase(),
        status: (updated.status || "wait_for_approval").toLowerCase(),
        pathwayID: updated.pathwayID?.toString() || "",
      };
      const updatedCourses = courses.map((c, i) =>
        i === index ? normalized : c
      );
      setCourses(updatedCourses);
    } catch (err) {
      console.error("Failed to request approval:", err);
      alert("Failed to request approval");
    }
  };

  // ---- Outline Dialog ----
  const openOutlineDialog = () => {
    setOutlinedraft(form.outline || "");
    setOutlineDialogOpen(true);
  };
  const closeOutlineDialogSafely = () => {
    focusGuardRef.current = true;
    setOutlineDialogOpen(false);
    outlineFieldRef.current?.blur?.();
    setTimeout(() => {
      focusGuardRef.current = false;
    }, 200);
  };
  const handleOutlineCancel = () => {
    setOutlinedraft("");
    closeOutlineDialogSafely();
  };
  const handleOutlineSave = () => {
    setForm((prev) => ({ ...prev, outline: outlinedraft }));
    closeOutlineDialogSafely();
  };
  const handleOutlineFieldFocus = () => {
    if (focusGuardRef.current) return;
    if (!outlineDialogOpen) openOutlineDialog();
  };

  return (
    <Box sx={{ padding: "2rem", maxWidth: 1100, margin: "0 auto" }}>
      <Typography variant="h4" gutterBottom fontWeight={700}>
        Course Management
      </Typography>

      {/* --- Form --- */}
      <Paper
        sx={{
          padding: "1.5rem",
          marginBottom: "2rem",
          borderRadius: 3,
          boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
        }}
      >
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Course Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <Autocomplete
              freeSolo
              options={categories}
              value={form.category}
              onChange={(_, newValue) => {
                if (typeof newValue === "string")
                  setForm((prev) => ({ ...prev, category: newValue }));
              }}
              onInputChange={(_, newInputValue) =>
                setForm((prev) => ({ ...prev, category: newInputValue || "" }))
              }
              renderInput={(params) => (
                <TextField {...params} label="Category" required />
              )}
            />

            <FormControl fullWidth>
              <InputLabel>Pathway</InputLabel>
              <Select
                name="pathwayId"
                value={form.pathwayId}
                onChange={handleChange}
                label="Pathway"
              >
                {pathways.map((p) => (
                  <MenuItem key={p.pathwayID} value={String(p.pathwayID)}>
                    {p.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Course Outline"
              name="outline"
              value={form.outline}
              onClick={openOutlineDialog}
              onFocus={handleOutlineFieldFocus}
              inputRef={outlineFieldRef}
              readOnly
              multiline
              rows={2}
              fullWidth
              required
              helperText="Click to open the full editor"
            />

            <FormControl fullWidth required>
              <InputLabel>Level</InputLabel>
              <Select
                name="level"
                value={form.level}
                onChange={handleChange}
                label="Level"
              >
                <MenuItem value="beginner">Beginner</MenuItem>
                <MenuItem value="intermediate">Intermediate</MenuItem>
                <MenuItem value="advanced">Advanced</MenuItem>
              </Select>
            </FormControl>

            <Stack direction="row" spacing={2}>
              <Button type="submit" variant="contained">
                {editingIndex !== null ? "Update Course" : "Add Course"}
              </Button>
              {editingIndex !== null && (
                <Button variant="outlined" onClick={clearForm}>
                  Cancel
                </Button>
              )}
            </Stack>
          </Stack>
        </form>
      </Paper>

      {/* --- Table --- */}
      <Paper
        sx={{
          borderRadius: 3,
          boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
        }}
      >
        <Typography variant="h6" sx={{ padding: "1rem" }}>
          Existing Courses
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Course Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Outline</TableCell>
              <TableCell>Level</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  No courses added yet.
                </TableCell>
              </TableRow>
            ) : (
              courses.map((course, index) => {
                const levelKey = (course.level || "").toLowerCase();
                const statusKey = (course.status || "draft").toLowerCase();

                return (
                  <TableRow key={course.courseID || index} hover>
                    <TableCell>{course.title}</TableCell>
                    <TableCell>{course.category}</TableCell>
                    <TableCell
                      sx={{
                        maxWidth: 240,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      title={course.outline}
                    >
                      {course.outline}
                    </TableCell>
                    <TableCell>{LEVEL_LABEL[levelKey] || "-"}</TableCell>
                    <TableCell>{STATUS_LABEL[statusKey] || "-"}</TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleEdit(index)}
                        >
                          Edit
                        </Button>

                        {statusKey === "draft" && (
                          <Button
                            variant="outlined"
                            size="small"
                            color="primary"
                            onClick={() => handleRequestApproval(index)}
                          >
                            Request for Approval
                          </Button>
                        )}

                        {statusKey === "active" && (
                          <Button
                            variant="outlined"
                            size="small"
                            color="error"
                            onClick={() => handleInactivate(index)}
                          >
                            Inactivate
                          </Button>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* Outline Dialog */}
      <Dialog
        open={outlineDialogOpen}
        onClose={handleOutlineCancel}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        <DialogTitle>Edit Course Outline</DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Course Outline"
            value={outlinedraft}
            onChange={(e) => setOutlinedraft(e.target.value)}
            multiline
            rows={15}
            fullWidth
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOutlineCancel}>Cancel</Button>
          <Button onClick={handleOutlineSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
