import { VoiceInputResult } from "../types";

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY!;

/**
 * Uses the latest OpenAI API to split natural language input into tasks.
 * Now uses the `/v1/responses` endpoint (2025 standard)
 */
export const splitTasksFromTranscription = async (
  transcription: string
): Promise<string[]> => {
  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: [
          {
            role: "system",
            content: `You extract tasks from natural language. 
Return ONLY a valid JSON array of very short, actionable tasks.

Examples:

Input: "Buy milk and call mom"
Output: ["Buy milk", "Call mom"]

Input: "Finish report, send email to team, book flight"
Output: ["Finish report", "Send email to team", "Book flight"]

Return nothing except a JSON array.`
          },
          {
            role: "user",
            content: transcription,
          },
        ],
        temperature: 0.2,
      }),
    });

    const data = await response.json();
    const text = data.output_text;

    if (!text) return fallbackSplitTasks(transcription);

    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      console.warn("AI returned non-JSON, using fallback.");
    }

    return fallbackSplitTasks(transcription);
  } catch (err) {
    console.error("OpenAI error:", err);
    return fallbackSplitTasks(transcription);
  }
};

/**
 * Fallback string splitter when AI is unavailable
 */
const fallbackSplitTasks = (text: string): string[] => {
  text = text.replace(/^(i need to|i have to|i must|i should|todo:|task:)/gi, "").trim();

  const separators = /\s+and\s+|\s*,\s*|\s+then\s+|\s*;\s*/gi;

  const tasks = text
    .split(separators)
    .map(t => t.trim())
    .filter(Boolean)
    .map(t => t.charAt(0).toUpperCase() + t.slice(1));

  return tasks.length > 0 ? tasks : [text];
};

/**
 * Whisper speech-to-text using OpenAI's new model (2025 standard)
 */
export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("file", audioBlob);
    formData.append("model", "gpt-4o-transcribe");

    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: formData,
    });

    const json = await response.json();
    return json.text ?? "";
  } catch (error) {
    console.error("Transcription failed:", error);
    throw new Error("Failed to transcribe audio.");
  }
};

/**
 * End-to-end processing of voice → transcription → tasks
 */
export const processVoiceInput = async (
  transcription: string
): Promise<VoiceInputResult> => {
  const tasks = await splitTasksFromTranscription(transcription);

  return {
    transcription,
    tasks,
  };
};
