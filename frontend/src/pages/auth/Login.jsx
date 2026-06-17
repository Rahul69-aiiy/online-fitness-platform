import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AuthLayout from "@/components/layout/AuthLayout";
import googleIcon from "@/assets/google.svg"
import { useNavigate } from "react-router-dom";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod"
import axios from "axios";

import { auth } from "@/lib/firebase.js";
import {
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
      "Password must contain uppercase, lowercase and a number"
    ),
});

export default function Login() {

  const { register, handleSubmit, formState: {errors} } = useForm({ resolver: zodResolver(loginSchema),});

  const navigate = useNavigate();

  const onSubmit = (data) => {
    console.log(data)
    // Simulate login
    navigate("/dashboard");
  };

  const googleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(
        auth,
        provider
      );

      const token =
        await result.user.getIdToken();

      await axios.post(
        "http://localhost:5000/api/auth/google",
        {
          firebaseToken: token,
        },
        {
          withCredentials: true,
        }
      );

      navigate("/dashboard");

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthLayout 
      title="Welcome back" 
      description="Enter your credentials to access your account"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <input type="email"
            className="w-full px-4 py-2 bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">
              {errors.email.message}
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Password</label>
            <Link to="/forgot-password" className="text-sm text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <input 
            type="password" 
            className="w-full px-4 py-2 bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            {...register("password")}
            required
          />
          {errors.password && (
            <p className="text-red-500 text-sm">
              {errors.password.message}
            </p>
          )}
        </div>
        <Button type="submit" className="w-full py-6">Sign In</Button>
        
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <div>
          <Button
            variant="outline"
            type="button"
            className="w-full py-6 bg-white/5 border-white/10 text-white hover:bg-white/10 flex items-center justify-center"
            onClick={googleLogin}
          >
            <img src={googleIcon} alt="Google" className="w-5 h-5 mr-2" />
            Sign In with Google
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary hover:underline font-bold">
            Sign up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
