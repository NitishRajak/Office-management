import express from "express";
import authRouter from "./auth.routes";
import employeeRouter from "./employee.routes";
import leaveRouter from "./leave.routes";
const router = express.Router();
export const rootRouter = () => {
  router.use("/v1/auth", authRouter);
  router.use("/v1/employees", employeeRouter);
  router.use("/v1/leave", leaveRouter);
  return router;
};
