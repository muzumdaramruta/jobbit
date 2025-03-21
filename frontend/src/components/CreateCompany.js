import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { API_URL } from "../config";
import { Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { getUserFromToken } from "../utils/helper.js";
import error_401 from "../img/error_401.png";
import { UserType } from "../utils/constants.js";

function CreateCompany() {
    const isLoggedIn = Cookies.get("jwt") !== undefined;
    const user = getUserFromToken();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [industry, setIndustry] = useState("");
    const [foundedDate, setFoundedDate] = useState("");
    const [employeeCount, setEmployeeCount] = useState("");
    const [website, setWebsite] = useState("");

    const [formValid, setFormValid] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const updateFormValidity = useCallback(() => {
        setFormValid(
            name.trim() !== "" &&
                description.trim() !== "" &&
                location.trim() !== "" &&
                industry.trim() !== ""
        );
    }, [name, description, location, industry]);

    useEffect(() => {
        updateFormValidity();
    }, [updateFormValidity]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post(
                `${API_URL}/company`,
                {
                    name,
                    description,
                    location,
                    industry,
                },
                {
                    withCredentials: true,
                }
            );
            if (response.status === 201) {
                const companyId = response.data._id;
                navigate(`/company/${companyId}`);
            }
        } catch (error) {
            console.error("Error creating company: ", error);
            if (error.response?.data?.error !== undefined) {
                setErrorMessage(error.response.data.error);
            } else {
                setErrorMessage("An error occurred. Please try again later.");
            }
            setShowAlert(true);
        }
    };

    return (
        <div className="container">
            {!isLoggedIn || user.userType !== UserType.Admin ? (
                <div className="text-center mt-5">
                    <img src={error_401} alt="placeholder" />
                    <br />
                    <br />
                    <p className="text-center" style={{ fontSize: "1.2rem" }}>
                        You are not authorized to view this page.
                    </p>
                </div>
            ) : (
                <div className="create-company-container">
                    <h3 className="text-center my-4">Add a new company</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">
                                Company Name{" "}
                                <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                autoComplete="off"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="description" className="form-label">
                                Description{" "}
                                <span className="text-danger">*</span>
                            </label>
                            <textarea
                                className="form-control"
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                autoComplete="off"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="location" className="form-label">
                                Location <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                required
                                autoComplete="off"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="industry" className="form-label">
                                Industry <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="industry"
                                value={industry}
                                onChange={(e) => setIndustry(e.target.value)}
                                required
                                autoComplete="off"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="foundedDate" className="form-label">
                                Founded Date{" "}
                            </label>
                            <input
                                type="date"
                                className="form-control"
                                id="foundedDate"
                                value={foundedDate}
                                onChange={(e) => setFoundedDate(e.target.value)}
                                required
                                autoComplete="off"
                            />
                        </div>
                        <div className="mb-3">
                            <label
                                htmlFor="employeeCount"
                                className="form-label"
                            >
                                Employee Count
                            </label>
                            <input
                                type="number"
                                min="0"
                                className="form-control"
                                id="employeeCount"
                                value={employeeCount}
                                onChange={(e) =>
                                    setEmployeeCount(e.target.value)
                                }
                                required
                                autoComplete="off"
                            />
                        </div>
                        {/* website */}
                        <div className="mb-3">
                            <label htmlFor="website" className="form-label">
                                Website
                            </label>
                            <input
                                type="url"
                                className="form-control"
                                id="website"
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                            />
                        </div>

                        <Alert
                            show={showAlert}
                            variant="warning"
                            onClose={() => setShowAlert(false)}
                            dismissible
                        >
                            {errorMessage}
                        </Alert>
                        <button
                            type="submit"
                            className="btn btn-outline-dark"
                            disabled={!formValid}
                        >
                            Create Company
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default CreateCompany;
