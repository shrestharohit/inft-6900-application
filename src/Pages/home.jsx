import { Link } from "react-router-dom";

import webDevImg from "../assets/Images/webdevremovebg.png";
import dataAnalyticsImg from "../assets/Images/dataanaremovebg.png";
import aiMlImg from "../assets/Images/aimlremovebg.png";

import techSkillsImg from "../assets/Images/techskills.png";
import analyticalSkillsImg from "../assets/Images/analyticalskills.png";
import businessSkillsImg from "../assets/Images/businessskills.png";
import Header from "../components/Header";
import Footer from "../components/Footer";

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
      <Header />

      <div className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto py-16 px-6">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold mb-4">
              Learn Today. Lead Tomorrow.
            </h1>
            <p className="text-lg text-slate-600 mb-6">
              Build real skills with hands-on courses and guided pathways.
            </p>
            <Link
              to="/registration"
              className="inline-block bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600"
            >
              Get Started
            </Link>
          </div>
        </section>

        {/* Popular Courses */}
        <section className="max-w-6xl mx-auto px-6 mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Most Popular Courses
          </h2>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {popularCourses.map((course, idx) => (
              <Link
                key={idx}
                to={course.link}
                className="block bg-white border rounded-xl p-6 shadow hover:shadow-lg transition transform hover:-translate-y-1"
              >
                <div className="h-20 mb-4 flex items-center justify-center">
                  <img
                    src={course.img}
                    alt={course.name}
                    className="max-h-16"
                  />
                </div>
                <h3 className="font-semibold text-lg">{course.name}</h3>
                <p className="text-sm text-slate-500">
                  Explore {course.name} with projects and expert mentors.
                </p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/all-courses"
              className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold"
            >
              View All Courses
            </Link>
          </div>
        </section>

        {/* Trending Pathways */}
        <section className="max-w-6xl mx-auto px-6 mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Trending Pathways
          </h2>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {trendingPathways.map((pathway, idx) => (
              <Link
                key={idx}
                to={pathway.link}
                className="block bg-white border rounded-xl p-6 shadow hover:shadow-lg transition transform hover:-translate-y-1"
              >
                <div className="h-20 mb-4 flex items-center justify-center">
                  <img
                    src={pathway.img}
                    alt={pathway.name}
                    className="max-h-16"
                  />
                </div>
                <h3 className="font-semibold text-lg">{pathway.name}</h3>
                <p className="text-sm text-slate-500">{pathway.description}</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {pathway.courses.map((course, cIdx) => (
                    <Link
                      key={cIdx}
                      to={course.link}
                      className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-semibold"
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
        <section className="max-w-6xl mx-auto px-6 mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">
            What Learners Say
          </h2>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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
              <div key={idx} className="bg-white rounded-xl p-6 shadow">
                <p className="italic text-slate-700">"{review.text}"</p>
                <span className="block mt-4 font-semibold">
                  – {review.name}
                </span>
                <div className="mt-2 text-yellow-400">⭐⭐⭐⭐⭐</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}

export default Home;
