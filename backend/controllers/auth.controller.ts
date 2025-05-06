import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import Employee from "../models/employee.model";
import type { AuthRequest } from "../middleware/auth.middleware";

// Generate JWT token
const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "secret", {
    expiresIn: "30d",
  });
};

interface RegisterRequestBody {
  email: string;
  password: string;
  role: "admin" | "employee";
}

interface LoginRequestBody {
  email: string;
  password: string;
}

export const register = async (
  req: Request<{}, {}, RegisterRequestBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password, role } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const user = await User.create({
      email,
      password,
      role,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        email: user.email,
        role: user.role,
        token: generateToken(user._id.toString()),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request<{}, {}, LoginRequestBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      let employeeData = null;
      if (user.role === "employee" && user.employeeId) {
        employeeData = await Employee.findById(user.employeeId);
      }

      res.json({
        _id: user._id,
        email: user.email,
        role: user.role,
        employee: employeeData,
        token: generateToken(user._id.toString()),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // If user is an employee, get employee details
    let employeeData = null;
    if (user.role === "employee" && user.employeeId) {
      employeeData = await Employee.findById(user.employeeId);
    }

    res.json({
      _id: user._id,
      email: user.email,
      role: user.role,
      employee: employeeData,
    });
  } catch (error) {
    next(error);
  }
};
