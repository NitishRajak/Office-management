import express from "express";
import {
  authenticate,
  isAdmin,
  isEmployeeOrAdmin,
} from "../middleware/auth.middleware";
import {
  createLeave,
  deleteLeave,
  getAllLeaves,
  getEmployeeLeaves,
  updateLeaveStatus,
} from "../controllers/leave.controller";

const router = express.Router();

// Admin routes
router.get("/", authenticate, isAdmin, getAllLeaves);
router.put("/:id", authenticate, isAdmin, updateLeaveStatus);
router.delete("/:id", authenticate, isAdmin, deleteLeave);

// Employee routes
router.post("/", authenticate, isEmployeeOrAdmin, createLeave);
router.get("/employee/:id", authenticate, isEmployeeOrAdmin, getEmployeeLeaves);

export default router;
