import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEnvelope,
    faPhone,
    faUserTie,
    faBriefcase,
    faLocationDot,
    faList,
} from "@fortawesome/free-solid-svg-icons";
import "../css/ProfilePage.css"; // Import your CSS file
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import error_401 from "../img/error_401.png";
import { UserType } from "../utils/constants";
import axios from "axios";
import { API_URL } from "../config";

function ProfilePage() {
    const isLoggedIn = Cookies.get("jwt") !== undefined;
    const token = Cookies.get("jwt");

    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true); // State to track loading status

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                if (!token) return;

                const headers = {
                    Authorization: `Bearer ${token}`,
                };
                const response = await axios.get(`${API_URL}/users/profile`, {
                    headers,
                    withCredentials: true,
                });
                setUser(response.data);
                setLoading(false); // Set loading to false after fetching data
            } catch (error) {
                console.error("Error fetching saved jobs: ", error);
                // Handle error
            }
        };

        fetchUserProfile();
    }, [token]);

    return (
        <div className="container">
            {!isLoggedIn && (
                <div className="text-center mt-5">
                    <img src={error_401} alt="placeholder" />
                    <br />
                    <br />
                    <p className="text-center" style={{ fontSize: "1.2rem" }}>
                        Please login to view this page
                    </p>
                </div>
            )}

            {isLoggedIn && (
                <div className="profile-container">
                    <div className="row align-items-center">
                        <div className="profile-header col-lg-10">
                            <h1>User Profile</h1>
                        </div>
                        <Link
                            to="/edit-profile"
                            className="btn btn-outline-dark col-lg-2"
                        >
                            Edit Profile
                        </Link>
                    </div>
                    <div className="container profile-info">
                        {loading ? (
                            <div className="text-center mt-5">
                                <div
                                    className="spinner-border text-warning"
                                    role="status"
                                >
                                    <span className="visually-hidden">
                                        Loading...
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* name */}
                                <div className="info-item">
                                    <FontAwesomeIcon
                                        icon={faUserTie}
                                        className="icon"
                                    />
                                    <p>{user.name}</p>
                                </div>
                                <div className="info-item">
                                    <FontAwesomeIcon
                                        icon={faEnvelope}
                                        className="icon"
                                    />
                                    <p>{user.email}</p>
                                </div>
                                <div className="info-item">
                                    <FontAwesomeIcon
                                        icon={faPhone}
                                        className="icon"
                                    />
                                    <p>{user.phone || "-"}</p>
                                </div>
                                <div className="info-item">
                                    <FontAwesomeIcon
                                        icon={faBriefcase}
                                        className="icon"
                                    />
                                    <p>
                                        {user.company ? user.company.name : "-"}
                                    </p>
                                </div>
                                <div className="info-item">
                                    <FontAwesomeIcon
                                        icon={faLocationDot}
                                        className="icon"
                                    />
                                    <p>{user.address || "-"}</p>
                                </div>
                                <div className="info-item">
                                    <FontAwesomeIcon
                                        icon={faList}
                                        className="icon"
                                    />
                                    <p>{user.bio || "-"}</p>
                                </div>
                                <div className="info-item">
                                    <FontAwesomeIcon
                                        icon={faUserTie}
                                        className="icon"
                                    />
                                    <p>{user.userType}</p>
                                </div>
                            </>
                        )}
                    </div>
                    {user.userType === UserType.Employee && (
                        <div className="container">
                            <div className="profile-saved-jobs">
                                <h3>Saved Jobs</h3>
                                {user.savedJobs.map((job) => (
                                    <Link
                                        to={`/jobs/${job._id}`}
                                        key={job._id}
                                        className="job-item"
                                        target="_blank"
                                    >
                                        <FontAwesomeIcon
                                            icon={faBriefcase}
                                            className="icon"
                                        />
                                        <p>{job.title}</p>
                                    </Link>
                                ))}
                                {user.savedJobs.length === 0 && (
                                    <p className="no-jobs">No saved jobs</p>
                                )}
                            </div>
                            {/* applied jobs */}
                            <div className="profile-applied-jobs">
                                <h3>Applied Jobs</h3>
                                {user.applications.map((application) => (
                                    <Link
                                        to={`/jobs/${application.job._id}`}
                                        key={application.job._id}
                                        className="job-item"
                                        target="_blank"
                                    >
                                        <FontAwesomeIcon
                                            icon={faBriefcase}
                                            className="icon"
                                        />
                                        <p>{application.job.title}</p>
                                    </Link>
                                ))}
                                {user.applications.length === 0 && (
                                    <p className="no-jobs">No applied jobs</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* if user is employer */}
                    {user.userType === UserType.Employer && (
                        <div className="profile-posted-jobs">
                            <h3>Jobs Posted</h3>
                            {user.postedJobs.map((job) => (
                                <Link
                                    to={`/jobs/${job._id}`}
                                    key={job._id}
                                    className="job-item"
                                    target="_blank"
                                >
                                    <p>{job.title}</p>
                                </Link>
                            ))}
                            {user.postedJobs.length === 0 && (
                                <p className="no-jobs">No posted jobs</p>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default ProfilePage;
