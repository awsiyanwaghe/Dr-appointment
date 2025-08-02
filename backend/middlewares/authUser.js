import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
    try {
        const { token } = req.headers;

        if (!token) {
            return res.status(401).json({ success: false, message: "Not Authorized. Login Again." });
        }

        const token_decod = jwt.verify(token, process.env.JWT_SECRET);

        // ✅ FIX: Initialize body if not present                   // chatgpt changes
        if (!req.body) req.body = {};

        req.body.userId = token_decod.id;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: error.message });
    }
};

export default authUser;
