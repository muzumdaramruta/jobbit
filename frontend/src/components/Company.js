import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { API_URL } from "../config";
import { Buffer } from "buffer";
import Cookies from "js-cookie";
import error_401 from "../img/error_401.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBriefcase,
    faStar,
    faCamera,
    faList,
    faMoneyBill,
    faEye,
    faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import Spinner from "react-bootstrap/Spinner";
import AddReviewModal from "./AddReviewModal";
import AddPhotosModal from "./AddPhotosModal";
import { Toast } from "react-bootstrap";
import "../css/Company.css";
import { Link } from "react-router-dom";
import { getUserFromToken } from "../utils/helper.js";
import { UserType } from "../utils/constants.js";

function Company() {
    const { id } = useParams();
    const user = getUserFromToken();
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("description"); // Default active tab
    const [showAddReviewModal, setShowAddReviewModal] = useState(false);
    const [showAddPhotosModal, setShowAddPhotosModal] = useState(false);
    const [jobs, setJobs] = useState([]);

    // Toast for photo upload
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const handleCloseToast = () => setShowToast(false);

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
            } finally {
                setLoading(false);
            }
        };
        fetchCompany();
    }, [id]);

    // retrieve jobs for give company id
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const token = Cookies.get("jwt");
                if (!token) return;

                const headers = {
                    Authorization: `Bearer ${token}`,
                };
                const response = await axios.get(
                    `${API_URL}/jobs/company/${id}`,
                    {
                        headers,
                        withCredentials: true,
                    }
                );
                setJobs(response.data);
            } catch (error) {
                console.error("Error fetching company details: ", error);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, [id]);

    const isLoggedIn = Cookies.get("jwt") !== undefined;

    const handleShowAddReviewModal = () => setShowAddReviewModal(true);
    const handleCloseAddReviewModal = () => setShowAddReviewModal(false);

    const handleShowAddPhotosModal = () => setShowAddPhotosModal(true);
    const handleCloseAddPhotosModal = () => setShowAddPhotosModal(false);

    const handleSubmitReview = async (reviewData) => {
        try {
            const token = Cookies.get("jwt");
            if (!token) return;

            const headers = {
                Authorization: `Bearer ${token}`,
            };

            reviewData.companyId = company._id;

            const updatedCompany = {
                ...company,
                reviews: [reviewData, ...company.reviews],
            };
            setCompany(updatedCompany);

            await axios.post(`${API_URL}/reviews`, reviewData, {
                headers,
                withCredentials: true,
            });

            setToastMessage("Review submitted successfully!");
            setShowToast(true);
        } catch (error) {
            console.error("Error submitting review: ", error);
            setToastMessage("Review submission failed. Please try again.");
            setShowToast(true);
        } finally {
            handleCloseAddReviewModal();
        }
    };

    const handleSubmitPhotos = async (photoData) => {
        try {
            const token = Cookies.get("jwt");
            if (!token) return;

            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const formData = new FormData();
            for (let i = 0; i < photoData.length; i++) {
                formData.append("photos", photoData[i]); // Append each file individually
            }
            await axios.post(
                `${API_URL}/company/${company._id}/photos`,
                formData,
                {
                    headers: {
                        ...headers,
                        "Content-Type": "multipart/form-data", // Specify content type as form-data
                    },
                    withCredentials: true,
                }
            );

            // Display success toast message
            setToastMessage("Photo upload successful! Please refresh to view.");
            setShowToast(true);
        } catch (error) {
            console.error("Error submitting photo: ", error);
            // Display error toast message
            setToastMessage("Error uploading photo. Please try again.");
            setShowToast(true);
        } finally {
            handleCloseAddPhotosModal();
        }
    };

    // Function to toggle visibility of reviews
    const toggleVisibility = async (index) => {
        setShowToast(false);
        try {
            const updatedCompany = { ...company };
            updatedCompany.reviews[index].isHidden =
                !updatedCompany.reviews[index].isHidden;
            setCompany(updatedCompany);
            const response = await axios.patch(
                `${API_URL}/reviews/${company.reviews[index]._id}`,
                {},
                {
                    withCredentials: true,
                }
            );
            setToastMessage(
                response.data.isHidden
                    ? "Review hidden successfully"
                    : "Review unhidden successfully"
            );
            setShowToast(true);
        } catch (error) {
            console.error("Error toggling visibility: ", error);

            if (error.response.data.error !== undefined)
                setToastMessage(error.response.data.error);
            else
                setToastMessage(
                    "Failed to toggle visibility. Please try again."
                );
            setShowToast(true);
        }
    };

    return (
        <div className="container my-6 col-sm-8">
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

            {isLoggedIn && (
                <div className="container">
                    <Toast
                        show={showToast}
                        onClose={handleCloseToast}
                        delay={5000} // Adjust the delay as needed
                        autohide
                        style={{
                            position: "fixed",
                            bottom: 20,
                            left: 20,
                        }}
                    >
                        <Toast.Body>{toastMessage}</Toast.Body>
                    </Toast>
                    <div className="row my-6">
                        <div className="col-md-2">
                            <div className="company-logo">
                                <img
                                    src={company ? company.logoUrl : ""}
                                    className="img-responsive"
                                    alt={company ? company.name : ""}
                                />
                            </div>
                        </div>
                        <div className="col-md-8 d-flex align-items-center">
                            <div>
                                <h1>{company ? company.name : "Loading..."}</h1>
                                <span className="company-rating badge bg-dark">
                                    <FontAwesomeIcon icon={faStar} />
                                    {company && company.rating ? (
                                        <span>
                                            &nbsp;
                                            {parseFloat(company.rating).toFixed(
                                                1
                                            )}
                                        </span>
                                    ) : (
                                        <span>&nbsp; -</span>
                                    )}
                                </span>
                            </div>
                        </div>
                        {/* Add a button to edit company details */}
                        {company && user.userType === UserType.Admin && (
                            <div className="col-md-2 float-end align-self-center">
                                <Link
                                    to={`/edit-company/${company._id}`}
                                    className="btn btn-outline-dark"
                                >
                                    Edit Company
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Nav tabs */}
                    <div className="container">
                        <ul
                            className="nav nav-tabs"
                            id="companyTabs"
                            role="tablist"
                        >
                            <li className="nav-item" role="presentation">
                                <button
                                    className={`nav-link ${
                                        activeTab === "description"
                                            ? "active"
                                            : ""
                                    }`}
                                    id="description-tab"
                                    data-bs-toggle="tab"
                                    data-bs-target="#description"
                                    type="button"
                                    role="tab"
                                    aria-controls="description"
                                    aria-selected={activeTab === "description"}
                                    onClick={() => setActiveTab("description")}
                                >
                                    <FontAwesomeIcon icon={faBriefcase} />
                                    &nbsp; Description
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button
                                    className={`nav-link ${
                                        activeTab === "reviews" ? "active" : ""
                                    }`}
                                    id="reviews-tab"
                                    data-bs-toggle="tab"
                                    data-bs-target="#reviews"
                                    type="button"
                                    role="tab"
                                    aria-controls="reviews"
                                    aria-selected={activeTab === "reviews"}
                                    onClick={() => setActiveTab("reviews")}
                                >
                                    <FontAwesomeIcon icon={faList} />
                                    &nbsp; Reviews
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button
                                    className={`nav-link ${
                                        activeTab === "photos" ? "active" : ""
                                    }`}
                                    id="photos-tab"
                                    data-bs-toggle="tab"
                                    data-bs-target="#photos"
                                    type="button"
                                    role="tab"
                                    aria-controls="photos"
                                    aria-selected={activeTab === "photos"}
                                    onClick={() => setActiveTab("photos")}
                                >
                                    <FontAwesomeIcon icon={faCamera} />
                                    &nbsp; Photos
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button
                                    className={`nav-link ${
                                        activeTab === "jobs" ? "active" : ""
                                    }`}
                                    id="jobs-tab"
                                    data-bs-toggle="tab"
                                    data-bs-target="#jobs"
                                    type="button"
                                    role="tab"
                                    aria-controls="jobs"
                                    aria-selected={activeTab === "jobs"}
                                    onClick={() => setActiveTab("jobs")}
                                >
                                    <FontAwesomeIcon icon={faMoneyBill} />
                                    &nbsp; Jobs
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Tab content */}
                    <div className="tab-content px-3" id="companyTabContent">
                        <div
                            className={`tab-pane fade ${
                                activeTab === "description" ? "show active" : ""
                            }`}
                            id="description"
                            role="tabpanel"
                            aria-labelledby="description-tab"
                        >
                            {loading && (
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
                            )}
                            {!loading && company && (
                                <div className="container">
                                    <p>
                                        <strong>Location:</strong>{" "}
                                        {company.location}
                                    </p>
                                    <p>
                                        <strong>Description:</strong>{" "}
                                        {company.description}
                                    </p>
                                    <p>
                                        <strong>Industry:</strong>{" "}
                                        {company.industry}
                                    </p>
                                    <p>
                                        <strong>Founded:</strong>{" "}
                                        {company.founded || "-"}
                                    </p>
                                    <p>
                                        <strong>Employee Count:</strong>{" "}
                                        {company.size || "-"}
                                    </p>
                                    <p>
                                        <strong>Website:</strong>{" "}
                                        {company.website || "-"}
                                    </p>
                                </div>
                            )}
                        </div>
                        <div
                            className={`tab-pane fade ${
                                activeTab === "reviews" ? "show active" : ""
                            }`}
                            id="reviews"
                            role="tabpanel"
                            aria-labelledby="reviews-tab"
                        >
                            {company &&
                                company.reviews &&
                                user.userType !== UserType.Admin &&
                                company.reviews.some(
                                    (review) => review.isHidden
                                ) && (
                                    <div className="alert alert-warning">
                                        Some reviews are hidden. Learn more
                                        about our{" "}
                                        <Link to="/PrivacyPolicy">
                                            review policy
                                        </Link>
                                        {/* TODO: Add a link to the privacy policy */}
                                    </div>
                                )}

                            <AddReviewModal
                                show={showAddReviewModal}
                                handleClose={handleCloseAddReviewModal}
                                handleSubmit={handleSubmitReview}
                            />
                            {user.userType !== UserType.Admin && (
                                <div className="col-md-2 float-end">
                                    <button
                                        className="btn btn-outline-dark"
                                        onClick={handleShowAddReviewModal}
                                    >
                                        Add a Review
                                    </button>
                                </div>
                            )}
                            {loading && (
                                <Spinner animation="border" role="status" />
                            )}
                            {!loading && company && (
                                <div className="container row">
                                    {company.reviews &&
                                        company.reviews.map(
                                            (review, index) =>
                                                // if user is admin, show all reviews but if user is not admin, show only visible reviews
                                                (user.userType ===
                                                    UserType.Admin ||
                                                    !review.isHidden) && (
                                                    <div
                                                        key={index}
                                                        className="review-container"
                                                        // text wrap if review is too long
                                                        style={{
                                                            wordWrap:
                                                                "break-word",
                                                        }}
                                                    >
                                                        <p className="review-rating">
                                                            {parseFloat(
                                                                review.rating
                                                            ).toFixed(1)}{" "}
                                                            <FontAwesomeIcon
                                                                icon={faStar}
                                                                color="orange"
                                                            />
                                                        </p>
                                                        {/* TODO: posted by user */}
                                                        {user.userType ===
                                                            UserType.Admin && (
                                                            <FontAwesomeIcon
                                                                className="float-end review-icon"
                                                                icon={
                                                                    review.isHidden
                                                                        ? faEyeSlash
                                                                        : faEye
                                                                }
                                                                color={
                                                                    review.isHidden
                                                                        ? "red"
                                                                        : "green"
                                                                }
                                                                onClick={() =>
                                                                    toggleVisibility(
                                                                        index
                                                                    )
                                                                }
                                                                title={
                                                                    review.isHidden
                                                                        ? "Click to unhide this comment"
                                                                        : "Click to hide this comment"
                                                                }
                                                            />
                                                        )}
                                                        <h5 className="review-title">
                                                            {review.title}
                                                        </h5>
                                                        <p className="review-description">
                                                            {review.description}
                                                        </p>
                                                    </div>
                                                )
                                        )}
                                    {company.reviews &&
                                        company.reviews.length === 0 && (
                                            <p>No reviews found</p>
                                        )}
                                </div>
                            )}
                        </div>
                        <div
                            className={`tab-pane fade ${
                                activeTab === "photos" ? "show active" : ""
                            }`}
                            id="photos"
                            role="tabpanel"
                            aria-labelledby="photos-tab"
                        >
                            <AddPhotosModal
                                show={showAddPhotosModal}
                                handleClose={handleCloseAddPhotosModal}
                                handleSubmit={handleSubmitPhotos}
                            />
                            {user.userType !== UserType.Admin && (
                                <div className="col-md-2 float-end">
                                    <button
                                        className="btn btn-outline-dark"
                                        onClick={handleShowAddPhotosModal}
                                    >
                                        Add Photos
                                    </button>
                                </div>
                            )}
                            {loading && (
                                <Spinner animation="border" role="status" />
                            )}
                            {!loading && company && (
                                <div className="container row">
                                    {company &&
                                        company.photos &&
                                        company.photos.map((photo, index) => (
                                            <div
                                                className="col-md-3 my-3"
                                                key={index}
                                            >
                                                <img
                                                    src={`data:${
                                                        photo.contentType
                                                    };base64,${Buffer.from(
                                                        photo.data
                                                    ).toString("base64")}`}
                                                    alt="company"
                                                    className="img-fluid"
                                                />
                                            </div>
                                        ))}
                                    {(!company ||
                                        !company.photos ||
                                        company.photos.length === 0) && (
                                        <p>No photos found</p>
                                    )}
                                </div>
                            )}
                        </div>
                        <div
                            className={`tab-pane fade ${
                                activeTab === "jobs" ? "show active" : ""
                            }`}
                            id="jobs"
                            role="tabpanel"
                            aria-labelledby="jobs-tab"
                        >
                            {company &&
                                user &&
                                user.userType === UserType.Employer && (
                                    <div className="col-md-2 float-end">
                                        <Link
                                            to={`/create-job/${company._id}`}
                                            className="btn btn-outline-dark"
                                        >
                                            Add Job
                                        </Link>
                                    </div>
                                )}

                            {loading && (
                                <Spinner animation="border" role="status" />
                            )}
                            {!loading && company && (
                                <div className="container">
                                    {jobs &&
                                        jobs.map((job, index) => (
                                            <Link
                                                to={`/jobs/${job._id}`}
                                                key={job._id}
                                                className="job-item"
                                                target="_blank"
                                            >
                                                <p>{job.title}</p>
                                            </Link>
                                        ))}
                                    {jobs && jobs.length === 0 && (
                                        <p>No jobs found</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Company;
