import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

// Function to retrieve user ID from JWT token
const getUserIdFromToken = () => {
    const token = Cookies.get("jwt"); // Assuming you have access to the Cookies object
    if (token) {
        const decodedToken = jwtDecode(token);
        return decodedToken.userId;
    }
    return null; // Return null if token doesn't exist
};

const getUserFromToken = () => {
    const token = Cookies.get("jwt"); // Assuming you have access to the Cookies object
    if (token) {
        const decodedToken = jwtDecode(token);
        return decodedToken;
    }
    return null; // Return null if token doesn't exist
};

export { getUserIdFromToken, getUserFromToken };
