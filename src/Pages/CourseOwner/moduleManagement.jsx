// src/Pages/CourseOwner/moduleManagement.jsx
import React, { useState, useEffect } from "react";
import {
    Box, Button, TextField, Typography, Stack, Paper,
    Table, TableHead, TableRow, TableCell, TableBody, IconButton
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";

const STORAGE_KEY = "course_owner_modules";

export default function ModuleManagement() {
    const [modules, setModules] = useState([]);
    const [form, setForm] = useState({
        courseName: "",
        moduleTitle: "",
        pages: [],
    });
    const [pageForm, setPageForm] = useState({ title: "", content: "", mediaUrl: "" });
    const [editingIndex, setEditingIndex] = useState(null);

    // Load saved modules
    useEffect(() => {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            try {
                setModules(JSON.parse(raw));
            } catch {
                setModules([]);
            }
        }
    }, []);

    // Save whenever modules change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(modules));
    }, [modules]);

    // Handle input change for module
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Handle page input change
    const handlePageChange = (e) => {
        setPageForm({ ...pageForm, [e.target.name]: e.target.value });
    };

    // Add page to current module
    const handleAddPage = () => {
        if (!pageForm.title.trim() || !pageForm.content.trim()) return;
        setForm({
            ...form,
            pages: [...form.pages, { ...pageForm, pageNumber: form.pages.length + 1 }],
        });
        setPageForm({ title: "", content: "", mediaUrl: "" });
    };

    // Remove page from module
    const handleRemovePage = (pageIdx) => {
        const updated = form.pages.filter((_, i) => i !== pageIdx);
        setForm({ ...form, pages: updated });
    };

    // Submit module
    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingIndex !== null) {
            const updated = [...modules];
            updated[editingIndex] = { ...form, status: "Wait for Approval" }; // edits go to approval
            setModules(updated);
            setEditingIndex(null);
        } else {
            setModules([...modules, { ...form, status: "Draft" }]); // new = Draft
        }
        setForm({ courseName: "", moduleTitle: "", pages: [] });
    };

    // Edit module
    const handleEdit = (idx) => {
        const { courseName, moduleTitle, pages } = modules[idx];
        setForm({ courseName, moduleTitle, pages });
        setEditingIndex(idx);
    };

    // Request approval
    const handleRequestApproval = (idx) => {
        const updated = [...modules];
        updated[idx].status = "Wait for Approval";
        setModules(updated);
    };

    return (
        <Box sx={{ padding: "2rem" }}>
            <Typography variant="h4" gutterBottom>
                Module Management
            </Typography>

            {/* Form */}
            <Paper sx={{ padding: "1.5rem", marginBottom: "2rem" }}>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <TextField
                            label="Course Name"
                            name="courseName"
                            value={form.courseName}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            label="Module Title"
                            name="moduleTitle"
                            value={form.moduleTitle}
                            onChange={handleChange}
                            required
                        />

                        {/* Add Pages */}
                        <Typography variant="h6">Pages</Typography>
                        <Stack direction="row" spacing={2}>
                            <TextField
                                label="Page Title"
                                name="title"
                                value={pageForm.title}
                                onChange={handlePageChange}
                            />
                            <TextField
                                label="Content"
                                name="content"
                                value={pageForm.content}
                                onChange={handlePageChange}
                            />
                            <TextField
                                label="Media URL"
                                name="mediaUrl"
                                value={pageForm.mediaUrl}
                                onChange={handlePageChange}
                            />
                            <Button variant="contained" onClick={handleAddPage}>
                                Add Page
                            </Button>
                        </Stack>

                        {form.pages.length > 0 && (
                            <Paper sx={{ padding: "1rem", marginTop: "1rem" }}>
                                {form.pages.map((p, idx) => (
                                    <Stack
                                        key={idx}
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        sx={{ marginBottom: "0.5rem" }}
                                    >
                                        <Typography>
                                            {p.pageNumber}. {p.title} – {p.content} ({p.mediaUrl || "No media"})
                                        </Typography>
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => handleRemovePage(idx)}
                                        >
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    </Stack>
                                ))}
                            </Paper>
                        )}

                        <Button type="submit" variant="contained" color="primary">
                            {editingIndex !== null ? "Update Module" : "Add Module"}
                        </Button>
                    </Stack>
                </form>
            </Paper>

            {/* Table */}
            <Paper>
                <Typography variant="h6" sx={{ padding: "1rem" }}>
                    Existing Modules
                </Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Course Name</TableCell>
                            <TableCell>Module Title</TableCell>
                            <TableCell>Pages</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {modules.map((m, index) => (
                            <TableRow key={index}>
                                <TableCell>{m.courseName}</TableCell>
                                <TableCell>{m.moduleTitle}</TableCell>
                                <TableCell>{m.pages.length}</TableCell>
                                <TableCell>{m.status}</TableCell>
                                <TableCell align="right">
                                    {m.status === "Draft" && (
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
                        {modules.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    No modules added yet.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Paper>
        </Box>
    );
}
