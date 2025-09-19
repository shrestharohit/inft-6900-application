// src/Pages/CourseOwner/courseManagement.jsx
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

const STORAGE_KEY = "course_owner_courses";
const MODULES_KEY = "course_owner_modules";

export default function CourseManagement() {
    const [courses, setCourses] = useState([]);
    const [form, setForm] = useState({
        name: "",
        category: "",
        outline: "",
        level: "",
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

    // outline dialog states
    const [outlineDialogOpen, setOutlineDialogOpen] = useState(false);
    const [outlineDraft, setOutlineDraft] = useState("");

    // refs to prevent instant re-open on close
    const outlineFieldRef = useRef(null);
    const focusGuardRef = useRef(false);

    useEffect(() => {
        const rawCourses = localStorage.getItem(STORAGE_KEY);
        if (rawCourses) {
            try {
                setCourses(JSON.parse(rawCourses));
            } catch {
                setCourses([]);
            }
        }

        const rawModules = localStorage.getItem(MODULES_KEY);
        if (rawModules) {
            try {
                setModules(JSON.parse(rawModules));
            } catch {
                setModules([]);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
    }, [courses]);

    // sync module statuses with a course
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
        } catch {
            // ignore
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name || !form.category || !form.outline || !form.level) {
            alert("❌ Please fill out all fields.");
            return;
        }

        // prevent duplicate course names
        const duplicateCourse = courses.some(
            (c, idx) =>
                idx !== editingIndex &&
                c.name.trim().toLowerCase() === form.name.trim().toLowerCase()
        );
        if (duplicateCourse) {
            alert("❌ A course with this name already exists.");
            return;
        }

        if (editingIndex !== null) {
            const updated = [...courses];
            updated[editingIndex] = { ...form, status: "Draft" };
            setCourses(updated);
            syncModulesForCourse(form.name, "Draft");
            setEditingIndex(null);
        } else {
            setCourses([...courses, { ...form, status: "Draft" }]);
        }

        if (form.category && !categories.includes(form.category)) {
            setCategories([...categories, form.category]);
        }

        setForm({ name: "", category: "", outline: "", level: "" });
    };

    const handleEdit = (index) => {
        const { name, category, outline, level } = courses[index];
        setForm({ name, category, outline, level });
        setEditingIndex(index);
    };

    // eligibility = must have at least one module with pages
    const isEligibleForApproval = (courseName) => {
        const relatedModules = modules.filter((m) => m.courseName === courseName);
        if (relatedModules.length === 0) return false;
        return relatedModules.every((m) => m.pages && m.pages.length > 0);
    };

    const handleRequestApproval = (index) => {
        const courseName = courses[index].name;
        if (!isEligibleForApproval(courseName)) {
            alert("❌ Cannot request approval: add modules with at least one page each.");
            return;
        }

        const updated = [...courses];
        updated[index].status = "Request for Approval";
        setCourses(updated);
        syncModulesForCourse(courseName, "Request for Approval");
    };

    const handleInactivate = (index) => {
        const updated = [...courses];
        updated[index].status = "Inactive";
        setCourses(updated);
        syncModulesForCourse(updated[index].name, "Inactive");
    };

    // outline dialog helpers
    const openOutlineDialog = () => {
        setOutlineDraft(form.outline || "");
        setOutlineDialogOpen(true);
    };

    const closeOutlineDialogSafely = () => {
        focusGuardRef.current = true;
        setOutlineDialogOpen(false);
        if (outlineFieldRef.current) {
            outlineFieldRef.current.blur?.();
        }
        setTimeout(() => {
            focusGuardRef.current = false;
        }, 200);
    };

    const handleOutlineCancel = () => {
        setOutlineDraft("");
        closeOutlineDialogSafely();
    };

    const handleOutlineSave = () => {
        setForm((prev) => ({ ...prev, outline: outlineDraft }));
        closeOutlineDialogSafely();
    };

    const handleOutlineFieldFocus = () => {
        if (focusGuardRef.current) return;
        if (!outlineDialogOpen) openOutlineDialog();
    };

    return (
        <Box sx={{ padding: "2rem", maxWidth: 1000, margin: "0 auto" }}>
            <Typography variant="h4" gutterBottom fontWeight={700}>
                Course Management
            </Typography>

            {/* Form */}
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
                            onChange={(event, newValue) => {
                                if (typeof newValue === "string") {
                                    setForm({ ...form, category: newValue });
                                }
                            }}
                            onInputChange={(event, newInputValue) => {
                                setForm({ ...form, category: newInputValue });
                            }}
                            renderInput={(params) => (
                                <TextField {...params} label="Category" required />
                            )}
                        />

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
                        />

                        <FormControl fullWidth required>
                            <InputLabel>Level</InputLabel>
                            <Select
                                name="level"
                                value={form.level}
                                onChange={handleChange}
                                label="Level"
                            >
                                <MenuItem value="Beginner">Beginner</MenuItem>
                                <MenuItem value="Intermediate">Intermediate</MenuItem>
                                <MenuItem value="Advanced">Advanced</MenuItem>
                            </Select>
                        </FormControl>

                        <Button type="submit" variant="contained" color="primary">
                            {editingIndex !== null ? "Update Course" : "Add Course"}
                        </Button>
                    </Stack>
                </form>
            </Paper>

            {/* Table */}
            <Paper sx={{ borderRadius: 3, boxShadow: "0 6px 16px rgba(0,0,0,0.08)" }}>
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
                                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                    No courses added yet.
                                </TableCell>
                            </TableRow>
                        ) : (
                            courses.map((course, index) => (
                                <TableRow key={index} hover>
                                    <TableCell>{course.name}</TableCell>
                                    <TableCell>{course.category}</TableCell>
                                    <TableCell
                                        sx={{
                                            maxWidth: 200,
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                        }}
                                    >
                                        {course.outline}
                                    </TableCell>
                                    <TableCell>{course.level}</TableCell>
                                    <TableCell>{course.status}</TableCell>
                                    <TableCell
                                        align="right"
                                        sx={{
                                            display: "flex",
                                            gap: 1,
                                            justifyContent: "flex-end",
                                        }}
                                    >
                                        {course.status !== "Request for Approval" && (
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={() => handleEdit(index)}
                                            >
                                                Edit
                                            </Button>
                                        )}

                                        {(course.status === "Draft" ||
                                            course.status === "Inactive") && (
                                                <Tooltip
                                                    title={
                                                        isEligibleForApproval(course.name)
                                                            ? "Submit for admin review"
                                                            : "Add modules with at least one page first"
                                                    }
                                                >
                                                    <span>
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            color="success"
                                                            onClick={() =>
                                                                handleRequestApproval(index)
                                                            }
                                                            disabled={
                                                                !isEligibleForApproval(course.name)
                                                            }
                                                        >
                                                            Request Approval
                                                        </Button>
                                                    </span>
                                                </Tooltip>
                                            )}

                                        {course.status === "Active" && (
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                color="error"
                                                onClick={() => handleInactivate(index)}
                                            >
                                                Inactivate
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
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
                        value={outlineDraft}
                        onChange={(e) => setOutlineDraft(e.target.value)}
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
