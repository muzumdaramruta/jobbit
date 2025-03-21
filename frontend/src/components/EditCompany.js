import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import { API_URL } from "../config";
import error_401 from "../img/error_401.png";
import { Spinner } from "react-bootstrap";

function EditCompany({ companyId }) {
    const isLoggedIn = Cookies.get("jwt") !== undefined;
    const token = Cookies.get("jwt");
    const navigate = useNavigate();
    const { id } = useParams();
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saveChangesLoading, setSaveChangesLoading] = useState(false);

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                if (!token) return;

                const headers = {
                    Authorization: `Bearer ${token}`,
                };
                const response = await axios.get(`${API_URL}/company/${id}`, {
                    headers,
                    withCredentials: true,
                });
                const data = response.data;
                setCompany(data);
                setLoading(false); // Set loading to false when data is fetched
            } catch (error) {
                console.error("Error fetching company details: ", error);
                if (error.response && error.response.status === 401) {
                    // Handle unauthorized access, e.g., redirect to login page
                }
            }
        };
        fetchCompany();
    }, [id, token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaveChangesLoading(true);
        const updatedCompany = {
            name: e.target.name.value,
            description: e.target.description.value,
            location: e.target.location.value,
            industry: e.target.industry.value,
        };

        try {
            // Send updated company details to the server
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            await axios.put(`${API_URL}/company/${id}`, updatedCompany, {
                headers,
                withCredentials: true,
            });
            // Redirect to the company details page
            navigate(`/company/${id}`);
        } catch (error) {
            console.error("Error updating company:", error);
        } finally {
            setSaveChangesLoading(false);
        }
    };

    return (
        <div className="container my-6 col-sm-8">
            {loading && (
                <div className="text-center mt-5">
                    <div className="spinner-border text-warning" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}
            {!loading && !isLoggedIn && (
                <div className="text-center mt-5">
                    <img src={error_401} alt="placeholder" />
                    <br />
                    <br />
                    <p className="text-center" style={{ fontSize: "1.2rem" }}>
                        Please login to view this page
                    </p>
                </div>
            )}
            {!loading && isLoggedIn && !company && (
                <div className="text-center mt-5">
                    <img src={error_401} alt="placeholder" />
                    <br />
                    <br />
                    <p className="text-center" style={{ fontSize: "1.2rem" }}>
                        Company not found
                    </p>
                </div>
            )}
            {!loading && isLoggedIn && company && (
                <div className="container">
                    <h1>Edit Company</h1>
                    {/* Render form with pre-filled company details */}
                    <form onSubmit={handleSubmit}>
                        {/* name */}
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">
                                Company Name:
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                defaultValue={company.name}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="description" className="form-label">
                                Description:
                            </label>
                            <textarea
                                className="form-control"
                                id="description"
                                defaultValue={company.description}
                            />
                        </div>
                        {/* location */}
                        <div className="mb-3">
                            <label htmlFor="location" className="form-label">
                                Location:
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="location"
                                defaultValue={company.location}
                            />
                        </div>
                        {/* industry */}
                        <div className="mb-3">
                            <label htmlFor="industry" className="form-label">
                                Industry:
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="industry"
                                defaultValue={company.industry}
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-outline-dark"
                            disabled={saveChangesLoading}
                        >
                            {saveChangesLoading ? (
                                <Spinner animation="border" size="sm" />
                            ) : (
                                "Save Changes"
                            )}
                        </button>
                        <button
                            className="btn btn-outline-dark ms-2"
                            onClick={() => navigate(`/company/${id}`)}
                            disabled={saveChangesLoading}
                        >
                            Cancel
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default EditCompany;
