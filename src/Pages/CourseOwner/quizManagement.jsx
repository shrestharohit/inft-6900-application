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
  Checkbox,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const STORAGE_KEY = "course_owner_quizzes";

export default function QuizManagement() {
  const [quizzes, setQuizzes] = useState([]);
  const [form, setForm] = useState({
    courseNumber: "",
    moduleNumber: "",
    quizTitle: "",
    timeLimit: "",
  });
  const [questions, setQuestions] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  const [questionForm, setQuestionForm] = useState({
    text: "",
    options: [
      { text: "", isCorrect: false, feedback: "" },
      { text: "", isCorrect: false, feedback: "" },
    ],
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

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...questionForm.options];
    newOptions[index][field] = value;
    setQuestionForm({ ...questionForm, options: newOptions });
  };

  const addOption = () => {
    setQuestionForm({
      ...questionForm,
      options: [...questionForm.options, { text: "", isCorrect: false, feedback: "" }],
    });
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
    if (!questionForm.text || questionForm.options.length < 2) {
      alert("⚠️ A question must have text and at least 2 options.");
      return;
    }
    if (questionForm.options.some((opt) => !opt.text.trim())) {
      alert("⚠️ Each option must have text.");
      return;
    }
    if (!questionForm.options.some((opt) => opt.isCorrect)) {
      alert("⚠️ At least one option must be marked correct.");
      return;
    }

    const newQuestion = {
      ...questionForm,
      number: questions.length + 1,
    };

    setQuestions([...questions, newQuestion]);

    setQuestionForm({
      text: "",
      options: [
        { text: "", isCorrect: false, feedback: "" },
        { text: "", isCorrect: false, feedback: "" },
      ],
      image: null,
    });
  };

  const deleteQuestion = (qIndex) => {
    const updatedQuestions = questions.filter((_, i) => i !== qIndex);
    const renumbered = updatedQuestions.map((q, i) => ({ ...q, number: i + 1 }));

    if (renumbered.length === 0 && editingIndex !== null) {
      // If it was the last question, delete the entire quiz
      const updatedQuizzes = [...quizzes];
      updatedQuizzes.splice(editingIndex, 1);
      setQuizzes(updatedQuizzes);
      setForm({ courseNumber: "", moduleNumber: "", quizTitle: "", timeLimit: "" });
      setEditingIndex(null);
      setQuestions([]);
      alert("Last question deleted. Entire quiz has been removed.");
    } else {
      setQuestions(renumbered);
    }
  };

  const handleEditQuiz = (index) => {
    const quiz = quizzes[index];
    setForm({
      courseNumber: quiz.courseNumber,
      moduleNumber: quiz.moduleNumber,
      quizTitle: quiz.quizTitle,
      timeLimit: quiz.timeLimit,
    });
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
    if (!form.courseNumber || !form.moduleNumber || !form.quizTitle || !form.timeLimit) {
      alert("⚠️ Please fill all quiz fields.");
      return;
    }
    if (questions.length === 0) {
      alert("⚠️ Add at least one question.");
      return;
    }

    // enforce one quiz per module
    const duplicateQuiz = quizzes.some(
      (q, idx) =>
        idx !== editingIndex &&
        q.courseNumber === form.courseNumber &&
        q.moduleNumber === form.moduleNumber
    );
    if (duplicateQuiz) {
      alert("❌ A quiz already exists for this module.");
      return;
    }

    const newQuiz = { ...form, questions, status: "Draft" };

    if (editingIndex !== null) {
      const updated = [...quizzes];
      updated[editingIndex] = newQuiz;
      setQuizzes(updated);
      setEditingIndex(null);
    } else {
      setQuizzes([...quizzes, newQuiz]);
    }

    setForm({ courseNumber: "", moduleNumber: "", quizTitle: "", timeLimit: "" });
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
            label="Course Number"
            name="courseNumber"
            value={form.courseNumber}
            onChange={handleChange}
            required
          />
          <TextField
            label="Module Number"
            name="moduleNumber"
            value={form.moduleNumber}
            onChange={handleChange}
            required
          />
          <TextField
            label="Quiz Title"
            name="quizTitle"
            value={form.quizTitle}
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
              <Stack key={i} direction="row" spacing={1} alignItems="center">
                <TextField
                  label={`Option ${i + 1}`}
                  value={opt.text}
                  onChange={(e) => handleOptionChange(i, "text", e.target.value)}
                  fullWidth
                  margin="normal"
                />
                <Checkbox
                  checked={opt.isCorrect}
                  onChange={(e) => handleOptionChange(i, "isCorrect", e.target.checked)}
                />
                <TextField
                  label="Feedback"
                  value={opt.feedback}
                  onChange={(e) => handleOptionChange(i, "feedback", e.target.value)}
                  fullWidth
                  margin="normal"
                />
              </Stack>
            ))}

            <Button
              startIcon={<AddCircleOutlineIcon />}
              onClick={addOption}
              sx={{ mt: 1 }}
            >
              Add Option
            </Button>

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
              sx={{ mt: 2 }}
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
                    <TableCell>Correct</TableCell>
                    <TableCell>Feedback</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {questions.map((q, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{q.number}</TableCell>
                      <TableCell>{q.text}</TableCell>
                      <TableCell>
                        {q.options.map((o, i) => (
                          <div key={i}>
                            {i + 1}. {o.text}
                          </div>
                        ))}
                      </TableCell>
                      <TableCell>
                        {q.options
                          .map((o, i) => (o.isCorrect ? `Option ${i + 1}` : null))
                          .filter(Boolean)
                          .join(", ")}
                      </TableCell>
                      <TableCell>
                        {q.options.map((o, i) => (
                          <div key={i}>
                            {i + 1}. {o.feedback}
                          </div>
                        ))}
                      </TableCell>
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

          <Button variant="contained" color="primary" onClick={handleSaveQuiz}>
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
              <TableCell>Course #</TableCell>
              <TableCell>Module #</TableCell>
              <TableCell>Quiz Title</TableCell>
              <TableCell>Time Limit</TableCell>
              <TableCell># Questions</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {quizzes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  No quizzes added yet.
                </TableCell>
              </TableRow>
            ) : (
              quizzes.map((quiz, idx) => (
                <TableRow key={idx}>
                  <TableCell>{quiz.courseNumber}</TableCell>
                  <TableCell>{quiz.moduleNumber}</TableCell>
                  <TableCell>{quiz.quizTitle}</TableCell>
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
