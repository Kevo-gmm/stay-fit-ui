import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Dumbbell, Heart, Utensils, Battery, LineChart, Apple, Star } from "lucide-react"; // Added Star for rating
import { cn } from "@/lib/utils";

export interface WorkoutData {
  workoutPlan: {
    workoutSchedule: {
      workoutsPerWeek: number;
      workoutDuration: number;
      workouts: {
        day: string;
        exercise: {
          name: string;
          type: string;
          duration?: number;
          reps?: number;
          sets?: number;
          intensity: string;
        }[];
      }[];
    };
    tips: {
      motivation: string[];
      diet: string[];
      recovery: string[];
      trackingProgress: string[];
      nutrition: {
        mealsPerDay: number;
        suggestedMeals: {
          meal: string;
          description: string;
          calories: number;
        }[];
      };
    };
  };
}

interface Exercise {
  name: string;
  type: string;
  duration?: number;
  reps?: number;
  sets?: number;
  intensity: string;
}

const ExerciseCard = ({ exercise }: { exercise: Exercise }) => (
  <Card className="mb-2">
    <CardContent className="p-4">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="font-semibold">{exercise.name}</h4>
          <p className="text-sm text-gray-500">{exercise.type}</p>
        </div>
        <div className="text-right">
          {exercise.sets && exercise.reps && (
            <p className="text-sm">
              {exercise.sets} sets × {exercise.reps} reps
            </p>
          )}
          {exercise.duration && (
            <p className="text-sm">{exercise.duration} minutes</p>
          )}
          <p className="text-sm text-gray-500">{exercise.intensity}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const TipsList = ({ tips }: { tips: string[] }) => (
  <ul className="list-disc pl-5 space-y-2">
    {tips.map((tip, index) => (
      <li key={index} className="text-sm">
        {tip}
      </li>
    ))}
  </ul>
);

const MealCard = ({ meal }: { meal: { meal: string; description: string; calories: number } }) => (
  <Card className="mb-2">
    <CardContent className="p-4">
      <h4 className="font-semibold">{meal.meal}</h4>
      <p className="text-sm text-gray-500">{meal.description}</p>
      <p className="text-sm text-gray-500">Calories: {meal.calories}</p>
    </CardContent>
  </Card>
);

// New component for user feedback
const FeedbackForm = ({ onSubmit }: { onSubmit: (feedback: string, rating: number) => void }) => {
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(feedback, rating);
    setFeedback("");
    setRating(0);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex items-center">
        <label className="mr-2">Rate this workout:</label>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`cursor-pointer ${star <= rating ? "text-yellow-500" : "text-gray-400"}`}
            onClick={() => setRating(star)}
          />
        ))}
      </div>
      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Provide your feedback here..."
        className="mt-2 w-full p-2 border rounded"
      />
      <button type="submit" className="mt-2 bg-blue-500 text-white p-2 rounded">
        Submit Feedback
      </button>
    </form>
  );
};

export function WorkoutPlanDashboard({ workoutData }: { workoutData: WorkoutData }) {
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [feedbacks, setFeedbacks] = useState<{ feedback: string; rating: number }[]>([]); // Store feedbacks

  const handleFeedbackSubmit = (feedback: string, rating: number) => {
    setFeedbacks((prev) => [...prev, { feedback, rating }]);
    // Here, you might also want to send feedback to a backend or an API
    console.log("Feedback submitted:", feedback, rating);
  };

  return (
    <div className="mx-auto">
      <h1 className="text-3xl font-bold mb-6">Personalized Workout Plan</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2" /> Weekly Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2">
              Workouts per week: {workoutData.workoutPlan.workoutSchedule.workoutsPerWeek}
            </p>
            <p>Workout duration: {workoutData.workoutPlan.workoutSchedule.workoutDuration} minutes</p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Daily Workouts</h2>
        <Tabs defaultValue={selectedDay} onValueChange={setSelectedDay}>
          <TabsList
            className={cn(
              "grid grid-cols-2 md:mb-0",
              `mb-${workoutData.workoutPlan.workoutSchedule.workouts.length * 2}`,
              `md:grid-cols-${workoutData.workoutPlan.workoutSchedule.workouts.length}`
            )}
          >
            {workoutData.workoutPlan.workoutSchedule.workouts.map((workout) => (
              <TabsTrigger key={workout.day} value={workout.day}>
                {workout.day}
              </TabsTrigger>
            ))}
          </TabsList>
          {workoutData.workoutPlan.workoutSchedule.workouts.map((workout) => (
            <TabsContent key={workout.day} value={workout.day}>
              <div className="space-y-2">
                {workout.exercise.map((ex, index) => (
                  <ExerciseCard key={index} exercise={ex} />
                ))}
                {/* Feedback Form for the specific day's workout */}
                <FeedbackForm onSubmit={handleFeedbackSubmit} />
                {/* Display submitted feedbacks */}
                {feedbacks.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-semibold">User Feedback:</h3>
                    <ul className="list-disc pl-5">
                      {feedbacks.map((fb, index) => (
                        <li key={index}>
                          {fb.rating} stars: {fb.feedback}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="mr-2" /> Motivation Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TipsList tips={workoutData.workoutPlan.tips.motivation} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Utensils className="mr-2" /> Diet Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TipsList tips={workoutData.workoutPlan.tips.diet} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Battery className="mr-2" /> Recovery Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TipsList tips={workoutData.workoutPlan.tips.recovery} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <LineChart className="mr-2" /> Progress Tracking Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TipsList tips={workoutData.workoutPlan.tips.trackingProgress} />
          </CardContent>
        </Card>
        {/* New Recommended Sports Section */}
        <Card>
  <CardHeader>
    <CardTitle className="flex items-center">
      <Dumbbell className="mr-2" /> Recommended Sports
    </CardTitle>
  </CardHeader>
  <CardContent>
    {workoutData.workoutPlan.tips.recommendedSports && workoutData.workoutPlan.tips.recommendedSports.length > 0 ? (
      <ul className="list-disc pl-5">
        {workoutData.workoutPlan.tips.recommendedSports.map((sport, index) => (
          <li key={index} className="text-sm">{sport}</li>
        ))}
      </ul>
    ) : (
      <p>No sports recommendations available.</p>
    )}
  </CardContent>
</Card>

        {/* New Nutritional Advice Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Utensils className="mr-2" /> Nutrition Advice
            </CardTitle>
          </CardHeader>
          <CardContent>
            {workoutData.workoutPlan.tips.nutrition ? (
              <>
                <p className="mb-2">
                  Meals per day: {workoutData.workoutPlan.tips.nutrition.mealsPerDay}
                </p>
                {workoutData.workoutPlan.tips.nutrition.suggestedMeals.map((meal, index) => (
                  <div key={index}>
                    <h4 className="font-semibold">{meal.meal}</h4>
                    <p>{meal.description}</p>
                    <p>{meal.calories} calories</p>
                  </div>
                ))}
              </>
            ) : (
              <p>No nutrition advice available.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
