// src/Pages/Admin/adminCourseApproval.jsx
import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Paper,
    Table, TableHead, TableRow, TableCell, TableBody,
    Button,
    Tooltip,
    Snackbar,
    Alert
} from "@mui/material";

const STORAGE_KEY = "course_owner_courses"; // same key used in CourseOwner page

const AdminCourseApproval = () => {
    const [courses, setCourses] = useState([]);
    const [snack, setSnack] = useState({ open: false, severity: "success", msg: "" });

    // Load courses from localStorage
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

    // Sync changes back to localStorage
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
    }, [courses]);

    const updateStatus = (idx, status) => {
        const next = [...courses];
        next[idx].status = status;
        setCourses(next);

        let msg = "";
        if (status === "Active") msg = "Course approved and activated.";
        if (status === "Draft") msg = "Course declined and moved to draft.";
        if (status === "Inactive") msg = "Course deactivated.";
        setSnack({ open: true, severity: "info", msg });
    };

    return (
        <Box sx={styles.page}>
            <Box sx={styles.card}>
                <Typography variant="h5" fontWeight={700} mb={2}>
                    Course Approval
                </Typography>

                <Paper variant="outlined">
                    <Table>
                        <TableHead sx={{ background: "#f7f7f9" }}>
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
                                    <TableCell colSpan={6} align="center" sx={{ py: 4, color: "text.secondary" }}>
                                        No courses submitted yet.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                courses.map((c, idx) => (
                                    <TableRow key={idx} hover>
                                        <TableCell>{c.name}</TableCell>
                                        <TableCell>{c.category}</TableCell>
                                        <TableCell>{c.outline}</TableCell>
                                        <TableCell>{c.duration}</TableCell>
                                        <TableCell>{c.status}</TableCell>
                                        <TableCell align="right">
                                            {c.status === "Wait for Approval" && (
                                                <>
                                                    <Tooltip title="Approve">
                                                        <Button
                                                            variant="contained"
                                                            color="success"
                                                            size="small"
                                                            sx={{ mr: 1 }}
                                                            onClick={() => updateStatus(idx, "Active")}
                                                        >
                                                            Approve
                                                        </Button>
                                                    </Tooltip>
                                                    <Tooltip title="Decline">
                                                        <Button
                                                            variant="outlined"
                                                            color="error"
                                                            size="small"
                                                            onClick={() => updateStatus(idx, "Draft")}
                                                        >
                                                            Decline
                                                        </Button>
                                                    </Tooltip>
                                                </>
                                            )}

                                            {c.status === "Active" && (
                                                <Tooltip title="Deactivate">
                                                    <Button
                                                        variant="outlined"
                                                        color="warning"
                                                        size="small"
                                                        onClick={() => updateStatus(idx, "Inactive")}
                                                    >
                                                        Deactivate
                                                    </Button>
                                                </Tooltip>
                                            )}

                                            {c.status === "Inactive" && (
                                                <Tooltip title="Reactivate">
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        size="small"
                                                        onClick={() => updateStatus(idx, "Active")}
                                                    >
                                                        Reactivate
                                                    </Button>
                                                </Tooltip>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </Paper>
            </Box>

            <Snackbar
                open={snack.open}
                autoHideDuration={2500}
                onClose={() => setSnack(s => ({ ...s, open: false }))}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert severity={snack.severity} variant="filled">
                    {snack.msg}
                </Alert>
            </Snackbar>
        </Box>
    );
};

const styles = {
    page: {
        maxWidth: 1200,
        margin: "24px auto",
        padding: "0 16px",
    },
    card: {
        background: "#fff",
        borderRadius: 10,
        padding: 20,
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    },
};

export default AdminCourseApproval;
