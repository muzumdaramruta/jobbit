import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBriefcase,
    faMapMarker,
    faMoneyBill,
    faCalendarDays,
    faUser,
    faList,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { API_URL } from "../config";
import error_401 from "../img/error_401.png";
import Cookies from "js-cookie";
import "../css/JobListings.css";
import { Link } from "react-router-dom";

function JobListing() {
    const [jobs, setJobs] = useState(null);
    const [loading, setLoading] = useState(true); // Initialize loading state
    const [searchTitleCompany, setSearchTitleCompany] = useState('');
    const [searchLocation, setSearchLocation] = useState('');
    const [locationSuggestions, setLocationSuggestions] = useState([]);

    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            try {
                const token = Cookies.get("jwt");
                if (!token) return;

                const headers = {
                    Authorization: `Bearer ${token}`,
                };
                const response = await axios.get(`${API_URL}/jobs`, {
                    headers,
                    withCredentials: true,
                });
                const data = response.data;
                setJobs(data);
            } catch (error) {
                console.error("Error fetching jobs: ", error);
                if (error.response && error.response.status === 401) {
                    // Handle unauthorized access, e.g., redirect to login page
                }
            } finally {
                setLoading(false); // Update loading state when fetch completes
            }
        };
        fetchJobs();
    }, []);

    const searchJobs = async () => {
        // Fetch jobs based on search keywords
        setLoading(true);
        try {
            const token = Cookies.get("jwt");
            if (!token) return;
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.get(`${API_URL}/jobs/`, {
                headers,
                params: {
                    query: searchTitleCompany,
                    location: searchLocation,
                },
                withCredentials: true,
            });
            const data = response.data;
            setJobs(data);
        } catch (error) {
            console.error("Error fetching jobs: ", error);
            if (error.response && error.response.status === 401) {
                // Handle unauthorized access, e.g., redirect to login page
            }
        } finally {
            setLoading(false); // Update loading state when fetch completes
        }
    };

    const handleLocationChange = async (value) => {
        setSearchLocation(value);
        try {
            if (value.length < 3) return;
            const response = await axios.get("https://api.opencagedata.com/geocode/v1/json", {
                params: {
                    q: value,
                    key: "4807ec3440f04bccb65143a463abee2c", // Replace with your OpenCage API key
                },
            });
            const filteredSuggestions = response.data.results
            .filter(result => {
                // Check if the country is United States or USA
                return result.components.country === "United States" || result.components.country === "USA";
            })
            .map(result => {
                // Extract city or town name from components
                return result.components.city || result.components.town;
            });
        setLocationSuggestions(filteredSuggestions);
        } catch (error) {
            console.error("Error fetching location suggestions: ", error);
            console.error("Error response data: ", error.response.data); // Log error response data
            console.error("Error status: ", error.response.status); // Log error status
            console.error("Error headers: ", error.response.headers); // Log error headers
        } 
    };
    
    return (
        <div className="container my-1">
            {loading && (
                <div className="text-center mt-5">
                    <div className="spinner-border text-warning" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}
            {!loading && jobs === null && (
                <div className="text-center mt-5">
                    <img src={error_401} alt="placeholder" />
                    <br />
                    <br />
                    <p className="text-center" style={{ fontSize: "1.2rem" }}>
                        Please login to view jobs
                    </p>
                </div>
            )}
            {!loading && jobs !== null && jobs.length === 0 && (
                <div className="text-center mt-5">
                    <h3>No jobs found based on the search criteria.</h3>
                </div>
            )}
            {!loading && jobs !== null && jobs.length > 0 && (
                <>
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
                                                        value={searchTitleCompany}
                                                        onChange={(e) => setSearchTitleCompany(e.target.value)}
                                                        className="form-control search-slt"
                                                        placeholder="Job title, company"
                                                        data-bs-toggle="dropdown"
                                                        autoComplete="off"
                                                    />
                                                    <ul className="dropdown-menu">
                                                        <li>
                                                            <a
                                                                className="dropdown-item"
                                                                href="#"
                                                            >
                                                                Remote
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a
                                                                className="dropdown-item"
                                                                href="#"
                                                            >
                                                                Software
                                                                Developer Intern
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a
                                                                className="dropdown-item"
                                                                href="#"
                                                            >
                                                                Database
                                                                Administrator
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>

                                            <div className="col-lg-5 col-md-5 col-sm-12 p-0">
                                            <div className="dropdown">
                                                <input 
                                                    id="search-form-input"
                                                    type="text"
                                                    value={searchLocation}
                                                    onChange={(e) => handleLocationChange(e.target.value)}
                                                    className="form-control search-slt"
                                                    placeholder="Location"
                                                />
                                                {locationSuggestions.length > 0 && (
                                                    <ul className="dropdown-menu">
                                                        {locationSuggestions.map((location, index) => (
                                                            <li key={index}>
                                                                <a
                                                                    className="dropdown-item"
                                                                    href="#"
                                                                    onClick={() => setSearchLocation(location)}
                                                                >
                                                                    {location}
                                                                </a>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
</div>

                                            <div className="col-lg-2 col-md-2 col-sm-12 p-0">
                                                <button
                                                    id="search"
                                                    type="button"
                                                    onClick={() => searchJobs()}
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
                    <div className="col-lg-12">
                        <h1 className="text-center">Popular Jobs</h1>
                    </div>
                    {jobs.map((job, index) => (
                        <div className="jobs col-lg-10 offset-lg-1" key={index}>
                            <div className="job rounded">
                                <div className="row">
                                    <div className="col-md-2 col-sm-2 text-center">
                                        <div className="company-logo">
                                            <img
                                                src={job.company.logoUrl}
                                                className="img-responsive"
                                                alt={job.companyName}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-10 col-sm-10">
                                        <div className="job-content">
                                            <h4
                                                className="job-listing-title"
                                                title={job.title}
                                            >
                                                <Link
                                                    to={`/jobs/${job._id}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    {job.title}
                                                </Link>
                                                <span className="badge job-type float-end">
                                                    {job.jobType}
                                                </span>
                                            </h4>
                                            <div className="row">
                                                <div className="col-md-4 col-sm-4">
                                                    <p>
                                                        <FontAwesomeIcon
                                                            icon={faBriefcase}
                                                        />
                                                        {job.company.name}
                                                    </p>
                                                </div>
                                                <div className="col-md-4 col-sm-4">
                                                    <p>
                                                        <FontAwesomeIcon
                                                            icon={faMapMarker}
                                                        />
                                                        {job.company.location}
                                                    </p>
                                                </div>
                                                <div className="col-md-4 col-sm-4">
                                                    <p>
                                                        <FontAwesomeIcon
                                                            icon={faMoneyBill}
                                                        />
                                                        {job.salary}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-md-4 col-sm-4">
                                                    <p>
                                                        <FontAwesomeIcon
                                                            icon={
                                                                faCalendarDays
                                                            }
                                                        />
                                                        {new Date(
                                                            job.createdAt
                                                        ).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="col-md-4 col-sm-4">
                                                    <p>
                                                        <FontAwesomeIcon
                                                            icon={faUser}
                                                        />
                                                        Applicants:{" "}
                                                        {
                                                            job.applications
                                                                .length
                                                        }
                                                    </p>
                                                </div>
                                                <div className="col-md-4 col-sm-4">
                                                    <p>
                                                        <FontAwesomeIcon
                                                            icon={faList}
                                                        />
                                                        {job.requirements.join(
                                                            ", "
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </>
            )}
        </div>
    );
}

export default JobListing;
