import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom"; // For getting the courseId from the URL
import beforeAuthLayout from "../components/BeforeAuth"; // This wrapper already includes the header and footer
import webdevremovebg from "../assets/Images/webdevremovebg.png";
import dataanaremovebg from "../assets/Images/dataanaremovebg.png";
import aiMlImg from "../assets/Images/aimlremovebg.png";

// Static mock data (replace this with backend data)
const courses = [
  {
    id: "1",
    name: "Web Development",
    description: "Learn to build websites using HTML, CSS, JavaScript.",
    level: "Beginner",
    knowledgeArea: "Tech Skills",
    releasedDate: "2023-05-01",
    rating: 4.5,
    numEnrolled: 1200,
    owner: "Course Owner 1",
    img: webdevremovebg, // Replace with actual image path
    reviews: [
      { user: "John Doe", rating: 4, comment: "Great course for beginners!" },
      { user: "Jane Smith", rating: 5, comment: "Loved it! Easy to follow." },
    ], // Added reviews
    outline: {
      modules: "10 modules",
      contentType: "Videos, Quizzes, Assignments",
      structure: ["HTML Basics", "CSS Basics", "JavaScript Basics", "Project"],
    },
  },
  {
    id: "2",
    name: "Data Analytics",
    description: "Master data analysis with Python and SQL.",
    level: "Intermediate",
    knowledgeArea: "Analytical Skills",
    releasedDate: "2023-03-20",
    rating: 4.7,
    numEnrolled: 900,
    owner: "Course Owner 2",
    img: dataanaremovebg, // Replace with actual image path
    reviews: [
      { user: "Alex Johnson", rating: 4, comment: "Very insightful course!" },
    ], // Added reviews
    outline: {
      modules: "8 modules",
      contentType: "Videos, Quizzes",
      structure: ["Introduction to Data", "SQL Basics", "Data Visualization"],
    },
  },

  {
    id: "3",  // Adding unique ID for each course
    name: "AI & Machine Learning",
    description: "Dive into AI and Machine Learning concepts and applications.",
    level: "Advanced",
    knowledgeArea: "Tech Skills",
    releasedDate: "2023-02-10",
    rating: 4.8,
    numEnrolled: 800,
    owner: "Course Owner 3",
    img: aiMlImg,
    reviews: [], // No reviews yet
    outline: {
      modules: "12 modules",
      contentType: "Videos, Labs",
      structure: ["Cloud Basics", "AWS Services", "Hands-on Labs"],
    },
  }
];

const CoursePage = ({ loggedInUser }) => {
  const { courseId } = useParams(); // Get courseId from URL
  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  // Fetch course data based on courseId (using static data for now)
  useEffect(() => {
    const selectedCourse = courses.find((course) => course.id === courseId);
    setCourse(selectedCourse);

    // Check if the user is enrolled
    if (loggedInUser) {
      setIsEnrolled(loggedInUser.enrolledCourses.includes(courseId));
    }
  }, [courseId, loggedInUser]);

  if (!course) {
    return <div>Course not found!</div>;
  }

  // Check if outline is defined for the course
  const hasOutline = course.outline && course.outline.modules;
  const reviews = course.reviews || []; // Fallback to empty array if reviews is undefined

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Back to Search Results */}
      <div className="mb-4">
        <Link to="/search" className="text-sm text-gray-600 hover:underline">
          &larr; Back to Search Results
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Course Image */}
        <img
          src={course.img} // Replace with actual image path
          alt={course.name}
          className="w-full md:w-1/2 lg:w-1/3 rounded-lg shadow-md object-cover"
        />

        {/* Course Info */}
        <div className="md:w-1/2 lg:w-2/3">
          <h1 className="text-3xl font-bold text-gray-800">{course.name}</h1>
          <p className="text-lg text-gray-600 mt-2">{course.description}</p>

          <div className="text-gray-500 text-sm mt-4 space-y-2">
            {/* Course Info with Links */}
            <p>
              <span className="font-semibold">Level:</span>{" "}
              <Link
                to={`/search?category=all&query=${course.level}`}
                className="text-blue-500 hover:underline"
              >
                {course.level}
              </Link>
            </p>
            <p>
              <span className="font-semibold">Knowledge Area:</span>{" "}
              <Link
                to={`/search?category=all&query=${course.knowledgeArea}`}
                className="text-blue-500 hover:underline"
              >
                {course.knowledgeArea}
              </Link>
            </p>
            <p>
              <span className="font-semibold">Released Date:</span> {course.releasedDate}
            </p>
            <p>
              <span className="font-semibold">Rating:</span> {course.rating} ⭐
            </p>
            <p>
              <span className="font-semibold">Enrolled Students:</span> {course.numEnrolled}
            </p>
            <p>
              <span className="font-semibold">Course Owner:</span>{" "}
              <Link
                to={`/search?category=all&query=${course.owner}`}
                className="text-blue-500 hover:underline"
              >
                {course.owner}
              </Link>
            </p>
          </div>

          {/* Course Outline Section */}
          {hasOutline && (
            <div className="bg-gray-100 p-4 rounded-lg mt-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Course Outline</h2>
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Modules:</span> {course.outline.modules}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Content Type:</span> {course.outline.contentType}
              </p>
              <h3 className="font-semibold text-gray-800 mt-4">Course Structure:</h3>
              <ul className="list-disc ml-5 text-gray-600">
                {course.outline.structure.map((module, index) => (
                  <li key={index}>{module}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Reviews Section */}
          <div className="mt-6 bg-gray-100 p-4 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Reviews</h2>
            {reviews.length > 0 ? (
              <div>
                {reviews.map((review, index) => (
                  <div key={index} className="mb-4">
                    <p className="font-semibold text-gray-800">{review.user}</p>
                    <div className="flex items-center text-yellow-500">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <span key={i}>⭐</span>
                      ))}
                    </div>
                    <p className="text-gray-600 mt-2">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No reviews yet.</p>
            )}
          </div>

          {/* Enroll/Enrolled Button */}
          <div className="mt-6">
            {isEnrolled ? (
              <button className="w-full bg-gray-400 text-white py-3 px-6 rounded-md cursor-not-allowed" disabled>
                You are already enrolled
              </button>
            ) : (
              <button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-md">
                Enroll Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default beforeAuthLayout(CoursePage);
