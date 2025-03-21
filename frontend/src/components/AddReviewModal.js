import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "../css/Review.css";

function AddReviewModal({ show, handleClose, handleSubmit }) {
    const [reviewData, setReviewData] = useState({
        title: "",
        description: "",
        rating: 0,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setReviewData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        handleSubmit(reviewData);
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add a Review</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleFormSubmit}>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">
                            Title
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="title"
                            name="title"
                            value={reviewData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">
                            Description
                        </label>
                        <textarea
                            className="form-control"
                            id="description"
                            name="description"
                            value={reviewData.description}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="rating" className="form-label">
                            Rating
                        </label>
                        <input
                            type="number"
                            className="form-control"
                            id="rating"
                            name="rating"
                            value={reviewData.rating}
                            onChange={handleChange}
                            min="1"
                            max="5"
                            required
                        />
                    </div>
                    <Button
                        variant="primary"
                        type="submit"
                        className="btn btn-outline-dark"
                    >
                        Submit
                    </Button>
                </form>
            </Modal.Body>
        </Modal>
    );
}

export default AddReviewModal;
