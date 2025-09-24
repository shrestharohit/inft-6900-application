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
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Tooltip,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const STORAGE_KEY_QUIZZES = "course_owner_quizzes";
const STORAGE_KEY_MODULES = "course_owner_modules";
const COURSES_KEY = "course_owner_courses";

export default function QuizManagement() {
  const [quizzes, setQuizzes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);
  const [form, setForm] = useState({
    courseTitle: "",
    moduleTitle: "",
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

  // Load quizzes, courses, modules
  useEffect(() => {
    const rawQuizzes = localStorage.getItem(STORAGE_KEY_QUIZZES);
    if (rawQuizzes) setQuizzes(JSON.parse(rawQuizzes));

    const rawCourses = localStorage.getItem(COURSES_KEY);
    if (rawCourses) setCourses(JSON.parse(rawCourses));

    const rawModules = localStorage.getItem(STORAGE_KEY_MODULES);
    if (rawModules) setModules(JSON.parse(rawModules));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_QUIZZES, JSON.stringify(quizzes));
  }, [quizzes]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "courseTitle") setForm((prev) => ({ ...prev, moduleTitle: "" }));
  };

  const handleQuestionChange = (e) => {
    const { name, value } = e.target;
    setQuestionForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...questionForm.options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setQuestionForm({ ...questionForm, options: newOptions });
  };

  const addOption = () => {
    if (questionForm.options.length >= 4) {
      alert("⚠️ You cannot add more than 4 options.");
      return;
    }
    setQuestionForm((prev) => ({
      ...prev,
      options: [...prev.options, { text: "", isCorrect: false, feedback: "" }],
    }));
  };

  const handleQuestionImage = (e) => {
    if (e.target.files[0]) {
      setQuestionForm({ ...questionForm, image: URL.createObjectURL(e.target.files[0]) });
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

    const updatedQuestions = [...questions];
    if (editingIndex !== null) {
      updatedQuestions[editingIndex] = { ...questionForm, number: editingIndex + 1 };
    } else {
      updatedQuestions.push({ ...questionForm, number: updatedQuestions.length + 1 });
    }
    setQuestions(updatedQuestions);

    setQuestionForm({
      text: "",
      options: [
        { text: "", isCorrect: false, feedback: "" },
        { text: "", isCorrect: false, feedback: "" },
      ],
      image: null,
    });
    setEditingIndex(null);
  };

  const deleteQuestion = (qIndex) => {
    const updatedQuestions = questions
      .filter((_, i) => i !== qIndex)
      .map((q, i) => ({ ...q, number: i + 1 }));
    setQuestions(updatedQuestions);

    if (editingIndex === qIndex) {
      setQuestionForm({
        text: "",
        options: [
          { text: "", isCorrect: false, feedback: "" },
          { text: "", isCorrect: false, feedback: "" },
        ],
        image: null,
      });
      setEditingIndex(null);
    }

    // If deleting last question, delete whole quiz
    if (updatedQuestions.length === 0 && editingIndex !== null) {
      const updatedQuizzes = [...quizzes];
      updatedQuizzes.splice(editingIndex, 1);
      setQuizzes(updatedQuizzes);
      setEditingIndex(null);
    }
  };

  const handleEditQuestion = (qIndex) => {
    setQuestionForm(questions[qIndex]);
    setEditingIndex(qIndex);
  };

  const handleSaveQuiz = () => {
    if (!form.courseTitle || !form.moduleTitle || !form.quizTitle || !form.timeLimit) {
      alert("⚠️ Please fill all quiz fields.");
      return;
    }
    if (questions.length === 0) {
      alert("⚠️ Add at least one question.");
      return;
    }

    const newQuiz = { ...form, questions };

    if (editingIndex !== null) {
      const updated = [...quizzes];
      updated[editingIndex] = {
        ...newQuiz,
        status: "Draft", // Always set Draft when editing
      };
      setQuizzes(updated);
    } else {
      newQuiz.status = "Draft";
      setQuizzes([...quizzes, newQuiz]);
    }

    setForm({ courseTitle: "", moduleTitle: "", quizTitle: "", timeLimit: "" });
    setQuestions([]);
    setEditingIndex(null);
  };

  const handleEditQuiz = (index) => {
    const quiz = quizzes[index];
    setForm({
      courseTitle: quiz.courseTitle,
      moduleTitle: quiz.moduleTitle,
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

  const handleInactivate = (index) => {
    const updated = [...quizzes];
    updated[index].status = "Inactive";
    setQuizzes(updated);
  };

  const modulesForSelectedCourse = modules
    .filter((m) => m.courseName === form.courseTitle)
    .map((m) => m.moduleTitle);

  return (
    <Box sx={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">Quiz Management</Typography>

      {/* Quiz Form */}
      <Paper sx={{ padding: "2rem", marginBottom: "2rem", borderRadius: 3, boxShadow: "0 8px 20px rgba(0,0,0,0.1)" }}>
        <Stack spacing={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Course Title</InputLabel>
            <Select name="courseTitle" value={form.courseTitle} onChange={handleChange} label="Course Title">
              {courses.map((c, idx) => <MenuItem key={idx} value={c.name}>{c.name}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Module Title</InputLabel>
            <Select name="moduleTitle" value={form.moduleTitle} onChange={handleChange} label="Module Title" disabled={!form.courseTitle}>
              {modulesForSelectedCourse.map((m, idx) => <MenuItem key={idx} value={m}>{m}</MenuItem>)}
            </Select>
          </FormControl>

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField label="Quiz Title" name="quizTitle" value={form.quizTitle} onChange={handleChange} fullWidth />
            <TextField label="Time Limit (minutes)" name="timeLimit" type="number" value={form.timeLimit} onChange={handleChange} fullWidth />
          </Stack>

          {/* Question Card */}
          <Card sx={{ mt: 2, p: 2, backgroundColor: "#f9f9f9" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Add / Edit Question</Typography>
              <TextField label="Question Text" name="text" value={questionForm.text} onChange={handleQuestionChange} fullWidth margin="normal" />
              <Stack spacing={2}>
                {questionForm.options.map((opt, i) => (
                  <Stack key={i} direction={{ xs: "column", md: "row" }} spacing={2} alignItems="center">
                    <TextField label={`Option ${i + 1}`} value={opt.text} onChange={(e) => handleOptionChange(i, "text", e.target.value)} fullWidth />
                    <Checkbox checked={opt.isCorrect} onChange={(e) => handleOptionChange(i, "isCorrect", e.target.checked)} />
                    <TextField label="Feedback" value={opt.feedback} onChange={(e) => handleOptionChange(i, "feedback", e.target.value)} fullWidth />
                  </Stack>
                ))}
              </Stack>
              <Stack direction="row" spacing={2} mt={2}>
                <Button startIcon={<AddCircleOutlineIcon />} onClick={addOption} variant="contained" color="primary">Add Option</Button>
                <Button variant="contained" color="primary" component="label">
                  Upload Image
                  <input type="file" hidden onChange={handleQuestionImage} />
                </Button>
              </Stack>
              {questionForm.image && <Box mt={2}><img src={questionForm.image} alt="Question" style={{ maxWidth: 250, borderRadius: 8 }} /></Box>}
              <Button variant="contained" color="primary" onClick={addQuestion} sx={{ mt: 3 }}>{editingIndex !== null ? "Update Question" : "Add Question"}</Button>
            </CardContent>
          </Card>

          {/* Questions Preview */}
          {questions.length > 0 && (
            <Paper sx={{ mt: 3, p: 2 }}>
              <Typography variant="h6" gutterBottom>Questions Preview</Typography>
              <Divider sx={{ mb: 2 }} />
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
                      <TableCell>{q.options.map((o,i) => <div key={i}>{i+1}. {o.text}</div>)}</TableCell>
                      <TableCell>{q.options.filter(o=>o.isCorrect).map((_, i)=>`Option ${i+1}`).join(", ")}</TableCell>
                      <TableCell>{q.options.map((o,i)=><div key={i}>{i+1}. {o.feedback}</div>)}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Button size="small" onClick={() => handleEditQuestion(idx)}>Edit</Button>
                          <IconButton color="error" onClick={() => deleteQuestion(idx)}><DeleteOutlineIcon /></IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          )}

          <Button variant="contained" color="primary" onClick={handleSaveQuiz} sx={{ mt: 3, alignSelf: "flex-start" }}>
            {editingIndex !== null ? "Update Quiz" : "Save Quiz"}
          </Button>
        </Stack>
      </Paper>

      {/* Existing Quizzes */}
      <Paper sx={{ padding: "1.5rem", borderRadius: 3, boxShadow: "0 8px 20px rgba(0,0,0,0.1)" }}>
        <Typography variant="h6" gutterBottom>Existing Quizzes</Typography>
        <Divider sx={{ mb: 2 }} />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Course Title</TableCell>
              <TableCell>Module Title</TableCell>
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
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>No quizzes added yet.</TableCell>
              </TableRow>
            ) : (
              quizzes.map((quiz, idx) => (
                <TableRow key={idx}>
                  <TableCell>{quiz.courseTitle}</TableCell>
                  <TableCell>{quiz.moduleTitle}</TableCell>
                  <TableCell>{quiz.quizTitle}</TableCell>
                  <TableCell>{quiz.timeLimit} min</TableCell>
                  <TableCell>{quiz.questions.length}</TableCell>
                  <TableCell>{quiz.status}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      {quiz.status === "Draft" && (
                        <Button size="small" variant="contained" color="success" onClick={() => handleRequestApproval(idx)}>Request Approval</Button>
                      )}
                      {quiz.status === "Active" && (
                        <>
                          <Button size="small" onClick={() => handleEditQuiz(idx)}>Edit</Button>
                          <Button size="small" variant="outlined" color="error" onClick={() => handleInactivate(idx)}>Inactivate</Button>
                        </>
                      )}
                      {quiz.status === "Inactive" && (
                        <Button size="small" variant="contained" color="success" onClick={() => handleRequestApproval(idx)}>Request Approval</Button>
                      )}
                      {quiz.status === "Wait for Approval" && (
                        <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>Waiting Approval</Typography>
                      )}
                    </Stack>
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
