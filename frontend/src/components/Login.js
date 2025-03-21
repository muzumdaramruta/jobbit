import React, { useState, useEffect, useCallback } from "react";
import { validateEmail, validatePassword } from "../utils/validation";
import axios from "axios";
import { API_URL } from "../config";
import { Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailValid, setEmailValid] = useState(false);
    const [passwordValid, setPasswordValid] = useState(false);
    const [formValid, setFormValid] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [emailTouched, setEmailTouched] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);
    const [loading, setLoading] = useState(false);

    const updateFormValidity = useCallback(() => {
        setFormValid(emailValid && passwordValid);
    }, [emailValid, passwordValid]);

    useEffect(() => {
        updateFormValidity();
    }, [updateFormValidity]);

    const handleEmailChange = (event) => {
        const emailValue = event.target.value;
        setEmail(emailValue);
        setEmailValid(validateEmail(emailValue));
        setEmailTouched(true);
    };

    const handlePasswordChange = (event) => {
        const passwordValue = event.target.value;
        setPassword(passwordValue);
        setPasswordValid(validatePassword(passwordValue));
        setPasswordTouched(true);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true); // Set loading to true when login button is clicked

        try {
            const response = await axios.post(
                `${API_URL}/users/login`,
                {
                    email,
                    password,
                },
                {
                    withCredentials: true,
                }
            );
            if (response.status === 200) {
                navigate("/");
            }
        } catch (error) {
            console.error("Error logging in: ", error);
            //  response body is an object with an error property
            if (error.response.data.error !== undefined) {
                setErrorMessage(error.response.data.error);
            } else if (error.response.status === 400) {
                setErrorMessage("Invalid email or password.");
            } else {
                setErrorMessage("An error occurred. Please try again later.");
            }
            setPassword("");
            setShowAlert(true);
            setFormValid(false);
        } finally {
            setLoading(false); // Set loading back to false after login attempt completes
        }
    };

    return (
        <div
            className="tab-pane fade show active"
            id="register"
            role="tabpanel"
            aria-labelledby="register-tab"
        >
            <h3 className="text-center my-4">Sign in to your account</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="loginEmail" className="form-label">
                        Email address
                    </label>
                    <input
                        type="email"
                        className={`form-control ${
                            emailValid || !emailTouched ? "" : "is-invalid"
                        }`}
                        id="loginEmail"
                        value={email}
                        onChange={handleEmailChange}
                    />
                    {emailTouched && !emailValid && (
                        <div className="invalid-feedback">
                            Please enter a valid email address.
                        </div>
                    )}
                </div>
                <div className="mb-3">
                    <label htmlFor="loginPassword" className="form-label">
                        Password
                    </label>
                    <input
                        type="password"
                        className={`form-control ${
                            passwordValid || !passwordTouched
                                ? ""
                                : "is-invalid"
                        }`}
                        id="loginPassword"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                    {passwordTouched && !passwordValid && (
                        <div className="invalid-feedback">
                            Password must be at least 8 characters long.
                        </div>
                    )}
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
                    disabled={!formValid || loading} // Disable button when form is invalid or loading
                >
                    {loading ? (
                        <Spinner animation="border" size="sm" />
                    ) : (
                        "Login"
                    )}
                </button>
            </form>
        </div>
    );
}

export default Login;
