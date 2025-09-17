// src/Pages/CourseOwner/moduleManagement.jsx
import React, { useState, useEffect } from "react";
import {
    Box, Button, TextField, Typography, Stack, Paper,
    Table, TableHead, TableRow, TableCell, TableBody,
    IconButton, Divider, Card, CardContent
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
            // Reset to Draft after edit, so user can request approval again
            updated[editingIndex] = { ...form, status: "Draft" };
            setModules(updated);
            setEditingIndex(null);
        } else {
            setModules([...modules, { ...form, status: "Draft" }]);
        }
        setForm({ courseName: "", moduleTitle: "", pages: [] });
        setPageForm({ title: "", content: "", mediaUrl: "" });
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

    // Discard changes
    const handleDiscard = () => {
        setForm({ courseName: "", moduleTitle: "", pages: [] });
        setPageForm({ title: "", content: "", mediaUrl: "" });
        setEditingIndex(null);
    };

    return (
        <Box sx={{ padding: "2rem", maxWidth: 1000, margin: "0 auto" }}>
            <Typography variant="h4" gutterBottom fontWeight={700}>
                Module Management
            </Typography>

            {/* Form */}
            <Paper sx={{ padding: "1.5rem", marginBottom: "2rem", borderRadius: 3, boxShadow: "0 6px 16px rgba(0,0,0,0.08)" }}>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <TextField
                            label="Course Name"
                            name="courseName"
                            value={form.courseName}
                            onChange={handleChange}
                            required
                            fullWidth
                        />
                        <TextField
                            label="Module Title"
                            name="moduleTitle"
                            value={form.moduleTitle}
                            onChange={handleChange}
                            required
                            fullWidth
                        />

                        {/* Add Pages */}
                        <Typography variant="h6" mt={2}>
                            Add Pages
                        </Typography>
                        <Stack spacing={2}>
                            <TextField
                                label="Page Title"
                                name="title"
                                value={pageForm.title}
                                onChange={handlePageChange}
                                fullWidth
                            />
                            <TextField
                                label="Page Content"
                                name="content"
                                value={pageForm.content}
                                onChange={handlePageChange}
                                multiline
                                rows={4}
                                fullWidth
                            />
                            <TextField
                                label="Media URL"
                                name="mediaUrl"
                                value={pageForm.mediaUrl}
                                onChange={handlePageChange}
                                fullWidth
                            />
                            <Button
                                variant="contained"
                                startIcon={<Add />}
                                onClick={handleAddPage}
                                sx={{ alignSelf: "flex-start" }}
                            >
                                Add Page
                            </Button>
                        </Stack>

                        {/* Display Added Pages */}
                        {form.pages.length > 0 && (
                            <Box sx={{ mt: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                    Pages in this Module
                                </Typography>
                                <Stack spacing={2}>
                                    {form.pages.map((p, idx) => (
                                        <Card key={idx} variant="outlined" sx={{ borderRadius: 2 }}>
                                            <CardContent>
                                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                                    <Typography variant="subtitle1" fontWeight={600}>
                                                        {p.pageNumber}. {p.title}
                                                    </Typography>
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => handleRemovePage(idx)}
                                                    >
                                                        <Delete fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                                <Divider sx={{ my: 1 }} />
                                                <Typography variant="body1" sx={{ mb: 1 }}>
                                                    {p.content}
                                                </Typography>
                                                {p.mediaUrl && (
                                                    <Typography variant="body2" color="primary">
                                                        Media:{" "}
                                                        <a href={p.mediaUrl} target="_blank" rel="noopener noreferrer">
                                                            {p.mediaUrl}
                                                        </a>
                                                    </Typography>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </Stack>
                            </Box>
                        )}

                        <Stack direction="row" spacing={2}>
                            <Button type="submit" variant="contained" color="primary">
                                {editingIndex !== null ? "Update Module" : "Add Module"}
                            </Button>
                            {editingIndex !== null && (
                                <Button variant="outlined" color="error" onClick={handleDiscard}>
                                    Discard
                                </Button>
                            )}
                        </Stack>
                    </Stack>
                </form>
            </Paper>

            {/* Table */}
            <Paper sx={{ borderRadius: 3, boxShadow: "0 6px 16px rgba(0,0,0,0.08)" }}>
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
                            <TableRow key={index} hover>
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
                                            sx={{ mr: 1 }}
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
                                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
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
