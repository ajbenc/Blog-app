import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function protect(req, res, next) {

    if (req.method === 'OPTIONS') {
        return res.status(200).end(); // Handle preflight requests
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({ message: "Not authorized, token failed" });
    }
}