import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "2mb" }));

// Gemini client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ---------------------------------------
// BASIC HEALTH CHECK
// ---------------------------------------
app.get("/", (req, res) => {
  res.json({
    message: "CareerX AI backend is running",
  });
});

// ---------------------------------------
// GEMINI CONNECTION TEST
// ---------------------------------------
app.get("/api/test-ai", async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        error: "GEMINI_API_KEY is missing from .env",
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents:
        "Reply with exactly: CareerX Gemini connection successful",
    });

    res.json({
      success: true,
      message: response.text,
    });
  } catch (error) {
    console.error("Gemini test error:", error);

    res.status(500).json({
      success: false,
      error: error.message || "Gemini request failed",
    });
  }
});

// ---------------------------------------
// RESUME ANALYSIS
// ---------------------------------------
app.post("/api/analyze-resume", async (req, res) => {
  try {
    const { resumeText } = req.body;

    // Validate resume text
    if (!resumeText || !resumeText.trim()) {
      return res.status(400).json({
        success: false,
        error: "Resume text is required.",
      });
    }

    // Validate Gemini key
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        error: "GEMINI_API_KEY is missing from .env",
      });
    }

    console.log(
      `Analyzing resume (${resumeText.length} characters)...`
    );

    // Models are attempted in order.
    // The first available model that succeeds is used.
    const models = [
      "gemini-3.6-flash",
      "gemini-3.7-flash",
      "gemini-2.5-flash",
      "gemini-2.5-flash-lite",
    ];

    let response = null;
    let lastError = null;

    const prompt = `
You are CareerX AI, an intelligent career guidance assistant
for students and early-career professionals.

Your task is to carefully analyze the supplied resume and
produce a structured career intelligence report.

IMPORTANT:
- Return ONLY valid JSON.
- Do NOT return markdown.
- Do NOT use triple backticks.
- Do NOT add commentary before or after the JSON.
- Do not invent information not supported by the resume.
- Keep recommendations realistic and evidence-based.

Return exactly this structure:

{
  "profileSummary": "",
  "technicalSkills": [],
  "softSkills": [],
  "projects": [],
  "experience": [],
  "education": [],
  "careerMatches": [
    {
      "career": "",
      "match": 0,
      "reason": ""
    }
  ],
  "skillGaps": [
    {
      "skill": "",
      "priority": "High",
      "reason": ""
    }
  ],
  "jobReadiness": 0,
  "roadmap": [
    {
      "phase": "",
      "title": "",
      "duration": "",
      "skills": []
    }
  ],
  "strengths": [],
  "improvements": []
}

RULES:

1. jobReadiness must be an integer from 0 to 100.

2. careerMatches.match must be an integer from 0 to 100.

3. Return up to 5 career matches.

4. Return up to 8 important skill gaps.

5. Return up to 6 roadmap phases.

6. Base the analysis only on information supported by the resume.

7. Do not invent degrees, employers, certifications, projects,
   achievements, or skills.

8. Technical skills should contain technologies, programming
   languages, frameworks, tools, databases, APIs, platforms,
   and other technical competencies explicitly supported by
   the resume.

9. Soft skills should contain interpersonal or professional
   abilities explicitly supported by the resume.

10. Projects should contain the projects mentioned in the resume.

11. Experience should contain jobs, internships, or professional
    experience mentioned in the resume.

12. Education should contain degrees, institutions, dates,
    and other educational information supported by the resume.

13. Career recommendations should consider the candidate's
    actual skills, projects, education, and experience.

14. Skill gaps should focus on skills that would materially improve
    readiness for the strongest recommended career.

15. The roadmap should be actionable and ordered from fundamentals
    toward job readiness.

16. Do not exaggerate the candidate's readiness.

RESUME:

${resumeText}
`;

    // ---------------------------------------
    // TRY GEMINI MODELS
    // ---------------------------------------
    for (const modelName of models) {
      try {
        console.log(`Trying Gemini model: ${modelName}`);

        response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
        });

        console.log(
          `Gemini model succeeded: ${modelName}`
        );

        break;
      } catch (error) {
        lastError = error;

        console.error(
          `Gemini model failed: ${modelName}`
        );

        console.error(error.message);
      }
    }

    // No model succeeded
    if (!response) {
      return res.status(503).json({
        success: false,
        error:
          lastError?.message ||
          "All Gemini models are currently unavailable.",
      });
    }

    // ---------------------------------------
    // CLEAN GEMINI RESPONSE
    // ---------------------------------------
    const rawText = response.text.trim();

    console.log("Gemini response received.");

    let cleanText = rawText;

    // Remove accidental markdown fences
    if (cleanText.startsWith("```")) {
      cleanText = cleanText
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();
    }

    // ---------------------------------------
    // PARSE JSON
    // ---------------------------------------
    let analysis;

    try {
      analysis = JSON.parse(cleanText);
    } catch (parseError) {
      console.error(
        "Failed to parse Gemini JSON."
      );

      console.error("Raw Gemini response:");
      console.error(cleanText);

      return res.status(500).json({
        success: false,
        error:
          "Gemini returned an invalid analysis format.",
      });
    }

    // ---------------------------------------
    // RETURN ANALYSIS
    // ---------------------------------------
    res.json({
      success: true,
      analysis,
    });

  } catch (error) {
    console.error(
      "Resume analysis error:",
      error
    );

    res.status(500).json({
      success: false,
      error:
        error.message ||
        "Failed to analyze resume.",
    });
  }
});
// ---------------------------------------
// MOCK INTERVIEW - GENERATE QUESTION
// ---------------------------------------
app.post("/api/mock-interview/question", async (req, res) => {
  try {
    const {
      career,
      skills,
      questionNumber,
    } = req.body;

    if (!career) {
      return res.status(400).json({
        success: false,
        error: "Career is required.",
      });
    }

    const skillList = Array.isArray(skills)
      ? skills.join(", ")
      : "";

    const prompt = `
You are CareerX AI, an expert technical and HR interviewer.

Generate ONE realistic interview question for a candidate
preparing for this career:

TARGET CAREER:
${career}

CANDIDATE SKILLS:
${skillList}

QUESTION NUMBER:
${questionNumber || 1}

Requirements:
- Adapt the question to the target career.
- Consider the candidate's listed skills.
- Mix technical, behavioral, and situational questions.
- Make the difficulty appropriate for a student or early-career candidate.
- Do not repeat generic questions unnecessarily.
- Return ONLY the question.
- Do not use markdown.
- Do not add explanations.
`;

    const models = [
      "gemini-3.6-flash",
      "gemini-3.7-flash",
      "gemini-2.5-flash",
      "gemini-2.5-flash-lite",
    ];

    let response = null;
    let lastError = null;

    for (const modelName of models) {
      try {
        console.log(
          `Mock interview question: trying ${modelName}`
        );

        response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
        });

        break;
      } catch (error) {
        lastError = error;

        console.error(
          `Mock interview question failed with ${modelName}:`,
          error.message
        );
      }
    }

    if (!response) {
      return res.status(503).json({
        success: false,
        error:
          lastError?.message ||
          "All Gemini models are unavailable.",
      });
    }

    const question = response.text.trim();

    res.json({
      success: true,
      question,
    });
  } catch (error) {
    console.error(
      "Mock interview question error:",
      error
    );

    res.status(500).json({
      success: false,
      error:
        error.message ||
        "Failed to generate interview question.",
    });
  }
});

// ---------------------------------------
// MOCK INTERVIEW - EVALUATE ANSWER
// ---------------------------------------
app.post("/api/mock-interview/evaluate", async (req, res) => {
  try {
    const {
      career,
      question,
      answer,
    } = req.body;

    if (!career || !question || !answer?.trim()) {
      return res.status(400).json({
        success: false,
        error:
          "Career, question and answer are required.",
      });
    }

    const prompt = `
You are CareerX AI, an expert interview evaluator.

Evaluate the candidate's answer to the following interview question.

TARGET CAREER:
${career}

QUESTION:
${question}

CANDIDATE ANSWER:
${answer}

Return ONLY valid JSON in exactly this structure:

{
  "score": 0,
  "strengths": [],
  "improvements": [],
  "modelAnswer": ""
}

Rules:

1. score must be an integer from 0 to 100.
2. strengths must contain 2 to 4 concise points.
3. improvements must contain 2 to 4 concise points.
4. modelAnswer should be a realistic, strong example answer.
5. Evaluate relevance, technical correctness, clarity,
   structure, confidence, and completeness.
6. Do not punish the candidate for using simple language.
7. Do not invent facts about the candidate.
8. Keep feedback constructive and useful.
9. Return JSON only.
10. Do not use markdown or code fences.
`;

    const models = [
      "gemini-3.6-flash",
      "gemini-3.7-flash",
      "gemini-2.5-flash",
      "gemini-2.5-flash-lite",
    ];

    let response = null;
    let lastError = null;

    for (const modelName of models) {
      try {
        console.log(
          `Mock interview evaluation: trying ${modelName}`
        );

        response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
        });

        break;
      } catch (error) {
        lastError = error;

        console.error(
          `Mock interview evaluation failed with ${modelName}:`,
          error.message
        );
      }
    }

    if (!response) {
      return res.status(503).json({
        success: false,
        error:
          lastError?.message ||
          "All Gemini models are unavailable.",
      });
    }

    let cleanText = response.text.trim();

    if (cleanText.startsWith("```")) {
      cleanText = cleanText
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();
    }

    let feedback;

    try {
      feedback = JSON.parse(cleanText);
    } catch (parseError) {
      console.error(
        "Mock interview JSON parsing failed:"
      );

      console.error(cleanText);

      return res.status(500).json({
        success: false,
        error:
          "Gemini returned an invalid interview evaluation.",
      });
    }

    res.json({
      success: true,
      feedback,
    });
  } catch (error) {
    console.error(
      "Mock interview evaluation error:",
      error
    );

    res.status(500).json({
      success: false,
      error:
        error.message ||
        "Failed to evaluate interview answer.",
    });
  }
});
// ---------------------------------------
// START SERVER
// ---------------------------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `CareerX backend running on http://localhost:${PORT}`
  );
});