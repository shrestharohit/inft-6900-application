// src/Pages/Admin/adminQuizApproval.jsx
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
} from "@mui/material";

const STORAGE_KEY = "course_owner_quizzes";

function AdminQuizApproval() {
  const [quizzes, setQuizzes] = useState([]);
  const [snack, setSnack] = useState({ open: false, severity: "info", msg: "" });

  // Load quizzes from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    setQuizzes(stored);
  }, []);

  // Persist quizzes to localStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quizzes));
  }, [quizzes]);

  // Update status (Approve / Decline / Inactivate)
  const updateStatus = (idx, status) => {
    const updated = [...quizzes];
    updated[idx].status = status;
    setQuizzes(updated);

    let msg = "";
    if (status === "Active") msg = "✅ Quiz approved and now Active.";
    if (status === "Draft") msg = "❌ Quiz declined and moved back to Draft.";
    if (status === "Inactive") msg = "⚠️ Quiz deactivated.";
    setSnack({ open: true, severity: "info", msg });
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: "24px auto", padding: "0 16px" }}>
      <Paper sx={{ padding: 3, borderRadius: 3, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}>
        <Typography variant="h5" fontWeight={700} mb={3}>
          Quiz Approval
        </Typography>

        <Paper variant="outlined" sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ background: "#f7f7f9" }}>
              <TableRow>
                <TableCell>Course</TableCell>
                <TableCell>Module</TableCell>
                <TableCell>Quiz Title</TableCell>
                <TableCell>Time Limit</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {quizzes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4, color: "text.secondary" }}>
                    No quizzes submitted yet.
                  </TableCell>
                </TableRow>
              ) : (
                quizzes.map((quiz, idx) => (
                  <TableRow key={idx} hover>
                    <TableCell>{quiz.courseTitle}</TableCell>
                    <TableCell>{quiz.moduleTitle}</TableCell>
                    <TableCell>{quiz.quizTitle}</TableCell>
                    <TableCell>{quiz.timeLimit} mins</TableCell>
                    <TableCell>{quiz.status}</TableCell>
                    <TableCell align="right">
                      {quiz.status === "Wait for Approval" && (
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
                      {quiz.status === "Active" && (
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
                      {(quiz.status === "Draft" || quiz.status === "Inactive") && (
                        <Typography variant="body2" color="text.secondary">
                          Waiting for owner update
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Paper>
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

export default AdminQuizApproval;
