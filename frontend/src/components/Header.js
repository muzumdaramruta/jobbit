import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { getUserFromToken } from "../utils/helper.js";
import { UserType } from "../utils/constants.js";

function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = getUserFromToken();

    // Function to handle logout
    const handleLogout = () => {
        // Clear the JWT token from cookies
        Cookies.remove("jwt");
        navigate("/auth");
    };

    // Check if the JWT token exists in cookies
    const isLoggedIn = Cookies.get("jwt") ? true : false;

    return (
        <nav
            className="navbar navbar-expand-lg navbar-light px-3"
            style={{ backgroundColor: "#ffd60a" }}
        >
            <div className="container-fluid">
                <Link className="navbar-brand fw-bold" to="/">
                    Jobbit
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div
                    className="collapse navbar-collapse"
                    id="navbarSupportedContent"
                >
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link
                                className={`nav-link ${
                                    location.pathname === "/" ? "active" : ""
                                }`}
                                to="/"
                            >
                                Home
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className={`nav-link ${
                                    location.pathname === "/about"
                                        ? "active"
                                        : ""
                                }`}
                                to="/about"
                            >
                                About Us
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className={`nav-link ${
                                    location.pathname === "/jobs"
                                        ? "active"
                                        : ""
                                }`}
                                to="/jobs"
                            >
                                Jobs
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className={`nav-link ${
                                    location.pathname === "/company-list"
                                        ? "active"
                                        : ""
                                }`}
                                to="/company-list"
                            >
                                Companies
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className={`nav-link ${
                                    location.pathname === "/contact"
                                        ? "active"
                                        : ""
                                }`}
                                to="/contact"
                            >
                                Contact
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className={`nav-link ${
                                    location.pathname === "/FAQs"
                                        ? "active"
                                        : ""
                                }`}
                                to="/FAQs"
                            >
                                FAQs
                            </Link>
                        </li>
                        {/* employees if the user logged is in admin role */}

                        {isLoggedIn && user.userType === UserType.Admin && (
                            <li className="nav-item">
                                <Link
                                    className={`nav-link ${
                                        location.pathname === "/employees"
                                            ? "active"
                                            : ""
                                    }`}
                                    to="/employees"
                                >
                                    Employees
                                </Link>
                            </li>
                        )}
                        
                    </ul>
                    {isLoggedIn ? (
                        <div className="dropdown">
                            <button
                                className="btn btn-outline-dark dropdown-toggle"
                                type="button"
                                id="dropdownMenuButton"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            ></button>
                            <ul
                                className="dropdown-menu dropdown-menu-end"
                                aria-labelledby="dropdownMenuButton"
                            >
                                <li>
                                    <Link
                                        className="dropdown-item"
                                        to="/profile"
                                    >
                                        Profile
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        className="dropdown-item"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <Link to="/auth" className="btn btn-outline-dark">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Header;
