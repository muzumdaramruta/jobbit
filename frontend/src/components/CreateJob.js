import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { API_URL } from "../config";
import { Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../css/CreateJob.css";
import Cookies from "js-cookie";
import { getUserFromToken } from "../utils/helper.js";
import error_401 from "../img/error_401.png";
import { UserType } from "../utils/constants.js";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

function CreateJob() {
    const isLoggedIn = Cookies.get("jwt") !== undefined;
    const user = getUserFromToken();
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [company, setCompany] = useState("");
    const [externalApplyLink, setExternalApplyLink] = useState("");
    const [salary, setSalary] = useState("");
    const [requirements, setRequirements] = useState("");
    const [description, setDescription] = useState("");
    const [jobType, setJobType] = useState("");
    const [isOpen, setIsOpen] = useState(true);

    const [formValid, setFormValid] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const token = Cookies.get("jwt");
                if (!token) return;

                const headers = {
                    Authorization: `Bearer ${token}`,
                };
                const response = await axios.get(`${API_URL}/company/${id}`, {
                    headers,
                    withCredentials: true,
                });
                setCompany(response.data);
            } catch (error) {
                console.error("Error fetching company details: ", error);
                setErrorMessage("An error occurred. Please try again later.");
                setShowAlert(true);
            }
        };
        fetchCompany();
    }, [id]);

    const updateFormValidity = useCallback(() => {
        setFormValid(
            title.trim() !== "" &&
                salary.trim() !== "" &&
                requirements.trim() !== "" &&
                description.trim() !== "" &&
                jobType.trim() !== ""
        );
    }, [title, salary, requirements, description, jobType]);

    useEffect(() => {
        updateFormValidity();
    }, [updateFormValidity]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post(
                `${API_URL}/jobs`,
                {
                    companyId: company._id,
                    title,
                    description,
                    requirements,
                    salary,
                    jobType,
                    externalApplyLink,
                    isOpen,
                },
                {
                    withCredentials: true,
                }
            );
            if (response.status === 201) {
                const jobId = response.data._id;
                navigate(`/jobs/${jobId}`);
            }
        } catch (error) {
            console.error("Error creating job: ", error);
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
            {!isLoggedIn || user.userType !== UserType.Employer ? (
                <div className="text-center mt-5">
                    <img src={error_401} alt="placeholder" />
                    <br />
                    <br />
                    <p className="text-center" style={{ fontSize: "1.2rem" }}>
                        You are not authorized to view this page.
                    </p>
                </div>
            ) : (
                <div className="create-job-container">
                    <h3 className="text-center my-4">
                        Add a new job to{" "}
                        <Link to={`/company/${id}`}>{company.name}</Link>
                    </h3>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="title" className="form-label">
                                Title
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="description" className="form-label">
                                Description
                            </label>
                            <textarea
                                className="form-control"
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label
                                htmlFor="requirements"
                                className="form-label"
                            >
                                Requirements
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="requirements"
                                value={requirements}
                                onChange={(e) =>
                                    setRequirements(e.target.value)
                                }
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="salary" className="form-label">
                                Salary
                            </label>
                            <input
                                type="number"
                                min="0"
                                className="form-control"
                                id="salary"
                                value={salary}
                                onChange={(e) => setSalary(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="jobType" className="form-label">
                                Job Type
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="jobType"
                                value={jobType}
                                onChange={(e) => setJobType(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label
                                htmlFor="externalApplyLink"
                                className="form-label"
                            >
                                External Apply Link (optional)
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="externalApplyLink"
                                value={externalApplyLink}
                                onChange={(e) =>
                                    setExternalApplyLink(e.target.value)
                                }
                            />
                        </div>
                        <div className="mb-3 form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="isOpen"
                                checked={isOpen}
                                onChange={(e) => setIsOpen(e.target.checked)}
                            />
                            <label
                                className="form-check-label"
                                htmlFor="isOpen"
                            >
                                Is Accepting Applications?
                            </label>
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
                            Create Job
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default CreateJob;
