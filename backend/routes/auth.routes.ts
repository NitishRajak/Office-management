import express from "express";
import { authenticate } from "../middleware/auth.middleware";
import { getProfile, login, register } from "../controllers/auth.controller";
import { getEmployees } from "../controllers/employee.controller";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/profile", authenticate, getProfile);

export default router;
