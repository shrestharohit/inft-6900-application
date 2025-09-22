import webDevImg from "../assets/Images/webdevremovebg.png";
import dataAnalyticsImg from "../assets/Images/dataanaremovebg.png";
import aiMlImg from "../assets/Images/aimlremovebg.png";

import techSkillsImg from "../assets/Images/techskills.png";
import analyticalSkillsImg from "../assets/Images/analyticalskills.png";
import businessSkillsImg from "../assets/Images/businessskills.png";

export const popularCourses = [
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

export const trendingPathways = [
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

export const ROUTES = {
  DEFAULT: "/",
  ADMIN: "/admin",
  COURSE_OWNER: "/courseowner",
};
