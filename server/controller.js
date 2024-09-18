const sqlConnection = require("./connect.js");
const jwt = require('jsonwebtoken');

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }
        const sqlQuery = `SELECT userName, email, role FROM user WHERE email = ? AND password = ?`;
        await sqlConnection.query(sqlQuery, [email, password], (err, data) => {
            if (err) {
                return res.status(500).json({ error: "Error during login" });
            } else if (data.length === 0) {
                return res.status(401).json({ error: "Invalid email or password" });
            } else {
                const payload = {
                    userName:data[0].userName,
                    email:data[0].email,
                    role:data[0].role
                }
                const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
                const option = {
                    expires: new Date(Date.now() + 1 * 60 * 60 * 1000),
                    secure: true,
                    httpOnly: true,
                    sameSite: "none",
                    path: "/",
                };
                res.cookie('rolebaseToken', token, option)
                res.status(200).json({ Status: "Success"})
            }
        });
    } catch (error) {
        console.log("Error during login:", error);
        return res.status(500).json({ error: "Error during login" });
    }
};

const tokenVerificationMiddleware = async (req, res, next) => {
    const token = req.cookies.rolebaseToken;
    if (!token) {
        return res.status(401).json({ error: "You are not authenticated" });
    } else {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            req.user = {
                userName: decoded.userName,
                email: decoded.email,
                role: decoded.role,
            };
            next();
        } catch (error) {
            return res.status(401).json({ error: "Invalid token" });
        }
    }
};

const getLoginData = (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: "You are not authenticated" });
    }
    return res.json(req.user);
};
module.exports = { userLogin, tokenVerificationMiddleware, getLoginData };