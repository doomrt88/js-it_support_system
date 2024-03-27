import jwt from "jsonwebtoken";

export const validateToken = (request, response, next) => {
  const token = request.get("Authorization");
  if (!token) {
    return response.status(403).json({
      error: "Forbidden",
      message: "Forbidden request",
    });
  }

  try {
    const tokenPayload = jwt.verify(token, process.env.JWT_SEED);
    request.user = tokenPayload;
    next();
  } catch (error) {
    return response.status(403).json({
      error: "Unauthorized",
      message: "Invalid token",
    });
  }
};