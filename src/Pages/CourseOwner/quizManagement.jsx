// src/Pages/CourseOwner/quizManagement.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const STORAGE_KEY = "course_owner_quizzes";

export default function QuizManagement() {
  const [quizzes, setQuizzes] = useState([]);
  const [form, setForm] = useState({ module: "", timeLimit: "" });
  const [questions, setQuestions] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  const [questionForm, setQuestionForm] = useState({
    text: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    feedback: "",
    image: null,
  });

  // Load quizzes from localStorage
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setQuizzes(JSON.parse(raw));
      } catch {
        setQuizzes([]);
      }
    }
  }, []);

  // Sync quizzes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quizzes));
  }, [quizzes]);

  // Quiz form handlers
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Question form handlers
  const handleQuestionChange = (e) => {
    setQuestionForm({ ...questionForm, [e.target.name]: e.target.value });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...questionForm.options];
    newOptions[index] = value;
    setQuestionForm({ ...questionForm, options: newOptions });
  };

  const handleQuestionImage = (e) => {
    if (e.target.files[0]) {
      setQuestionForm({
        ...questionForm,
        image: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const addQuestion = () => {
    if (
      !questionForm.text ||
      questionForm.options.some((o) => !o) ||
      !questionForm.correctAnswer
    ) {
      alert("Please fill all question fields.");
      return;
    }
    setQuestions([...questions, { ...questionForm }]);
    setQuestionForm({
      text: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      feedback: "",
      image: null,
    });
  };

  const deleteQuestion = (qIndex) => {
    const updatedQuestions = questions.filter((_, i) => i !== qIndex);

    if (updatedQuestions.length === 0 && editingIndex !== null) {
      // If it was the last question, delete the entire quiz
      const updatedQuizzes = [...quizzes];
      updatedQuizzes.splice(editingIndex, 1);
      setQuizzes(updatedQuizzes);
      setForm({ module: "", timeLimit: "" });
      setEditingIndex(null);
      setQuestions([]);
      alert("Last question deleted. Entire quiz has been removed.");
    } else {
      setQuestions(updatedQuestions);
    }
  };

  const handleEditQuiz = (index) => {
    const quiz = quizzes[index];
    setForm({ module: quiz.module, timeLimit: quiz.timeLimit });
    setQuestions(quiz.questions);
    setEditingIndex(index);
  };

  const handleRequestApproval = (index) => {
    const updated = [...quizzes];
    updated[index].status = "Wait for Approval";
    setQuizzes(updated);
  };

  const handleDeleteQuiz = (index) => {
    const updated = quizzes.filter((_, i) => i !== index);
    setQuizzes(updated);
  };

  const handleSaveQuiz = () => {
    if (!form.module || !form.timeLimit || questions.length === 0) {
      alert("Please fill all quiz fields and add at least one question.");
      return;
    }
    const newQuiz = { ...form, questions, status: "Draft" };

    if (editingIndex !== null) {
      const updated = [...quizzes];
      updated[editingIndex] = newQuiz; // overwrite existing quiz
      setQuizzes(updated);
      setEditingIndex(null);
    } else {
      setQuizzes([...quizzes, newQuiz]);
    }

    setForm({ module: "", timeLimit: "" });
    setQuestions([]);
  };

  return (
    <Box sx={{ padding: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        Quiz Management
      </Typography>

      {/* Quiz Form */}
      <Paper sx={{ padding: "1.5rem", marginBottom: "2rem" }}>
        <Stack spacing={2}>
          <TextField
            label="Module"
            name="module"
            value={form.module}
            onChange={handleChange}
            required
          />
          <TextField
            label="Time Limit (minutes)"
            name="timeLimit"
            type="number"
            value={form.timeLimit}
            onChange={handleChange}
            required
          />

          {/* Question Form */}
          <Paper sx={{ padding: "1rem", mt: 1 }}>
            <Typography variant="h6">Add / Edit Question</Typography>
            <TextField
              label="Question Text"
              name="text"
              value={questionForm.text}
              onChange={handleQuestionChange}
              fullWidth
              margin="normal"
            />
            {questionForm.options.map((opt, i) => (
              <TextField
                key={i}
                label={`Option ${i + 1}`}
                value={opt}
                onChange={(e) => handleOptionChange(i, e.target.value)}
                fullWidth
                margin="normal"
              />
            ))}
            <TextField
              label="Correct Answer"
              name="correctAnswer"
              value={questionForm.correctAnswer}
              onChange={handleQuestionChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Feedback"
              name="feedback"
              value={questionForm.feedback}
              onChange={handleQuestionChange}
              fullWidth
              margin="normal"
            />
            <Button variant="outlined" component="label" sx={{ mt: 1 }}>
              Upload Image
              <input type="file" hidden onChange={handleQuestionImage} />
            </Button>
            {questionForm.image && (
              <Box mt={1}>
                <img
                  src={questionForm.image}
                  alt="Question"
                  style={{ maxWidth: 200, borderRadius: 8 }}
                />
              </Box>
            )}
            <Button
              variant="contained"
              color="secondary"
              onClick={addQuestion}
              sx={{ mt: 1 }}
            >
              Add Question
            </Button>
          </Paper>

          {/* Questions Preview */}
          {questions.length > 0 && (
            <Paper sx={{ mt: 2, p: 2 }}>
              <Typography variant="h6">Questions Preview</Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Question</TableCell>
                    <TableCell>Options</TableCell>
                    <TableCell>Correct Answer</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {questions.map((q, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>{q.text}</TableCell>
                      <TableCell>{q.options.join(", ")}</TableCell>
                      <TableCell>{q.correctAnswer}</TableCell>
                      <TableCell>
                        <IconButton
                          color="error"
                          onClick={() => deleteQuestion(idx)}
                        >
                          <DeleteOutlineIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          )}

          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveQuiz}
          >
            {editingIndex !== null ? "Update Quiz" : "Save Quiz"}
          </Button>
        </Stack>
      </Paper>

      {/* Existing Quizzes Table */}
      <Paper>
        <Typography variant="h6" sx={{ padding: "1rem" }}>
          Existing Quizzes
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Module</TableCell>
              <TableCell>Time Limit</TableCell>
              <TableCell># Questions</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {quizzes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  No quizzes added yet.
                </TableCell>
              </TableRow>
            ) : (
              quizzes.map((quiz, idx) => (
                <TableRow key={idx}>
                  <TableCell>{quiz.module}</TableCell>
                  <TableCell>{quiz.timeLimit} min</TableCell>
                  <TableCell>{quiz.questions.length}</TableCell>
                  <TableCell>{quiz.status}</TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      display: "flex",
                      gap: 1,
                      justifyContent: "flex-end",
                      flexWrap: "wrap",
                    }}
                  >
                    {quiz.status !== "Wait for Approval" && (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleEditQuiz(idx)}
                      >
                        Edit
                      </Button>
                    )}
                    {(quiz.status === "Draft" || quiz.status === "Inactive") && (
                      <Button
                        variant="contained"
                        size="small"
                        color="success"
                        onClick={() => handleRequestApproval(idx)}
                      >
                        Request Approval
                      </Button>
                    )}
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      onClick={() => handleDeleteQuiz(idx)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
