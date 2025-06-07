import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const privateKey = "Mykey@5432";
const optionsAccess = {
  expiresIn: "1h",
};

const optionsRefresh = {
  expiresIn: "7d",
};

export const authenticateUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) return false;

  return await bcrypt.compare(password, user.password);
};

export const getAccessToken = async (email) => {
  let user = await User.findOne({ email });
  const payloadAccess = {
    type: "access",
    _id: user._id,
    empId: user.empId,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    designation: user.designation,
    contact: user.contact,
    dateOfBirth: user.dateOfBirth,
    address: user.address,
    roles: user.roles,
  };

  return jwt.sign(payloadAccess, privateKey, optionsAccess);
};

export const getRefreshToken = async (email) => {
  let user = await User.findOne({ email });
  const payLoadRefresh = {
    type: "refresh",
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    roles: user.roles,
  };

  return jwt.sign(payLoadRefresh, privateKey, optionsRefresh);
};

// export const updateUser = async (user) => {};

export const createUser = async (userData) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      roles,
      designation,
      salary,
      dateOfBirth,
      contact,
      address,
    } = userData;

    // Simple validation
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !designation ||
      !salary ||
      !dateOfBirth ||
      !contact
    ) {
      return {
        success: false,
        message: "Missing Required Fields",
      };
    }

    // Check for duplicate email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return {
        success: false,
        message: "Email already in use",
      };
    }

    const user = new User({
      firstName,
      lastName,
      email,
      password, // Will be hashed in pre-save hook
      roles: roles || ["user"],
      designation,
      salary,
      dateOfBirth,
      contact,
      address,
    });

    await user.save();

    return {
      success: true,
      message: "User created successfully",
      user: {
        empId: user.empId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        roles: user.roles,
        designation: user.designation,
      },
    };
  } catch (error) {
    console.error("User creation failed:", error);
    return { success: false, message: "Internal server error" };
  }
};
