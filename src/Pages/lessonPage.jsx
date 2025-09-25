import React from "react";
import { useParams, Link } from "react-router-dom";
import beforeAuthLayout from "../components/BeforeAuth";
import { dummyCourses } from "../Pages/dummyData";
import { dummyModules } from "../Pages/dummyModule";
import { dummyLessonContent } from "../Pages/dummyLessonContent";

const LessonPage = () => {
  const { courseId, moduleId, lessonId } = useParams();

  const course = dummyCourses.find((c) => c.id === courseId);
  if (!course)
    return (
      <div className="p-6 text-red-500 text-center font-semibold text-lg">
        Course not found!
      </div>
    );

  const modules = dummyModules[courseId] || [];
  const module = modules.find((m) => m.id.toString() === moduleId);
  if (!module)
    return (
      <div className="p-6 text-red-500 text-center font-semibold text-lg">
        Module not found!
      </div>
    );

  const lessonContent = dummyLessonContent[courseId]?.[lessonId];
  if (!lessonContent)
    return (
      <div className="p-6 text-red-500 text-center font-semibold text-lg">
        Lesson content not found!
      </div>
    );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Back to Module */}
      <div className="mb-6">
        <Link
          to={`/courses/${courseId}/modules/${moduleId}`}
          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
        >
          &larr; Back to {module.title}
        </Link>
      </div>

      {/* Lesson Heading */}
      <h1 className="text-4xl font-extrabold text-gray-800 mb-6">{lessonContent.title}</h1>

      {/* Lesson Content */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <p className="text-gray-700 text-lg leading-relaxed">{lessonContent.content}</p>
      </div>
    </div>
  );
};

export default beforeAuthLayout(LessonPage);
