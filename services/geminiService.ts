import { GoogleGenAI, Type, Schema } from "@google/genai";
import { StudentProject } from "../types";

const SYSTEM_INSTRUCTION = `
You are an AI Full-Stack Project Builder for Students.
Your task is to convert ANY project idea, even very simple ones (example: “Build a calculator”), into a MANDATORY FULL-STACK APPLICATION.

🚨 IMPORTANT RULE (NON-NEGOTIABLE):
Every project MUST include:
1. A Frontend (HTML/CSS/JS)
2. A Backend (Python Flask)
3. At least one REST API Endpoint

Even if the project logically does not require a backend (like a calculator), you MUST still create one for academic learning purposes. The calculation/logic MUST happen on the server.

🔹 FOLDER STRUCTURE REQUIREMENTS:
You must strictly follow this structure:
project_name/
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
└── backend/
    ├── app.py
    └── requirements.txt

🔹 CODE REQUIREMENTS:
- 'app.py' MUST contain a runnable Flask app with CORS enabled.
- 'script.js' MUST use \`fetch()\` to call the backend API.
- 'requirements.txt' MUST include \`flask\` and \`flask-cors\`.
- All code must be complete and copy-paste ready.

OUTPUT SECTIONS:
1. Project Title & Overview
2. Tech Stack (Fixed: HTML/CSS/JS + Python Flask)
3. Folder Structure
4. Files (Full content)
5. API Flow Explanation (Endpoints, Request/Response format)
6. How to Run (Step-by-step for both terminal and browser)
7. Logic Explanation
8. Viva Questions
9. Future Enhancements
`;

const projectSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    projectTitle: { type: Type.STRING },
    domain: { type: Type.STRING },
    techStack: { type: Type.STRING },
    folderStructure: { type: Type.STRING, description: "ASCII representation of folder structure with frontend and backend folders" },
    files: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          fileName: { type: Type.STRING, description: "Relative path, e.g., 'backend/app.py'" },
          code: { type: Type.STRING },
          language: { type: Type.STRING },
        },
        required: ["fileName", "code", "language"],
      },
    },
    apiFlowExplanation: { 
      type: Type.STRING, 
      description: "Explanation of the API endpoints created, request format, and response format." 
    },
    howToRun: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Step-by-step instructions on how to setup folders, install python requirements, run flask, and open frontend.",
    },
    conceptExplanation: { type: Type.STRING, description: "Why a backend is used and how data flows." },
    vivaQuestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          answer: { type: Type.STRING },
        },
        required: ["question", "answer"],
      },
    },
    futureEnhancements: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
  required: [
    "projectTitle",
    "domain",
    "techStack",
    "folderStructure",
    "files",
    "apiFlowExplanation",
    "howToRun",
    "conceptExplanation",
    "vivaQuestions",
    "futureEnhancements",
  ],
};

export const generateProject = async (userIdea: string): Promise<StudentProject> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [{ text: `Build a mandatory Full-Stack Python Flask project for: "${userIdea}"` }],
        },
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: projectSchema,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("The AI returned an empty response. Please try again.");
    }

    return JSON.parse(text) as StudentProject;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    let errorMessage = "Failed to generate project.";
    if (error.message) {
      if (error.message.includes("403")) errorMessage = "Access denied. Invalid API Key.";
      else if (error.message.includes("429")) errorMessage = "Too many requests. Please wait a moment.";
      else errorMessage = error.message;
    }
    throw new Error(errorMessage);
  }
};