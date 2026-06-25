import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AuthLayout from "@/components/layout/AuthLayout";
import { User, Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";
import {z} from "zod";
import { useForm } from "react-hook-form";
import auth2 from "@/assets/auth2.jpg"
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/lib/api.js";
import useToastStore from "@/store/useToastStore";

const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters"),

  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
      "Password must contain uppercase, lowercase and a number"
    ),
});

export default function StudentRegister({role, setRole}) {
  const toast = useToastStore((s) => s.toast);
  const { register, handleSubmit, formState: { errors } } = useForm({resolver: zodResolver(registerSchema),});
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    console.log(data)
    try {
    const payload = {
      ...data,
      role,
    };

    const res = await api.post("/auth/register/student", payload);

    console.log("REGISTER SUCCESS:", res.data);

    role === "trainer" ? navigate("/trainer/dashboard") : navigate("/dashboard");
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to register student");
  }
  
  };

  return (
    <AuthLayout
      title="Create an account"
      description="Join our fitness community today"
      image={auth2}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            type="button"
            onClick={() => setRole("student")}
            className={cn(
              "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all",
              role === "student"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50",
            )}
          >
            <User
              className={cn(
                "w-6 h-6 mb-2",
                role === "student" ? "text-primary" : "text-muted-foreground",
              )}
            />
            <span
              className={cn(
                "text-sm font-bold",
                role === "student"
                  ? "text-foreground"
                  : "text-muted-foreground",
              )}
            >
              Student
            </span>
          </button>
          <button
            type="button"
            onClick={() => setRole("trainer")}
            className={cn(
              "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all",
              role === "trainer"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50",
            )}
          >
            <Dumbbell
              className={cn(
                "w-6 h-6 mb-2",
                role === "trainer" ? "text-primary" : "text-muted-foreground",
              )}
            />
            <span
              className={cn(
                "text-sm font-bold",
                role === "trainer"
                  ? "text-foreground"
                  : "text-muted-foreground",
              )}
            >
              Trainer
            </span>
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Full Name</label>
          <input
            type="text"
            {...register("name")}
            className="w-full px-4 py-2 bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">
              {errors.name.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <input
            type="email"
            {...register("email")}
            className="w-full px-4 py-2 bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">
              {errors.email.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Password</label>
          <input
            type="password"
            {...register("password")}
            className="w-full px-4 py-2 bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">
              {errors.password.message}
            </p>
          )}
        </div>
        <Button type="submit" className="w-full py-6 mt-4">
          Create Account
        </Button>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline font-bold">
            Log in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
