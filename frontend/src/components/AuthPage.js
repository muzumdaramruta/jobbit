import React, { useState, useEffect } from "react";
import Login from "./Login";
import Register from "./Register";
import { useNavigate } from "react-router-dom";
import "../css/AuthPage.css";
import Cookies from "js-cookie";

function AuthPage() {
    const [activeTab, setActiveTab] = useState("login");
    const navigate = useNavigate();

    // Redirect to home page if user is already logged in
    useEffect(() => {
        const jwtToken = Cookies.get("jwt");
        if (jwtToken) {
            navigate("/");
        }
    }, [navigate]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="container my-5 px-md-4">
            <div className="row">
                <div className="col-lg-6 offset-lg-3">
                    <nav>
                        <ul className="nav nav-tabs">
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${
                                        activeTab === "login" ? "active" : ""
                                    }`}
                                    onClick={() => handleTabChange("login")}
                                >
                                    Login
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${
                                        activeTab === "register" ? "active" : ""
                                    }`}
                                    onClick={() => handleTabChange("register")}
                                >
                                    Register
                                </button>
                            </li>
                        </ul>
                    </nav>
                    <div>
                        {activeTab === "login" ? <Login /> : <Register />}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthPage;
