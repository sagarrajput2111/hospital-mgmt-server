import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const privateKey = "Mykey@5432";
const options = {
  expiresIn: "1h",
};

export const authenticateUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) return false;

  return await bcrypt.compare(password, user.password);
};

export const generateJwt = async (email) => {
  let user = await User.findOne({ email });
  const payload = {
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    roles: user.roles,
  };

  return jwt.sign(payload, privateKey, options);
};


