import bcrypt from "bcrypt"
import createToken from "../utils/createToken.js"
import prisma from "../config/db.js";
import { verifyFirebaseToken } from "../services/firebaseService.js";

const studentRegister = async (req, res) => {
  try {
    const {name,  email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const User = await prisma.user.findUnique({where: {email}});

    if(User) {
      return res.status(400).json({success: false, message: "User already exists"})
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
      // secure: true,
      sameSite: "Lax",
    };

    delete newUser.password;
    const token = createToken(newUser)
    res.status(200).cookie("token", token, options).json({success: true, message: "User registered successfully", user: newUser});

  } catch (error) {
    console.error("Student registration error:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};

const trainerRegister = async(req, res) => {
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
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
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
        sameSite: "Lax",
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

export const register = async(req, res) => {
  const { role } = req.params;

  if (role === "trainer") {
    return trainerRegister(req, res);
  }
  return studentRegister(req, res);
}

export const login = async(req, res) => {
    try {
      const {email, password} = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false, 
          message: "All fields are required",
        });
      }

      const User = await prisma.user.findUnique({
        where: { email },
      })

      if(!User) {
        return res.status(404).json({success: false, message: "User does not exist",})
      }

      const isPasswordCorrect = await bcrypt.compare(password, User.password)

      if(!isPasswordCorrect) {
        return res.status(400).json({success: false, message: "Invalid credentials"});
      }

      const options = {
        httpOnly: true,
        // secure: true,
        sameSite: "Lax",
      };
      
      delete User.password;
      const token = createToken(User)

      res.status(200).cookie("token", token, options).json({success: true,message: "Login successful", user: User});
    } catch(error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: "An unexpected error occurred. Please try again later."
      });
    }
}


export const logout = async (req, res) => {
  res.clearCookie("token").status(200).json({success: true, message: "Logged out successfully" });
};

export const googleLogin = async (req, res) => {
  try {
    const { firebaseToken } = req.body;

    const decoded = await verifyFirebaseToken(firebaseToken);

    const email = decoded.email;

    const User = await prisma.user.findUnique({
      where: { email }
    });

    if(!User) {
      return res.status(400).json({
        success: false, 
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