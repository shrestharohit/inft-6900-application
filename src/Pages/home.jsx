import React from "react";
import { Link } from "react-router-dom";

// Import your downloaded images
import webDevImg from '../assets/Images/webdev.png';
import dataAnalyticsImg from '../assets/Images/dataana.png';
import aiMlImg from '../assets/Images/aiml.png';

function Home() {
    const popularCourses = [
        { name: "Web Development", img: webDevImg, link: "/courses/web-development" },
        { name: "Data Analytics", img: dataAnalyticsImg, link: "/courses/data-analytics" },
        { name: "AI & Machine Learning", img: aiMlImg, link: "/courses/ai-ml" },
    ];

    const trendingPathways = [
        {
            name: "Tech Skills",
            link: "/pathway/tech-skills",
            description: "Master coding, cloud & emerging technologies.",
            bg: "#e8f7ef",
            courses: [
                { name: "HTML & CSS", link: "/courses/html-css" },
                { name: "JavaScript", link: "/courses/javascript" },
                { name: "React", link: "/courses/react" },
            ]
        },
        {
            name: "Analytical Skills",
            link: "/pathway/analytical-skills",
            description: "Learn big data, research, and problem solving.",
            bg: "#fff3e8",
            courses: [
                { name: "Excel for Analytics", link: "/courses/excel" },
                { name: "SQL & Databases", link: "/courses/sql" },
                { name: "Python for Data Analysis", link: "/courses/python-data" },
            ]
        },
        {
            name: "Business Skills",
            link: "/pathway/business-skills",
            description: "Build leadership and management expertise.",
            bg: "#f0f4ff",
            courses: [
                { name: "Project Management", link: "/courses/project-management" },
                { name: "Leadership Skills", link: "/courses/leadership" },
                { name: "Entrepreneurship", link: "/courses/entrepreneurship" },
            ]
        },
    ];

    return (
        <div style={styles.page}>
            {/* Hero Section */}
            <section style={styles.hero}>
                <h1 style={styles.heroTitle}>Learn Today. Lead Tomorrow.</h1>
                <p style={styles.heroSubtitle}>
                    Build real skills. Take real courses. Launch real careers.
                </p>
                <button style={styles.ctaBtn}>Get Started</button>
            </section>

            {/* Popular Courses */}
            <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Most Popular Courses</h2>
                <div style={styles.courseGrid}>
                    {popularCourses.map((course, idx) => (
                        <Link key={idx} to={course.link} style={styles.courseCard}>
                            <img src={course.img} alt={course.name} style={styles.courseIcon} />
                            <h3 style={styles.courseName}>{course.name}</h3>
                            <p style={styles.courseDesc}>
                                Explore {course.name} with hands-on projects and expert instructors.
                            </p>
                        </Link>
                    ))}
                </div>
                <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
                    <Link to="/all-courses" style={styles.viewAllBtn}>View All Courses</Link>
                </div>
            </section>

            {/* Trending Pathways */}
            <section style={{ ...styles.section, background: "#f5f7fe" }}>
                <h2 style={styles.sectionTitle}>Trending Pathways</h2>
                <div style={styles.trendingContainer}>
                    {trendingPathways.map((pathway, idx) => (
                        <div key={idx} style={{ marginBottom: "2rem" }}>
                            <Link to={pathway.link} style={{ ...styles.pathwayCard, background: pathway.bg }}>
                                <h3 style={{ marginBottom: "0.5rem" }}>{pathway.name}</h3>
                                <p style={{ fontSize: "0.95rem", color: "#555" }}>{pathway.description}</p>
                            </Link>

                            {/* Courses inside pathway */}
                            <div style={styles.pathwayCourses}>
                                {pathway.courses.map((course, cIdx) => (
                                    <Link key={cIdx} to={course.link} style={styles.pathwayCourseBtn}>
                                        {course.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Reviews */}
            <section style={styles.section}>
                <h2 style={styles.sectionTitle}>What Learners Say</h2>
                <div style={styles.reviewGrid}>
                    {[
                        { name: "Alex", text: "This platform really helped me grow my career.", img: "https://randomuser.me/api/portraits/men/32.jpg" },
                        { name: "Sarah", text: "Amazing courses with practical projects.", img: "https://randomuser.me/api/portraits/women/44.jpg" },
                        { name: "John", text: "The user experience is smooth and motivating.", img: "https://randomuser.me/api/portraits/men/65.jpg" },
                    ].map((review, idx) => (
                        <div key={idx} style={styles.reviewCard}>
                            <img src={review.img} alt={review.name} style={styles.avatar} />
                            <p style={styles.reviewText}>"{review.text}"</p>
                            <span style={styles.reviewer}>– {review.name}</span>
                            <div style={styles.stars}>⭐⭐⭐⭐⭐</div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

const styles = {
    page: { background: "#fafafa", fontFamily: "Inter, sans-serif", lineHeight: "1.6", paddingBottom: "3rem" },
    hero: { background: "linear-gradient(135deg, #29347a 0%, #4f5da6 100%)", color: "#fff", textAlign: "center", padding: "5rem 1rem", borderRadius: "12px", margin: "2rem auto", maxWidth: "1100px" },
    heroTitle: { fontWeight: "700", fontSize: "2.5rem", marginBottom: "1rem" },
    heroSubtitle: { fontSize: "1.2rem", marginBottom: "1.5rem" },
    ctaBtn: { background: "#fff", color: "#29347a", padding: "12px 28px", border: "none", borderRadius: "6px", fontWeight: "600", cursor: "pointer" },

    section: { maxWidth: "1100px", margin: "3rem auto", padding: "2rem", borderRadius: "12px", background: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" },
    sectionTitle: { textAlign: "center", fontSize: "1.8rem", fontWeight: "700", color: "#29347a", marginBottom: "2rem" },

    courseGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: "1.5rem" },
    courseCard: { background: "#fff", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.08)", textAlign: "center", paddingBottom: "1rem", textDecoration: "none", color: "#29347a", transition: "transform 0.3s, box-shadow 0.3s" },
    courseIcon: { width: "60px", height: "60px", objectFit: "contain", margin: "1rem auto" },
    courseName: { fontWeight: "600", margin: "0.5rem 0" },
    courseDesc: { fontSize: "0.9rem", color: "#555", padding: "0 1rem" },
    viewAllBtn: { display: "inline-block", background: "#007BFF", color: "#fff", padding: "10px 20px", borderRadius: "6px", textDecoration: "none", fontWeight: "600" },

    trendingContainer: { display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: "600px", margin: "0 auto" },
    pathwayCard: { borderRadius: "10px", padding: "1.5rem 1rem", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", textDecoration: "none", color: "#29347a", cursor: "pointer", transition: "transform 0.3s, box-shadow 0.3s" },
    pathwayCourses: { display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "1rem", justifyContent: "center" },
    pathwayCourseBtn: { padding: "8px 14px", borderRadius: "6px", background: "#6cc04a", color: "#fff", textDecoration: "none", fontSize: "0.9rem", cursor: "pointer" },

    reviewGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: "1.5rem", justifyContent: "center" },
    reviewCard: { background: "#f9faff", borderRadius: "10px", padding: "2rem 1.5rem", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
    avatar: { width: "60px", height: "60px", borderRadius: "50%", marginBottom: "1rem" },
    reviewText: { fontSize: "0.95rem", fontStyle: "italic" },
    reviewer: { display: "block", marginTop: "1rem", fontWeight: "600", color: "#29347a" },
    stars: { marginTop: "0.5rem", color: "#f5b50a" },
};

export default Home;