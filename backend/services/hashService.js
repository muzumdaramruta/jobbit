import bcrypt from "bcryptjs";

const generateSalt = async () => {
    return await bcrypt.genSalt(10);
};

const generateHash = async (password) => {
    const salt = await generateSalt();
    return bcrypt.hash(password, salt);
};

const isPasswordValid = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword || "");
};

export { generateSalt, generateHash, isPasswordValid };
