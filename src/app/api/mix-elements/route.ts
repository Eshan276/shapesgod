import { NextResponse } from "next/server";
import { OpenAI } from "openai";

// Initialize the OpenAI client with Shapes API
const shapesClient = new OpenAI({
  apiKey: process.env.SHAPES_API_KEY || "",
  baseURL: "https://api.shapes.inc/v1",
});

export async function POST(request: Request) {
  try {
    // Parse the request body
    const { element1, element2 } = await request.json();

    // Validate inputs
    if (!element1 || !element2) {
      return NextResponse.json(
        { error: "Both elements are required" },
        { status: 400 }
      );
    }

    // Call the Shapes API
    const response = await shapesClient.chat.completions.create({
      model: "shapesinc/elementcreator",
      messages: [
        {
          role: "system",
          content: `You are a creative fusion agent. Your task is to take two input objects or elements and generate:
1. A "mix" — a creative or logical combination of the two inputs.
2. A single emoji that represents this fusion.

Always respond strictly in the following JSON format:
{
  "input_1": "<first input>",
  "input_2": "<second input>",
  "mix": "<a short, imaginative or accurate fusion of both inputs>",
  "emoji": "<a single emoji that represents the mix>"
}

Be creative but coherent. The mix should make intuitive or symbolic sense based on the inputs, and the named should be at most "two words". The emoji must be relevant to the mix.`,
        },
        {
          role: "user",
          content: `${element1} and ${element2}`,
        },
      ],
    });

    const mixContent = response.choices[0].message.content;

    if (!mixContent) {
      return NextResponse.json(
        { error: "Failed to generate mix" },
        { status: 500 }
      );
    }

    try {
      // Parse the JSON response
      const mixData = JSON.parse(mixContent);

      // Return the mix result
      return NextResponse.json({
        result: mixData.emoji,
        description: `${element1} + ${element2} = ${mixData.mix}`,
      });
    } catch (error) {
      console.error("Error parsing API response:", error);
      return NextResponse.json(
        { error: "Invalid response format" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to process element combination" },
      { status: 500 }
    );
  }
}
