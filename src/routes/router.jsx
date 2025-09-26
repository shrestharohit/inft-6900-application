import { createBrowserRouter } from "react-router-dom";

// Public pages
import Home from "../Pages/Home";
import RegistrationForm from "../Pages/registration";
import LoginForm from "../Pages/login";
import Login2FA from "../Pages/login2fa";
import ForgotPassword from "../Pages/forgotpassword";
import ProfileManagement from "../Pages/profilemanagement";

// Admin imports
import AdminLayout from "../Pages/Admin/adminlayout";
import AdminUserManagement from "../Pages/Admin/adminUserManagement";
import AdminCourseApproval from "../Pages/Admin/adminCourseApproval";
import AdminModuleApproval from "../Pages/Admin/adminModuleApproval";
import AdminQuizApproval from "../Pages/Admin/adminQuizApproval";

import {
  DashboardPage,
  PathwaysPage,
  CoursesPage,
  EnrollmentsPage,
  ReportsPage,
  MessagesPage,
  SettingsPage,
} from "../Pages/Admin/pagesPlaceholders";

// Course Owner imports
import CourseManagement from "../Pages/CourseOwner/courseManagement";
import CourseOwnerLayout from "../Pages/CourseOwner/courseOwnerLayout";
import ModuleManagement from "../Pages/CourseOwner/moduleManagement";
import QuizManagement from "../Pages/CourseOwner/quizManagement";

// Student pages
import CoursePage from "../Pages/CoursePage";
import CourseContentPage from "../Pages/CourseContentPage";
import ModulePage from "../Pages/ModulePage"; // ✅ new
import QuizPage from "../Pages/QuizPage"; // ✅ new
import LessonPage from "../Pages/LessonPage";
import PathwayPage from "../Pages/PathwayPage";
import PathwayContentPage from "../Pages/PathwayContentPage";
import Placeholder from "../Pages/Placeholder";

import SearchResults from "../Pages/SearchResults";
import CertificatePage from "../Pages/certificatePage";

// All Courses and Pathways Pages
import AllCoursesPage from "../Pages/AllCoursesPage";
import AllPathwaysPage from "../Pages/AllPathwaysPage";

export const router = createBrowserRouter([
  // Public routes
  { path: "/", element: <Home /> },
  { path: "/registration", element: <RegistrationForm /> },
  { path: "/login", element: <LoginForm /> },
  { path: "/login2fa", element: <Login2FA /> },
  { path: "/forgotpassword", element: <ForgotPassword /> },
  { path: "/profilemanagement", element: <ProfileManagement /> },

  // Pathways routes
  { path: "/pathway/:pathwayId", element: <PathwayPage /> },
  { path: "/pathway/:pathwayId/content", element: <PathwayContentPage /> },

  // Dynamic route for Course Details
  { path: "/courses/:courseId", element: <CoursePage /> },
  { path: "/courses/:courseId/content", element: <CourseContentPage /> },

  // Module & Quiz routes (for navigation from CourseContentPage)
  { path: "/courses/:courseId/modules/:moduleId", element: <ModulePage /> },
  { path: "/courses/:courseId/quizzes/:quizId", element: <QuizPage /> },
  { path: "/courses/:courseId/modules/:moduleId/lessons/:lessonId", element: <LessonPage /> },
  { path: "/certificate", element: <CertificatePage /> },

  // Admin routes (nested)
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "pathways", element: <PathwaysPage /> },
      { path: "courses", element: <CoursesPage /> },
      { path: "enrollments", element: <EnrollmentsPage /> },
      { path: "reports", element: <ReportsPage /> },
      { path: "users", element: <AdminUserManagement /> },
      { path: "messages", element: <MessagesPage /> },
      { path: "settings", element: <SettingsPage /> },
      { path: "course-approvals", element: <AdminCourseApproval /> },
      { path: "module-approvals", element: <AdminModuleApproval /> },
      { path: "quiz-approvals", element: <AdminQuizApproval /> },
    ],
  },

  // Course Owner routes (nested)
  {
    path: "/courseowner",
    element: <CourseOwnerLayout />,
    children: [
      { index: true, element: <CourseManagement /> },
      { path: "courses", element: <CourseManagement /> },
      { path: "modules", element: <ModuleManagement /> },
      { path: "quizzes", element: <QuizManagement /> },
      { path: "reports", element: <Placeholder title="Reports Page" /> },
      { path: "settings", element: <Placeholder title="Settings Page" /> },
    ],
  },

  // Search Results
  { path: "/search", element: <SearchResults /> },

  // All Courses Page
  { path: "/all-courses", element: <AllCoursesPage /> },

  // All Pathways Page
  { path: "/all-pathways", element: <AllPathwaysPage /> },
]);
