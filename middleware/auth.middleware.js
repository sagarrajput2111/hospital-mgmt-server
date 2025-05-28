const privateKey = "Mykey@5432";
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]; // or req.get("Authorization")
  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res
      .status(401)
      .json({ message: "Authorization header missing or malformed" });

  const token = authHeader.split(" ")[1]; // Remove "Bearer "
  let decoded;
  try {
    decoded = jwt.verify(token, privateKey);
    // console.log(decoded);
    req.userData = decoded;
    next();
  } catch (err) {
    // Token invalid or expired
    console.error("the error object is", err.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

export const verifyRefreshToken = (req, res, next) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token missing" });
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, privateKey);
    if (decoded.type !== "refresh") {
      return res.status(403).json({ message: "Invalid token type" });
    }
    req.userData = decoded;
    next();
  } catch (err) {
    console.error("the error object is", err.message);
    return res
      .status(403)
      .json({ message: "Invalid or expired refresh token" });
  }
};
