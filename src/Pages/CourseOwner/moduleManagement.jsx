// src/Pages/CourseOwner/moduleManagement.jsx
import React, { useState, useEffect } from "react";
import {
    Box, Button, TextField, Typography, Stack, Paper,
    Table, TableHead, TableRow, TableCell, TableBody,
    IconButton, Divider, Card, CardContent, Select, MenuItem, FormControl, InputLabel,
    Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import Autocomplete from "@mui/material/Autocomplete";

const STORAGE_KEY = "course_owner_modules";
const COURSES_KEY = "course_owner_courses";

export default function ModuleManagement() {
    const [modules, setModules] = useState([]);
    const [courses, setCourses] = useState([]);
    const [form, setForm] = useState({
        courseName: "",
        moduleTitle: "",
        pages: [],
    });
    const [pageForm, setPageForm] = useState({ title: "", content: "", mediaUrl: "" });
    const [editingIndex, setEditingIndex] = useState(null);
    const [contentDialogOpen, setContentDialogOpen] = useState(false);

    useEffect(() => {
        const rawModules = localStorage.getItem(STORAGE_KEY);
        if (rawModules) {
            try {
                setModules(JSON.parse(rawModules));
            } catch {
                setModules([]);
            }
        }
        const rawCourses = localStorage.getItem(COURSES_KEY);
        if (rawCourses) {
            try {
                setCourses(JSON.parse(rawCourses));
            } catch {
                setCourses([]);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(modules));
    }, [modules]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handlePageChange = (e) => {
        setPageForm({ ...pageForm, [e.target.name]: e.target.value });
    };

    const handleAddPage = () => {
        if (!pageForm.title.trim() || !pageForm.content.trim()) return;
        setForm({
            ...form,
            pages: [...form.pages, { ...pageForm, pageNumber: form.pages.length + 1 }],
        });
        setPageForm({ title: "", content: "", mediaUrl: "" });
    };

    const handleRemovePage = (pageIdx) => {
        const updated = form.pages.filter((_, i) => i !== pageIdx);
        const renumbered = updated.map((p, idx) => ({ ...p, pageNumber: idx + 1 }));
        setForm({ ...form, pages: renumbered });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.courseName || !form.moduleTitle) return;

        if (editingIndex !== null) {
            const updated = [...modules];
            updated[editingIndex] = { ...form, status: "Draft" };
            setModules(updated);
            setEditingIndex(null);
        } else {
            setModules([...modules, { ...form, status: "Draft" }]);
        }
        setForm({ courseName: "", moduleTitle: "", pages: [] });
        setPageForm({ title: "", content: "", mediaUrl: "" });
    };

    const handleEdit = (idx) => {
        const { courseName, moduleTitle, pages } = modules[idx];
        setForm({ courseName, moduleTitle, pages });
        setEditingIndex(idx);
    };

    const handleRequestApproval = (idx) => {
        const updated = [...modules];
        updated[idx].status = "Request for Approval";
        setModules(updated);
    };

    const handleDiscard = () => {
        setForm({ courseName: "", moduleTitle: "", pages: [] });
        setPageForm({ title: "", content: "", mediaUrl: "" });
        setEditingIndex(null);
    };

    const moduleTitlesForCourse = modules
        .filter((m) => m.courseName === form.courseName)
        .map((m) => m.moduleTitle);

    return (
        <Box sx={{ padding: "2rem", maxWidth: 1000, margin: "0 auto" }}>
            <Typography variant="h4" gutterBottom fontWeight={700}>
                Module Management
            </Typography>

            <Paper sx={{ padding: "1.5rem", marginBottom: "2rem", borderRadius: 3, boxShadow: "0 6px 16px rgba(0,0,0,0.08)" }}>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <FormControl fullWidth>
                            <InputLabel>Course Name</InputLabel>
                            <Select
                                name="courseName"
                                value={form.courseName}
                                label="Course Name"
                                onChange={handleChange}
                                required
                            >
                                {courses.map((c, idx) => (
                                    <MenuItem key={idx} value={c.name}>{c.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Autocomplete
                            freeSolo
                            options={moduleTitlesForCourse}
                            value={form.moduleTitle}
                            onChange={(_, newValue) => setForm({ ...form, moduleTitle: newValue || "" })}
                            onInputChange={(_, newInput) => setForm({ ...form, moduleTitle: newInput })}
                            renderInput={(params) => <TextField {...params} label="Module Title" required />}
                        />

                        <Typography variant="h6" mt={2}>Add Pages</Typography>
                        <Stack spacing={2}>
                            <TextField
                                label="Page Title"
                                name="title"
                                value={pageForm.title}
                                onChange={handlePageChange}
                                fullWidth
                            />
                            {/* Page Content opens a scrollable Dialog */}
                            <TextField
                                label="Page Content"
                                name="content"
                                value={pageForm.content}
                                onClick={() => setContentDialogOpen(true)}
                                readOnly
                                multiline
                                rows={2}
                                fullWidth
                            />
                            <TextField
                                label="Media URL"
                                name="mediaUrl"
                                value={pageForm.mediaUrl}
                                onChange={handlePageChange}
                                fullWidth
                            />
                            <Button variant="contained" startIcon={<Add />} onClick={handleAddPage} sx={{ alignSelf: "flex-start" }}>
                                Add Page
                            </Button>
                        </Stack>

                        {form.pages.length > 0 && (
                            <Box sx={{ mt: 3 }}>
                                <Typography variant="h6" gutterBottom>Pages in this Module</Typography>
                                <Stack spacing={2}>
                                    {form.pages.map((p, idx) => (
                                        <Card key={idx} variant="outlined" sx={{ borderRadius: 2 }}>
                                            <CardContent>
                                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                                    <Typography variant="subtitle1" fontWeight={600}>
                                                        {p.pageNumber}. {p.title}
                                                    </Typography>
                                                    <IconButton size="small" color="error" onClick={() => handleRemovePage(idx)}>
                                                        <Delete fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                                <Divider sx={{ my: 1 }} />
                                                <Typography variant="body1" sx={{ mb: 1 }}>{p.content}</Typography>
                                                {p.mediaUrl && (
                                                    <Typography variant="body2" color="primary">
                                                        Media: <a href={p.mediaUrl} target="_blank" rel="noopener noreferrer">{p.mediaUrl}</a>
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
                                <Button variant="outlined" color="error" onClick={handleDiscard}>Discard</Button>
                            )}
                        </Stack>
                    </Stack>
                </form>
            </Paper>

            <Paper sx={{ borderRadius: 3, boxShadow: "0 6px 16px rgba(0,0,0,0.08)" }}>
                <Typography variant="h6" sx={{ padding: "1rem" }}>Existing Modules</Typography>
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
                                    <Button variant="outlined" size="small" onClick={() => handleEdit(index)}>Edit</Button>
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

            {/* Scrollable Dialog for Page Content */}
            <Dialog
                open={contentDialogOpen}
                onClose={() => setContentDialogOpen(false)}
                maxWidth="md"
                fullWidth
                scroll="paper"
            >
                <DialogTitle>Edit Page Content</DialogTitle>
                <DialogContent dividers>
                    <TextField
                        label="Page Content"
                        name="content"
                        value={pageForm.content}
                        onChange={handlePageChange}
                        multiline
                        rows={15}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setContentDialogOpen(false)}>Cancel</Button>
                    <Button onClick={() => setContentDialogOpen(false)} variant="contained">Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
