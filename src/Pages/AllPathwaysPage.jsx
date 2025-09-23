import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import beforeAuthLayout from "../components/BeforeAuth";
import techSkillsImg from "../assets/Images/techskills.png";
import analyticalSkillsImg from "../assets/Images/analyticalskills.png";
import businessSkillsImg from "../assets/Images/businessskills.png";



// Dummy data for pathways
const dummyPathways = [
    {
        id: "1",
        name: "Tech Skills",
        description: "Master coding and DevOps skills.",
        img: techSkillsImg,
        link: "/pathway/tech-skills",
    },
    {
        id: "2",
        name: "Analytical Skills",
        description: "Learn Big Data and Power BI.",
        img: analyticalSkillsImg,
        link: "/pathway/analytical-skills",
    },
    // Add more pathways as needed

    {
        id: "3",
        name: "Business Skills",
        description: "Build Accounting and Finance expertise.",
        img: businessSkillsImg,
        link: "/pathway/business-skills",
    },
];

const AllPathwaysPage = () => {
    const [pathways, setPathways] = useState([]);

    useEffect(() => {
        // Simulate fetching pathways (you can replace it with actual API call)
        setPathways(dummyPathways);
    }, []);

    return (
        <div className="search-results-container bg-gray-50 px-6 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">All Pathways</h1>
            {pathways.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {pathways.map((pathway, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-lg shadow-md">
                            <img
                                src={pathway.img}
                                alt={pathway.name}
                                className="w-full h-40 object-cover rounded-lg mb-4"
                            />
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">{pathway.name}</h3>
                            <p className="text-gray-600 text-sm mb-4">{pathway.description}</p>
                            <Link
                                to={pathway.link}
                                className="text-green-600 hover:text-green-700 font-semibold"
                            >
                                View Pathway
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No pathways found.</p>
            )}
        </div>
    );
};

export default beforeAuthLayout(AllPathwaysPage);
