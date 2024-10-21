"use client";
import PopupChat from "@/components/popup-chat";
import { ModeToggle } from "@/components/theme-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import withAuth from "@/middleware/auth";
import { Bell, Dumbbell, History, Settings, Trophy, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { PersonalizationSection } from "./PersonalizationSection";
import { WorkoutData, WorkoutPlanDashboard } from "./WorkoutPlanDashboard";

export default withAuth(function FitnessApp() {
  const [showNotification, setShowNotification] = useState(false);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutData>();

  return (
    <>
      <header className="shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Dumbbell className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold">Stay Fit AI</h1>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/history">
              <History className="h-6 w-6 text-gray-600" />
            </Link>
            <ModeToggle />
            <Bell className="h-6 w-6 text-gray-600" />
            <User className="h-6 w-6 text-gray-600" />
            <Settings className="h-6 w-6 text-gray-600" />
          </div>
        </div>
      </header>
      <div className="min-h-screen">
        <PopupChat />
        {showNotification && (
          <div className="max-w-7xl mx-auto px-4 mt-4">
            <Alert>
              <Trophy className="h-4 w-4" />
              <AlertTitle>Preferences Saved!</AlertTitle>
              <AlertDescription>Your personalized fitness and nutrition plan has been updated successfully.</AlertDescription>
            </Alert>
          </div>
        )}

        <main className="max-w-7xl mx-auto px-4 py-8">
          <PersonalizationSection setWorkoutData={setWorkoutPlan} />
          <div>{workoutPlan && <WorkoutPlanDashboard workoutData={workoutPlan} />}</div>
        </main>
      </div>
    </>
  );
});
