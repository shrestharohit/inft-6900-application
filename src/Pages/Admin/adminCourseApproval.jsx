// src/Pages/Admin/adminCourseApproval.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Tooltip,
  Snackbar,
  Alert,
  Collapse,
  IconButton,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import useCourseApi from "../../hooks/useCourseApi";

const MODULES_KEY = "course_owner_modules";

const AdminCourseApproval = () => {
  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);
  const { fetchAllCourses, updateCourse } = useCourseApi();
  const [expanded, setExpanded] = useState({});
  const [snack, setSnack] = useState({
    open: false,
    severity: "success",
    msg: "",
  });

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetchAllCourses();
        if (!mounted) return;
        setCourses(res);
      } catch (e) {
        console.error("Failed to load courses for approval", e);
        if (mounted) setCourses([]);
      }
    };

    load();
    return () => (mounted = false);
  }, [fetchAllCourses]);

  const updateStatus = async (courseID, status) => {
    if (!courseID) {
      setSnack({ open: true, severity: "error", msg: "Missing course id" });
      return;
    }

    try {
      const res = await updateCourse(courseID, { status });
      setCourses((prev) =>
        prev.map((course) =>
          course.courseID === courseID ? { ...course, status: status } : course
        )
      );
      setSnack({ open: true, severity: "success", msg });
    } catch (err) {
      console.error("Failed to update course status", err);
      setSnack({
        open: true,
        severity: "error",
        msg: "Failed to update course status",
      });
    }
  };

  const toggleExpand = (courseID) => {
    setExpanded((prev) => ({ ...prev, [courseID]: !prev[courseID] }));
  };

  const getModulesForCourse = (courseID) => [];

  const statusMapper = {
    wait_for_approval: "Wait For Approval",
    draft: "Draft",
    active: "Active",
    inactive: "Inactive",
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
                <TableCell />
                <TableCell>Course Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Outline</TableCell>
                {/* <TableCell>Duration</TableCell> */}
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    align="center"
                    sx={{ py: 4, color: "text.secondary" }}
                  >
                    No courses submitted yet.
                  </TableCell>
                </TableRow>
              ) : (
                courses.map((course, idx) => {
                  return (
                    <React.Fragment key={idx}>
                      <TableRow hover>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => toggleExpand(course.courseID)}
                          >
                            {expanded[course.courseID] ? (
                              <KeyboardArrowUp />
                            ) : (
                              <KeyboardArrowDown />
                            )}
                          </IconButton>
                        </TableCell>
                        <TableCell>{course.title}</TableCell>
                        <TableCell>{course.category}</TableCell>
                        <TableCell>{course.outline}</TableCell>
                        {/* <TableCell>{course.duration}</TableCell> */}
                        <TableCell>{statusMapper[course.status]}</TableCell>
                        <TableCell align="right">
                          {course.status === "wait_for_approval" && (
                            <>
                              <Tooltip title="Approve">
                                <Button
                                  variant="contained"
                                  color="success"
                                  size="small"
                                  sx={{ mr: 1 }}
                                  onClick={() =>
                                    updateStatus(course.courseID, "active")
                                  }
                                >
                                  Approve
                                </Button>
                              </Tooltip>
                              <Tooltip title="Decline">
                                <Button
                                  variant="outlined"
                                  color="error"
                                  size="small"
                                  onClick={() =>
                                    updateStatus(course.courseID, "draft")
                                  }
                                >
                                  Decline
                                </Button>
                              </Tooltip>
                            </>
                          )}

                          {course.status === "active" && (
                            <Tooltip title="Deactivate">
                              <Button
                                variant="outlined"
                                color="warning"
                                size="small"
                                onClick={() =>
                                  updateStatus(course.courseID, "inactive")
                                }
                              >
                                Inactivate
                              </Button>
                            </Tooltip>
                          )}

                          {course.status === "inactive" && (
                            <Typography variant="body2" color="text.secondary">
                              Course is inactive. Owner can edit & request
                              approval.
                            </Typography>
                          )}

                          {course.status === "draft" && (
                            <Typography variant="body2" color="text.secondary">
                              Pending owner submission
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>

                      {/* Expanded content: modules + pages */}
                      <TableRow>
                        <TableCell colSpan={7} sx={{ py: 0 }}>
                          <Collapse
                            in={expanded[course.courseID]}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Box sx={{ m: 2 }}>
                              {course?.modules?.length === 0 ? (
                                <Typography color="text.secondary">
                                  No modules for this course.
                                </Typography>
                              ) : (
                                course?.modules?.map((mod, mIdx) => (
                                  <Box key={mIdx} sx={{ mb: 2 }}>
                                    <Typography
                                      variant="subtitle1"
                                      fontWeight={600}
                                    >
                                      Module: {mod.moduleTitle} ({mod.status})
                                    </Typography>
                                    {mod?.contents?.length === 0 ? (
                                      <Typography color="text.secondary" ml={2}>
                                        No pages in this module.
                                      </Typography>
                                    ) : (
                                      mod?.contents?.map((p, cIdx) => (
                                        <Box key={cIdx} ml={3} mb={1}>
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
