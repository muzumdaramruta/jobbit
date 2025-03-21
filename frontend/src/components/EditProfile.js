import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import error_401 from "../img/error_401.png";
import "../css/EditProfile.css";
import { validatePhone, validateName } from "../utils/validation";
import { Alert } from "react-bootstrap";
import { Spinner } from "react-bootstrap";

// TODO fix "submit" button being disabled after few sec. of loading

function EditProfile() {
    const isLoggedIn = Cookies.get("jwt") !== undefined;
    const token = Cookies.get("jwt");
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();

    const [nameValid, setNameValid] = useState(false);
    const [phoneValid, setPhoneValid] = useState(false);
    const [formValid, setFormValid] = useState(false);

    // error msg if form submission fails
    const [showAlert, setShowAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [loading, setLoading] = useState(true);
    const [saveChangesLoading, setSaveChangesLoading] = useState(false);

    useEffect(() => {
        const updateFormValidity = () => {
            setFormValid(nameValid && phoneValid);
        };
        updateFormValidity();
    }, [nameValid, phoneValid]);

    useEffect(() => {
        const fetchProfileDetails = async () => {
            try {
                if (!token) return;

                const headers = {
                    Authorization: `Bearer ${token}`,
                };
                const response = await axios.get(`${API_URL}/users/profile`, {
                    headers,
                    withCredentials: true,
                });
                const data = response.data;
                if (validateName(data.name)) {
                    setNameValid(true);
                }
                if (validatePhone(data.phone)) {
                    setPhoneValid(true);
                }
                setFormValid(nameValid && phoneValid);
                setFormData(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching profile details: ", error);
            }
        };

        fetchProfileDetails();
    }, [token]);

    const handleChange = (e) => {
        if (e.target.name === "name") {
            if (validateName(e.target.value)) {
                setNameValid(true);
            } else {
                setNameValid(false);
            }
        } else if (e.target.name === "phone") {
            if (validatePhone(e.target.value)) {
                setPhoneValid(true);
            } else {
                setPhoneValid(false);
            }
        }

        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaveChangesLoading(true);
        try {
            await axios.put(`${API_URL}/users/update`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });
            navigate("/profile");
        } catch (error) {
            console.error("Error updating profile:", error);
            setShowAlert(true);
            setErrorMessage("Error updating profile with message: " + error);
            setFormValid(false);
        } finally {
            setSaveChangesLoading(false);
        }
    };

    return (
        <div className="container">
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

            {!loading && isLoggedIn && (
                <div className="profile-container">
                    <h1>Edit Profile</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">
                                Name
                            </label>
                            <input
                                type="text"
                                className={`form-control ${
                                    nameValid || !formData.name
                                        ? ""
                                        : "is-invalid"
                                }`}
                                id="name"
                                name="name"
                                value={formData.name || ""}
                                onChange={handleChange}
                            />
                            {!nameValid && (
                                <div className="invalid-feedback">
                                    Please enter a valid name
                                </div>
                            )}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">
                                Email
                            </label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                value={formData.email || ""}
                                disabled
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="phone" className="form-label">
                                Phone
                            </label>
                            <input
                                type="text"
                                className={`form-control ${
                                    phoneValid || !formData.phone
                                        ? ""
                                        : "is-invalid"
                                }`}
                                id="phone"
                                name="phone"
                                value={formData.phone || ""}
                                onChange={handleChange}
                            />
                            {!phoneValid && (
                                <div className="invalid-feedback">
                                    Please enter a valid phone number
                                </div>
                            )}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="address" className="form-label">
                                Address
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="address"
                                name="address"
                                value={formData.address || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="bio" className="form-label">
                                Biography
                            </label>
                            <textarea
                                className="form-control"
                                id="bio"
                                name="bio"
                                value={formData.bio || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="userType" className="form-label">
                                User Type
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="userType"
                                name="userType"
                                value={formData.userType || ""}
                                disabled
                            />
                        </div>
                        {/* Add more form fields as needed */}
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
                            disabled={!formValid || saveChangesLoading}
                        >
                            {saveChangesLoading ? (
                                <Spinner animation="border" size="sm" />
                            ) : (
                                "Save Changes"
                            )}
                        </button>
                        <Link
                            to="/profile"
                            className="btn btn-secondary ms-2"
                            disabled={saveChangesLoading}
                        >
                            Cancel
                        </Link>
                    </form>
                </div>
            )}
        </div>
    );
}

export default EditProfile;
