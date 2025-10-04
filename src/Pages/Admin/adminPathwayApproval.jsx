// src/Pages/Admin/adminPathwayApproval.jsx
import React, { useState, useEffect } from "react";
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
  Collapse,
  IconButton,
  Snackbar,
  Alert,
  TextField,
  Stack,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";

const STORAGE_KEY = "course_owner_pathways";

export default function AdminPathwayApproval() {
  const [pathways, setPathways] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [editing, setEditing] = useState({});
  const [snack, setSnack] = useState({ open: false, severity: "success", msg: "" });

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const allPathways = JSON.parse(raw);
      setPathways(
        allPathways.filter(
          (p) =>
            p.status === "Request for Approval" ||
            p.status === "Active" ||
            p.status === "Inactive" ||
            p.status === "Draft"
        )
      );
    }
  }, []);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    const allPathways = raw ? JSON.parse(raw) : [];
    const updatedAll = allPathways.map((p) => {
      const updated = pathways.find((ap) => ap.title === p.title);
      return updated ? updated : p;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAll));
  }, [pathways]);

  const toggleExpand = (title) => setExpanded((prev) => ({ ...prev, [title]: !prev[title] }));

  const updateStatus = (idx, status) => {
    const updated = [...pathways];

    if (status === "Declined") {
      updated[idx].status = "Draft";
    } else {
      updated[idx].status = status;
    }

    setPathways(updated);

    let msg = "";
    if (status === "Active") msg = "✅ Pathway approved and now Active.";
    else if (status === "Declined") msg = "❌ Pathway declined. Waiting for owner resubmission.";
    else if (status === "Inactive") msg = "⚠️ Pathway deactivated.";
    else if (status === "Request for Approval") msg = "📩 Pathway submitted for approval.";

    setSnack({ open: true, severity: "info", msg });
  };

  const saveEdit = (idx, updatedData) => {
    const updated = [...pathways];

    const newCourses = updatedData.courses
      ? updatedData.courses.map((c) => {
          if (typeof c === "string") return { name: c.trim() };
          return c;
        })
      : updated[idx].courses;

    updated[idx] = {
      ...updated[idx],
      ...updatedData,
      courses: newCourses,
    };

    setPathways(updated);
    setEditing((prev) => ({ ...prev, [idx]: false }));
    setSnack({ open: true, severity: "success", msg: "✅ Pathway updated successfully." });
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: "24px auto", padding: "0 16px" }}>
      <Paper sx={{ padding: 3, borderRadius: 2 }}>
        <Typography variant="h5" fontWeight={700} mb={2}>
          Pathway Approval
        </Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Courses</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pathways.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4, color: "text.secondary" }}>
                  No pathways submitted for approval.
                </TableCell>
              </TableRow>
            ) : (
              pathways.map((p, idx) => (
                <React.Fragment key={idx}>
                  <TableRow hover>
                    <TableCell>
                      <IconButton size="small" onClick={() => toggleExpand(p.title)}>
                        {expanded[p.title] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                      </IconButton>
                    </TableCell>
                    <TableCell>{p.title}</TableCell>
                    <TableCell>{p.description}</TableCell>
                    <TableCell>{p.courses?.map((c) => c.name || c).join(", ")}</TableCell>
                    <TableCell>{p.status}</TableCell>
                    <TableCell align="right">
                      {p.status === "Request for Approval" && (
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
                              onClick={() => updateStatus(idx, "Declined")}
                            >
                              Decline
                            </Button>
                          </Tooltip>
                        </>
                      )}
                      {p.status === "Active" && (
                        <Tooltip title="Inactivate">
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
                      {p.status === "Inactive" && (
                        <Typography color="text.secondary" variant="body2">
                          Course is inactive. Owner can edit & request approval
                        </Typography>
                      )}
                      {p.status === "Draft" && (
                        <Typography color="text.secondary" variant="body2">
                          Pending Owner Submission
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell colSpan={6} sx={{ py: 0 }}>
                      <Collapse in={expanded[p.title]} timeout="auto" unmountOnExit>
                        <Box sx={{ m: 2 }}>
                          {editing[idx] ? (
                            <Stack spacing={2}>
                              <TextField
                                fullWidth
                                label="Pathway Title"
                                defaultValue={p.title}
                                onChange={(e) => (p._newTitle = e.target.value)}
                              />
                              <TextField
                                fullWidth
                                label="Description"
                                defaultValue={p.description}
                                onChange={(e) => (p._newDescription = e.target.value)}
                              />
                              <TextField
                                fullWidth
                                label="Courses (comma separated)"
                                defaultValue={p.courses?.map((c) => c.name || c).join(", ")}
                                onChange={(e) => (p._newCourses = e.target.value.split(","))}
                              />
                              <Box>
                                <Button
                                  variant="contained"
                                  color="success"
                                  size="small"
                                  sx={{ mr: 1 }}
                                  onClick={() =>
                                    saveEdit(idx, {
                                      title: p._newTitle || p.title,
                                      description: p._newDescription || p.description,
                                      courses: p._newCourses || p.courses,
                                    })
                                  }
                                >
                                  Save
                                </Button>
                                <Button
                                  variant="outlined"
                                  color="secondary"
                                  size="small"
                                  onClick={() => setEditing((prev) => ({ ...prev, [idx]: false }))}
                                >
                                  Cancel
                                </Button>
                              </Box>
                            </Stack>
                          ) : (
                            <>
                              {p.courses?.length === 0 ? (
                                <Typography color="text.secondary">No courses in this pathway.</Typography>
                              ) : (
                                p.courses.map((c, i) => (
                                  <Typography key={i} variant="body2" sx={{ mb: 0.5 }}>
                                    {i + 1}. {c.name || c}
                                  </Typography>
                                ))
                              )}
                            </>
                          )}
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>

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
}
