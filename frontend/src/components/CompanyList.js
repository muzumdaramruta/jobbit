import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config";
import Cookies from "js-cookie";
import error_401 from "../img/error_401.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "../css/CompanyList.css";
import { getUserFromToken } from "../utils/helper.js";
import { UserType } from "../utils/constants";

function CompanyList() {
    const [companies, setCompanies] = useState(null); // Initialize companies as null
    const [loading, setLoading] = useState(true); // Initialize loading state
    const user = getUserFromToken();

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const token = Cookies.get("jwt");
                if (!token) return;
                const headers = {
                    Authorization: `Bearer ${token}`,
                };
                const response = await axios.get(`${API_URL}/company`, {
                    headers,
                    withCredentials: true,
                });
                const data = response.data;
                setCompanies(data);
            } catch (error) {
                console.error("Error fetching companies: ", error);
                if (error.response && error.response.status === 401) {
                    // Handle unauthorized access, e.g., redirect to login page
                }
            } finally {
                setLoading(false); // Update loading state when fetch completes
            }
        };
        fetchCompanies();
    }, []);

    return (
        <div className="container my-1">
            <h1 className="text-center my-3">Companies</h1>
            <h5 className="my-3 text-center">
                If your company is not listed below, please contact the admin.
            </h5>
            {loading && (
                <div className="text-center mt-5">
                    <div className="spinner-border text-warning" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}
            {!loading && companies === null && (
                <div className="text-center mt-5">
                    <img src={error_401} alt="placeholder" />
                    <br />
                    <br />
                    <p className="text-center" style={{ fontSize: "1.2rem" }}>
                        Please login to view companies
                    </p>
                </div>
            )}
            {!loading && companies !== null && companies.length > 0 && (
                <>
                    <div className="container">
                        {user && user.userType === UserType.Admin && (
                            <div className="text-center">
                                <Link
                                    to="/create-company"
                                    className="btn btn-outline-dark"
                                >
                                    Add Company
                                </Link>
                            </div>
                        )}
                    </div>

                    {companies.map((company) => (
                        <div
                            className="companies col-lg-10 offset-lg-1"
                            key={company._id}
                        >
                            <div className="company rounded">
                                <div className="row">
                                    <div className="col-md-2 col-sm-2 text-center">
                                        <div className="company-logo">
                                            <img
                                                src={company.logoUrl}
                                                className="img-responsive"
                                                alt={company.name}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4 col-sm-4">
                                        <div className="company-name">
                                            <Link
                                                to={`/company/${company._id}`}
                                            >
                                                <h4>{company.name}</h4>
                                            </Link>
                                        </div>
                                        <div className="company-rating">
                                            <p>
                                                <span>
                                                    {company.rating
                                                        ? company.rating.toFixed(
                                                              1
                                                          )
                                                        : "-"}
                                                    <FontAwesomeIcon
                                                        icon={faStar}
                                                        color="orange"
                                                    />
                                                </span>
                                                <span> </span>
                                                <span>
                                                    {company.reviews.length ||
                                                        0}{" "}
                                                    reviews
                                                </span>
                                            </p>
                                        </div>

                                        <div className="company-location">
                                            <p>{company.location}</p>

                                            <p>{company.industry}</p>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-sm-6">
                                        <div className="company-industry">
                                            <p>{company.description}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </>
            )}
        </div>
    );
}

export default CompanyList;
