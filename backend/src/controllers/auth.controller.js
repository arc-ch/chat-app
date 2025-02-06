import cloudinary from "../lib/cloudinary.js";
import { generatetoken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // hash passwords using bcryptjs
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }
    //  hash password using bcryptjs
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //  Create a new user from the User model and put the hashed pw in the db
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword, // here put the hashedpassword into the db not the exact one that user gave
    });

    if (newUser) {
      // generate a jsonwebtoken
      generatetoken(newUser._id, res);

      //  save the new user to the db
      await newUser.save();
      return res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
        message: "User created successfully",
      });
    } else {
      res.status(500).json({ message: "Invalid user data " });
    }
  } catch (error) {
    console.log("Error in signup controller ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    // compare the password that user gave with the hashed password in the db
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // generate a jsonwebtoken
    generatetoken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const updateProfile = async (req, res) => {

    try {
        const {profilePic} = req.body;
        const userId = req.user._id; // we can access id from req.user because last step of protectRoute was req.user = user

        if (!profilePic){
            return res.status(400).json({message: "Profile pic is required "})
        }

        const uploadResponse = await cloudinary.uploader.upload_large(profilePic, {chunk_size: 6000000});

    

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: uploadResponse.secure_url },
            { new: true }  // we use new: true to return the updated user document
        );
        
        res.status(200).json({message: updatedUser})
    } 
        catch (error) {
        console.log("Error in updateProfile controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }

}


export const checkAuth = (req, res) => {
    try {
    // The user object is already attached to the request by the 'protectRoute' middleware
    // Send the user object as a response to the client
      res.status(200).json(req.user);
    } catch (error) {
      console.log("Error in checkAuth controller", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };