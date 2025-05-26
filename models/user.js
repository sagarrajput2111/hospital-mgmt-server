import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    empId: {
      type: String,
      required: true,
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
    }
  },
  {
    timestamps: true, // <-- Add this option
  }
);

export default mongoose.model("User", userSchema);
