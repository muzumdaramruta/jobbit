import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import { Toast } from "react-bootstrap";
import error_401 from "../img/error_401.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarOutline } from "@fortawesome/free-regular-svg-icons";
import "../css/Job.css";
import { getUserIdFromToken, getUserFromToken } from "../utils/helper.js";
import { Link } from "react-router-dom";
import { UserType } from "../utils/constants.js";
import { faCheck, faTimes, faClock } from "@fortawesome/free-solid-svg-icons";
import ApplyJobModal from "./ApplyJobModal";
import { useNavigate } from "react-router-dom";

function Job() {
    const isLoggedIn = Cookies.get("jwt") !== undefined;
    const token = Cookies.get("jwt");
    const userId = getUserIdFromToken();
    const user = getUserFromToken();
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [savedJobs, setSavedJobs] = useState([]);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [applications, setApplications] = useState([]);
    const [userApplicationStatus, setUserApplicationStatus] = useState("");
    const [showApplyJobModal, setShowApplyJobModal] = useState(false);
    const [jobLoading, setJobLoading] = useState(true);

    const handleShowApplyJobModal = () => setShowApplyJobModal(true);
    const handleCloseApplyJobModal = () => setShowApplyJobModal(false);

    const navigate = useNavigate();

    // Fetch saved jobs once when the component mounts
    useEffect(() => {
        const fetchSavedJobs = async () => {
            setShowToast(false);
            try {
                if (!token || user.userType !== UserType.Employee) return;

                const headers = {
                    Authorization: `Bearer ${token}`,
                };
                const response = await axios.get(`${API_URL}/users/profile`, {
                    headers,
                    withCredentials: true,
                });
                const data = response.data;
                setSavedJobs(data.savedJobs);
            } catch (error) {
                console.error("Error fetching saved jobs: ", error);
                setToastMessage(
                    "An error occurred while fetching saved status."
                );
                setShowToast(true);
            }
        };

        fetchSavedJobs();
    }, [token]);

    useEffect(() => {
        const fetchJob = async () => {
            setShowToast(false);
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
            } catch (error) {
                console.error("Error fetching job: ", error);
                setToastMessage(
                    "An error occurred while fetching the job details."
                );
                setShowToast(true);
            } finally {
                setJobLoading(false);
            }
        };
        fetchJob();
    }, [id, token]);

    // fetch applications for the loggedin user for employer to see the status
    useEffect(() => {
        const fetchUserApplications = async () => {
            setShowToast(false);
            try {
                if (!token || user.userType !== UserType.Employee) return;

                const headers = {
                    Authorization: `Bearer ${token}`,
                };
                const response = await axios.get(`${API_URL}/users/profile`, {
                    headers,
                    withCredentials: true,
                });
                const data = response.data;
                const application = data.applications.find(
                    (application) => application.job._id === id
                );
                setUserApplicationStatus(application ? application.status : "");
            } catch (error) {
                console.error("Error fetching applications: ", error);
                setToastMessage("Application status could not be determined.");
                setShowToast(true);
            }
        };
        fetchUserApplications();
    }, [id, token]);

    // fetch all applications for the job
    useEffect(() => {
        const fetchJobApplications = async () => {
            setShowToast(false);
            try {
                if (!token || job?.postedBy !== userId) return;

                const headers = {
                    Authorization: `Bearer ${token}`,
                };
                const response = await axios.get(
                    `${API_URL}/jobs/${id}/applications`,
                    {
                        headers,
                        withCredentials: true,
                    }
                );
                const data = response.data;
                setApplications(data);
            } catch (error) {
                console.error("Error fetching user applications: ", error);
                setToastMessage("Application status could not be determined.");
                setShowToast(true);
            }
        };
        fetchJobApplications();
    }, [id, token, job, userId]);

    const handleViewResumeClick = async (applicationId) => {
        setShowToast(false);
        try {
            if (!token) return;

            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.get(
                `${API_URL}/applications/${applicationId}/resume`,
                {
                    headers,
                    withCredentials: true,
                    responseType: "blob",
                }
            );
            const blob = response.data;
            const url = URL.createObjectURL(blob);
            window.open(url);
        } catch (error) {
            console.error("Error fetching PDF:", error);
            setToastMessage(
                "An error occurred while trying to view the resume."
            );
            setShowToast(true);
        }
    };

    const handleStarClick = async (jobId) => {
        setShowToast(false);
        try {
            if (!token) return;

            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const response = await axios.post(
                `${API_URL}/jobs/toggle-save/${jobId}`,
                {},
                {
                    headers,
                    withCredentials: true,
                }
            );

            if (response.status !== 200) {
                console.error("Error toggling save for job: ", response);
                return;
            }

            // update savedJobs to remove or add jobId without using response data
            setSavedJobs((prevSavedJobs) => {
                if (prevSavedJobs.map((job) => job._id).includes(jobId)) {
                    setToastMessage("Job removed from saved list");
                    setShowToast(true);
                    return prevSavedJobs.filter((id) => id._id !== jobId);
                }
                setToastMessage("Job saved successfully");
                setShowToast(true);
                return [...prevSavedJobs, job];
            });
        } catch (error) {
            console.error("Error toggling save for job: ", error);
            setToastMessage("An error occurred while save-toggling the job.");
            setShowToast(true);
        }
    };

    const handleDeleteJob = async (jobId) => {
        try {
            if (!token) {
                // Handle case when user is not logged in
                return;
            }

            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const response = await axios.delete(`${API_URL}/jobs/${jobId}`, {
                headers,
                withCredentials: true,
            });

            if (response.status === 200) {
                console.log("Job deleted successfully");
            } else {
                console.error("Error deleting job:", response.data);
            }
        } catch (error) {
            console.error("Error deleting job:", error);
            // Set error message to display to the user
            setToastMessage("An error occurred while deleting the job.");
            setShowToast(true);
        }
    };

    const handleApplicationStatusChange = async (applicationId, newStatus) => {
        setShowToast(false);
        try {
            const token = Cookies.get("jwt");
            if (!token) return;

            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const response = await axios.patch(
                `${API_URL}/applications/${applicationId}`,
                { status: newStatus },
                {
                    headers,
                    withCredentials: true,
                }
            );
            setShowToast(true);
            setToastMessage("Application status updated successfully");
            if (response.status !== 200) {
                console.error("Error updating application status: ", response);
                setToastMessage(
                    "An error occurred while updating the status of application."
                );
                setShowToast(true);
                return;
            }

            // update applications to reflect the new status
            setApplications((prevApplications) => {
                return prevApplications.map((application) => {
                    if (application._id === applicationId) {
                        return { ...application, status: newStatus };
                    }
                    return application;
                });
            });
        } catch (error) {
            console.error("Error deleting job:", error);
            // Set error message to display to the user
            setToastMessage(
                "An error occurred while updating the status of application."
            );
            setShowToast(true);
        }
    };

    // submit application which is a resume file to the api
    const handleSubmitApplication = async (resumeFile) => {
        setShowToast(false);
        try {
            const formData = new FormData();
            formData.append("resume", resumeFile);

            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            };

            const response = await axios.post(
                `${API_URL}/jobs/apply/${id}`,
                formData,
                {
                    headers,
                    withCredentials: true,
                }
            );

            if (response.status === 200) {
                setUserApplicationStatus(response.data.status);
                setToastMessage("Application submitted successfully");
                setShowToast(true);
            } else {
                console.error("Error submitting application:", response.data);
                setToastMessage(
                    "An error occurred while submitting the application."
                );
                setShowToast(true);
            }
        } catch (error) {
            console.error("Error submitting application:", error);
            setToastMessage(
                "An error occurred while submitting the application."
            );
            setShowToast(true);
        } finally {
            handleCloseApplyJobModal();
            navigate("/jobs/" + id);
        }
    };

    return (
        <div className="container my-6 col-sm-8">
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
                        Please login to view company details
                    </p>
                </div>
            )}

            {jobLoading && isLoggedIn && (
                <div className="text-center mt-5">
                    <div className="spinner-border text-warning" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}

            {!jobLoading && isLoggedIn && !job && (
                <div className="text-center mt-5">
                    <img src={error_401} alt="placeholder" />
                    <br />
                    <br />
                    <p className="text-center" style={{ fontSize: "1.2rem" }}>
                        Job not found
                    </p>
                </div>
            )}

            {!jobLoading && isLoggedIn && job && (
                <div className="container">
                    <h1 className="text-center mb-3">Job Details</h1>
                    <div className="job-card">
                        <div className="float-end">
                            <ApplyJobModal
                                show={showApplyJobModal}
                                handleClose={handleCloseApplyJobModal}
                                handleSubmit={handleSubmitApplication}
                            />
                            {user.userType === UserType.Employee &&
                                // if user has already applied, show the status of the application
                                (userApplicationStatus ? (
                                    <span className="badge job-type">
                                        {userApplicationStatus}
                                    </span>
                                ) : (
                                    <button
                                        type="button"
                                        className="btn btn-outline-dark"
                                        onClick={handleShowApplyJobModal}
                                    >
                                        Apply
                                    </button>
                                    // <Link
                                    //     to={`/apply/${job._id}`}
                                    //     className="btn btn-outline-dark"
                                    // >
                                    //     Apply
                                    // </Link>
                                ))}
                            {job.postedBy === userId && (
                                <>
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={() => handleDeleteJob(job._id)}
                                    >
                                        Delete
                                    </button>
                                    <Link
                                        to={`/edit-job/${job._id}`}
                                        className="btn btn-secondary"
                                    >
                                        Edit
                                    </Link>
                                </>
                            )}
                            {user.userType === UserType.Employee && (
                                <FontAwesomeIcon
                                    className="star-icon"
                                    title="Save/Unsave job"
                                    icon={
                                        savedJobs.filter(
                                            (savedJob) =>
                                                savedJob._id === job._id
                                        ).length > 0
                                            ? faStarSolid
                                            : faStarOutline
                                    }
                                    onClick={() => handleStarClick(job._id)}
                                />
                            )}
                        </div>
                        <h2 className="job-title" title={job.title}>
                            {job.title}
                        </h2>
                        <div className="details">
                            <p>
                                <strong>Company Name:</strong>{" "}
                                {job.company.name}
                            </p>
                            <p>
                                <strong>Description:</strong> {job.description}
                            </p>
                            <p>
                                <strong>Salary:</strong> {job.salary} USD
                            </p>
                            <p>
                                <strong>Date Posted:</strong>{" "}
                                {new Date(job.datePosted).toLocaleDateString()}
                            </p>
                            <p>
                                <strong>Job Type:</strong> {job.jobType}
                            </p>
                            <p>
                                <strong>Open:</strong>{" "}
                                {job.isOpen ? "Yes" : "No"}
                            </p>
                        </div>
                        <div className="requirements">
                            <strong>Requirements:</strong>
                            <ul>
                                {job.requirements.map((requirement, index) => (
                                    <li key={index}>{requirement}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    {/* show all the applications if the user is the jobPoster */}
                    {job.postedBy === userId && (
                        <div className="job-card mt-4">
                            <h3>Applications</h3>
                            {applications.length === 0 && (
                                <p>No applications found</p>
                            )}
                            {applications.length > 0 && (
                                <table className="table table-hover align-middle">
                                    <thead>
                                        <tr>
                                            <th>User</th>
                                            <th>Resume</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {applications.map((application) => (
                                            <tr key={application._id}>
                                                <td>
                                                    <Link
                                                        to={`/users/${application.user._id}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                    >
                                                        {application.user.name}
                                                    </Link>
                                                </td>
                                                <td>
                                                    <a
                                                        href="#"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleViewResumeClick(
                                                                application._id
                                                            );
                                                        }}
                                                    >
                                                        View Resume
                                                    </a>
                                                </td>
                                                <td>
                                                    <div
                                                        className={`status ${application.status}`}
                                                    >
                                                        {application.status}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="status-icons">
                                                        <FontAwesomeIcon
                                                            icon={faCheck}
                                                            className={`icon success-icon ${
                                                                application.status ===
                                                                "Accepted"
                                                                    ? "active"
                                                                    : ""
                                                            }`}
                                                            onClick={() =>
                                                                handleApplicationStatusChange(
                                                                    application._id,
                                                                    "Accepted"
                                                                )
                                                            }
                                                        />
                                                        <FontAwesomeIcon
                                                            icon={faTimes}
                                                            className={`icon danger-icon ${
                                                                application.status ===
                                                                "Rejected"
                                                                    ? "active"
                                                                    : ""
                                                            }`}
                                                            onClick={() =>
                                                                handleApplicationStatusChange(
                                                                    application._id,
                                                                    "Rejected"
                                                                )
                                                            }
                                                        />
                                                        <FontAwesomeIcon
                                                            icon={faClock}
                                                            className={`icon warning-icon ${
                                                                application.status ===
                                                                "Pending"
                                                                    ? "active"
                                                                    : ""
                                                            }`}
                                                            onClick={() =>
                                                                handleApplicationStatusChange(
                                                                    application._id,
                                                                    "Pending"
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Job;
