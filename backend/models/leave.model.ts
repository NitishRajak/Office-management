import mongoose, { type Document, Schema, type Model, Types } from "mongoose";
import { IEmployee } from "./employee.model";

export interface ILeave extends Document {
  employee: Types.ObjectId | IEmployee;
  type: "Annual Leave" | "Sick Leave" | "Personal Leave";
  startDate: Date;
  endDate: Date;
  days: number;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  approvedBy?: Types.ObjectId;
  approvedAt?: Date;
}

const leaveSchema = new Schema<ILeave>(
  {
    employee: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Employee",
    },
    type: {
      type: String,
      required: true,
      enum: ["Annual Leave", "Sick Leave", "Personal Leave"],
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    days: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    approvedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Leave: Model<ILeave> = mongoose.model<ILeave>("Leave", leaveSchema);

export default Leave;
