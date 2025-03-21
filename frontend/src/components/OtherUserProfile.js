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
import error_401 from "../img/error_401.png";
import axios from "axios";
import { API_URL } from "../config";
import { useParams } from "react-router-dom";
import { Toast } from "react-bootstrap";

function OtherUserProfile() {
    const isLoggedIn = Cookies.get("jwt") !== undefined;
    const token = Cookies.get("jwt");
    const { id } = useParams();

    const [user, setUser] = useState({});
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                if (!token) return;

                const headers = {
                    Authorization: `Bearer ${token}`,
                };
                const response = await axios.get(
                    `${API_URL}/users/profile/${id}`,
                    {
                        headers,
                        withCredentials: true,
                    }
                );
                setUser(response.data);
            } catch (error) {
                console.error("Error fetching saved jobs: ", error);
                // Handle error
                setShowToast(true);
                if (error.response) {
                    setToastMessage(error.response.data.error);
                } else setToastMessage("Error fetching user profile");
            }
        };

        fetchUserProfile();
    }, [token, id]);

    return (
        <div className="container">
            <Toast
                show={showToast}
                onClose={() => setShowToast(false)}
                delay={5000}
                autohide
                style={{
                    position: "fixed",
                    bottom: 20,
                    left: 20,
                }}
            >
                <Toast.Body>{toastMessage}</Toast.Body>
            </Toast>
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
                    </div>
                    <div className="container profile-info">
                        {/* name */}
                        <div className="info-item">
                            <FontAwesomeIcon
                                icon={faUserTie}
                                className="icon"
                            />
                            <p>{user.name || "-"}</p>
                        </div>
                        <div className="info-item">
                            <FontAwesomeIcon
                                icon={faEnvelope}
                                className="icon"
                            />
                            <p>{user.email || "-"}</p>
                        </div>
                        <div className="info-item">
                            <FontAwesomeIcon icon={faPhone} className="icon" />
                            <p>{user.phone || "-"}</p>
                        </div>
                        {/* company */}
                        <div className="info-item">
                            <FontAwesomeIcon
                                icon={faBriefcase}
                                className="icon"
                            />
                            <p>{user.company?.name || "-"}</p>
                        </div>
                        <div className="info-item">
                            <FontAwesomeIcon
                                icon={faLocationDot}
                                className="icon"
                            />
                            <p>{user.address || "-"}</p>
                        </div>
                        <div className="info-item">
                            <FontAwesomeIcon icon={faList} className="icon" />
                            <p>{user.bio || "-"}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default OtherUserProfile;
