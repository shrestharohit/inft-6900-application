import React, { useState } from "react";
import { Link } from "react-router-dom";

// Images
import webDevImg from '../assets/Images/webdev.png';
import dataAnalyticsImg from '../assets/Images/dataana.png';
import aiMlImg from '../assets/Images/aiml.png';

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
            description: "Master coding, cloud & emerging technologies.",
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
            courses: [
                { name: "Project Management", link: "/courses/project-management" },
                { name: "Leadership Skills", link: "/courses/leadership" },
                { name: "Entrepreneurship", link: "/courses/entrepreneurship" },
            ]
        },
    ];

    return (
        <div style={styles.page}>
            {/* Hero */}
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
                                    transform: isHover ? "translateY(-6px)" : "translateY(0)",
                                    boxShadow: isHover
                                        ? "0 10px 24px rgba(0,0,0,0.12)"
                                        : "0 4px 14px rgba(0,0,0,0.08)",
                                }}
                                onMouseEnter={() => setHoveredCourse(idx)}
                                onMouseLeave={() => setHoveredCourse(null)}
                            >
                                <div style={styles.courseIconWrap}>
                                    <img src={course.img} alt={course.name} style={styles.courseIcon} />
                                </div>
                                <h3 style={styles.courseName}>{course.name}</h3>
                                <p style={styles.courseDesc}>
                                    Explore {course.name} with projects and expert mentors.
                                </p>
                            </Link>
                        );
                    })}
                </div>

                <div style={{ textAlign: "center", marginTop: "1.75rem" }}>
                    <Link to="/all-courses" style={styles.viewAllBtn}>View All Courses</Link>
                </div>
            </section>



            {/* Trending Pathways */}
            <section style={{ ...styles.section, background: "#f5f7fe" }}>
                <h2 style={styles.sectionTitle}>Trending Pathways</h2>
                <div style={styles.trendingContainer}>
                    {trendingPathways.map((pathway, idx) => {
                        const isHover = hoveredPathway === idx;
                        return (
                            // NEW wrapper that clips anything extending left/right
                            <div key={idx} style={styles.pathwayRow}>
                                <Link
                                    to={pathway.link}
                                    style={{
                                        ...styles.pathwayCard,
                                        background: pathway.bg,
                                        transform: isHover ? "translateY(-4px)" : "translateY(0)",
                                        boxShadow: isHover
                                            ? "0 10px 24px rgba(0,0,0,0.12)"
                                            : "0 4px 14px rgba(0,0,0,0.08)",
                                    }}
                                    onMouseEnter={() => setHoveredPathway(idx)}
                                    onMouseLeave={() => setHoveredPathway(null)}
                                >
                                    <div style={styles.pathwayHeader}>
                                        <h3 style={{ margin: 0 }}>{pathway.name}</h3>
                                        <span style={styles.pathwayBadge}>Pathway</span> {/* was "Path" */}
                                    </div>
                                    <p style={styles.pathwayDesc}>{pathway.description}</p>
                                </Link>

                                <div style={styles.pathwayCourses}>
                                    {pathway.courses.map((course, cIdx) => (
                                        <Link key={cIdx} to={course.link} style={styles.pathwayCourseBtn}>
                                            {course.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
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
                        { name: "John", text: "The user experience is smooth and motivating." },
                    ].map((review, idx) => (
                        <div key={idx} style={styles.reviewCard}>
                            <img src={review.img} alt={review.name} style={styles.avatar} />
                            <p style={styles.reviewText}>"{review.text}"</p>
                            <span style={styles.reviewer}>– {review.name}</span>
                            <div style={styles.stars} aria-label="5 out of 5 stars">⭐⭐⭐⭐⭐</div>
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
        paddingBottom: "3rem"
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
        padding: "4.75rem 1.25rem",
        maxWidth: "820px",
        margin: "0 auto",
    },
    heroTitle: { fontWeight: 800, fontSize: "2.8rem", marginBottom: "0.75rem", letterSpacing: "-0.02em" },
    heroSubtitle: { fontSize: "1.15rem", opacity: 0.95, marginBottom: "1.5rem" },
    ctaBtn: {
        background: "#6cc04a",
        color: "#0b142b",
        padding: "12px 28px",
        border: "none",
        borderRadius: "10px",
        fontWeight: 700,
        cursor: "pointer",
        fontSize: "1rem",
        boxShadow: "0 6px 18px rgba(108,192,74,0.35)",
    },
    heroFootnote: { marginTop: "0.75rem", fontSize: "0.85rem", opacity: 0.9 },

    // Sections
    section: {
        maxWidth: "1150px",
        margin: "2.25rem auto",
        padding: "2rem",
        borderRadius: "12px",
        background: "#fff",
        boxShadow: "0 2px 12px rgba(0,0,0,0.05)"
    },
    sectionTitle: {
        textAlign: "center",
        fontSize: "1.9rem",
        fontWeight: 800,
        color: "#1f2a60",
        marginBottom: "1.75rem",
        letterSpacing: "-0.01em"
    },

    // Courses
    courseGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: "1.25rem" },
    courseCard: {
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
        textAlign: "center",
        padding: "1rem 1rem 1.25rem",
        textDecoration: "none",
        color: "#1f2a60",
        transition: "transform 200ms ease, box-shadow 200ms ease",
    },
    courseIconWrap: {
        width: 72, height: 72, borderRadius: 14,
        background: "#f3f6ff",
        display: "grid", placeItems: "center",
        margin: "0.75rem auto 0.5rem"
    },
    courseIcon: { width: "48px", height: "48px", objectFit: "contain" },
    courseName: { fontWeight: 700, margin: "0.5rem 0 0.25rem" },
    courseDesc: { fontSize: "0.92rem", color: "#49526e", padding: "0 0.5rem" },
    viewAllBtn: {
        display: "inline-block",
        background: "#1f64ff",
        color: "#fff",
        padding: "11px 20px",
        borderRadius: "10px",
        textDecoration: "none",
        fontWeight: 700,
        boxShadow: "0 6px 18px rgba(31,100,255,0.25)"
    },

    // Pathways
    trendingContainer: { display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "720px", margin: "0 auto" },

    // NEW: row wrapper that clips any decorative/box-shadow bleed
    pathwayRow: {
        marginBottom: "1.5rem",
        position: "relative",
        overflow: "hidden",     // << clamps the pastel lines so they don’t protrude
        borderRadius: "12px",   // match card radius so clipping looks clean
    },

    pathwayCard: {
        borderRadius: "12px",
        padding: "1.25rem 1rem",
        textAlign: "left",
        textDecoration: "none",
        color: "#1f2a60",
        cursor: "pointer",
        transition: "transform 200ms ease, box-shadow 200ms ease",
        position: "relative",   // create a stacking context
        overflow: "hidden",     // belt-and-suspenders: clip inside the card, too
        background: "#fff",  // fallback if no bg provided
    },

    pathwayHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.35rem" },
    pathwayBadge: {
        fontSize: "0.75rem",
        background: "#1f2a60",
        color: "#fff",
        padding: "4px 8px",
        borderRadius: "999px",
        fontWeight: 700,
    },
    pathwayDesc: { fontSize: "0.95rem", color: "#4b5577", margin: 0 },
    pathwayCourses: { display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.75rem" },
    pathwayCourseBtn: {
        padding: "8px 14px",
        borderRadius: "999px",
        background: "#6cc04a",
        color: "#0b142b",
        textDecoration: "none",
        fontSize: "0.9rem",
        fontWeight: 700,
        boxShadow: "0 4px 14px rgba(108,192,74,0.25)"
    },

    // Reviews
    reviewGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "1.25rem" },
    reviewCard: {
        background: "#ffffff",
        borderRadius: "14px",
        padding: "1.5rem",
        textAlign: "center",
        boxShadow: "0 4px 16px rgba(0,0,0,0.06)"
    },
    avatar: { width: 64, height: 64, borderRadius: "50%", margin: "0 auto 0.75rem", display: "block", objectFit: "cover" },
    reviewText: { fontSize: "0.98rem", fontStyle: "italic", color: "#2d3559", margin: 0 },
    reviewer: { display: "block", marginTop: "0.75rem", fontWeight: 700, color: "#1f2a60" },
    stars: { marginTop: "0.35rem", color: "#f5b50a" },
};

export default Home;
