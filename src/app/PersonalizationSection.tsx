"use client";
import React, { useState, useCallback, memo } from "react";
import { Bell, User, Settings, Dumbbell, Trophy, Save } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";

export const PersonalizationSection = memo(
  ({ setWorkoutData }: { setWorkoutData: (data: any) => void }) => {
    const [userPreferences, setUserPreferences] = useState({
      name: "John Doe",
      age: 25,
      weight: 70,
      height: 180,
      ailments: "",
      country: "India",
      fitnessLevel: "intermediate",
      fitnessGoal: "build-muscle",
      dietaryRestrictions: ["vegetarian"],
      workoutDuration: 45,
      workoutsPerWeek: 4,
      additionalNotes: "",
    });
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: { preventDefault: () => void }) {
      event.preventDefault();
      setLoading(true);
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userPreferences),
      });
      const outputString = await response.text();
      const jsonMatch = outputString.match(/{[\s\S]*}/);
      const jsonPart = jsonMatch ? jsonMatch[0] : null;

      // Extract the remaining text
      const remainingText = jsonPart
        ? outputString.split(jsonPart)[1].trim()
        : "";

      // Parse the JSON part into an object
      let workoutPlan = null;
      if (jsonPart) {
        try {
          workoutPlan = JSON.parse(jsonPart);
          setWorkoutData(workoutPlan);

          const existingPlans =
            JSON.parse(localStorage.getItem("workoutPlans") || "[]") || [];
          const updatedPlans = [...existingPlans, workoutPlan];

          localStorage.setItem("workoutPlans", JSON.stringify(updatedPlans));
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      }

      setLoading(false);
    }

    const handlePreferenceChange = useCallback((field: any, value: any) => {
      setUserPreferences((prev) => ({
        ...prev,
        [field]: value,
      }));
    }, []);

    return (
      <div>
        {loading && (
          <div className=" mx-auto  my-4">
            <Alert>
              <Trophy className="h-4 w-4" />
              <AlertTitle>Creating a Workout Plan</AlertTitle>

              <AlertDescription>
                Your personalized fitness and nutrition plan is being generated.
                Please wait...
              </AlertDescription>
            </Alert>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Personalize Your Plan</span>
                <Button type="submit" className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Create a Plan
                </Button>
              </CardTitle>
              <CardDescription>
                Customize your fitness and nutrition journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  id="name"
                  label="Name"
                  type="text"
                  value={userPreferences.name}
                  onChange={(value: any) =>
                    handlePreferenceChange("name", value)
                  }
                />
                <InputField
                  id="age"
                  label="Age"
                  type="number"
                  value={userPreferences.age}
                  onChange={(value: any) =>
                    handlePreferenceChange("age", Number(value))
                  }
                />
                <InputField
                  id="weight"
                  label="Weight (kg)"
                  type="number"
                  value={userPreferences.weight}
                  onChange={(value: any) =>
                    handlePreferenceChange("weight", Number(value))
                  }
                />
                <InputField
                  id="height"
                  label="Height (cm)"
                  type="number"
                  value={userPreferences.height}
                  onChange={(value: any) =>
                    handlePreferenceChange("height", Number(value))
                  }
                />
                <InputField
                  id="ailments"
                  label="Ailments"
                  type="text"
                  value={userPreferences.ailments}
                  onChange={(value: any) =>
                    handlePreferenceChange("ailments", value)
                  }
                />
                <InputField
                  id="country"
                  label="Country"
                  type="text"
                  value={userPreferences.country}
                  onChange={(value: any) =>
                    handlePreferenceChange("country", value)
                  }
                />
                <SelectField
                  id="fitnessLevel"
                  label="Fitness Level"
                  value={userPreferences.fitnessLevel}
                  onChange={(value: any) =>
                    handlePreferenceChange("fitnessLevel", value)
                  }
                  options={[
                    { value: "beginner", label: "Beginner" },
                    { value: "intermediate", label: "Intermediate" },
                    { value: "advanced", label: "Advanced" },
                  ]}
                />
                <SelectField
                  id="fitnessGoal"
                  label="Fitness Goal"
                  value={userPreferences.fitnessGoal}
                  onChange={(value: any) =>
                    handlePreferenceChange("fitnessGoal", value)
                  }
                  options={[
                    { value: "build-muscle", label: "Build Muscle" },
                    { value: "lose-weight", label: "Lose Weight" },
                    { value: "flexibility", label: "Flexibility" },
                    { value: "endurance", label: "Endurance" }
                  ]}
                  
                />
                <SelectField
                  id="dietaryRestrictions"
                  label="Dietary Restrictions"
                  value={userPreferences.dietaryRestrictions[0]}
                  onChange={(value: any) =>
                    handlePreferenceChange("dietaryRestrictions", [value])
                  }
                  options={[
                    { value: "none", label: "None" },
                    { value: "vegetarian", label: "Vegetarian" },
                    { value: "vegan", label: "Vegan" },
                  ]}
                />
                <SelectField
                  id="workoutDuration"
                  label="Workout Duration (minutes)"
                  value={userPreferences.workoutDuration}
                  onChange={(value: any) =>
                    handlePreferenceChange("workoutDuration", Number(value))
                  }
                  options={[
                    { value: 30, label: "30 minutes" },
                    { value: 45, label: "45 minutes" },
                    { value: 60, label: "60 minutes" },
                  ]}
                />
                <TextAreaField
                  id="additionalNotes"
                  label="Additional Notes"
                  value={userPreferences.additionalNotes}
                  onChange={(value: any) =>
                    handlePreferenceChange("additionalNotes", value)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    );
  }
);

// Memoized Input Field Component
interface InputFieldProps {
  label: string;
  id: string;
  type: string;
  value: string | number;
  onChange: (value: string | number) => void;
}

const InputField = memo(
  ({ label, id, type, value, onChange }: InputFieldProps) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium mb-2">
        {label}
      </label>
      <input
        id={id}
        type={type}
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
);

// Memoized Select Field Component
interface SelectFieldProps {
  label: string;
  id: string;
  value: string | number;
  onChange: (value: string | number) => void;
  options: { value: string | number; label: string }[];
}

const SelectField = memo(
  ({ label, id, value, onChange, options }: SelectFieldProps) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium mb-2">
        {label}
      </label>
      <select
        id={id}
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
);

// Memoized Text Area Component
interface TextAreaFieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
}

const TextAreaField = memo(
  ({ label, id, value, onChange }: TextAreaFieldProps) => (
    <div className="col-span-2">
      <label htmlFor={id} className="block text-sm font-medium mb-2">
        {label}
      </label>
      <textarea
        id={id}
        className="w-full p-2 border rounded-md min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
);
