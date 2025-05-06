import type { Request, Response, NextFunction } from "express";
import type mongoose from "mongoose";

interface ErrorWithStatusCode extends Error {
  statusCode?: number;
  code?: number;
}

// Error handling middleware
export const errorHandler = (
  err: ErrorWithStatusCode,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(err.stack);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(
      (err as mongoose.Error.ValidationError).errors
    ).map((val) => val.message);
    res.status(400).json({ message: messages.join(", ") });
    return;
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    res.status(400).json({ message: "Duplicate field value entered" });
    return;
  }

  // JWT error
  if (err.name === "JsonWebTokenError") {
    res.status(401).json({ message: "Invalid token" });
    return;
  }

  // JWT expired error
  if (err.name === "TokenExpiredError") {
    res.status(401).json({ message: "Token expired" });
    return;
  }

  // Default server error
  res.status(err.statusCode || 500).json({
    message: err.message || "Server Error",
  });
};
