import React from "react";
import { useParams, Link } from "react-router-dom";
import beforeAuthLayout from "../components/BeforeAuth";

// Simple placeholder for now
const CourseContentPage = () => {
    const { courseId } = useParams();

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Back to Course Page */}
            <div className="mb-4">
                <Link
                    to={`/courses/${courseId}`}
                    className="text-sm text-gray-600 hover:underline"
                >
                    &larr; Back to Course Overview
                </Link>
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-6">
                Course Content
            </h1>

            <p className="text-gray-600 mb-6">
                Welcome to your course! Here you’ll find lessons, videos, assignments,
                and quizzes for <span className="font-semibold">Course ID: {courseId}</span>.
            </p>

            {/* Example structure you can expand later */}
            <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-semibold text-gray-800">Module 1: Introduction</h2>
                    <ul className="list-disc list-inside text-gray-600">
                        <li>Lesson 1.1 - Getting Started</li>
                        <li>Lesson 1.2 - Overview of Tools</li>
                    </ul>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-semibold text-gray-800">Module 2: Core Concepts</h2>
                    <ul className="list-disc list-inside text-gray-600">
                        <li>Lesson 2.1 - Key Theory</li>
                        <li>Lesson 2.2 - Practical Exercise</li>
                    </ul>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-semibold text-gray-800">Module 3: Quiz & Assignment</h2>
                    <ul className="list-disc list-inside text-gray-600">
                        <li>Quiz 1</li>
                        <li>Assignment 1</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default beforeAuthLayout(CourseContentPage);
