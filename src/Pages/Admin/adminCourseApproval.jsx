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

const STORAGE_KEY = "course_owner_courses";
const MODULES_KEY = "course_owner_modules";

const AdminCourseApproval = () => {
    const [courses, setCourses] = useState([]);
    const [snack, setSnack] = useState({ open: false, severity: "success", msg: "" });

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

    // helper to update modules associated with a course
    const syncModulesForCourse = (courseName, newStatus) => {
        try {
            const raw = localStorage.getItem(MODULES_KEY);
            if (!raw) return;
            const modules = JSON.parse(raw);
            const updated = modules.map((m) => {
                if (m.courseName === courseName) {
                    return { ...m, status: newStatus };
                }
                return m;
            });
            localStorage.setItem(MODULES_KEY, JSON.stringify(updated));
        } catch (e) {
            // ignore parse errors
        }
    };

    const updateStatus = (idx, status) => {
        const updated = [...courses];
        updated[idx].status = status;
        setCourses(updated);

        let msg = "";
        if (status === "Active") {
            msg = "✅ Course approved and now Active.";
            // When course approved, also activate all modules for that course
            syncModulesForCourse(updated[idx].name, "Active");
        } else if (status === "Draft") {
            msg = "❌ Course declined and moved back to Draft.";
            // Declining course moves its modules back to Draft
            syncModulesForCourse(updated[idx].name, "Draft");
        } else if (status === "Inactive") {
            msg = "⚠️ Course deactivated.";
            syncModulesForCourse(updated[idx].name, "Inactive");
        } else if (status === "Request for Approval") {
            msg = "🟡 Course sent for approval.";
            syncModulesForCourse(updated[idx].name, "Request for Approval");
        }

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
                                courses.map((course, idx) => (
                                    <TableRow key={idx} hover>
                                        <TableCell>{course.name}</TableCell>
                                        <TableCell>{course.category}</TableCell>
                                        <TableCell>{course.outline}</TableCell>
                                        <TableCell>{course.duration}</TableCell>
                                        <TableCell>{course.status}</TableCell>
                                        <TableCell align="right">
                                            {/* Wait for Approval → Approve / Decline */}
                                            {course.status === "Request for Approval" && (
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

                                            {/* Active → can Inactivate */}
                                            {course.status === "Active" && (
                                                <Tooltip title="Deactivate">
                                                    <Button
                                                        variant="outlined"
                                                        color="warning"
                                                        size="small"
                                                        onClick={() => updateStatus(idx, "Inactive")}
                                                    >
                                                        Inactivate
                                                    </Button>
                                                </Tooltip>
                                            )}

                                            {/* Inactive → show info only, owner edits in their page */}
                                            {course.status === "Inactive" && (
                                                <Typography variant="body2" color="text.secondary">
                                                    Course is inactive. Owner can edit & request approval.
                                                </Typography>
                                            )}

                                            {/* Draft → info only */}
                                            {course.status === "Draft" && (
                                                <Typography variant="body2" color="text.secondary">
                                                    Pending owner submission
                                                </Typography>
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
