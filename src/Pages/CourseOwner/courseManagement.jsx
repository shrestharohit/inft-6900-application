// src/Pages/CourseOwner/courseManagement.jsx
import React, { useState, useEffect } from "react";
import {
    Box, Button, TextField, MenuItem, Typography,
    Stack, Paper, Table, TableHead, TableRow, TableCell, TableBody
} from "@mui/material";

const categories = [
    "Business Analysis",
    "Data Analysis",
    "Project Management",
    "Programming",
    "Finance",
];

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

    // Load saved courses
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

    // Save whenever courses change
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
            updated[editingIndex] = { ...form, status: "Wait for Approval" }; // on edit -> wait for approval
            setCourses(updated);
            setEditingIndex(null);
        } else {
            setCourses([...courses, { ...form, status: "Draft" }]); // new course -> draft
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
                        <TextField
                            select
                            label="Category"
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            required
                        >
                            {categories.map((c) => (
                                <MenuItem key={c} value={c}>
                                    {c}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            label="Course Outline (modules/topics)"
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
                        {courses.map((course, index) => (
                            <TableRow key={index}>
                                <TableCell>{course.name}</TableCell>
                                <TableCell>{course.category}</TableCell>
                                <TableCell>{course.outline}</TableCell>
                                <TableCell>{course.duration}</TableCell>
                                <TableCell>{course.status}</TableCell>
                                <TableCell align="right">
                                    {course.status === "Draft" && (
                                        <Button
                                            variant="contained"
                                            size="small"
                                            color="secondary"
                                            onClick={() => handleRequestApproval(index)}
                                            sx={{ marginRight: "0.5rem" }}
                                        >
                                            Request Approval
                                        </Button>
                                    )}
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() => handleEdit(index)}
                                    >
                                        Edit
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {courses.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    No courses added yet.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Paper>
        </Box>
    );
}
