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
        moduleNumber: "",
        moduleTitle: "",
        moduleDescription: "",
        moduleDuration: "",
        pages: [],
    });

    const [pageForm, setPageForm] = useState({ title: "", content: "", mediaUrl: "" });
    const [editingIndex, setEditingIndex] = useState(null); // module index
    const [editingPageIndex, setEditingPageIndex] = useState(null); // page index
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

    // Add new page or update existing one
    const handleSavePage = () => {
        if (!pageForm.title.trim() || !pageForm.content.trim()) return;

        // page title validation (within the same module)
        const duplicatePage = form.pages.some(
            (p, idx) =>
                idx !== editingPageIndex &&
                p.title.trim().toLowerCase() === pageForm.title.trim().toLowerCase()
        );
        if (duplicatePage) {
            alert("❌ A page with this title already exists in this module.");
            return;
        }

        if (editingPageIndex !== null) {
            const updatedPages = [...form.pages];
            updatedPages[editingPageIndex] = {
                ...pageForm,
                pageNumber: editingPageIndex + 1,
            };
            setForm({ ...form, pages: updatedPages });
            setEditingPageIndex(null);
        } else {
            setForm({
                ...form,
                pages: [
                    ...form.pages,
                    { ...pageForm, pageNumber: form.pages.length + 1 },
                ],
            });
        }

        setPageForm({ title: "", content: "", mediaUrl: "" });
        setContentDialogOpen(false);
    };

    const handleEditPage = (pageIdx) => {
        setPageForm(form.pages[pageIdx]);
        setEditingPageIndex(pageIdx);
        setContentDialogOpen(true);
    };

    const handleRemovePage = (pageIdx) => {
        const updated = form.pages.filter((_, i) => i !== pageIdx);
        const renumbered = updated.map((p, idx) => ({
            ...p,
            pageNumber: idx + 1,
        }));
        setForm({ ...form, pages: renumbered });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.courseName || !form.moduleNumber || !form.moduleTitle) {
            alert("⚠️ Please select a course and enter module details.");
            return;
        }

        // module number validation (unique within course)
        const duplicateModuleNumber = modules.some(
            (m, idx) =>
                idx !== editingIndex &&
                m.courseName === form.courseName &&
                m.moduleNumber === form.moduleNumber
        );
        if (duplicateModuleNumber) {
            alert("❌ A module with this number already exists for this course.");
            return;
        }

        // module title validation (unique within course)
        const duplicateModuleTitle = modules.some(
            (m, idx) =>
                idx !== editingIndex &&
                m.courseName === form.courseName &&
                m.moduleTitle.trim().toLowerCase() ===
                form.moduleTitle.trim().toLowerCase()
        );
        if (duplicateModuleTitle) {
            alert("❌ A module with this title already exists for this course.");
            return;
        }

        if (editingIndex !== null) {
            const updated = [...modules];
            updated[editingIndex] = { ...form, status: "Draft" };
            setModules(updated);
            setEditingIndex(null);
        } else {
            setModules([...modules, { ...form, status: "Draft" }]);
        }

        setForm({
            courseName: "",
            moduleNumber: "",
            moduleTitle: "",
            moduleDescription: "",
            moduleDuration: "",
            pages: [],
        });
        setPageForm({ title: "", content: "", mediaUrl: "" });
    };

    const handleEditModule = (idx) => {
        const {
            courseName,
            moduleNumber,
            moduleTitle,
            moduleDescription,
            moduleDuration,
            pages,
        } = modules[idx];
        setForm({
            courseName,
            moduleNumber,
            moduleTitle,
            moduleDescription,
            moduleDuration,
            pages,
        });
        setEditingIndex(idx);
    };

    const handleDiscard = () => {
        setForm({
            courseName: "",
            moduleNumber: "",
            moduleTitle: "",
            moduleDescription: "",
            moduleDuration: "",
            pages: [],
        });
        setPageForm({ title: "", content: "", mediaUrl: "" });
        setEditingIndex(null);
        setEditingPageIndex(null);
    };

    const moduleTitlesForCourse = modules
        .filter((m) => m.courseName === form.courseName)
        .map((m) => m.moduleTitle);

    return (
        <Box sx={{ padding: "2rem", maxWidth: 1000, margin: "0 auto" }}>
            <Typography variant="h4" gutterBottom fontWeight={700}>
                Module Management
            </Typography>

            {/* Module creation/edit form */}
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
                                    <MenuItem key={idx} value={c.name}>
                                        {c.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            label="Module Number"
                            name="moduleNumber"
                            value={form.moduleNumber}
                            onChange={handleChange}
                            required
                        />

                        <Autocomplete
                            freeSolo
                            options={moduleTitlesForCourse}
                            value={form.moduleTitle}
                            onChange={(_, newValue) =>
                                setForm({
                                    ...form,
                                    moduleTitle: newValue || "",
                                })
                            }
                            onInputChange={(_, newInput) =>
                                setForm({ ...form, moduleTitle: newInput })
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Module Title"
                                    required
                                />
                            )}
                        />

                        <TextField
                            label="Module Description"
                            name="moduleDescription"
                            value={form.moduleDescription}
                            onChange={handleChange}
                            multiline
                            rows={3}
                            fullWidth
                        />

                        <TextField
                            label="Module Duration"
                            name="moduleDuration"
                            value={form.moduleDuration}
                            onChange={handleChange}
                            placeholder="e.g., 2 weeks"
                            fullWidth
                        />

                        <Typography variant="h6" mt={2}>
                            Add / Edit Pages
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
                            <Button
                                variant="contained"
                                startIcon={<Add />}
                                onClick={() => setContentDialogOpen(true)}
                                sx={{ alignSelf: "flex-start" }}
                            >
                                {editingPageIndex !== null
                                    ? "Update Page"
                                    : "Add Page"}
                            </Button>
                        </Stack>

                        {form.pages.length > 0 && (
                            <Box sx={{ mt: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                    Pages in this Module
                                </Typography>
                                <Stack spacing={2}>
                                    {form.pages.map((p, idx) => (
                                        <Card
                                            key={idx}
                                            variant="outlined"
                                            sx={{ borderRadius: 2 }}
                                        >
                                            <CardContent>
                                                <Box
                                                    display="flex"
                                                    justifyContent="space-between"
                                                    alignItems="center"
                                                >
                                                    <Typography
                                                        variant="subtitle1"
                                                        fontWeight={600}
                                                    >
                                                        Page {p.pageNumber}.{" "}
                                                        {p.title}
                                                    </Typography>
                                                    <Box>
                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{ mr: 1 }}
                                                            onClick={() =>
                                                                handleEditPage(
                                                                    idx
                                                                )
                                                            }
                                                        >
                                                            Edit
                                                        </Button>
                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            onClick={() =>
                                                                handleRemovePage(
                                                                    idx
                                                                )
                                                            }
                                                        >
                                                            <Delete fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                </Box>
                                                <Divider sx={{ my: 1 }} />
                                                <Typography
                                                    variant="body1"
                                                    sx={{ mb: 1 }}
                                                >
                                                    {p.content}
                                                </Typography>
                                                {p.mediaUrl && (
                                                    <Typography
                                                        variant="body2"
                                                        color="primary"
                                                    >
                                                        Media:{" "}
                                                        <a
                                                            href={p.mediaUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
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
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                            >
                                {editingIndex !== null
                                    ? "Update Module"
                                    : "Add Module"}
                            </Button>
                            {(editingIndex !== null ||
                                editingPageIndex !== null) && (
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={handleDiscard}
                                    >
                                        Discard
                                    </Button>
                                )}
                        </Stack>
                    </Stack>
                </form>
            </Paper>

            {/* Existing modules list */}
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
                            <TableCell>Course Name</TableCell>
                            <TableCell>Module #</TableCell>
                            <TableCell>Module Title</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Duration</TableCell>
                            <TableCell>Pages</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {modules.map((m, index) => (
                            <TableRow key={index} hover>
                                <TableCell>{m.courseName}</TableCell>
                                <TableCell>{m.moduleNumber}</TableCell>
                                <TableCell>{m.moduleTitle}</TableCell>
                                <TableCell>{m.moduleDescription}</TableCell>
                                <TableCell>{m.moduleDuration}</TableCell>
                                <TableCell>{m.pages.length}</TableCell>
                                <TableCell>{m.status}</TableCell>
                                <TableCell align="right">
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() => handleEditModule(index)}
                                    >
                                        Edit Module
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {modules.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                                    No modules added yet.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Paper>

            {/* Dialog for Page Content */}
            <Dialog
                open={contentDialogOpen}
                onClose={() => setContentDialogOpen(false)}
                maxWidth="md"
                fullWidth
                scroll="paper"
            >
                <DialogTitle>
                    {editingPageIndex !== null ? "Edit Page" : "Add Page"}
                </DialogTitle>
                <DialogContent dividers>
                    <TextField
                        label="Page Title"
                        name="title"
                        value={pageForm.title}
                        onChange={handlePageChange}
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Page Content"
                        name="content"
                        value={pageForm.content}
                        onChange={handlePageChange}
                        multiline
                        rows={15}
                        fullWidth
                    />
                    <TextField
                        label="Media URL"
                        name="mediaUrl"
                        value={pageForm.mediaUrl}
                        onChange={handlePageChange}
                        fullWidth
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setContentDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSavePage} variant="contained">
                        {editingPageIndex !== null ? "Update Page" : "Save Page"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
