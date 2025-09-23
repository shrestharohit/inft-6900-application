import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import beforeAuthLayout from "../components/BeforeAuth";
import techSkillsImg from "../assets/Images/techskills.png";
import analyticalSkillsImg from "../assets/Images/analyticalskills.png";
import businessSkillsImg from "../assets/Images/businessskills.png";

// Dummy Pathway Data
const dummyPathways = [
  {
    id: "1",
    name: "Tech Skills",
    description: "Master coding and DevOps skills.",
    img: techSkillsImg,
    rating: 4.6,
    reviews: [
      { user: "Alice", rating: 5, comment: "Fantastic collection of courses!" },
      { user: "Bob", rating: 4, comment: "Very useful for DevOps beginners." },
    ],
    courses: [
      { id: "coding", name: "Coding", link: "/courses/coding" },
      { id: "devops", name: "DevOps", link: "/courses/devops" },
    ],
  },
  {
    id: "2",
    name: "Analytical Skills",
    description: "Learn Big Data and Power BI.",
    img: analyticalSkillsImg,
    rating: 4.8,
    reviews: [
      { user: "Sara", rating: 5, comment: "Helped me land my analyst job!" },
    ],
    courses: [
      { id: "bigdata", name: "Big Data", link: "/courses/bigdata" },
      { id: "powerbi", name: "Power BI", link: "/courses/powerbi" },
    ],
  },
  {
    id: "3",
    name: "Business Skills",
    description: "Build Accounting and Finance expertise.",
    img: businessSkillsImg,
    rating: 4.4,
    reviews: [],
    courses: [
      { id: "accounting", name: "Accounting", link: "/courses/accounting" },
      { id: "finance", name: "Finance", link: "/courses/finance" },
    ],
  },
];

const PathwayPage = () => {
  const { pathwayId } = useParams();
  const [pathway, setPathway] = useState(null);

  useEffect(() => {
    const selectedPathway = dummyPathways.find((p) => p.id === pathwayId);
    setPathway(selectedPathway);
  }, [pathwayId]);

  if (!pathway) {
    return <div>Pathway not found!</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Back to Search */}
      <div className="mb-6">
        <Link to="/search" className="text-sm text-gray-600 hover:underline">
          &larr; Back to Search Results
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Pathway Image */}
        <div className="md:w-1/3">
          <img
            src={pathway.img}
            alt={pathway.name}
            className="w-full h-72 object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* Pathway Info */}
        <div className="md:w-2/3">
          <h1 className="text-4xl font-extrabold text-gray-900">{pathway.name}</h1>
          <p className="text-lg text-gray-600 mt-4">{pathway.description}</p>

          <div className="text-gray-500 text-sm mt-6 space-y-2">
            <p>
              <span className="font-semibold">Courses Included:</span>{" "}
              {pathway.courses.length}
            </p>
            <p>
              <span className="font-semibold">Rating:</span> {pathway.rating} ⭐
            </p>
          </div>

          {/* Courses in Pathway */}
          <div className="bg-gray-100 p-6 rounded-lg mt-6 shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Courses in this Pathway
            </h2>
            <ul className="list-disc ml-6 text-gray-600">
              {pathway.courses.map((course, index) => (
                <li key={index}>
                  <Link
                    to={course.link}
                    className="text-blue-500 hover:underline"
                  >
                    {course.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Reviews */}
          <div className="mt-6 bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Reviews
            </h2>
            {pathway.reviews.length > 0 ? (
              pathway.reviews.map((review, index) => (
                <div key={index} className="mb-4">
                  <p className="font-semibold text-gray-800">{review.user}</p>
                  <div className="flex items-center text-yellow-500">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <span key={i}>⭐</span>
                    ))}
                  </div>
                  <p className="text-gray-600 mt-2">{review.comment}</p>
                </div>
              ))
            ) : (
              <p>No reviews yet.</p>
            )}
          </div>

          {/* Enroll Button */}
          <div className="mt-6">
            <button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-md">
              Enroll in Pathway
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default beforeAuthLayout(PathwayPage);
