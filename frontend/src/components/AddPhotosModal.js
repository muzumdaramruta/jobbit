import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

// TODO remove photo is not working
function AddPhotosModal({ show, handleClose, handleSubmit }) {
    const [photos, setPhotos] = useState([]);

    const handleFileChange = (e) => {
        const files = e.target.files;
        setPhotos([...photos, ...files]);
    };

    const handleRemovePhoto = (index) => {
        const updatedPhotos = [...photos];
        console.log("Before removing", updatedPhotos);
        updatedPhotos.splice(index, 1);
        console.log("After removing", updatedPhotos);
        setPhotos(updatedPhotos);
    };

    const handleUpload = () => {
        // Implement logic to upload photos (e.g., call handleSubmit)
        handleSubmit(photos);
        setPhotos([]);
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add Photos</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formFileMultiple" className="mb-3">
                        <Form.Label>Select multiple photos:</Form.Label>
                        <Form.Control
                            type="file"
                            multiple
                            onChange={handleFileChange}
                        />
                    </Form.Group>
                    <div>
                        {photos.map((photo, index) => (
                            <div className="container" key={index}>
                                <span>{photo.name}</span>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    className="btn btn-outline-dark float-end"
                                    onClick={() => handleRemovePhoto(index)}
                                >
                                    Remove
                                </Button>
                            </div>
                        ))}
                    </div>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="secondary"
                    className="btn btn-outline-dark"
                    onClick={handleClose}
                >
                    Close
                </Button>
                <Button
                    variant="primary"
                    className="btn btn-outline-dark"
                    onClick={handleUpload}
                >
                    Upload
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default AddPhotosModal;
