import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

/**
 * Middleware function to protect routes that require authentication.
 * Verifies if a user is logged in by checking the presence and validity of a JWT.
 */
export const protectRoute = async (req, res, next) => {
  try {
    // Step 1: Retrieve the JWT token from cookies but first setup cookiparser in index.js
    const token = req.cookies.jwt;
    
    // If no token is found, return Unauthorized error
    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    // Step 2: Verify the validity of the JWT token using the secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // If the token is not valid (or decoded returns null), return an error
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    // Step 3: Check if a user exists with the userId from the decoded token
    const user = await User.findById(decoded.userId).select("-password");

    // If no user is found, return a Not Found error
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Step 4: Attach the user object to the request for further use in route handler for example= updateProfile()
    req.user = user;

    // Step 5: Proceed to the next middleware or route handler 
    next();


  } catch (error) {
    // Log the error for debugging and return a generic Internal Server Error
    console.error("Error in protectRoute middleware: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
