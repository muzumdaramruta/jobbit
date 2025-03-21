import React, { useState, useEffect, useCallback } from "react";
import {
    validateEmail,
    validateName,
    validatePassword,
} from "../utils/validation";
import axios from "axios";
import { API_URL } from "../config";
import { Alert } from "react-bootstrap";
import { Toast } from "react-bootstrap";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [userType, setUserType] = useState("");
    const [company, setCompany] = useState("");
    const [nameValid, setNameValid] = useState(false);
    const [emailValid, setEmailValid] = useState(false);
    const [passwordValid, setPasswordValid] = useState(false);
    const [confirmPasswordValid, setConfirmPasswordValid] = useState(false);
    const [userTypeValid, setUserTypeValid] = useState(false);
    const [formValid, setFormValid] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [nameTouched, setNameTouched] = useState(false);
    const [emailTouched, setEmailTouched] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);
    const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
    const [userTypeTouched, setUserTypeTouched] = useState(false);
    const [companies, setCompanies] = useState([]);
    const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const handleCloseToast = () => setShowToast(false);

    useEffect(() => {
        const fetchCompanies = async () => {
            setShowToast(false);
            try {
                const response = await axios.get(`${API_URL}/company`);
                setCompanies(response.data);
            } catch (error) {
                console.error("Error fetching companies: ", error);
                setShowToast(true);
                setToastMessage("An error occurred. Please try again later.");
            }
        };
        fetchCompanies();
    }, []);

    const updateFormValidity = useCallback(() => {
        setFormValid(
            nameValid &&
                emailValid &&
                passwordValid &&
                confirmPasswordValid &&
                userTypeValid &&
                (!showCompanyDropdown || !!company)
        );
    }, [
        nameValid,
        emailValid,
        passwordValid,
        confirmPasswordValid,
        userTypeValid,
        showCompanyDropdown,
        company,
    ]);

    useEffect(() => {
        updateFormValidity();
    }, [updateFormValidity]);

    const handleNameChange = (event) => {
        const nameValue = event.target.value;
        setName(nameValue);
        setNameValid(validateName(nameValue)); // Validate name format
        setNameTouched(true);
        updateFormValidity();
    };

    const handleEmailChange = (event) => {
        const emailValue = event.target.value;
        setEmail(emailValue);
        setEmailValid(validateEmail(emailValue)); // Validate email format
        setEmailTouched(true);
        updateFormValidity();
    };

    const handlePasswordChange = (event) => {
        const passwordValue = event.target.value;
        setPassword(passwordValue);
        setPasswordValid(validatePassword(passwordValue)); // Validate password format
        setPasswordTouched(true);
        if (confirmPasswordTouched) {
            setConfirmPasswordValid(confirmPassword === passwordValue);
        }
        updateFormValidity();
    };

    const handleConfirmPasswordChange = (event) => {
        const confirmPasswordValue = event.target.value;
        setConfirmPassword(confirmPasswordValue);
        setConfirmPasswordTouched(true);
        setConfirmPasswordValid(confirmPasswordValue === password); // Check if confirm password matches password
        updateFormValidity();
    };

    const handleUserTypeChange = (event) => {
        const userTypeValue = event.target.value;
        setUserType(userTypeValue);
        setUserTypeValid(true); // Always set to true for radio buttons as one will always be selected
        setUserTypeTouched(true);
        setShowCompanyDropdown(userTypeValue === "Employer");
        updateFormValidity();
    };

    const handleCompanyChange = (event) => {
        const companyValue = event.target.value;
        setCompany(companyValue);
        updateFormValidity();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setShowAlert(false);

        try {
            const response = await axios.post(
                `${API_URL}/users/signup`,
                {
                    name,
                    email,
                    password,
                    userRole: userType,
                    companyId: userType === "Employer" ? company : undefined,
                },
                {
                    withCredentials: true,
                }
            );
            if (response.status === 201) {
                setToastMessage("Account created successfully. Please log in.");
                setShowToast(true);
                // refresh the page after 1 second but same URL
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        } catch (error) {
            console.error("Error logging in: ", error);
            if (error.response.status === 400) {
                setErrorMessage(error.response.data.error);
            } else {
                setErrorMessage("An error occurred. Please try again later.");
            }
            setPassword("");
            setConfirmPassword("");
            setShowAlert(true);
            setFormValid(false);
        }
    };

    return (
        <div
            className="tab-pane fade show active"
            id="register"
            role="tabpanel"
            aria-labelledby="register-tab"
        >
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
            <h3 className="text-center my-4">Create account</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="registerName" className="form-label">
                        Name
                    </label>
                    <input
                        type="text"
                        className={`form-control ${
                            nameValid || !nameTouched ? "" : "is-invalid"
                        }`}
                        id="registerName"
                        required
                        value={name}
                        onChange={handleNameChange}
                    />
                    {nameTouched && !nameValid && (
                        <div className="invalid-feedback">
                            Invalid name. Needs first and last name.
                        </div>
                    )}
                </div>
                <div className="mb-3">
                    <label htmlFor="registerEmail" className="form-label">
                        Email address
                    </label>
                    <input
                        type="email"
                        className={`form-control ${
                            emailValid || !emailTouched ? "" : "is-invalid"
                        }`}
                        id="registerEmail"
                        required
                        value={email}
                        onChange={handleEmailChange}
                    />
                    {emailTouched && !emailValid && (
                        <div className="invalid-feedback">
                            Please enter a valid northeastern email address.
                        </div>
                    )}
                </div>
                <div className="mb-3">
                    <label htmlFor="registerPassword" className="form-label">
                        Password
                    </label>
                    <input
                        type="password"
                        className={`form-control ${
                            passwordValid || !passwordTouched
                                ? ""
                                : "is-invalid"
                        }`}
                        id="registerPassword"
                        required
                        value={password}
                        onChange={handlePasswordChange}
                    />
                    {passwordTouched && !passwordValid && (
                        <div className="invalid-feedback">
                            Password must have at least 8 characters, one
                            uppercase letter, one lowercase letter, one number
                            and one special character.
                        </div>
                    )}
                </div>
                <div className="mb-3">
                    <label
                        htmlFor="registerConfirmPassword"
                        className="form-label"
                    >
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        className={`form-control ${
                            confirmPasswordValid || !confirmPasswordTouched
                                ? ""
                                : "is-invalid"
                        }`}
                        id="registerConfirmPassword"
                        required
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                    />
                    {confirmPasswordTouched && !confirmPasswordValid && (
                        <div className="invalid-feedback">
                            Passwords do not match.
                        </div>
                    )}
                </div>
                <div className="mb-3" id="userType">
                    <div className="mb-3 form-check form-check-inline">
                        <input
                            type="radio"
                            className="form-check-input"
                            id="jobSeeker"
                            name="userType"
                            required
                            value="Employee"
                            onChange={handleUserTypeChange}
                        />
                        <label className="form-check-label" htmlFor="jobSeeker">
                            Employee
                        </label>
                    </div>
                    <div className="mb-3 form-check form-check-inline">
                        <input
                            type="radio"
                            className="form-check-input"
                            id="employer"
                            name="userType"
                            required
                            value="Employer"
                            onChange={handleUserTypeChange}
                        />
                        <label className="form-check-label" htmlFor="employer">
                            Employer
                        </label>
                    </div>
                    {showCompanyDropdown && (
                        <select
                            className="form-select mb-3"
                            onChange={handleCompanyChange}
                            value={company}
                        >
                            <option value="">Select Company</option>
                            {companies.map((company) => (
                                <option key={company._id} value={company._id}>
                                    {company.name}
                                </option>
                            ))}
                        </select>
                    )}
                    {userTypeTouched && !userTypeValid && (
                        <div className="invalid-feedback">
                            Please select your user type.
                        </div>
                    )}
                </div>
                <Alert
                    show={showAlert}
                    variant="danger"
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
                    Register
                </button>
            </form>
        </div>
    );
}

export default Register;
