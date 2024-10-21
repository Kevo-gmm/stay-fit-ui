"use client";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { WorkoutData, WorkoutPlanDashboard } from "../WorkoutPlanDashboard";
import { Separator } from "@/components/ui/separator";

export default function History() {
  const [workoutPlans, setWorkoutPlans] = useState<Array<WorkoutData>>([]);

  useEffect(() => {
    // Load workout plans from local storage on initial render
    const plans = JSON.parse(localStorage.getItem("workoutPlans") || "[]") || [];
    setWorkoutPlans(plans);
  }, []);

  // Function to clear workout history
  const clearHistory = () => {
    if (window.confirm("Are you sure you want to clear the history?")) {
      localStorage.removeItem("workoutPlans"); // Clear the local storage
      setWorkoutPlans([]); // Update the state to reflect the cleared history
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 mt-4">
        <h1 className="text-6xl mb-4">History</h1>
        <div className="flex items-center mb-4">
          <button
            className="bg-red-500 text-white py-2 px-4 rounded flex items-center"
            onClick={clearHistory}
          >
            <FontAwesomeIcon icon={faTrash} className="mr-2" />
            Clear History
          </button>
        </div>
        <div>
          {workoutPlans.length === 0 ? (
            <p>No workout plans found.</p>
          ) : (
            workoutPlans.map((workoutPlan, index) => (
              <div key={index}>
                <h2 className="text-4xl mb-4">Workout Plan {index + 1}</h2>
                <WorkoutPlanDashboard workoutData={workoutPlan} />
                {index < workoutPlans.length - 1 && (
                  <Separator className="my-10" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
