import bcrypt from "bcrypt"
import createToken from "../utils/createToken.js"
import prisma from "../config/db.js";
import {getAuth} from "firebase-admin/auth"

export const register = async (req, res) => {
  try {
    const {name,  email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const User = await prisma.user.findUnique({where: {email}});

    if(User) {
      return res.status(400).json({message: "User already exists"})
    }

    const role = req.body.role?.toUpperCase() || "STUDENT";
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name, 
        email,
        password: hashedPassword,
        role
      },
    });

    // to make sure cookies are not modified in frontend
    const options = {
      httpOnly: true,
      // secure: true,
      sameSite: "Lax",
    };

    delete newUser.password;
    const token = createToken(newUser)
    res.status(200).cookie("token", token, options).json({message: "User registered successfully", user});

  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: error.message,
    });
  }
};

export const login = async(req, res) => {
    try {
      const {name, email, password} = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          message: "All fields are required",
        });
      }

      const User = await prisma.user.findUnique({
        where: { email },
      })

      if(!User) {
        return res.status(404).json({message: "User does not exist",})
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password)

      if(!isPasswordCorrect) {
        return res.status(400).json({message: "Invalid credentials"});
      }

      const options = {
        httpOnly: true,
        // secure: true,
        sameSite: "Lax",
      };
      
      delete user.password;
      const token = createToken(user)

      res.status(200).cookie("token", token, options).json({message: "Login successful", user});
    } catch(error) {
      console.log(error.message)
      res.status(500).json({ message: error.message})
    }
}

export const logout = async (req, res) => {
  res.clearCookie("token").status(200).json({ message: "Logged out successfully" });
};

export const googleLogin = async (req, res) => {
  try {
    const { firebaseToken } = req.body;

    const decoded = await getAuth().verifyIdToken(firebaseToken);

    const email = decoded.email;

    const User = await prisma.user.findUnique({
      where: { email }
    });

    if(!User) {
      return res.status(400).json({
        message: "Please register first."
      });
    }

    const options = {
      httpOnly: true,
      // secure: true,
      sameSite: "Lax",
    };
    const { password, ...user } = User
    const token = createToken(user)

    res.status(200).cookie("token", token, options).json({message: "Login successful", user});
  } catch(error) {
    console.log(error.message)
    res.status(500).json({ message: error.message})
  }
}

export const getMe = (req, res) => {
  res.json({ success: true, user: req.user });
};