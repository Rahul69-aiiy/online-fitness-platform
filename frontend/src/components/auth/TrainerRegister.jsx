import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AuthLayout from "@/components/layout/AuthLayout";
import {
  User,
  Dumbbell,
  Award,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CATEGORIES } from "@/data/constants";
import auth2 from "@/assets/auth2.jpg"
import axios from "axios";

const trainerSchema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 characters"),

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

  specialization: z
    .string()
    .trim()
    .min(3, "Specialization must be at least 3 characters"),

  experience: z.coerce
    .number()
    .min(0)
    .default(0),

  bio: z.string().trim().min(20, "Bio must be at least 20 characters"),

  primaryLocation: z
    .string()
    .trim()
    .min(3, "Location must be at least 3 characters"),

  certifications: z.string().optional(),

  categories: z
    .array(z.string())
    .min(1, "Select at least one category")
    .transform((categories) =>
      categories.map((category) => category.toUpperCase())
    )
});

export default function TrainerRegister({ role, setRole }) {
  const [currentStep, setCurrentStep] = useState(1);
  const {
        register,
        handleSubmit,
        formState: { errors },
        trigger,
        getValues,
        setValue,
        watch,
    } = useForm({
        resolver: zodResolver(trainerSchema),
        defaultValues: {
            categories: [],
            certifications: "",
        },
    });

  const navigate = useNavigate();

  const certificationValue = watch("certifications", "");

  const certificationTags = certificationValue
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);

  const selectedCategories = watch("categories", []);

  const toggleCategory = (category) => {
    const current = getValues("categories");

    if (current.includes(category)) {
      setValue(
        "categories",
        current.filter((c) => c !== category),
        { shouldValidate: true }
      );
    } else {
      setValue(
        "categories",
        [...current, category],
        { shouldValidate: true }
      );
    }
  };

  const handleNextStep1 = async () => {
    const isValid = await trigger([
      "name",
      "email",
      "password",
    ]);

    if (isValid) {
      setCurrentStep(2);
    }
  };

  const handleNextStep2 = async () => {
    const isValid = await trigger([
      "specialization",
      "experience",
      "bio",
      "primaryLocation",
    ]);

    if (isValid) {
      setCurrentStep(3);
    }
  };

  const handleSubmitFinal = async (data) => {
    const finalData = {
      ...data,
      certifications: data.certifications
        ? data.certifications
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean)
        : [],
      role: "trainer",
    };

    try {
      await axios.post(
        "http://localhost:5000/api/auth/register/trainer",
        finalData,
        {
          withCredentials: true,
        }
      );
      navigate("/trainer/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <AuthLayout
      title="Create an account"
      description="Join our fitness community today"
      image={auth2}
    >
      <form className="space-y-4" 
              onSubmit={handleSubmit(handleSubmitFinal)}>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            type="button"
            onClick={() => setRole("student")}
            className={cn(
              "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all",
              role === "student"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            )}
          >
            <User
              className={cn(
                "w-6 h-6 mb-2",
                role === "student" ? "text-primary" : "text-muted-foreground"
              )}
            />
            <span
              className={cn(
                "text-sm font-bold",
                role === "student"
                  ? "text-foreground"
                  : "text-muted-foreground"
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
                : "border-border hover:border-primary/50"
            )}
          >
            <Dumbbell
              className={cn(
                "w-6 h-6 mb-2",
                role === "trainer" ? "text-primary" : "text-muted-foreground"
              )}
            />
            <span
              className={cn(
                "text-sm font-bold",
                role === "trainer"
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              Trainer
            </span>
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                  currentStep > step
                    ? "bg-primary text-primary-foreground"
                    : currentStep === step
                    ? "bg-primary text-primary-foreground ring-2 ring-primary/50"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {currentStep > step ? <CheckCircle2 className="w-5 h-5" /> : step}
              </div>
              {step < 3 && (
                <div
                  className={cn(
                    "w-12 h-1 mx-2",
                    currentStep > step ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1 */}
        {currentStep === 1 && (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <input
                type="text"
                {...register("name")}
                className="w-full px-4 py-2 bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
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
                <p className="text-red-500 text-sm">{errors.email.message}</p>
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
                <p className="text-red-500 text-sm">{errors.password.message}</p>
              )}
            </div>
          </>
        )}

        {/* Step 2 */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Dumbbell className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Trainer Details</h3>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                Specialization
              </label>
              <input
                type="text"
                {...register("specialization")}
                className="w-full px-4 py-2 bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.specialization && (
                <p className="text-red-500 text-sm">{errors.specialization.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                Years of Experience
              </label>
              <input
                type="number"
                {...register("experience")}
                className="w-full px-4 py-2 bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                min="0"
              />
              {errors.experience && (
                <p className="text-red-500 text-sm">{errors.experience.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                Bio
              </label>
              <textarea
                {...register("bio")}
                className="w-full px-4 py-2 bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                rows={4}
              />
              {errors.bio && (
                <p className="text-red-500 text-sm">{errors.bio.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                Primary Location
              </label>
              <input
                type="text"
                {...register("primaryLocation")}
                className="w-full px-4 py-2 bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.primaryLocation && (
                <p className="text-red-500 text-sm">{errors.primaryLocation.message}</p>
              )}
            </div>
          </div>
        )}

        {/* Step 3 */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Certifications & Categories</h3>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                Certifications (comma separated)
              </label>
              <input
                type="text"
                {...register("certifications")}
                className="w-full px-4 py-2 bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., NASM, ACE"
              />
              {certificationTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {certificationTags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Categories</label>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => toggleCategory(category.toUpperCase())}
                    className={cn(
                      "px-4 py-3 rounded-lg border transition-all text-sm font-medium flex items-center justify-center",
                      selectedCategories.includes(category.toUpperCase())
                        ? "bg-primary text-primary-foreground border-primary shadow-md"
                        : "bg-card border-border hover:border-primary/50 hover:bg-card/80"
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>
              {errors.categories && (
                <p className="text-red-500 text-sm">{errors.categories.message}</p>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          {currentStep > 1 && (
            <Button
              type="button"
              onClick={handleBack}
              className="flex-1 py-6 text-lg flex items-center justify-center gap-2 bg-muted text-foreground hover:bg-muted/80"
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </Button>
          )}
          {currentStep === 1 && (
            <Button
              type="button"
              onClick={handleNextStep1}
              className="flex-1 py-6 text-lg flex items-center justify-center gap-2"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </Button>
          )}
          {currentStep === 2 && (
            <Button
              type="button"
              onClick={handleNextStep2}
              className="flex-1 py-6 text-lg flex items-center justify-center gap-2 ml-auto"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </Button>
          )}
          {currentStep === 3 && (
            <Button
              type="submit"
              className="flex-1 py-6 text-lg flex items-center justify-center gap-2 ml-auto"
            >
              Create Account
            </Button>
          )}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline font-bold">
            Log in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
