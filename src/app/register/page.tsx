"use client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { postReq } from "@/lib/utils";
import { User } from "@/states/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignUpPage() {
  const [formData, setFormData] = useState<FormData>({ username: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<FormErrors>({ username: "", email: "", password: "", confirmPassword: "" });
  const [apiError, setApiError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { updateUser } = User;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors: FormErrors = { username: "", email: "", password: "", confirmPassword: "" };

    if (formData.username.trim() === "") {
      newErrors.username = "Username is required";
      isValid = false;
    }

    if (formData.email.trim() === "") {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
      const { data, res } = await postReq({ username: formData.username, password: formData.password, email: formData.email }, "user/signup");

      if (res.ok) {
        updateUser({ email: formData.email, username: formData.username });
        router.push("/");
      } else {
        setApiError("An error occurred during sign-up. Please try again.");
      }
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-3xl font-bold text-center text-white mb-6">Sign Up</h2>
          {apiError && (
            <Alert variant="destructive">
              <AlertDescription>{apiError}</AlertDescription>
            </Alert>
          )}
          <div>
            <Input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
              className={inputClasses("username")}
              required
            />
            {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username}</p>}
          </div>
          <div>
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className={inputClasses("email")}
              required
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          </div>
          <div>
            <Input
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
          <div>
            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={inputClasses("confirmPassword")}
              required
            />
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
          </div>
          <div>
            <Button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border-none rounded-md shadow-sm text-sm font-medium text-purple-700 bg-white hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Sign Up
            </Button>
          </div>
        </form>
        <p className="mt-4 text-center text-sm text-white">
          Already have an account?{" "}
          <Link href="/login" className="font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
