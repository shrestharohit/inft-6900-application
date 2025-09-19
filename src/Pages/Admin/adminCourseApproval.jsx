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
    Alert,
    Collapse,
    IconButton,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";

const STORAGE_KEY = "course_owner_courses";
const MODULES_KEY = "course_owner_modules";

const AdminCourseApproval = () => {
    const [courses, setCourses] = useState([]);
    const [modules, setModules] = useState([]);
    const [expanded, setExpanded] = useState({});
    const [snack, setSnack] = useState({ open: false, severity: "success", msg: "" });

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

    // helper to update modules associated with a course
    const syncModulesForCourse = (courseName, newStatus) => {
        try {
            const raw = localStorage.getItem(MODULES_KEY);
            if (!raw) return;
            const mods = JSON.parse(raw);
            const updated = mods.map((m) => {
                if (m.courseName === courseName) {
                    return { ...m, status: newStatus };
                }
                return m;
            });
            localStorage.setItem(MODULES_KEY, JSON.stringify(updated));
            setModules(updated);
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
            syncModulesForCourse(updated[idx].name, "Active");
        } else if (status === "Draft") {
            msg = "❌ Course declined and moved back to Draft.";
            syncModulesForCourse(updated[idx].name, "Draft");
        } else if (status === "Inactive") {
            msg = "⚠️ Course deactivated.";
            syncModulesForCourse(updated[idx].name, "Inactive");
        }

        setSnack({ open: true, severity: "info", msg });
    };

    const toggleExpand = (courseName) => {
        setExpanded((prev) => ({ ...prev, [courseName]: !prev[courseName] }));
    };

    const getModulesForCourse = (courseName) =>
        modules.filter((m) => m.courseName === courseName);

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
                                <TableCell />
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
                                    <TableCell colSpan={7} align="center" sx={{ py: 4, color: "text.secondary" }}>
                                        No courses submitted yet.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                courses.map((course, idx) => {
                                    const courseModules = getModulesForCourse(course.name);
                                    return (
                                        <React.Fragment key={idx}>
                                            <TableRow hover>
                                                <TableCell>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => toggleExpand(course.name)}
                                                    >
                                                        {expanded[course.name] ? (
                                                            <KeyboardArrowUp />
                                                        ) : (
                                                            <KeyboardArrowDown />
                                                        )}
                                                    </IconButton>
                                                </TableCell>
                                                <TableCell>{course.name}</TableCell>
                                                <TableCell>{course.category}</TableCell>
                                                <TableCell>{course.outline}</TableCell>
                                                <TableCell>{course.duration}</TableCell>
                                                <TableCell>{course.status}</TableCell>
                                                <TableCell align="right">
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

                                                    {course.status === "Inactive" && (
                                                        <Typography variant="body2" color="text.secondary">
                                                            Course is inactive. Owner can edit & request approval.
                                                        </Typography>
                                                    )}

                                                    {course.status === "Draft" && (
                                                        <Typography variant="body2" color="text.secondary">
                                                            Pending owner submission
                                                        </Typography>
                                                    )}
                                                </TableCell>
                                            </TableRow>

                                            {/* Expanded content: modules + pages */}
                                            <TableRow>
                                                <TableCell colSpan={7} sx={{ py: 0 }}>
                                                    <Collapse in={expanded[course.name]} timeout="auto" unmountOnExit>
                                                        <Box sx={{ m: 2 }}>
                                                            {courseModules.length === 0 ? (
                                                                <Typography color="text.secondary">
                                                                    No modules for this course.
                                                                </Typography>
                                                            ) : (
                                                                courseModules.map((mod, mIdx) => (
                                                                    <Box key={mIdx} sx={{ mb: 2 }}>
                                                                        <Typography variant="subtitle1" fontWeight={600}>
                                                                            Module: {mod.moduleTitle} ({mod.status})
                                                                        </Typography>
                                                                        {mod.pages.length === 0 ? (
                                                                            <Typography color="text.secondary" ml={2}>
                                                                                No pages in this module.
                                                                            </Typography>
                                                                        ) : (
                                                                            mod.pages.map((p, pIdx) => (
                                                                                <Box key={pIdx} ml={3} mb={1}>
                                                                                    <Typography variant="body2">
                                                                                        {p.pageNumber}. <b>{p.title}</b> –{" "}
                                                                                        {p.content.substring(0, 80)}
                                                                                        {p.content.length > 80 && "..."}
                                                                                    </Typography>
                                                                                    {p.mediaUrl && (
                                                                                        <Typography
                                                                                            variant="caption"
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
                                                                                </Box>
                                                                            ))
                                                                        )}
                                                                    </Box>
                                                                ))
                                                            )}
                                                        </Box>
                                                    </Collapse>
                                                </TableCell>
                                            </TableRow>
                                        </React.Fragment>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </Paper>
            </Box>

            <Snackbar
                open={snack.open}
                autoHideDuration={2500}
                onClose={() => setSnack((s) => ({ ...s, open: false }))}
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
