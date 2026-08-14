import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized. Login Again.",
      });
    }

    const token = authHeader.split(" ")[1];

    const tokenDecoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.body = req.body || {};
    req.body.userId = tokenDecoded.id;

    next();
  } catch (error) {
    console.log("Auth Error:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default authUser;