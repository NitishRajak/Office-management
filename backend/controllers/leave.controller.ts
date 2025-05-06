import type { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";

import Leave, { ILeave } from "../models/leave.model";
import { AuthRequest } from "../middleware/auth.middleware";
import Employee, { IEmployee } from "../models/employee.model";

interface ILeaveBalance {
  annual: number;
  sick: number;
  personal: number;
  [key: string]: number;
}

export const getAllLeaves = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const leaves = await Leave.find({})
      .populate("employee", "name employeeId department")
      .populate("approvedBy", "email");

    res.json(leaves);
  } catch (error) {
    next(error);
  }
};

export const getEmployeeLeaves = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const employeeId = req.params.id;

    if (
      req.user?.role === "admin" ||
      (req.user?.role === "employee" &&
        req.user.employeeId &&
        req.user.employeeId.toString() === employeeId)
    ) {
      const leaves = await Leave.find({ employee: employeeId }).sort({
        createdAt: -1,
      });

      res.json(leaves);
    } else {
      res.status(403).json({ message: "Not authorized to access this data" });
    }
  } catch (error) {
    next(error);
  }
};

export const createLeave = async (
  req: AuthRequest &
    Request<
      {},
      {},
      {
        type: "Annual Leave" | "Sick Leave" | "Personal Leave";
        startDate: string;
        endDate: string;
        reason: string;
      }
    >,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { type, startDate, endDate, reason } = req.body;

    if (!req.user?.employeeId) {
      res.status(400).json({ message: "Employee ID not found" });
      return;
    }

    // Calculate number of days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    // Create leave request
    const leave = await Leave.create({
      employee: req.user.employeeId,
      type,
      startDate,
      endDate,
      days: diffDays,
      reason,
    });

    res.status(201).json(leave);
  } catch (error) {
    next(error);
  }
};

// @desc    Update leave request status
// @route   PUT /api/leaves/:id
// @access  Private/Admin
export const updateLeaveStatus = async (
  req: AuthRequest &
    Request<{ id: string }, {}, { status: "Approved" | "Rejected" }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status } = req.body;

    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      res.status(404).json({ message: "Leave request not found" });
      return;
    }

    // Update leave status
    leave.status = status;

    // If approved or rejected, add approver info
    if (status === "Approved" || status === "Rejected") {
      if (!req.user?._id) {
        res.status(401).json({ message: "User not authenticated" });
        return;
      }

      leave.approvedBy = req.user._id;
      leave.approvedAt = new Date();

      // If approved, update employee leave balance
      if (status === "Approved") {
        const employee = await Employee.findById(leave.employee);

        if (employee) {
          // Determine which leave balance to update
          let leaveType: "annual" | "sick" | "personal" | null = null;

          if (leave.type === "Annual Leave") {
            leaveType = "annual";
          } else if (leave.type === "Sick Leave") {
            leaveType = "sick";
          } else if (leave.type === "Personal Leave") {
            leaveType = "personal";
          }

          // Update leave balance
          if (leaveType && employee && employee.leaveBalance) {
            if (
              leaveType === "annual" &&
              employee.leaveBalance.annual >= leave.days
            ) {
              employee.leaveBalance.annual -= leave.days;
              await employee.save();
            } else if (
              leaveType === "sick" &&
              employee.leaveBalance.sick >= leave.days
            ) {
              employee.leaveBalance.sick -= leave.days;
              await employee.save();
            } else if (
              leaveType === "personal" &&
              employee.leaveBalance.personal >= leave.days
            ) {
              employee.leaveBalance.personal -= leave.days;
              await employee.save();
            } else {
              res.status(400).json({
                message: "Employee does not have enough leave balance",
              });
              return;
            }
          }
        }
      }
    }

    const updatedLeave = await leave.save();

    res.json(updatedLeave);
  } catch (error) {
    next(error);
  }
};

export const deleteLeave = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      res.status(404).json({ message: "Leave request not found" });
      return;
    }

    if (leave.status !== "Pending") {
      res.status(400).json({
        message: "Cannot delete approved or rejected leave requests",
      });
      return;
    }

    await Leave.deleteOne({ _id: leave._id });

    res.json({ message: "Leave request removed" });
  } catch (error) {
    next(error);
  }
};
