import { NavLink, Outlet, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import useQuizApi from "../hooks/useQuizApi";
import useModuleApi from "../hooks/useModuleApi";

export default function CourseLayout() {
  const { courseId } = useParams();
  const [modules, setModules] = useState(null);
  const [quiz, setQuiz] = useState(null);

  const { fetchAllModulesInACourse } = useModuleApi();
  const { fetchQuizForCourse } = useQuizApi();

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

  const [openModule, setOpenModule] = useState(null);

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="fixed top-20 left-0 w-64 bg-white border-r shadow-sm h-[calc(100vh-5rem)] overflow-y-auto">
        {/* Course Menu link that goes to course content page */}
        <NavLink
          to={`/courses/${courseId}/content`}
          className="block text-lg font-bold px-4 py-3 border-b hover:bg-gray-100 text-blue-600 cursor-pointer"
        >
          Course Menu
        </NavLink>

        <nav className="flex flex-col space-y-1 p-2">
          {/* Expandable Modules */}
          {modules?.map((module) => (
            <div key={module.moduleID}>
              <button
                onClick={() =>
                  setOpenModule(
                    openModule === module.moduleID ? null : module.moduleID
                  )
                }
                className="w-full text-left px-4 py-2 rounded hover:bg-gray-100 font-medium flex justify-between items-center"
              >
                {module.title}
                <span>{openModule === module.moduleID ? "▲" : "▼"}</span>
              </button>

              {openModule === module.moduleID && (
                <ul className="ml-4 mt-1 space-y-1">
                  {module.contents?.map((content) => (
                    <li key={content.contentID}>
                      <NavLink
                        to={`modules/${module.moduleID}/lessons/${content.contentID}`}
                        className="block px-3 py-1 text-sm rounded hover:bg-gray-100"
                      >
                        {content.title}
                      </NavLink>
                    </li>
                  ))}
                  <li>
                    <NavLink
                      to={`quizzes/${
                        quiz?.find((x) => (x.moduleID = module.moduleID))
                          ?.quizID
                      }`}
                      className="block px-3 py-1 text-sm rounded hover:bg-gray-100"
                    >
                      Quiz
                    </NavLink>
                  </li>
                </ul>
              )}
            </div>
          ))}

          {/* Other fixed links */}
          <NavLink
            to="announcements"
            className="px-4 py-2 rounded hover:bg-gray-100"
          >
            Announcements
          </NavLink>
          <NavLink
            to="discussions"
            className="px-4 py-2 rounded hover:bg-gray-100"
          >
            Discussion Board
          </NavLink>
          <NavLink
            to="questions"
            className="px-4 py-2 rounded hover:bg-gray-100"
          >
            Ask Question
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 mt-20 p-6">
        <Outlet />
      </main>
    </div>
  );
}
