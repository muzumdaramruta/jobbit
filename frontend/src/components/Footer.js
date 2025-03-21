import React from "react";

function Footer() {
    return (
        <footer
            className="footer mt-auto pb-3"
            style={{ backgroundColor: "#ffd60a" }}
        >
            <div className="container">
                <div className="row">
                    <div className="col-md-4">
                        <h5>Quick Links</h5>
                        <ul className="list-group list-unstyled">
                            <li>
                                <a href="/">Home</a>
                            </li>
                            <li>
                                <a href="#">About Us</a>
                            </li>
                            <li>
                                <a href="#">Search Jobs</a>
                            </li>
                            <li>
                                <a href="#">Companies</a>
                            </li>
                        </ul>
                    </div>
                    <div className="col-md-4">
                        <h5>Address</h5>
                        <ul className="list-group list-unstyled">
                            <li>123 Jobbit St, Boston, MA</li>
                            <li>456 Main St, Anytown, MA</li>
                            <li>789 Roadsville St, Thatcity, TX</li>
                        </ul>
                    </div>
                    <div className="col-md-4">
                        <h5>Contact Information</h5>
                        <ul className="list-group list-unstyled">
                            <li>
                                Email:{" "}
                                <a href="mailto:info@jobbit.com">
                                    info@jobbit.com
                                </a>
                            </li>
                            <li>
                                Phone: <a href="tel:+1234567890">+1234567890</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
