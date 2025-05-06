import mongoose, { type Document, Schema, type Model } from "mongoose"
import bcrypt from "bcryptjs"

export interface IUser extends Document {
  email: string
  password: string
  role: "admin" | "employee"
  employeeId?: mongoose.Types.ObjectId
  comparePassword(candidatePassword: string): Promise<boolean>
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "employee"],
      default: "employee",
    },
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
    },
  },
  { timestamps: true },
)

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error as Error)
  }
})

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password)
}

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema)

export default User
