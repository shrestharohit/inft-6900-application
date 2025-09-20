import { Link } from "react-router-dom";

import webDevImg from "../assets/Images/webdevremovebg.png";
import dataAnalyticsImg from "../assets/Images/dataanaremovebg.png";
import aiMlImg from "../assets/Images/aimlremovebg.png";

import techSkillsImg from "../assets/Images/techskills.png";
import analyticalSkillsImg from "../assets/Images/analyticalskills.png";
import businessSkillsImg from "../assets/Images/businessskills.png";
import Header from "../components/Header";
import Footer from "../components/Footer";
import beforeAuthLayout from "../components/BeforeAuth";

function Home() {
  const popularCourses = [
    {
      name: "Web Development",
      img: webDevImg,
      link: "/courses/web-development",
    },
    {
      name: "Data Analytics",
      img: dataAnalyticsImg,
      link: "/courses/data-analytics",
    },
    { name: "AI & Machine Learning", img: aiMlImg, link: "/courses/ai-ml" },
  ];

  const trendingPathways = [
    {
      name: "Tech Skills",
      link: "/pathway/tech-skills",
      description: "Master coding and DevOps skills.",
      img: techSkillsImg,
      courses: [
        { name: "Coding", link: "/courses/coding" },
        { name: "DevOps", link: "/courses/devops" },
      ],
    },
    {
      name: "Analytical Skills",
      link: "/pathway/analytical-skills",
      description: "Learn Big Data and Power BI.",
      img: analyticalSkillsImg,
      courses: [
        { name: "Big Data", link: "/courses/bigdata" },
        { name: "Power BI", link: "/courses/powerbi" },
      ],
    },
    {
      name: "Business Skills",
      link: "/pathway/business-skills",
      description: "Build Accounting and Finance expertise.",
      img: businessSkillsImg,
      courses: [
        { name: "Accounting", link: "/courses/accounting" },
        { name: "Finance", link: "/courses/finance" },
      ],
    },
  ];

  return (
    <>
      <div className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto py-8 sm:py-12 lg:py-16 px-4 sm:px-6">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-3 sm:mb-4 leading-tight">
              Learn Today. Lead Tomorrow.
            </h1>
            <p className="text-base sm:text-lg text-slate-600 mb-4 sm:mb-6 max-w-2xl mx-auto px-2">
              Build real skills with hands-on courses and guided pathways.
            </p>
            <Link
              to="/registration"
              className="inline-block bg-green-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-green-600 transition-colors text-sm sm:text-base"
            >
              Get Started
            </Link>
          </div>
        </section>

        {/* Popular Courses */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">
            Most Popular Courses
          </h2>
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {popularCourses.map((course, idx) => (
              <Link
                key={idx}
                to={course.link}
                className="block bg-white border rounded-xl p-4 sm:p-6 shadow hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 active:transform-none"
              >
                <div className="h-16 sm:h-20 mb-3 sm:mb-4 flex items-center justify-center">
                  <img
                    src={course.img}
                    alt={course.name}
                    className="max-h-12 sm:max-h-16 w-auto"
                  />
                </div>
                <h3 className="font-semibold text-base sm:text-lg text-center mb-2">
                  {course.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 text-center leading-relaxed">
                  Explore {course.name} with projects and expert mentors.
                </p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6 sm:mt-8">
            <Link
              to="/all-courses"
              className="inline-block bg-blue-600 text-white px-5 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              View All Courses
            </Link>
          </div>
        </section>

        {/* Trending Pathways */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">
            Trending Pathways
          </h2>
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {trendingPathways.map((pathway, idx) => (
              <Link
                key={idx}
                to={pathway.link}
                className="block bg-white border rounded-xl p-4 sm:p-6 shadow hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 active:transform-none"
              >
                <div className="h-16 sm:h-20 mb-3 sm:mb-4 flex items-center justify-center">
                  <img
                    src={pathway.img}
                    alt={pathway.name}
                    className="max-h-12 sm:max-h-16 w-auto"
                  />
                </div>
                <h3 className="font-semibold text-base sm:text-lg text-center mb-2">
                  {pathway.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 text-center mb-3 sm:mb-4 leading-relaxed">
                  {pathway.description}
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {pathway.courses.map((course, cIdx) => (
                    <Link
                      key={cIdx}
                      to={course.link}
                      className="px-2 sm:px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs sm:text-sm font-semibold hover:bg-green-200 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {course.name}
                    </Link>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Reviews */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">
            What Learners Say
          </h2>
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Alex",
                text: "This platform really helped me grow my career.",
              },
              {
                name: "Sarah",
                text: "Amazing courses with practical projects.",
              },
              {
                name: "John",
                text: "The user experience is smooth and motivating.",
              },
            ].map((review, idx) => (
              <div key={idx} className="bg-white rounded-xl p-4 sm:p-6 shadow">
                <p className="italic text-slate-700 text-sm sm:text-base leading-relaxed mb-3 sm:mb-4">
                  "{review.text}"
                </p>
                <span className="block font-semibold text-sm sm:text-base">
                  – {review.name}
                </span>
                <div className="mt-2 text-yellow-400 text-sm sm:text-base">
                  ⭐⭐⭐⭐⭐
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

export default beforeAuthLayout(Home);
