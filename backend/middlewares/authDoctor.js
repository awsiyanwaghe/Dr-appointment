import jwt from 'jsonwebtoken';

// doctor authentication middlewear
const authDoctor = async (req, res, next) => {
    try {
        const { dtoken } = req.headers;

        if (!dtoken) {
            return res.status(401).json({ success: false, message: "Not Authorized. Login Again." });
        }

        const token_decod = jwt.verify(dtoken, process.env.JWT_SECRET);

        // ✅ FIX: Initialize body if not present                   // chatgpt changes
        if (!req.body) req.body = {};

        req.body.docId = token_decod.id;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: error.message });
    }
};

export default authDoctor;
