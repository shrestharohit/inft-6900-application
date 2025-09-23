import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import beforeAuthLayout from "../components/BeforeAuth";
import { dummyPathways } from "../Pages/dummyData"; // ✅ central source

const AllPathwaysPage = () => {
    const [pathways, setPathways] = useState([]);

    useEffect(() => {
        // Simulate fetching pathways (replace with API later)
        setPathways(dummyPathways);
    }, []);

    return (
        <div className="search-results-container bg-gray-50 px-6 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">All Pathways</h1>
            {pathways.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {pathways.map((pathway) => (
                        <div
                            key={pathway.id}
                            className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all"
                        >
                            <img
                                src={pathway.img}
                                alt={pathway.name}
                                className="w-full h-40 object-cover rounded-lg mb-4"
                            />
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                {pathway.name}
                            </h3>
                            <p className="text-gray-600 text-sm mb-4">{pathway.description}</p>
                            <Link
                                to={`/pathway/${pathway.id}`}
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
