import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuoteRight } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { API_URL } from "../config";
import "../css/TestimonialSlider.css";

function TestimonialSlider() {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get(`${API_URL}/reviews/popular`);
                setReviews(response.data);
            } catch (error) {
                console.error("Error fetching popular reviews: ", error);
            }
        };

        fetchReviews();
    }, []);

    return (
        <section className="testimonial-slider bg-light">
            {reviews.length === 0 && (
                <div className="text-center py-5">
                    <h2>No reviews available</h2>
                </div>
            )}

            {/* render the slider */}
            {reviews.length > 0 && (
                <div
                    id="carouselExampleCaptions"
                    className="carousel slide"
                    data-bs-ride="carousel"
                >
                    <div className="carousel-indicators">
                        {reviews.map((review, index) => (
                            <button
                                key={index}
                                type="button"
                                data-bs-target="#carouselExampleCaptions"
                                data-bs-slide-to={index}
                                className={index === 0 ? "active" : ""}
                                aria-current="true"
                                aria-label={`Slide ${index + 1}`}
                            ></button>
                        ))}
                    </div>
                    <div className="carousel-inner py-5 text-center">
                        {reviews.map((review, index) => (
                            <div
                                key={index}
                                className={`carousel-item ${
                                    index === 0 ? "active" : ""
                                }`}
                            >
                                <FontAwesomeIcon
                                    icon={faQuoteRight}
                                    className="fs-1 text-danger"
                                />
                                <figure className="text-center col-md-6 offset-md-3 mt-4">
                                    <blockquote className="blockquote">
                                        <p>"{review.description}"</p>
                                    </blockquote>
                                    <figcaption className="blockquote-footer mt-2">
                                        {review.user?.name}
                                    </figcaption>
                                </figure>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}

export default TestimonialSlider;
