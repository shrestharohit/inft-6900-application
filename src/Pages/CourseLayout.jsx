import { NavLink, Outlet, useParams } from "react-router-dom";
import React, { useState } from "react";
import { dummyModules } from "../Pages/dummyModule";

export default function CourseLayout() {
    const { courseId } = useParams();
    const [openModule, setOpenModule] = useState(null);

    const modules = dummyModules[courseId] || [];

    return (
        <div className="flex">
            {/* Sidebar */}
            <aside className="fixed top-20 left-0 w-64 bg-white border-r shadow-sm h-[calc(100vh-5rem)] overflow-y-auto">
                {/* Clickable Course Menu Header */}
                <NavLink
                    to={`/courses/${courseId}/content`}
                    className="block text-lg font-bold px-4 py-3 border-b hover:bg-gray-100 text-blue-600 cursor-pointer"
                >
                    Course Menu
                </NavLink>

                <nav className="flex flex-col space-y-1 p-2">
                    {/* Expandable Modules */}
                    {modules.map((module) => (
                        <div key={module.id}>
                            <button
                                onClick={() =>
                                    setOpenModule(openModule === module.id ? null : module.id)
                                }
                                className="w-full text-left px-4 py-2 rounded hover:bg-gray-100 font-medium flex justify-between items-center"
                            >
                                {module.title}
                                <span>{openModule === module.id ? "▲" : "▼"}</span>
                            </button>

                            {openModule === module.id && (
                                <ul className="ml-4 mt-1 space-y-1">
                                    {module.lessons.map((lesson) => (
                                        <li key={lesson.id}>
                                            <NavLink
                                                to={
                                                    lesson.title.toLowerCase().includes("quiz")
                                                        ? `quizzes/${lesson.id}`
                                                        : `modules/${module.id}/lessons/${lesson.id}`
                                                }
                                                className="block px-3 py-1 text-sm rounded hover:bg-gray-100"
                                            >
                                                {lesson.title}
                                            </NavLink>
                                        </li>
                                    ))}
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
