import bcrypt from "bcrypt"
import createToken from "../utils/createToken.js"
import prisma from "../config/db.js";
import { verifyFirebaseToken } from "../services/firebaseService.js";
import ExpressError from "../utils/ExpressError.js";

const studentRegister = async (req, res, next) => {
  try {
    const {name,  email, password } = req.body;

    if (!name || !email || !password) {
      return next(new ExpressError("All fields are required", 400));
    }

    const User = await prisma.user.findUnique({where: {email}});

    if(User) {
      return next(new ExpressError("User already exists", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name, 
        email,
        password: hashedPassword,
        role: "STUDENT",
      },
    });

    // to make sure cookies are not modified in frontend
    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    };

    const { password: _, ...userWithoutPassword } = newUser;
    const token = createToken(userWithoutPassword);
    res.status(200).cookie("token", token, options).json({success: true, message: "User registered successfully", user: userWithoutPassword});

  } catch (error) {
    console.error("Student registration error:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};

const trainerRegister = async(req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      specialization,
      experience = 0,
      bio,
      primaryLocation,
      certifications,
      categories,
    } = req.body;

    if (!name || !email || !password) {
      return next(new ExpressError("All fields are required", 400));
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return next(new ExpressError("User already exists", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "TRAINER",

        trainerProfile: {
          create: {
            specialization,
            experience,
            bio,
            primaryLocation,
            certifications,
            categories,
          },
        },
      },
      include: {
        trainerProfile: true,
      },
    });

    const { password: _, ...userWithoutPassword } = newUser;

    const token = createToken(userWithoutPassword);

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })  
      .json({
        success: true,
        message: "Trainer registered successfully",
        user: userWithoutPassword,
      });

  } catch (error) {
    console.error("Trainer registration error:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });
  }
}

export const register = async(req, res, next) => {
  const { role } = req.params;

  if (role === "trainer") {
    return trainerRegister(req, res, next);
  }
  return studentRegister(req, res, next);
}

export const login = async(req, res, next) => {
    try {
      const {email, password} = req.body;

      if (!email || !password) {
        return next(new ExpressError("All fields are required", 400));
      }

      const User = await prisma.user.findUnique({
        where: { email },
        include: { trainerProfile: true },
      })

      if(!User) {
        return next(new ExpressError("User does not exist", 404));
      }

      const isPasswordCorrect = await bcrypt.compare(password, User.password)

      if(!isPasswordCorrect) {
        return next(new ExpressError("Invalid credentials", 400));
      }

      const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      };
      
      const { password: _, ...userWithoutPassword } = User;
      const token = createToken(userWithoutPassword)

      res.status(200).cookie("token", token, options).json({success: true,message: "Login successful", user: userWithoutPassword});
    } catch(error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: "An unexpected error occurred. Please try again later."
      });
    }
}


export const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  }).status(200).json({success: true, message: "Logged out successfully" });
};

export const googleLogin = async (req, res, next) => {
  try {
    const { firebaseToken } = req.body;

    const decoded = await verifyFirebaseToken(firebaseToken);

    const email = decoded.email;

    const User = await prisma.user.findUnique({
      where: { email },
      include: { trainerProfile: true },
    });

    if(!User) {
      return next(new ExpressError("Please register first.", 400));
    }

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    };
    const { password, ...user } = User
    const token = createToken(user)

    res.status(200).cookie("token", token, options).json({success: true, message: "Login successful", user});
  } catch(error) {
    console.error("Google login error:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later."
    });
  }
}

export const getMe = (req, res) => {
  res.json({ success: true, user: req.user });
};