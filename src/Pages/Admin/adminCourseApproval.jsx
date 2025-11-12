import React, { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tooltip,
  Snackbar,
  Alert,
  Collapse,
  IconButton,
  Button,
  Typography,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import useCourseApi from "../../hooks/useCourseApi";
import usePathwayApi from "../../hooks/usePathwayApi";
import { truncateText } from "../../utils/global";
import { useNavigate } from "react-router-dom";

const AdminCourseApproval = () => {
  const [courses, setCourses] = useState([]);
  const [pathways, setPathways] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [snack, setSnack] = useState({
    open: false,
    severity: "success",
    msg: "",
  });
  const { fetchAllCourses, updateCourse } = useCourseApi();
  const { fetchAllPathways } = usePathwayApi();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [courseRes, pathwayRes] = await Promise.all([
          fetchAllCourses(),
          fetchAllPathways(),
        ]);
        if (!mounted) return;

        // Hide all draft courses from admin view
        const filteredCourses = (courseRes || []).filter(
          (course) => course.status?.toLowerCase() !== "draft"
        );

        setCourses(filteredCourses);
        setPathways(pathwayRes?.pathways || []);
      } catch (e) {
        console.error("Failed to load data", e);
        if (mounted) {
          setCourses([]);
          setPathways([]);
        }
      }
    };
    load();
    return () => (mounted = false);
  }, [fetchAllCourses, fetchAllPathways]);

  const updateStatus = async (courseID, status) => {
    if (!courseID) {
      setSnack({ open: true, severity: "error", msg: "Missing course id" });
      return;
    }

    try {
      await updateCourse(courseID, { status });
      setSnack({
        open: true,
        severity: "success",
        msg: "✅ Course status updated.",
      });

      // Re-fetch and re-filter so drafts remain hidden
      const res = await fetchAllCourses();
      const filteredCourses = (res || []).filter(
        (course) => course.status?.toLowerCase() !== "draft"
      );
      setCourses(filteredCourses);
    } catch (err) {
      console.error("Failed to update course", err);
      setSnack({ open: true, severity: "error", msg: "❌ Update failed." });
    }
  };

  const toggleExpand = (courseID) =>
    setExpanded((prev) => ({ ...prev, [courseID]: !prev[courseID] }));

  const statusMapper = {
    wait_for_approval: "Wait For Approval",
    draft: "Draft",
    active: "Active",
    inactive: "Inactive",
  };

  const getPathwayName = (id) =>
    pathways.find((p) => p.pathwayID === id)?.name || "—";

  return (
    <div className="max-w-6xl mx-auto mt-6 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-4">Course Approval</h2>

        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <Table className="min-w-full border-collapse">
            <TableHead>
              <TableRow className="bg-gray-100 text-gray-800">
                <TableCell />
                <TableCell className="font-semibold">Course Name</TableCell>
                <TableCell className="font-semibold">Category</TableCell>
                <TableCell className="font-semibold">Pathway</TableCell>
                <TableCell className="font-semibold">Outline</TableCell>
                <TableCell className="font-semibold">Status</TableCell>
                <TableCell align="right" className="font-semibold">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {courses.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    align="center"
                    className="py-8 text-gray-500 italic"
                  >
                    No courses submitted yet.
                  </TableCell>
                </TableRow>
              ) : (
                courses.map((course, idx) => {
                  const status = statusMapper[course.status] || "—";
                  return (
                    <React.Fragment key={idx}>
                      <TableRow
                        className={`hover:bg-gray-50 transition ${
                          course.status === "wait_for_approval"
                            ? "border-l-4 border-yellow-500"
                            : ""
                        }`}
                      >
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

                        <TableCell className="font-medium text-gray-800">
                          {course.title}
                        </TableCell>
                        <TableCell>{course.category}</TableCell>
                        <TableCell className="italic text-gray-600">
                          {getPathwayName(course.pathwayID)}
                        </TableCell>
                        <TableCell>{truncateText(course.outline)}</TableCell>
                        <TableCell>{status}</TableCell>

                        <TableCell align="right">
                          {course.status === "wait_for_approval" && (
                            <div className="flex flex-col gap-2 items-end">
                              <Tooltip title="Approve">
                                <Button
                                  variant="contained"
                                  color="success"
                                  size="small"
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
                            </div>
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
                              Inactive — owner can edit & resubmit.
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>

                      {/* Expanded details */}
                      <TableRow>
                        <TableCell colSpan={7} className="p-0">
                          <Collapse
                            in={expanded[course.courseID]}
                            timeout="auto"
                            unmountOnExit
                          >
                            <div className="m-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                              <p className="text-gray-700 text-sm mb-2">
                                <strong>Full Outline:</strong> {course.outline}
                              </p>
                              <a
                                className="text-blue-600 underline cursor-pointer"
                                onClick={() =>
                                  navigate(`/courses/${course.courseID}`)
                                }
                              >
                                View course details →
                              </a>
                            </div>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

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
    </div>
  );
};

export default AdminCourseApproval;
