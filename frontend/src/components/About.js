import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import error_401 from "../img/error_401.png";
import Cookies from "js-cookie";

function About() {
    const navigate = useNavigate();
    const [remainingTime, setRemainingTime] = useState(5);
    const jwtToken = Cookies.get("jwt");

    useEffect(() => {
        let timer;
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
    }, [jwtToken, navigate]);

    return (
        <div className="container my-1 col-lg-6">
            {!jwtToken && (
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

            {jwtToken && (
                <>
                    <h1
                        className="text-center mt-5"
                        style={{ fontWeight: "normal" }}
                    >
                        About Jobbit
                    </h1>
                    <p className="text-center" style={{ fontSize: "1.2rem" }}>
                        Welcome to Jobbit, the world's largest professional
                        network with more than 1 billion members in more than
                        200 countries and territories worldwide.
                    </p>
                    <br />
                    <h1 className="text-center mt-5">Vision</h1>
                    <p className="text-center">
                        Our mission is simple: connect the world's professionals
                        to make them more productive and successful. When you
                        join Jobbit, you get access to people, jobs, news,
                        updates, and insights that help you be great at what you
                        do.
                    </p>
                    <br />
                    <h1 className="text-center mt-5">Mission</h1>
                    <p className="text-center">
                        We are committed to making Jobbit a safe place for
                        professionals to connect and grow. We are constantly
                        improving our platform to ensure that our members can
                        connect with confidence.
                    </p>
                    <br />
                    <h1 className="text-center mt-5">Values</h1>
                    <p className="text-center">
                        We are proud to be a part of the Jobbit family and we
                        look forward to helping you achieve your professional
                        goals.
                    </p>
                    <br />
                    <h1 className="text-center mt-5">Who are we?</h1>
                    <p className="text-center">
                        Jobbit began in co-founder Reid Hoffman's living room in
                        2002 and was officially launched on May 5, 2003.
                    </p>
                    <p className="text-center">
                        Today, Jobbit leads a diversified business with revenues
                        from membership subscriptions, advertising sales and
                        recruitment solutions under the leadership of Ryan
                        Roslansky. In December 2016, Microsoft completed its
                        acquisition of Jobbit, bringing together the world’s
                        leading professional cloud and the world’s leading
                        professional network.
                    </p>
                    <br />
                </>
            )}
        </div>
    );
}

export default About;
