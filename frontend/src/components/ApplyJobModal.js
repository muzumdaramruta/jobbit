import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "../css/Review.css";

function ApplyJobModal({ show, handleClose, handleSubmit }) {
    // State to store the form data which is only a resume in this case
    const [resume, setResume] = useState(null);

    const handleChange = (e) => {
        setResume(e.target.files[0]);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        handleSubmit(resume);
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Apply to job</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleFormSubmit}>
                    <div className="mb-3">
                        <label htmlFor="resume" className="form-label">
                            Resume
                        </label>
                        <input
                            type="file"
                            className="form-control"
                            id="resume"
                            name="resume"
                            onChange={handleChange}
                            required
                            accept=".pdf, .doc, .docx, .xls, .xlsx"
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

export default ApplyJobModal;
