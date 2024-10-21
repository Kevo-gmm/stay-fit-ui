"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { postReq } from "../../lib/utils";
import { User } from "@/states/auth";

interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface FormErrors {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [formData, setFormData] = useState<FormData>({ email: "", password: "", rememberMe: false });
  const [errors, setErrors] = useState<FormErrors>({ email: "", password: "" });
  const [apiError, setApiError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { updateUser } = User;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (name in errors) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors: FormErrors = { email: "", password: "" };

    if (formData.email.trim() === "") {
      newErrors.email = "email is required";
      isValid = false;
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError("");

    if (!validateForm()) {
      return;
    }
    try {
      setLoading(true);
      const { data, res } = await postReq({ email: formData.email, password: formData.password }, "user/login");
      if (res.ok) {
        updateUser({ email: formData.email, username: data.username });
        router.push("/");
      } else if (res.status === 401) {
        setApiError(data.message);
      } else setApiError("An error occurred. Please try again.");
    } catch (error) {
      setApiError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = (fieldName: keyof FormErrors): string => `
    w-full px-4 py-2 bg-white/20 border rounded-md text-white placeholder-white/70 
    focus:outline-none focus:ring-2 focus:ring-purple-500
    ${errors[fieldName] ? "border-red-500 focus:ring-red-500" : "border-white/30"}
  `;

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('https://ik.imagekit.io/stril2wwi/athlete/twilight-deer-4k-rc.jpg')" }}
    >
      <div className="absolute inset-0 bg-black opacity-30"></div>
      <div className="relative z-10 w-full max-w-md p-8 rounded-lg backdrop-blur-sm bg-white/10 shadow-lg animate-glow">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-3xl font-bold text-center text-white mb-6">Login</h2>
          {apiError && (
            <Alert variant="destructive">
              <AlertDescription>{apiError}</AlertDescription>
            </Alert>
          )}
          <div>
            <Input
              type="email"
              name="email"
              placeholder="admin@mail.com"
              value={formData.email}
              onChange={handleInputChange}
              className={cn("bg-transparent", inputClasses("email"))}
              required
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className={inputClasses("password")}
              required
            />
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-white/30 rounded"
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-white">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium text-white hover:underline">
                Forgot your password?
              </a>
            </div>
          </div>
          <div>
            <Button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border-none rounded-md shadow-sm text-sm font-medium text-purple-700 bg-white hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              loading={loading}
            >
              Log in
            </Button>
          </div>
        </form>
        <p className="mt-4 text-center text-sm text-white">
          Don&apos;t have an account?{" "}
          <Link href="register" className="font-medium hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
