import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config";
import Cookies from "js-cookie";
import { Toast } from "react-bootstrap";
import error_401 from "../img/error_401.png";
import { getUserFromToken } from "../utils/helper.js";
import { UserType } from "../utils/constants.js";
import { Link } from "react-router-dom";

function Employees() {
    const jwtToken = Cookies.get("jwt");
    const isLoggedIn = jwtToken !== undefined;
    const user = getUserFromToken();
    const isAdmin = isLoggedIn ? user.userType === UserType.Admin : false;
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true); // State to track loading status

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                if (!jwtToken || !isAdmin) return;

                const headers = {
                    Authorization: `Bearer ${jwtToken}`,
                };
                const response = await axios.get(`${API_URL}/users/`, {
                    headers,
                    withCredentials: true,
                });
                setUsers(response.data);
                setLoading(false); // Set loading to false after fetching data
            } catch (error) {
                console.error("Error fetching all users: ", error);
                // Handle error
                setShowToast(true);
                if (error.response && error.response.status === 401)
                    setToastMessage("Unauthorized");
                else setToastMessage("Error fetching users");
            }
        };

        fetchAllUsers();
    }, [jwtToken, isAdmin]);

    const toggleFreezeUser = async (userId) => {
        setShowToast(false);
        try {
            const headers = {
                Authorization: `Bearer ${jwtToken}`,
            };
            const response = await axios.patch(
                `${API_URL}/users/toggle-freeze/${userId}`,
                {},
                { headers, withCredentials: true }
            );
            const updatedUsers = users.map((user) => {
                if (user._id === userId) {
                    return { ...user, isFrozen: !user.isFrozen };
                }
                return user;
            });
            setUsers(updatedUsers);
            setShowToast(true);
            setToastMessage(
                response.data.isFrozen
                    ? "User account is frozen"
                    : "User account is unfrozen"
            );
        } catch (error) {
            console.error("Error toggling freeze user: ", error);
            setShowToast(true);
            if (error.response.data.error !== undefined)
                setToastMessage(error.response.data.error);
            else setToastMessage("Error updating user status");
        }
    };

    return (
        <div className="container my-6 col-sm-8">
            {/* toast to show success or error messages */}
            <Toast
                show={showToast}
                onClose={() => setShowToast(false)}
                delay={5000}
                autohide
                style={{
                    position: "fixed",
                    bottom: 20,
                    left: 20,
                }}
            >
                <Toast.Body>{toastMessage}</Toast.Body>
            </Toast>

            {!isLoggedIn && (
                <div className="text-center mt-5">
                    <img src={error_401} alt="placeholder" />
                    <br />
                    <br />
                    <p>Please login to view this page</p>
                </div>
            )}

            {isLoggedIn && !isAdmin && (
                <div className="text-center mt-5">
                    <img src={error_401} alt="placeholder" />
                    <br />
                    <br />
                    <p>You do not have permission to view this page</p>
                </div>
            )}

            {isLoggedIn && isAdmin && (
                <div className="row">
                    <h3 className="my-3 text-center">All Users</h3>
                    {loading ? (
                        <div className="text-center mt-5">
                            <div
                                className="spinner-border text-warning"
                                role="status"
                            >
                                <span className="visually-hidden">
                                    Loading...
                                </span>
                            </div>
                        </div>
                    ) : (
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>User Type</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user._id}>
                                        <td>
                                            <Link
                                                to={`/users/${user._id}`}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                {user.name}
                                            </Link>
                                        </td>

                                        <td>{user.email}</td>
                                        <td>{user.userRole}</td>
                                        <td>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => {
                                                    toggleFreezeUser(user._id);
                                                }}
                                            >
                                                {user.isFrozen
                                                    ? "Unfreeze"
                                                    : "Freeze"}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
}

export default Employees;
