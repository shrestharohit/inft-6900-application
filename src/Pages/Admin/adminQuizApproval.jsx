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
import useQuizApi from "../../hooks/useQuizApi";

const STORAGE_KEY = "course_owner_quizzes";

function AdminQuizApproval() {
  const [quizzes, setQuizzes] = useState([]);
  const [snack, setSnack] = useState({
    open: false,
    severity: "info",
    msg: "",
  });

  const { fetchQuizApprovalList, updateQuiz } = useQuizApi();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetchQuizApprovalList();
        if (!mounted) return;
        setQuizzes(res);
      } catch (e) {
        console.error("Failed to load courses for approval", e);
        if (mounted) setQuizzes([]);
        p;
      }
    };

    load();
    return () => (mounted = false);
  }, [fetchQuizApprovalList]);

  const updateStatus = async (quiz, status) => {
    let msg = "";
    const payload = { ...quiz, status };

    try {
      await updateQuiz(quiz.quizID, payload);
      if (status === "active") msg = "✅ Quiz approved and now Active.";
      if (status === "draft") msg = "❌ Quiz declined and moved back to Draft.";
      if (status === "inactive") msg = "⚠️ Quiz deactivated.";
      setSnack((s) => ({ ...s, open: true, severity: "success", msg }));
    } catch (err) {
      setSnack({
        open: true,
        severity: "error",
        msg: "Failed to update quiz status",
      });
    }
    const res = await fetchQuizApprovalList();
    setQuizzes(res);
  };

  const statusMapper = {
    wait_for_approval: "Wait For Approval",
    draft: "Draft",
    active: "Active",
    inactive: "Inactive",
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: "24px auto", padding: "0 16px" }}>
      <Paper
        sx={{
          padding: 3,
          borderRadius: 3,
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        }}
      >
        <Typography variant="h5" fontWeight={700} mb={3}>
          Quiz Approval
        </Typography>

        <Paper variant="outlined" sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ background: "#f7f7f9" }}>
              <TableRow>
                <TableCell>Index</TableCell>
                <TableCell>Quiz Title</TableCell>
                <TableCell>Time Limit (mins)</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {quizzes.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    align="center"
                    sx={{ py: 4, color: "text.secondary" }}
                  >
                    No quizzes submitted yet.
                  </TableCell>
                </TableRow>
              ) : (
                quizzes.map((quiz, idx) => (
                  <TableRow key={idx} hover>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{quiz.title}</TableCell>
                    <TableCell>{quiz.timeLimit}</TableCell>
                    <TableCell>{statusMapper[quiz.status]}</TableCell>
                    <TableCell align="right">
                      {quiz.status === "wait_for_approval" && (
                        <>
                          <Tooltip title="Approve">
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              sx={{ mr: 1 }}
                              onClick={() => updateStatus(quiz, "active")}
                            >
                              Approve
                            </Button>
                          </Tooltip>
                          <Tooltip title="Decline">
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              onClick={() => updateStatus(quiz, "draft")}
                            >
                              Decline
                            </Button>
                          </Tooltip>
                        </>
                      )}
                      {quiz.status === "active" && (
                        <Tooltip title="Deactivate">
                          <Button
                            variant="outlined"
                            color="warning"
                            size="small"
                            onClick={() => updateStatus(quiz, "inactive")}
                          >
                            Inactivate
                          </Button>
                        </Tooltip>
                      )}
                      {(quiz.status === "draft" ||
                        quiz.status === "inactive") && (
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
