import express from "express";
import {
  authenticate,
  isAdmin,
  isEmployeeOrAdmin,
} from "../middleware/auth.middleware";
import {
  createEmployee,
  deleteEmployee,
  getEmployeeById,
  getEmployees,
  updateEmployee,
} from "../controllers/employee.controller";

//   getEmployees,
//   getEmployeeById,
//   createEmployee,
//   updateEmployee,
//   deleteEmployee,
// } from "../controllers/employee.controller.js";
// import {
//   authenticate,
//   isAdmin,
//   isEmployeeOrAdmin,
// } from "../middleware/auth.middleware.js";

const router = express.Router();

// Admin only routes
router
  .route("/")
  .get(authenticate, isAdmin, getEmployees)
  .post(authenticate, isAdmin, createEmployee);

// Admin or self routes
router
  .route("/:id")
  .get(authenticate, isEmployeeOrAdmin, getEmployeeById)
  .put(authenticate, isAdmin, updateEmployee)
  .delete(authenticate, isAdmin, deleteEmployee);

export default router;
