import jwt from "jsonwebtoken";

export const validateToken = (request, response, next) => {
  const token = request.get("Authorization");

  if (!token) {
    return response.status(400).json({
      error: "bad request",
      message: "No body provided",
    });
  }

  try {
    const tokenPayload = jwt.verify(token, process.env.JWT_SEED);
    request.user = tokenPayload;
    next();
  } catch (error) {
    return response.status(400).json({
      error: "Unauthorized",
      message: "Invalid token",
    });
  }
};
