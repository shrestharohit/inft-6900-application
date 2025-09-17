// src/Pages/CourseOwner/courseManagement.jsx
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
    Autocomplete
} from "@mui/material";

const STORAGE_KEY = "course_owner_courses";

export default function CourseManagement() {
    const [courses, setCourses] = useState([]);
    const [form, setForm] = useState({
        name: "",
        category: "",
        outline: "",
        duration: "",
    });
    const [editingIndex, setEditingIndex] = useState(null);
    const [categories, setCategories] = useState([
        "Business Analysis",
        "Data Analysis",
        "Project Management",
        "Programming",
        "Finance",
    ]);

    useEffect(() => {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            try {
                setCourses(JSON.parse(raw));
            } catch {
                setCourses([]);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
    }, [courses]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingIndex !== null) {
            const updated = [...courses];
            // After editing, status is always Draft
            updated[editingIndex] = { ...form, status: "Draft" };
            setCourses(updated);
            setEditingIndex(null);
        } else {
            setCourses([...courses, { ...form, status: "Draft" }]);
        }

        // Add category to list if new
        if (form.category && !categories.includes(form.category)) {
            setCategories([...categories, form.category]);
        }

        setForm({ name: "", category: "", outline: "", duration: "" });
    };

    const handleEdit = (index) => {
        const { name, category, outline, duration } = courses[index];
        setForm({ name, category, outline, duration });
        setEditingIndex(index);
    };

    const handleRequestApproval = (index) => {
        const updated = [...courses];
        updated[index].status = "Wait for Approval";
        setCourses(updated);
    };

    const handleInactivate = (index) => {
        const updated = [...courses];
        updated[index].status = "Inactive";
        setCourses(updated);
    };

    return (
        <Box sx={{ padding: "2rem" }}>
            <Typography variant="h4" gutterBottom>
                Course Management
            </Typography>

            {/* Form */}
            <Paper sx={{ padding: "1.5rem", marginBottom: "2rem" }}>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <TextField
                            label="Course Name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />

                        {/* Editable Category Dropdown */}
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
                                <TextField
                                    {...params}
                                    label="Category"
                                    required
                                />
                            )}
                        />

                        <TextField
                            label="Course Outline"
                            name="outline"
                            value={form.outline}
                            onChange={handleChange}
                            multiline
                            rows={3}
                            required
                        />
                        <TextField
                            label="Expected Duration"
                            name="duration"
                            value={form.duration}
                            onChange={handleChange}
                            placeholder="e.g., 6 weeks"
                            required
                        />

                        <Button type="submit" variant="contained" color="primary">
                            {editingIndex !== null ? "Update Course" : "Add Course"}
                        </Button>
                    </Stack>
                </form>
            </Paper>

            {/* Table */}
            <Paper>
                <Typography variant="h6" sx={{ padding: "1rem" }}>
                    Existing Courses
                </Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Course Name</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Outline</TableCell>
                            <TableCell>Duration</TableCell>
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
                                <TableRow key={index}>
                                    <TableCell>{course.name}</TableCell>
                                    <TableCell>{course.category}</TableCell>
                                    <TableCell>{course.outline}</TableCell>
                                    <TableCell>{course.duration}</TableCell>
                                    <TableCell>{course.status}</TableCell>
                                    <TableCell align="right" sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                        {/* Edit button */}
                                        {course.status !== "Wait for Approval" && (
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={() => handleEdit(index)}
                                            >
                                                Edit
                                            </Button>
                                        )}

                                        {/* Request Approval button for Draft or Inactive courses */}
                                        {(course.status === "Draft" || course.status === "Inactive") && (
                                            <Button
                                                variant="contained"
                                                size="small"
                                                color="success"
                                                onClick={() => handleRequestApproval(index)}
                                            >
                                                Request Approval
                                            </Button>
                                        )}

                                        {/* Inactivate button for Active courses */}
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
        </Box>
    );
}
