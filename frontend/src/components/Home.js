import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFacebookF,
    faTwitter,
    faInstagram,
    faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";
import { Alert } from "react-bootstrap";
import { Accordion } from "react-bootstrap";
import interview from "../img/interview.jpeg";
import create_account from "../img/create_account.jpeg";
import top_companies from "../img/top_companies.jpeg";
import dream_job from "../img/dream_job.jpeg";
import { useNavigate } from "react-router-dom";
import error_401 from "../img/error_401.png";
import Cookies from "js-cookie";
import TestimonialSlider from "./TestimonialSlider";

function Home() {
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
        <div className="container my-1 text-center">
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
                    <div className="container">
                        <Alert variant="warning" dismissible>
                            <Alert.Heading>Attention</Alert.Heading>
                            <p>
                                Please note that due to the current market
                                conditions, job availability and hiring
                                processes may be affected. We advise candidates
                                to remain patient and persistent in their job
                                search. Make sure to thoroughly research
                                companies and job opportunities before applying.
                                Stay informed about any updates or changes in
                                the job market.
                            </p>
                        </Alert>
                    </div>
                    <div className="container my-5 px-md-4">
                        <div className="row">
                            <div className="col-lg-12">
                                <h1 className="text-center">
                                    Find Your Dream Job
                                </h1>
                                <div className="container  mb-5 px-md-4">
                                    <form
                                        id="search-form"
                                        action="#"
                                        method="post"
                                        noValidate="novalidate"
                                    >
                                        <div className="row">
                                            <div className="col-lg-5 col-md-5 col-sm-12 p-0">
                                                <div
                                                    id="searchDropdownDiv"
                                                    className="dropdown"
                                                >
                                                    <input
                                                        id="search-form-input"
                                                        type="text"
                                                        className="form-control search-slt"
                                                        placeholder="Job title, company"
                                                        data-bs-toggle="dropdown"
                                                    />
                                                    <ul className="dropdown-menu">
                                                        <li>
                                                            <button className="dropdown-item">
                                                                Remote
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button className="dropdown-item">
                                                                Software
                                                                Developer Intern
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button className="dropdown-item">
                                                                Database
                                                                Administrator
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="col-lg-5 col-md-5 col-sm-12 p-0">
                                                <input
                                                    type="text"
                                                    className="form-control search-slt"
                                                    placeholder="Location"
                                                />
                                            </div>
                                            <div className="col-lg-2 col-md-2 col-sm-12 p-0">
                                                <button
                                                    id="search"
                                                    type="button"
                                                    className="form-control btn btn-outline-dark"
                                                >
                                                    Search
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="container my-5 px-md-4">
                        <div className="row">
                            <div className="col-lg-12">
                                <h1 className="text-center">
                                    Welcome to Jobbit
                                </h1>
                                <p className="fs-5 my-4">
                                    At Jobbit, we strive to connect talented
                                    individuals with their dream jobs. Our
                                    platform offers a seamless experience for
                                    both job seekers and employers, ensuring
                                    efficient and effective recruitment
                                    processes.
                                </p>
                                <div className="d-flex justify-content-center website-description-img">
                                    <img
                                        src={interview}
                                        className="img-fluid mt-4 rounded"
                                        style={{
                                            maxWidth: "800px",
                                            height: "auto",
                                        }}
                                        alt="Jobbit Welcomes You!"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="about-us" className="container my-5 px-md-4">
                        <div className="row">
                            <div className="col-lg-12">
                                <h1 className="text-center">About Us</h1>
                                <p className="fs-5 my-4">
                                    Our mission is to empower individuals to
                                    find meaningful employment opportunities
                                    while assisting companies in discovering the
                                    best talent to drive their success. We
                                    believe in the transformative power of
                                    matching the right person with the right
                                    job, creating mutually beneficial
                                    partnerships that fuel growth and
                                    innovation.
                                </p>
                                <div
                                    className="accordion"
                                    id="accordionExample"
                                >
                                    <Accordion defaultActiveKey="0">
                                        <Accordion.Item eventKey="0">
                                            <Accordion.Header>
                                                What is Jobbit?
                                            </Accordion.Header>
                                            <Accordion.Body>
                                                Jobbit is a job search site that
                                                connects job seekers with
                                                employers. We offer a wide range
                                                of job listings across various
                                                industries, making it easy for
                                                you to find the perfect job. Our
                                                platform also allows you to save
                                                your favourite job listings and
                                                track your application progress,
                                                ensuring a seamless job search
                                                experience.
                                            </Accordion.Body>
                                        </Accordion.Item>
                                        <Accordion.Item eventKey="1">
                                            <Accordion.Header>
                                                How does Jobbit work?
                                            </Accordion.Header>
                                            <Accordion.Body>
                                                Jobbit works by allowing job
                                                seekers to search for job
                                                listings based on their
                                                preferences, such as job title,
                                                location, and industry. Once you
                                                find a job that interests you,
                                                you can apply directly through
                                                our platform. Employers can also
                                                post job listings and search for
                                                potential candidates to fill
                                                their open positions.
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="container my-5">
                        <div className="row">
                            <div className="col-md-4 my-5">
                                <div className="card">
                                    <img
                                        src={create_account}
                                        className="card-img-top"
                                        alt="Create Account"
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">
                                            Create an Account
                                        </h5>
                                        <p className="card-text">
                                            Sign up for a Jobbit account to
                                            access jobs, save your favourites,
                                            and track your application progress
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 my-5">
                                <div className="card">
                                    <img
                                        src={top_companies}
                                        className="card-img-top"
                                        alt="Top Companies"
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">
                                            Connect with Top Companies
                                        </h5>
                                        <p className="card-text">
                                            Discover opportunities to work with
                                            leading organizations and make your
                                            mark in the industry
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 my-5">
                                <div className="card">
                                    <img
                                        src={dream_job}
                                        className="card-img-top"
                                        alt="Dream Job"
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">
                                            Find Your Dream Job
                                        </h5>
                                        <p className="card-text">
                                            Browse through thousands of job
                                            listings and find the perfect fit
                                            for your skills and expertise
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="container text-center my-5">
                        <div className="row">
                            <div className="col-md-4">
                                <h3>Number of Jobs</h3>
                                <p
                                    className="display-4"
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="bottom"
                                    title="513"
                                >
                                    500+
                                </p>
                            </div>
                            <div className="col-md-4">
                                <h3>Number of Applicants</h3>
                                <p
                                    className="display-4"
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="bottom"
                                    title="1034"
                                >
                                    1000+
                                </p>
                            </div>
                            <div className="col-md-4">
                                <h3>Job Placement Rate</h3>
                                <p className="display-4">90%</p>
                            </div>
                        </div>
                    </div>
                    {/* Testimonial Slider */}
                    <div>
                        <TestimonialSlider />
                    </div>

                    <div className="container my-5">
                        <div className="row">
                            <div className="col-md-12">
                                <h1
                                    className="text-center"
                                    style={{ marginBottom: "20px" }}
                                >
                                    Follow Us
                                </h1>
                                <div className="d-flex justify-content-center">
                                    <button className="btn btn-outline-dark mx-2">
                                        <FontAwesomeIcon icon={faFacebookF} />
                                    </button>
                                    <button className="btn btn-outline-dark mx-2">
                                        <FontAwesomeIcon icon={faTwitter} />
                                    </button>
                                    <button className="btn btn-outline-dark mx-2">
                                        <FontAwesomeIcon icon={faInstagram} />
                                    </button>
                                    <button className="btn btn-outline-dark mx-2">
                                        <FontAwesomeIcon icon={faLinkedinIn} />
                                    </button>
                                    <button
                                        className="btn btn-outline-dark mx-2"
                                        type="button"
                                        data-bs-toggle="offcanvas"
                                        data-bs-target="#offcanvasRight"
                                        aria-controls="offcanvasRight"
                                    >
                                        Promotions
                                    </button>
                                    <div
                                        className="offcanvas offcanvas-end"
                                        tabIndex="-1"
                                        id="offcanvasRight"
                                        aria-labelledby="offcanvasRightLabel"
                                    >
                                        <div className="offcanvas-header">
                                            <h5 id="offcanvasRightLabel">
                                                Promotions
                                            </h5>
                                            <button
                                                type="button"
                                                className="btn-close text-reset"
                                                data-bs-dismiss="offcanvas"
                                                aria-label="Close"
                                            ></button>
                                        </div>
                                        <div className="offcanvas-body">
                                            <p>
                                                Get 20% off your first month of
                                                premium membership when you sign
                                                up today!
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Home;
