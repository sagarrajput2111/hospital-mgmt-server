import {
  authenticateUser,
  getAccessToken,
  getRefreshToken,
  createUser,
} from "../services/auth.service.js";

export const userAuthentication = async (req, res) => {
  let { email, password } = req.body;
  let isValid = await authenticateUser(email, password);
  if (!isValid)
    return res.status(401).json({
      authenticated: false,
      message: "Invalid email or password",
    });
  else {
    const accessToken = await getAccessToken(email);
    const refreshToken = await getRefreshToken(email);

    return res.status(200).json({
      authenticated: true,
      message: "User authenticated successfully",
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  }
};

export const accessTokenController = async (req, res) => {
  const { email } = req.userData; //
  //  Assuming userData is set by verifyRefreshToken middleware
  console.log("Generating access token for email:", email);
  try {
    const accessToken = await getAccessToken(email);
    return res.status(200).json({
      message: "Access token generated successfully",
      accessToken: accessToken,
    });
  } catch (error) {
    console.error("Error generating access token:", error);
    return res.status(500).json({
      message: "An error occurred while generating the access token",
      error: error.message,
    });
  }
};

export const registerUserController = async (req, res) => {
  const user = req.body;

  try {
    const result = await createUser(user);
    if (!result.success) {
      return res.status(500).json({
        message: result.message,
        error: result.error,
      });
    }

    return res.status(201).json({
      message: result.message,
      user: result.user,
    });
  } catch (error) {
    console.error("Error generating access token:", error);
    return res.status(500).json({
      message: "An error occurred registering the user",
      error: error.message,
    });
  }
};

// export default userAuthentication;
