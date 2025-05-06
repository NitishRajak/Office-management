import mongoose, { type Document, Schema, type Model } from "mongoose";

export interface IEmergencyContact {
  name: string;
  phone: string;
}

export interface ILeaveBalance {
  annual: number;
  sick: number;
  personal: number;
}

export interface IEmployee extends Document {
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  department: string;
  position: string;
  joinDate: Date;
  status: "Active" | "On Leave" | "Terminated";
  salary: string;
  manager?: string;
  emergencyContact: IEmergencyContact;
  skills: string[];
  projects: string[];
  performance: "Excellent" | "Good" | "Average" | "Poor";
  leaveBalance: ILeaveBalance;
}

const employeeSchema = new Schema<IEmployee>(
  {
    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    position: {
      type: String,
      required: true,
      trim: true,
    },
    joinDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "On Leave", "Terminated"],
      default: "Active",
    },
    salary: {
      type: String,
      required: true,
    },
    manager: {
      type: String,
      trim: true,
    },
    emergencyContact: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      phone: {
        type: String,
        required: true,
        trim: true,
      },
    },
    skills: [String],
    projects: [String],
    performance: {
      type: String,
      enum: ["Excellent", "Good", "Average", "Poor"],
      default: "Good",
    },
    leaveBalance: {
      annual: {
        type: Number,
        default: 20,
      },
      sick: {
        type: Number,
        default: 10,
      },
      personal: {
        type: Number,
        default: 5,
      },
    },
  },
  { timestamps: true }
);

const Employee: Model<IEmployee> = mongoose.model<IEmployee>(
  "Employee",
  employeeSchema
);

export default Employee;
