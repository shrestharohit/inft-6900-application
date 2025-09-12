import React, { useState } from "react";
import { Link } from "react-router-dom";

// Images
import webDevImg from '../assets/Images/webdevremovebg.png';
import dataAnalyticsImg from '../assets/Images/dataanaremovebg.png';
import aiMlImg from '../assets/Images/aimlremovebg.png';

function Home() {
    const [hoveredCourse, setHoveredCourse] = useState(null);
    const [hoveredPathway, setHoveredPathway] = useState(null);

    const popularCourses = [
        { name: "Web Development", img: webDevImg, link: "/courses/web-development" },
        { name: "Data Analytics", img: dataAnalyticsImg, link: "/courses/data-analytics" },
        { name: "AI & Machine Learning", img: aiMlImg, link: "/courses/ai-ml" },
    ];

    const trendingPathways = [
        {
            name: "Tech Skills",
            link: "/pathway/tech-skills",
            description: "Master coding and DevOps skills.",
            courses: [
                { name: "Coding", link: "/courses/coding" },
                { name: "DevOps", link: "/courses/devops" },
            ]
        },
        {
            name: "Analytical Skills",
            link: "/pathway/analytical-skills",
            description: "Learn Big Data and Power BI.",
            courses: [
                { name: "Big Data", link: "/courses/bigdata" },
                { name: "Power BI", link: "/courses/powerbi" },
            ]
        },
        {
            name: "Business Skills",
            link: "/pathway/business-skills",
            description: "Build Accounting and Finance expertise.",
            courses: [
                { name: "Accounting", link: "/courses/accounting" },
                { name: "Finance", link: "/courses/finance" },
            ]
        },
    ];

    return (
        <div style={styles.page}>

            {/* Hero Section */}
            <section style={styles.hero}>
                <div style={styles.heroInner}>
                    <h1 style={styles.heroTitle}>Learn Today. Lead Tomorrow.</h1>
                    <p style={styles.heroSubtitle}>
                        Build real skills with hands-on courses and guided pathways.
                    </p>
                    <Link to="/registration" style={{ textDecoration: "none" }}>
                        <button style={styles.ctaBtn}>Get Started</button>
                    </Link>
                </div>
            </section>

            {/* Popular Courses */}
            <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Most Popular Courses</h2>
                <div style={styles.courseGrid}>
                    {popularCourses.map((course, idx) => {
                        const isHover = hoveredCourse === idx;
                        return (
                            <Link
                                key={idx}
                                to={course.link}
                                style={{
                                    ...styles.courseCard,
                                    transform: isHover ? "translateY(-8px)" : "translateY(0)",
                                    boxShadow: isHover
                                        ? "0 12px 28px rgba(0,0,0,0.15)"
                                        : "0 6px 18px rgba(0,0,0,0.08)",
                                }}
                                onMouseEnter={() => setHoveredCourse(idx)}
                                onMouseLeave={() => setHoveredCourse(null)}
                            >
                                <img
                                    src={course.img}
                                    alt={course.name}
                                    style={styles.courseIcon}
                                />
                                <h3 style={styles.courseName}>{course.name}</h3>
                                <p style={styles.courseDesc}>
                                    Explore {course.name} with projects and expert mentors.
                                </p>
                            </Link>
                        );
                    })}
                </div>
                <div style={{ textAlign: "center", marginTop: "2rem" }}>
                    <Link to="/all-courses" style={styles.viewAllBtn}>
                        View All Courses
                    </Link>
                </div>
            </section>

            {/* Trending Pathways */}
            <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Trending Pathways</h2>
                <div style={styles.courseGrid}>
                    {trendingPathways.map((pathway, idx) => {
                        const isHover = hoveredPathway === idx;
                        return (
                            <Link
                                key={idx}
                                to={pathway.link}
                                style={{
                                    ...styles.courseCard,
                                    transform: isHover ? "translateY(-8px)" : "translateY(0)",
                                    boxShadow: isHover
                                        ? "0 12px 28px rgba(0,0,0,0.15)"
                                        : "0 6px 18px rgba(0,0,0,0.08)",
                                }}
                                onMouseEnter={() => setHoveredPathway(idx)}
                                onMouseLeave={() => setHoveredPathway(null)}
                            >
                                {/* Centered pathway image */}
                                <div style={styles.pathwayImg}>
                                    <img
                                        src={webDevImg} // Replace with pathway-specific image if you have
                                        alt={pathway.name}
                                        style={styles.pathwayImgInner}
                                    />
                                </div>
                                <h3 style={styles.courseName}>{pathway.name}</h3>
                                <p style={styles.courseDesc}>{pathway.description}</p>
                                <div style={styles.pathwayCourses}>
                                    {pathway.courses.map((course, cIdx) => (
                                        <Link key={cIdx} to={course.link} style={styles.pathwayCourseBtn}>
                                            {course.name}
                                        </Link>
                                    ))}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* Reviews */}
            <section style={styles.section}>
                <h2 style={styles.sectionTitle}>What Learners Say</h2>
                <div style={styles.reviewGrid}>
                    {[
                        { name: "Alex", text: "This platform really helped me grow my career." },
                        { name: "Sarah", text: "Amazing courses with practical projects." },
                        { name: "John", text: "The user experience is smooth and motivating." }
                    ].map((review, idx) => (
                        <div key={idx} style={styles.reviewCard}>
                            <p style={styles.reviewText}>"{review.text}"</p>
                            <span style={styles.reviewer}>– {review.name}</span>
                            <div style={styles.stars} aria-label="5 out of 5 stars">
                                ⭐⭐⭐⭐⭐
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

const styles = {
    page: {
        background: "#fafafa",
        fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        lineHeight: 1.6,
        paddingBottom: "3rem",
    },

    // Hero
    hero: {
        background: "linear-gradient(135deg, #1f2a60 0%, #4856a6 100%)",
        color: "#fff",
        borderRadius: "14px",
        margin: "2rem auto",
        maxWidth: "1150px",
        boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
    },
    heroInner: {
        textAlign: "center",
        padding: "5rem 1.25rem",
        maxWidth: "820px",
        margin: "0 auto",
    },
    heroTitle: {
        fontWeight: 800,
        fontSize: "2.8rem",
        marginBottom: "0.75rem",
    },
    heroSubtitle: {
        fontSize: "1.2rem",
        opacity: 0.95,
        marginBottom: "2rem",
    },
    ctaBtn: {
        background: "#6cc04a",
        color: "#0b142b",
        padding: "14px 32px",
        border: "none",
        borderRadius: "10px",
        fontWeight: 700,
        cursor: "pointer",
        fontSize: "1rem",
        boxShadow: "0 6px 18px rgba(108,192,74,0.35)",
        transition: "all 0.2s ease",
    },

    // Sections
    section: {
        maxWidth: "1150px",
        margin: "2.5rem auto",
        padding: "2rem",
        borderRadius: "12px",
        background: "#fff",
        boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
    },
    sectionTitle: {
        fontSize: "2rem",
        fontWeight: 800,
        color: "#1f2a60",
        marginBottom: "2rem",
        letterSpacing: "-0.01em",
        textAlign: "center",
    },

    // Popular Courses / Pathways
    courseGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
        gap: "1.5rem",
    },
    courseCard: {
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
        textAlign: "center",
        padding: "1.5rem 1rem",
        textDecoration: "none",
        color: "#1f2a60",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
    },
    courseIcon: { width: "90px", height: "90px", objectFit: "contain", marginBottom: "1rem"},
    courseName: { fontWeight: 700, marginBottom: "0.5rem" },
    courseDesc: { fontSize: "0.95rem", color: "#49526e" },
    viewAllBtn: {
        display: "inline-block",
        background: "#1f64ff",
        color: "#ffffff",
        padding: "12px 24px",
        borderRadius: "10px",
        textDecoration: "none",
        fontWeight: 700,
        boxShadow: "0 6px 18px rgba(31,100,255,0.25)",
        transition: "all 0.2s ease",
    },

    // Pathway images and courses
    pathwayImg: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: "1rem",
    },
    pathwayImgInner: {
        width: "90px",
        height: "90px",
        objectFit: "contain",
    },
    pathwayCourses: {
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "0.5rem",
        marginTop: "1rem",
    },
    pathwayCourseBtn: {
        padding: "8px 16px",
        borderRadius: "999px",
        background: "#6cc04a",
        color: "#0b142b",
        textDecoration: "none",
        fontSize: "0.9rem",
        fontWeight: 700,
        boxShadow: "0 4px 14px rgba(108,192,74,0.25)",
        transition: "all 0.2s ease",
    },

    // Reviews
    reviewGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "1.5rem" },
    reviewCard: { background: "#ffffff", borderRadius: "16px", padding: "2rem", textAlign: "center", boxShadow: "0 6px 20px rgba(0,0,0,0.08)" },
    reviewText: { fontSize: "1rem", fontStyle: "italic", color: "#2d3559", marginBottom: "1rem" },
    reviewer: { display: "block", fontWeight: 700, color: "#1f2a60" },
    stars: { marginTop: "0.5rem", color: "#f5b50a" },
};

export default Home;
