import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import beforeAuthLayout from "../components/BeforeAuth";
import { dummyCourses } from "../Pages/dummyData";

const CourseContentPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const course = dummyCourses.find((c) => c.id === courseId);

  if (!course) {
    return <div className="p-6 text-red-500">Course not found!</div>;
  }

  const modules = [
    {
      id: 1,
      title: `Module 1: Introduction to ${course.name}`,
      pages: [
        { id: 101, title: `Lesson 1.1 - Introduction to ${course.name}` },
        { id: 102, title: "Quiz 1" },
      ],
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Page Heading */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Course Content</h1>

      <p className="text-gray-600 mb-6">
        Welcome to your course! Here you’ll find lessons and quizzes for{" "}
        <span className="font-semibold">{course.name}</span>.
      </p>

      {/* Modules Section */}
      <div className="space-y-4 mb-10">
        {modules.map((module) => (
          <div
            key={module.id}
            className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <Link
              to={`/courses/${courseId}/modules/${module.id}`}
              className="text-xl font-semibold text-blue-600 hover:underline"
            >
              {module.title}
            </Link>

            <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
              {module.pages.map((page) => (
                <li key={page.id}>{page.title}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

     
    </div>
  );
};

export default beforeAuthLayout(CourseContentPage);
