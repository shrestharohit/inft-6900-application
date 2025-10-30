import { createBrowserRouter } from "react-router-dom";

// Public pages
import Home from "../Pages/Home";
import RegistrationForm from "../Pages/registration";
import LoginForm from "../Pages/login";
import Login2FA from "../Pages/login2fa";
import ForgotPassword from "../Pages/forgotpassword"; // Step 1
import VerifyOtpPage from "../Pages/verifyOtpPage"; // Step 2
import ResetPasswordPage from "../Pages/resetPasswordPage"; // Step 3
import ProfileManagement from "../Pages/profilemanagement";

// Dummy pages for footer
import About from "../Pages/about"; // no curly braces
import Contact from "../Pages/contactus";
import Terms from "../Pages/termsAndCondition";

// Admin imports
import AdminLayout from "../Pages/Admin/adminlayout";
import AdminDashboard from "../Pages/Admin/admindashboard";
import AdminUserManagement from "../Pages/Admin/adminUserManagement";
import AdminCourseApproval from "../Pages/Admin/adminCourseApproval";
import AdminModuleApproval from "../Pages/Admin/adminModuleApproval";
import AdminQuizApproval from "../Pages/Admin/adminQuizApproval";
import AdminProfile from "../Pages/Admin/AdminProfile";
import AdminPathwayApproval from "../Pages/Admin/adminPathwayManagement.jsx";

// Student imports
import Dashboard from "../Pages/Dashboard";
import CourseLayout from "../Pages/CourseLayout";
import CoursePage from "../Pages/CoursePage";
import CourseContentPage from "../Pages/CourseContentPage";
import ModulePage from "../Pages/ModulePage";
import QuizPage from "../Pages/QuizPage";
import LessonPage from "../Pages/LessonPage";
import PathwayPage from "../Pages/PathwayPage";
import PathwayContentPage from "../Pages/PathwayContentPage";
import CourseQuestionsPage from "../Pages/CourseQuestionsPage";
import StudentAnnouncementsPage from "../Pages/StudentAnnouncementsPage";
import StudentDiscussionPage from "../Pages/StudentDiscussionPage";
import SchedulePage from "../pages/SchedulePage";
import PomodoroSettings from "../Pages/PomodoroSettings.jsx";

import SearchResults from "../Pages/SearchResults";
import CertificatePage from "../Pages/certificatePage";

// Admin placeholder pages
import {
  PathwaysPage,
  CoursesPage,
  EnrollmentsPage,
  MessagesPage,
} from "../Pages/Admin/pagesPlaceholders";

// Course Owner imports
import CourseOwnerDashboard from "../Pages/CourseOwner/CourseOwnerDashboard";
import CourseManagement from "../Pages/CourseOwner/courseManagement";
import CourseOwnerLayout from "../Pages/CourseOwner/courseOwnerLayout";
import ModuleManagement from "../Pages/CourseOwner/moduleManagement";
import QuizManagement from "../Pages/CourseOwner/quizManagement";
import CourseOwnerProfile from "../Pages/CourseOwner/courseOwnerProfile";
import CourseOwnerAnnouncementsPage from "../Pages/CourseOwner/CourseOwnerAnnouncementsPage";
import CourseOwnerDiscussionPage from "../Pages/CourseOwner/CourseOwnerDiscussionPage";
import CourseOwnerQuestionsPage from "../Pages/CourseOwner/CourseOwnerQuestionsPage";
import PathwayManagement from "../Pages/CourseOwner/pathwayManagement";

// All Courses and Pathways Pages
import AllCoursesPage from "../Pages/AllCoursesPage";
import AllPathwaysPage from "../Pages/AllPathwaysPage";

export const router = createBrowserRouter([
  // Public routes
  { path: "/", element: <Home /> },
  { path: "/registration", element: <RegistrationForm /> },
  { path: "/login", element: <LoginForm /> },
  { path: "/login2fa", element: <Login2FA /> },

  // Forgot password 3-step flow
  { path: "/forgotpassword", element: <ForgotPassword /> }, // Step 1
  { path: "/verify-otp", element: <VerifyOtpPage /> }, // Step 2
  { path: "/reset-password", element: <ResetPasswordPage /> }, // Step 3

  { path: "/profilemanagement", element: <ProfileManagement /> },
  { path: "/pomodoro-settings", element: <PomodoroSettings /> },

  // Footer dummy pages
  { path: "/about", element: <About /> },
  { path: "/contact", element: <Contact /> },
  { path: "/terms", element: <Terms /> },

  // Pathways routes
  { path: "/pathway/:pathwayId", element: <PathwayPage /> },
  { path: "/pathway/:pathwayId/content", element: <PathwayContentPage /> },

  // Student course routes
  { path: "/dashboard", element: <Dashboard /> },
  {
    path: "/courses/:courseId",
    children: [
      { index: true, element: <CoursePage /> }, // normal page (already has beforeAuthLayout)
      {
        element: <CourseLayout />, // layout for nested routes
        children: [
          { path: "content", element: <CourseContentPage /> },
          { path: "questions", element: <CourseQuestionsPage /> },
          { path: "modules/:moduleId", element: <ModulePage /> },
          {
            path: "modules/:moduleId/lessons/:lessonId",
            element: <LessonPage />,
          },
          { path: "modules/:moduleId/quizzes/:quizId", element: <QuizPage /> },
          { path: "announcements", element: <StudentAnnouncementsPage /> },
          { path: "discussions", element: <StudentDiscussionPage /> },
          { path: "certificate", element: <CertificatePage /> },
          { path: "schedule", element: <SchedulePage /> },
          
        ],
      },
    ],
  },

  // Admin routes
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "pathways", element: <AdminPathwayApproval /> },
      { path: "courses", element: <CoursesPage /> },
      { path: "enrollments", element: <EnrollmentsPage /> },
      { path: "users", element: <AdminUserManagement /> },
      { path: "messages", element: <MessagesPage /> },
      { path: "profile", element: <AdminProfile title="Profile Page" /> },
      { path: "course-approvals", element: <AdminCourseApproval /> },
      { path: "module-approvals", element: <AdminModuleApproval /> },
      { path: "quiz-approvals", element: <AdminQuizApproval /> },
    ],
  },

  // Course Owner routes
  {
    path: "/courseowner",
    element: <CourseOwnerLayout />,
    children: [
      { index: true, element: <CourseOwnerDashboard /> },
      { path: "courses", element: <CourseManagement /> },
      { path: "modules", element: <ModuleManagement /> },
      { path: "quizzes", element: <QuizManagement /> },
      { path: "profile", element: <CourseOwnerProfile title="Profile Page" /> },
      { path: "announcements", element: <CourseOwnerAnnouncementsPage /> },
      { path: "discussions", element: <CourseOwnerDiscussionPage /> },
      { path: "questions", element: <CourseOwnerQuestionsPage /> },
      { path: "pathways", element: <PathwayManagement /> },
    ],
  },

  // Search & global
  { path: "/search", element: <SearchResults /> },
  { path: "/all-courses", element: <AllCoursesPage /> },
  { path: "/all-pathways", element: <AllPathwaysPage /> },

  // fallback route
  {
    path: "*",
    element: (
      <h1 className="text-center mt-20 text-3xl">404 - Page Not Found</h1>
    ),
  },
]);
