import { authenticateUser,generateJwt } from "../services/auth.service.js";

const userAuthentication = async (req, res) => {
  let { email, password } = req.body;
  let isValid = await authenticateUser(email, password);
  if (!isValid)
    return res.status(401).json({
      authenticated: false,
      message: "Invalid email or password",
    });
  else {

    let token=await generateJwt(email);
    console.log("token is ",token)
    
    return res.status(200).json({
      authenticated: true,
      message: "User authenticated successfully",
      accesstoken:token
    });
  }
};

export default userAuthentication;
