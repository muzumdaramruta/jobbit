import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import { API_URL } from "../config";
import error_401 from "../img/error_401.png";

function EditJob({ jobId }) {
    const isLoggedIn = Cookies.get("jwt") !== undefined;
    const token = Cookies.get("jwt");
    const navigate = useNavigate();
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                if (!token) return;

                const headers = {
                    Authorization: `Bearer ${token}`,
                };
                const response = await axios.get(`${API_URL}/jobs/${id}`, {
                    headers,
                    withCredentials: true,
                });
                const data = response.data;
                setJob(data);
                setIsOpen(data.isOpen);
            } catch (error) {
                console.error("Error fetching job: ", error);
                if (error.response && error.response.status === 401) {
                    // Handle unauthorized access, e.g., redirect to login page
                }
            }
        };
        fetchJob();
    }, [id, token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedJob = {
            title: e.target.title.value,
            description: e.target.description.value,
            salary: e.target.salary.value,
            jobType: e.target.jobType.value,
            requirements: e.target.requirements.value,
            isOpen: isOpen,
            // Add more fields as needed
        };

        try {
            // Send updated job details to the server
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            await axios.put(`${API_URL}/jobs/${id}`, updatedJob, {
                headers,
                withCredentials: true,
            });
            // Redirect to the job details page
            navigate(`/jobs/${id}`);
        } catch (error) {
            console.error("Error updating job:", error);
        }
    };

    const handleStatusChange = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="container my-6 col-sm-8">
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

            {isLoggedIn && job && (
                <div className="container">
                    <h1>Edit Job</h1>
                    {/* Render form with pre-filled job details */}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="title" className="form-label">
                                Title:
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="title"
                                defaultValue={job.title}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="description" className="form-label">
                                Description:
                            </label>
                            <textarea
                                className="form-control"
                                id="description"
                                defaultValue={job.description}
                            />
                        </div>
                        {/* Additional fields for job details */}
                        <div className="mb-3">
                            <label htmlFor="salary" className="form-label">
                                Salary:
                            </label>
                            <input
                                type="number"
                                className="form-control"
                                id="salary"
                                defaultValue={job.salary}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="jobType" className="form-label">
                                Job Type:
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="jobType"
                                defaultValue={job.jobType}
                            />
                        </div>
                        {/* requirements */}
                        <div className="mb-3">
                            <label
                                htmlFor="requirements"
                                className="form-label"
                            >
                                Requirements:
                            </label>
                            <textarea
                                className="form-control"
                                id="requirements"
                                defaultValue={job.requirements}
                            />
                        </div>
                        {/* Dropdown for open/close job */}
                        <div className="mb-3">
                            <label htmlFor="status" className="form-label">
                                Job Status:
                            </label>
                            <select
                                className="form-select"
                                id="status"
                                value={isOpen ? "open" : "close"} // Bind value to isOpen state
                                onChange={(e) =>
                                    setIsOpen(e.target.value === "open")
                                } // Update isOpen state based on selected value
                            >
                                <option value="open">Open</option>
                                <option value="close">Close</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-outline-dark">
                            Save Changes
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => navigate(`/jobs/${id}`)}
                        >
                            Cancel
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default EditJob;
