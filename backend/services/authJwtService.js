import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, email, userType, res) => {
    const token = jwt.sign(
        {
            userId,
            email,
            userType,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPERIES_IN_STR,
        }
    );
    const cookieOptions = {
        maxAge: process.env.JWT_EXPIRES_IN,
        sameSite: "lax",
        domain: process.env.FRONTEND_DOMAIN || "localhost",
    };
    if (process.env.NODE_ENV === "prod") {
        cookieOptions.secure = true;
        cookieOptions.httpOnly = true;
    }

    res.cookie("jwt", token, cookieOptions);

    return token;
};


export default generateTokenAndSetCookie;
