// router.js
import { createBrowserRouter } from "react-router-dom";

// Import pages/components (public)
import Home from "../Pages/Home";
import RegistrationForm from "../pages/registration";
import LoginForm from "../pages/login";
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
import CoursePage from "../Pages/CoursePage";
import PathwayPage from "../Pages/PathwayPage";
import Placeholder from "../Pages/Placeholder";



import SearchResults from "../Pages/SearchResults";

export const router = createBrowserRouter([
  // Public routes
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/registration",
    element: <RegistrationForm />,
  },
  {
    path: "/login",
    element: <LoginForm />,
  },
  {
    path: "/login2fa",
    element: <Login2FA />,
  },
  {
    path: "/forgotpassword",
    element: <ForgotPassword />,
  },
  {
    path: "/profilemanagement",
    element: <ProfileManagement />,
  },

  // Pathways routes
  {
    path: "/pathway/tech-skills",
    element: <PathwayPage name="Tech Skills" />,
  },
  {
    path: "/pathway/analytical-skills",
    element: <PathwayPage name="Analytical Skills" />,
  },
  {
    path: "/pathway/business-skills",
    element: <PathwayPage name="Business Skills" />,
  },

  // Courses routes
  {
    path: "/courses/coding",
    element: <CoursePage name="Coding" />,
  },
  {
    path: "/courses/devops",
    element: <CoursePage name="DevOps" />,
  },
  {
    path: "/courses/bigdata",
    element: <CoursePage name="Big Data" />,
  },
  {
    path: "/courses/powerbi",
    element: <CoursePage name="Power BI" />,
  },
  {
    path: "/courses/accounting",
    element: <CoursePage name="Accounting" />,
  },
  {
    path: "/courses/finance",
    element: <CoursePage name="Finance" />,
  },

  // Admin routes (nested)
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "pathways",
        element: <PathwaysPage />,
      },
      {
        path: "courses",
        element: <CoursesPage />,
      },
      {
        path: "enrollments",
        element: <EnrollmentsPage />,
      },
      {
        path: "reports",
        element: <ReportsPage />,
      },
      {
        path: "users",
        element: <AdminUserManagement />,
      },
      {
        path: "messages",
        element: <MessagesPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
      {
        path: "course-approvals",
        element: <AdminCourseApproval />,
      },
      {
        path: "module-approvals",
        element: <AdminModuleApproval />,
      },
      {
        path: "quiz-approvals",
        element: <AdminQuizApproval />,
      },
    ],
  },

  // Course Owner routes (nested)
  {
    path: "/courseowner",
    element: <CourseOwnerLayout />,
    children: [
      {
        index: true,
        element: <CourseManagement />,
      },
      {
        path: "courses",
        element: <CourseManagement />,
      },
      {
        path: "modules",
        element: <ModuleManagement />,
      },
      {
        path: "quizzes",
        element: <QuizManagement />,
      },
      {
        path: "reports",
        element: <Placeholder title="Reports Page" />,
      },
      {
        path: "settings",
        element: <Placeholder title="Settings Page" />,
      },
    ],
  },
// Search Results

  {
    path: "/search", 
    element: <SearchResults />
  },
  


]);
