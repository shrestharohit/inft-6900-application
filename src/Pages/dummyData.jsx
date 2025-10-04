import webdevremovebg from "../assets/Images/webdevremovebg.png";
import dataanaremovebg from "../assets/Images/dataanaremovebg.png";
import aiMlImg from "../assets/Images/aimlremovebg.png";
import techSkillsImg from "../assets/Images/techskills.png";
import analyticalSkillsImg from "../assets/Images/analyticalskills.png";
import businessSkillsImg from "../assets/Images/businessskills.png";

/**
 * Utility: Load reviews from localStorage if present, else use defaults
 */
const loadReviews = (courseId, defaultReviews = []) => {
    const stored = localStorage.getItem(`reviews_${courseId}`);
    return stored ? JSON.parse(stored) : defaultReviews;
};

export const dummyCourses = [
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
        ownerId: "17",                    // ✅ match loggedInUser.id
        ownerEmail: "hideaki.sato0312@gmail.com",      // ✅ match loggedInUser.email
        img: webdevremovebg,
        outline: {
            modules: "10 modules",
            contentType: "Videos, Quizzes, Assignments",
            structure: ["HTML Basics", "CSS Basics", "JavaScript Basics", "Project"],
        },
        reviews: loadReviews("1", [
            { user: "John Doe", rating: 4, comment: "Great course for beginners!" },
            { user: "Jane Smith", rating: 5, comment: "Loved it! Easy to follow." },
        ]),
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
        img: dataanaremovebg,
        outline: {
            modules: "6 modules",
            contentType: "Videos, Quizzes",
            structure: ["Intro to Data", "SQL Basics", "Data Cleaning"],
        },
        reviews: loadReviews("2", [
            { user: "Alex Johnson", rating: 4, comment: "Very insightful course!" },
        ]),
    },
    {
        id: "3",
        name: "AI & Machine Learning",
        description: "Dive into AI and Machine Learning concepts and applications.",
        level: "Advanced",
        knowledgeArea: "Tech Skills",
        releasedDate: "2023-02-10",
        rating: 4.8,
        numEnrolled: 800,
        owner: "Course Owner 3",
        img: aiMlImg,
        outline: {
            modules: "10 modules",
            contentType: "Labs, Projects",
            structure: ["Regression", "Classification", "Clustering", "Capstone"],
        },
        reviews: loadReviews("3"),
    },
    {
        id: "4",
        name: "Big Data",
        description: "Learn how to work with large-scale datasets using Hadoop & Spark.",
        level: "Intermediate",
        knowledgeArea: "Analytical Skills",
        releasedDate: "2023-06-01",
        rating: 4.6,
        numEnrolled: 700,
        owner: "Course Owner 4",
        img: analyticalSkillsImg,
        outline: {
            modules: "8 modules",
            contentType: "Hands-on Labs",
            structure: ["HDFS Basics", "MapReduce", "Spark", "Mini Project"],
        },
        reviews: loadReviews("4"),
    },
    {
        id: "5",
        name: "Accounting",
        description: "Understand financial statements, ledgers, and reporting.",
        level: "Beginner",
        knowledgeArea: "Business Skills",
        releasedDate: "2023-07-15",
        rating: 4.3,
        numEnrolled: 500,
        owner: "Course Owner 5",
        img: businessSkillsImg,
        outline: {
            modules: "5 modules",
            contentType: "Videos, Quizzes",
            structure: ["Intro to Accounting", "Ledgers", "Balance Sheets"],
        },
        reviews: loadReviews("5"),
    },
    {
        id: "6",
        name: "Finance",
        description: "Explore corporate finance, investments, and markets.",
        level: "Intermediate",
        knowledgeArea: "Business Skills",
        releasedDate: "2023-08-20",
        rating: 4.5,
        numEnrolled: 650,
        owner: "Course Owner 6",
        img: businessSkillsImg,
        outline: {
            modules: "7 modules",
            contentType: "Case Studies",
            structure: ["Financial Ratios", "Business Planning", "Case Project"],
        },
        reviews: loadReviews("6"),
    },
    {
        id: "7",
        name: "DevOps",
        description: "CI/CD pipelines, Docker, and Kubernetes essentials.",
        level: "Intermediate",
        knowledgeArea: "Tech Skills",
        releasedDate: "2023-09-01",
        rating: 4.7,
        numEnrolled: 850,
        owner: "Course Owner 7",
        img: techSkillsImg,
        outline: {
            modules: "8 modules",
            contentType: "Videos + Labs",
            structure: ["CI/CD Basics", "Docker", "Kubernetes"],
        },
        reviews: loadReviews("7"),
    },
    {
        id: "8",
        name: "Power BI",
        description: "Data visualization and business intelligence with Power BI.",
        level: "Advanced",
        knowledgeArea: "Analytical Skills",
        releasedDate: "2023-10-10",
        rating: 4.9,
        numEnrolled: 950,
        owner: "Course Owner 8",
        img: analyticalSkillsImg,
        outline: {
            modules: "6 modules",
            contentType: "Videos + Projects",
            structure: ["Intro to Power BI", "DAX Basics", "Dashboard Project"],
        },
        reviews: loadReviews("8"),
    },
    {
        id: "9",
        name: "Cloud Computing",
        description: "Understand cloud platforms like AWS, Azure, and Google Cloud.",
        level: "Advanced",
        knowledgeArea: "Tech Skills",
        releasedDate: "2023-11-01",
        rating: 4.8,
        numEnrolled: 1100,
        owner: "Course Owner 9",
        img: techSkillsImg,
        outline: {
            modules: "9 modules",
            contentType: "Videos + Labs",
            structure: ["AWS Basics", "Azure", "Google Cloud", "Capstone"],
        },
        reviews: loadReviews("9"),
    },
];

// ✅ Pathways can stay static for now (or we can also hook them to localStorage if needed)
export const dummyPathways = [
    {
        id: "101",
        name: "Tech Skills Pathway",
        description: "Start from basics and advance through coding, DevOps, and AI/ML.",
        img: techSkillsImg,
        rating: 4.6,
        knowledgeArea: "Tech Skills",
        reviews: [
            { user: "Alice", rating: 5, comment: "Fantastic collection of courses!" },
            { user: "Bob", rating: 4, comment: "Very useful for DevOps beginners." },
        ],
        outline: {
            modules: "3 stages",
            contentType: "Courses, Projects",
            structure: [
                "Web Development (Beginner)",
                "DevOps Foundations",
                "Cloud Computing Basics",
            ],
        },
        courses: [
            { id: "1", name: "Web Development (Beginner)" },
            { id: "7", name: "DevOps" },
            { id: "9", name: "Cloud Computing" },
        ],
    },
    {
        id: "102",
        name: "Analytical Skills Pathway",
        description: "Learn Data Analytics, Big Data, and Power BI.",
        img: analyticalSkillsImg,
        rating: 4.8,
        knowledgeArea: "Analytical Skills",
        reviews: [{ user: "Sara", rating: 5, comment: "Helped me land my analyst job!" }],
        outline: {
            modules: "3 stages",
            contentType: "Courses, Labs, Projects",
            structure: [
                "Data Analytics (Intermediate)",
                "Big Data Fundamentals",
                "Power BI for Beginners",
            ],
        },
        courses: [
            { id: "2", name: "Data Analytics" },
            { id: "4", name: "Big Data" },
            { id: "8", name: "Power BI" },
        ],
    },
    {
        id: "103",
        name: "Business Skills Pathway",
        description: "Master Accounting and Finance for professional growth.",
        img: businessSkillsImg,
        rating: 4.4,
        knowledgeArea: "Business Skills",
        reviews: [],
        outline: {
            modules: "2 stages",
            contentType: "Courses, Case Studies",
            structure: ["Accounting Basics", "Finance Essentials"],
        },
        courses: [
            { id: "5", name: "Accounting" },
            { id: "6", name: "Finance" },
        ],
    },
];
