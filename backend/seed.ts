import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/user.model.js";
import Employee from "./models/employee.model.js";
import bcrypt from "bcryptjs";

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "")
  .then(() => console.log("MongoDB connected for seeding"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Sample data
const adminUser = {
  email: "admin@company.com",
  password: "admin123",
  role: "admin" as const,
};

const employees = [
  {
    employeeId: "EMP001",
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    phone: "555-123-4567",
    address: "123 Main St, Anytown, CA 12345",
    department: "Engineering",
    position: "Senior Developer",
    joinDate: "2021-05-12",
    status: "Active" as const,
    salary: "$95,000",
    manager: "David Miller",
    emergencyContact: {
      name: "John Johnson",
      phone: "555-987-6543",
    },
    skills: ["JavaScript", "React", "Node.js", "TypeScript"],
    projects: ["Website Redesign", "Mobile App Development"],
    performance: "Excellent" as const,
    leaveBalance: {
      annual: 14,
      sick: 8,
      personal: 5,
    },
  },
  {
    employeeId: "EMP002",
    name: "Michael Chen",
    email: "michael.chen@company.com",
    phone: "555-234-5678",
    address: "456 Oak St, Somewhere, NY 54321",
    department: "Marketing",
    position: "Marketing Manager",
    joinDate: "2020-11-03",
    status: "Active" as const,
    salary: "$85,000",
    manager: "Jennifer Lopez",
    emergencyContact: {
      name: "Lisa Chen",
      phone: "555-876-5432",
    },
    skills: ["Digital Marketing", "SEO", "Content Strategy", "Analytics"],
    projects: ["Q2 Marketing Campaign", "Brand Refresh"],
    performance: "Good" as const,
    leaveBalance: {
      annual: 12,
      sick: 7,
      personal: 4,
    },
  },
];

// Seed data
const seedData = async (): Promise<void> => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Employee.deleteMany({});

    console.log("Previous data cleared");

    // Create admin user
    const hashedPassword = await bcrypt.hash(adminUser.password, 10);
    const admin = await User.create({
      ...adminUser,
      password: hashedPassword,
    });

    console.log("Admin user created");

    // Create employees and their user accounts
    for (const employeeData of employees) {
      const employee = await Employee.create({
        ...employeeData,
        joinDate: new Date(employeeData.joinDate),
      });

      // Create user account for employee
      const employeeUser = await User.create({
        email: employeeData.email,
        password: await bcrypt.hash("password123", 10), // Default password
        role: "employee",
        employeeId: employee._id,
      });

      console.log(`Created employee: ${employee.name}`);
    }

    console.log("Data seeding completed");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

// Run the seed function
seedData();
