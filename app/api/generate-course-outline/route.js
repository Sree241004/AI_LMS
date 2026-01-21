import { model, generationConfig } from "../../../configs/AiModel";
import { auth } from "@clerk/nextjs/server";

export async function POST(req) {
  try {
    const { userId } = auth();

    if (!userId) {
      return Response.json({ error: "User not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    console.log("📩 Received Body:", body);

    const { topic, courseType, difficultyLevel, createdBy, courseId } = body;

    if (!topic || !courseType || !difficultyLevel) {
      return Response.json(
        { error: "Missing topic, courseType, or difficultyLevel" },
        { status: 400 }
      );
    }

    const prompt = `
Generate a course outline in JSON format.

Topic: ${topic}
Course Type: ${courseType}
Difficulty: ${difficultyLevel}

Return JSON with:
- summary
- chapters (array)

Each chapter must include:
- chapterTitle
- chapterSummary
- emoji
- topics (array of strings)

Output only valid JSON.
`;

    const result = await model.generateContent(prompt, generationConfig);
    const text = result.response.text();

    console.log("✅ Gemini Response:", text);

    return Response.json({ result: text });

  } catch (error) {
    console.error("❌ Gemini Error:", error);
    return Response.json(
      { error: "Failed to generate course outline" },
      { status: 500 }
    );
  }
}
