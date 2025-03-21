import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import error_401 from "../img/error_401.png";
import Cookies from "js-cookie";

function Contact() {
    const navigate = useNavigate();
    const [remainingTime, setRemainingTime] = useState(5);

    useEffect(() => {
        let timer;
        const jwtToken = Cookies.get("jwt");
        if (!jwtToken) {
            timer = setInterval(() => {
                setRemainingTime((prevTime) => {
                    if (prevTime === 1) {
                        // If time is up, redirect to login page
                        clearInterval(timer);
                        navigate("/auth");
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer); // Cleanup interval on component unmount
    }, [navigate]);

    return (
        <div className="container my-1 col-lg-6">
            {!Cookies.get("jwt") && (
                <div className="text-center mt-5">
                    <img src={error_401} alt="placeholder" />
                    <br />
                    <br />
                    <p className="text-center" style={{ fontSize: "1.2rem" }}>
                        You need to login to view this page. Redirecting to
                        login page in {remainingTime} seconds...
                    </p>
                </div>
            )}

            {Cookies.get("jwt") && (
                <>
                    <h1
                        className="text-center mt-5"
                        style={{ fontWeight: "normal" }}
                    >
                        Contact Us
                    </h1>
                    <p className="text-center" style={{ fontSize: "1.2rem" }}>
                        We are here to help you with any questions you may have.
                        Please feel free to reach out to us at anytime and we
                        will get back to you as soon as possible.
                    </p>
                    <br />
                    <h1 className="text-center mt-5">Email</h1>
                    <p className="text-center">
                        <a href="mailto:vakulabharanam.s@northeastern.edu">
                            muzumdar.a@northeastern.edu
                        </a>
                    </p>
                    <br />
                    <h1 className="text-center mt-5">Phone</h1>
                    <p className="text-center">
                        <a href="tel:+18573647774">857-364-7774</a>
                    </p>
                    <br />
                    <h1 className="text-center mt-5">Address</h1>
                    <p className="text-center">123 Main St.</p>
                    <p className="text-center">San Francisco, CA 94101</p>
                    <br />
                </>
            )}
        </div>
    );
}

export default Contact;
