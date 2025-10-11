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
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import useCourseApi from "../../hooks/useCourseApi";
import { useAuth } from "../../contexts/AuthContext";
import usePathwayApi from "../../hooks/usePathwayApi"; // ✅ NEW

const MODULES_KEY = "course_owner_modules";

// UI mappers
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
  const [courses, setCourses] = useState([]);
  const [pathways, setPathways] = useState([]); // ✅ pathways list

  const [form, setForm] = useState({
    name: "",
    category: "",
    outline: "",
    level: "",
    pathwayId: "", // ✅ selected pathway
  });

  const [editingIndex, setEditingIndex] = useState(null);
  const [categories, setCategories] = useState([
    "Business Analysis",
    "Data Analysis",
    "Project Management",
    "Programming",
    "Finance",
  ]);

  const [modules, setModules] = useState([]);
  const { registerCourse, updateCourse, fetchAllCourses } = useCourseApi();
  const { fetchAllPathways } = usePathwayApi(); // ✅ pathway API hook
  const { loggedInUser } = useAuth();

  const [outlineDialogOpen, setOutlineDialogOpen] = useState(false);
  const [outlinedraft, setOutlinedraft] = useState("");
  const outlineFieldRef = useRef(null);
  const focusGuardRef = useRef(false);

  // ---- Load courses + pathways ----
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetchAllCourses();
        const list = Array.isArray(res) ? res : res?.courses || [];
        if (mounted) {
          const normalized = list.map((c) => ({
            ...c,
            level: (c.level || "").toLowerCase(),
            status: (c.status || "draft").toLowerCase(),
          }));
          setCourses(normalized);
        }
      } catch (err) {
        console.error("Failed to fetch courses", err);
        if (mounted) setCourses([]);
      }

      // ✅ Load pathways
      try {
        const res = await fetchAllPathways();
        const list = res?.pathways || [];
        if (mounted) setPathways(list);
      } catch (err) {
        console.error("Failed to load pathways", err);
        const raw = localStorage.getItem("course_owner_pathways");
        if (raw && mounted) setPathways(JSON.parse(raw));
      }

      try {
        const raw = localStorage.getItem(MODULES_KEY);
        if (raw && mounted) setModules(JSON.parse(raw));
      } catch {
        setModules([]);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [fetchAllCourses, fetchAllPathways]);

  // ---- Helpers ----
  const syncModulesForCourse = (courseName, newStatus) => {
    try {
      const raw = localStorage.getItem(MODULES_KEY);
      if (!raw) return;
      const mods = JSON.parse(raw);
      const updated = mods.map((m) =>
        m.courseName === courseName ? { ...m, status: newStatus } : m
      );
      localStorage.setItem(MODULES_KEY, JSON.stringify(updated));
      setModules(updated);
    } catch { }
  };

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
        (c.title || c.name || "").trim().toLowerCase() ===
        name.trim().toLowerCase()
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
      userID: loggedInUser?.id,
      pathwayId: pathwayId || null,
      status: "draft",
    };

    try {
      if (editingIndex !== null) {
        const courseId = courses[editingIndex]?.courseID;
        if (!courseId) return alert("Missing course ID");

        const res = await updateCourse(courseId, payload);
        const updated = res?.course || res || { ...payload, courseID: courseId };
        const normalized = {
          ...updated,
          level: (updated.level || "").toLowerCase(),
          status: (updated.status || "draft").toLowerCase(),
        };
        setCourses((prev) =>
          prev.map((c, i) => (i === editingIndex ? normalized : c))
        );
        syncModulesForCourse(name, "draft");
      } else {
        const res = await registerCourse(payload);
        const created = res?.course || res || payload;
        const normalized = {
          ...created,
          level: (created.level || "").toLowerCase(),
          status: (created.status || "draft").toLowerCase(),
        };
        setCourses((prev) => [...prev, normalized]);
      }

      if (category && !categories.includes(category)) {
        setCategories((prev) => [...prev, category]);
      }

      clearForm();
    } catch (err) {
      console.error("Failed to save course", err);
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
      };
      setCourses((prev) => prev.map((c, i) => (i === index ? normalized : c)));
    } catch (err) {
      console.error("Failed to inactivate", err);
      alert("Failed to inactivate course");
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
                <MenuItem value="">None</MenuItem>
                {pathways.map((p) => (
                  <MenuItem key={p.pathwayID} value={p.pathwayID}>
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
      <Paper sx={{ borderRadius: 3, boxShadow: "0 6px 16px rgba(0,0,0,0.08)" }}>
        <Typography variant="h6" sx={{ padding: "1rem" }}>
          Existing Courses
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Course Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Pathway</TableCell>
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
                const pathwayName =
                  pathways.find((p) => p.pathwayID === course.pathwayID)?.name ||
                  "—";
                return (
                  <TableRow key={course.courseID || index} hover>
                    <TableCell>{course.title}</TableCell>
                    <TableCell>{course.category}</TableCell>
                    <TableCell sx={{ fontStyle: pathwayName === "—" ? "italic" : "normal" }}>
                      {pathwayName}
                    </TableCell>
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
      <Dialog open={outlineDialogOpen} onClose={handleOutlineCancel} maxWidth="md" fullWidth scroll="paper">
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
