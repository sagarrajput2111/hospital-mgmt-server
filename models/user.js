import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import { nanoid } from "nanoid";

const userSchema = new mongoose.Schema(
  {
    empId: {
      type: String,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    roles: {
      type: [String],
      required: true,
      default: ["user"],
    },
    designation: {
      type: String,
      required: true,
    },
    salary: {
      type: Number,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    contact: {
      type: String,
      required: true
    },
    address: {
      type: String,
    },
  },
  {
    timestamps: true, // <-- Add this option
  }
);

userSchema.pre("save", async function (next) {
  if (!this.empId) {
    this.empId = `EMP-${nanoid(6)}`; // e.g., PAT-8Z2X1D
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default mongoose.model("User", userSchema);
