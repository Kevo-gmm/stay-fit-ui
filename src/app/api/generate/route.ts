import { CohereClientV2 } from "cohere-ai";
import { GoogleGenerativeAI } from "@google/generative-ai";

const cohere = new CohereClientV2({
  token: "uVcqFQfiNmx8ivy56RUZdQ2jOJkfxC5wDGAin9jV", // Example token, use your actual token here
});

const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_GEMINI_API_KEY as string // Use your actual Google Gemini API key here
);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: `
  Hi Gemini! I’d like your help with my fitness journey. I will provide the following details: 

  - Name
  - Age
  - Weight
  - Height
  - Ailments
  - Country
  - Fitness Level
  - Fitness Goal
  - Dietary Restrictions
  - Workout Duration
  - Workouts Per Week
  - Additional Notes

  Based on this information, can you suggest a personalized workout plan, including motivational tips, specific nutritional advice like meal recommendations, total calories, and recommended sports? 

  The response should follow this JSON schema:
  {
    "workoutPlan": {
      "workoutSchedule": {
        "workoutsPerWeek": "integer",
        "workoutDuration": "integer",
        "workouts": [
          {
            "day": "string",
            "exercise": [
              {
                "name": "string",
                "type": "string",
                "duration": "integer",
                "reps": "integer",
                "sets": "integer",
                "intensity": "string"
              }
            ]
          }
        ]
      },
      "tips": {
        "motivation": ["string"],
        "diet": ["string"],
        "recovery": ["string"],
        "trackingProgress": ["string"],
        "nutrition": {
          "mealsPerDay": "integer",
          "totalCalories": "integer", // New field for total calories
          "suggestedMeals": [
            {
              "meal": "string",
              "description": "string",
              "calories": "integer"
            }
          ]
        },
        "recommendedSports": ["string"] // New field for recommended sports
      }
    }
  }
  `,
});

export async function POST(request: Request) {
  // Extract user input from request
  const {
    name,
    age,
    weight,
    height,
    ailments,
    country,
    fitnessLevel,
    fitnessGoal,
    dietaryRestrictions,
    workoutDuration,
    workoutsPerWeek,
    additionalNotes,
  } = await request.json();

  try {
    // Construct the AI prompt based on user input
    const prompt = `
      I am ${name}, a ${age}-year-old ${fitnessLevel} person from ${country}. 
      I weigh ${weight} and stand ${height} tall. 
      I have ${ailments}. 
      My fitness goal is ${fitnessGoal}. 
      I workout ${workoutsPerWeek} times a week for ${workoutDuration} minutes per session.
      I have the following dietary restrictions: ${dietaryRestrictions}. 
      ${additionalNotes}.
      Can you suggest a workout plan, motivational tips, specific nutritional advice, such as meal recommendations, total calorie counts, and recommended sports?
    `;

    // Request the response from the AI model
    const result = await model.generateContent(prompt);

    // Return the AI-generated content in the response
    return new Response(result.response.text(), {
      status: 200,
    });
  } catch (error) {
    // Handle errors and send a failure response
    console.error(error);
    return new Response("Failed to generate the workout plan and nutritional advice!", {
      status: 500,
    });
  }
}
