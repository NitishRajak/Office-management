import type { Request, Response, NextFunction } from "express";
import Employee, { IEmployee } from "../models/employee.model";
import { AuthRequest } from "../middleware/auth.middleware";
import User from "../models/user.model";

interface CreateEmployeeRequest {
  name: string;
  email: string;
  phone: string;
  address: string;
  department: string;
  position: string;
  joinDate: string;
  salary: string;
  manager?: string;
  emergencyContact: {
    name: string;
    phone: string;
  };
  skills?: string[];
  projects?: string[];
  password?: string;
}

interface UpdateEmployeeRequest {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  department?: string;
  position?: string;
  salary?: string;
  manager?: string;
  status?: string;
  emergencyContact?: {
    name: string;
    phone: string;
  };
  skills?: string[];
  projects?: string[];
  performance?: string;
  leaveBalance?: {
    annual?: number;
    sick?: number;
    personal?: number;
  };
}

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private/Admin
export const getEmployees = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const employees = await Employee.find({});
    res.json(employees);
  } catch (error) {
    next(error);
  }
};

// @desc    Get employee by ID
// @route   GET /api/employees/:id
// @access  Private/Admin or Self
export const getEmployeeById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      res.status(404).json({ message: "Employee not found" });
      return;
    }

    // Check if user is admin or the employee themselves
    if (
      req.user?.role === "admin" ||
      (req.user?.role === "employee" &&
        req.user.employeeId &&
        req.user.employeeId.toString() === employee._id.toString())
    ) {
      res.json(employee);
    } else {
      res
        .status(403)
        .json({ message: "Not authorized to access this employee data" });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new employee
// @route   POST /api/employees
// @access  Private/Admin
export const createEmployee = async (
  req: Request<{}, {}, CreateEmployeeRequest>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      name,
      email,
      phone,
      address,
      department,
      position,
      joinDate,
      salary,
      manager,
      emergencyContact,
      skills,
      projects,
      password,
    } = req.body;

    // Check if email already exists
    const emailExists = await Employee.findOne({ email });

    if (emailExists) {
      res
        .status(400)
        .json({ message: "Employee with this email already exists" });
      return;
    }

    // Generate employee ID
    const employeeCount = await Employee.countDocuments();
    const employeeId = `EMP${String(employeeCount + 1).padStart(3, "0")}`;

    // Create employee
    const employee = await Employee.create({
      employeeId,
      name,
      email,
      phone,
      address,
      department,
      position,
      joinDate: new Date(joinDate),
      salary,
      manager,
      emergencyContact: {
        name: emergencyContact.name,
        phone: emergencyContact.phone,
      },
      skills: skills || [],
      projects: projects || [],
    });

    // Create user account for the employee
    if (password) {
      await User.create({
        email,
        password,
        role: "employee",
        employeeId: employee._id,
      });
    }

    res.status(201).json(employee);
  } catch (error) {
    next(error);
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private/Admin
export const updateEmployee = async (
  req: Request<{ id: string }, {}, UpdateEmployeeRequest>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      res.status(404).json({ message: "Employee not found" });
      return;
    }

    // Update employee fields
    if (req.body.name) employee.name = req.body.name;
    if (req.body.phone) employee.phone = req.body.phone;
    if (req.body.address) employee.address = req.body.address;
    if (req.body.department) employee.department = req.body.department;
    if (req.body.position) employee.position = req.body.position;
    if (req.body.salary) employee.salary = req.body.salary;
    if (req.body.manager) employee.manager = req.body.manager;
    if (req.body.status)
      employee.status = req.body.status as IEmployee["status"];

    if (req.body.emergencyContact) {
      if (req.body.emergencyContact.name)
        employee.emergencyContact.name = req.body.emergencyContact.name;
      if (req.body.emergencyContact.phone)
        employee.emergencyContact.phone = req.body.emergencyContact.phone;
    }

    if (req.body.skills) {
      employee.skills = req.body.skills;
    }

    if (req.body.projects) {
      employee.projects = req.body.projects;
    }

    if (req.body.performance) {
      employee.performance = req.body.performance as IEmployee["performance"];
    }

    if (req.body.leaveBalance) {
      employee.leaveBalance = {
        ...employee.leaveBalance,
        ...req.body.leaveBalance,
      };
    }

    const updatedEmployee = await employee.save();

    // If email is being updated, update the user account as well
    if (req.body.email && req.body.email !== employee.email) {
      const user = await User.findOne({ employeeId: employee._id });
      if (user) {
        user.email = req.body.email;
        await user.save();
      }

      // Update employee email after user is updated to maintain consistency
      employee.email = req.body.email;
      await employee.save();
    }

    res.json(updatedEmployee);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private/Admin
export const deleteEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      res.status(404).json({ message: "Employee not found" });
      return;
    }

    // Delete associated user account
    await User.deleteOne({ employeeId: employee._id });

    // Delete employee
    await Employee.deleteOne({ _id: employee._id });

    res.json({ message: "Employee removed" });
  } catch (error) {
    next(error);
  }
};
