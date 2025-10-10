import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import beforeAuthLayout from "../components/BeforeAuth";
import { dummyCourses } from "../Pages/dummyData";
import { dummyModules } from "../Pages/dummyModule";
import useCourseApi from "../hooks/useCourseApi";
import useQuizApi from "../hooks/useQuizApi";
import useModuleApi from "../hooks/useModuleApi";

const CourseContentPage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [modules, setModules] = useState(null);

  const { fetchCourse } = useCourseApi();
  const { fetchQuizForCourse } = useQuizApi();
  const { fetchAllModulesInACourse } = useModuleApi();

  useEffect(() => {
    let mounted = true;
    fetchCourse(courseId)
      .then((res) => {
        if (mounted) setCourse(res);
      })
      .catch((err) => {
        console.error("Failed to fetch courses", err);
        if (mounted) setCourse([]);
      });

    return () => (mounted = false);
  }, [fetchCourse]);

  useEffect(() => {
    let mounted = true;
    fetchQuizForCourse(7)
      .then((res) => {
        if (mounted) setQuiz(res);
      })
      .catch((err) => {
        console.error("Failed to fetch quiz", err);
        if (mounted) setQuiz([]);
      });

    return () => (mounted = false);
  }, [fetchQuizForCourse]);

  useEffect(() => {
    let mounted = true;
    fetchAllModulesInACourse(courseId)
      .then((res) => {
        if (mounted) setModules(res);
      })
      .catch((err) => {
        console.error("Failed to fetch modules", err);
        if (mounted) setModules([]);
      });

    return () => (mounted = false);
  }, [fetchAllModulesInACourse]);

  if (!course) {
    return <div className="p-4 text-red-500">Course not found!</div>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Heading */}
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Course Content</h1>

      <p className="text-gray-600 mb-6">
        Welcome to your course! Here you’ll find lessons and quizzes for{" "}
        <span className="font-semibold">{course.title}</span>.
      </p>

      {/* Modules Section */}
      <div className="space-y-4">
        {modules?.map((module) => (
          <div
            key={module?.moduleID}
            className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold text-blue-600 mb-2">
              {module?.title}
            </h2>

            <ul className="list-disc list-inside text-gray-600 space-y-1">
              {module?.contents?.map((content) => (
                <li key={content.contentID}>
                  <Link
                    to={`/courses/${courseId}/modules/${module.moduleID}/lessons/${content.contentID}`}
                    className="text-gray-700 hover:text-blue-600 hover:underline"
                  >
                    {content.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to={`/courses/${courseId}/quizzes/${
                    quiz?.find((x) => (x.moduleID = module.moduleID))?.quizID
                  }`}
                  className="text-gray-700 hover:text-blue-600 hover:underline"
                >
                  Quiz
                </Link>
              </li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default beforeAuthLayout(CourseContentPage);
