import { VoiceInputResult } from "../types";

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY!;

/**
 * Uses OpenAI Chat Completions API to split natural language input into tasks.
 */
export const splitTasksFromTranscription = async (
  transcription: string
): Promise<string[]> => {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
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

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", errorText);
      return fallbackSplitTasks(transcription);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;

    if (!text) return fallbackSplitTasks(transcription);

    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (parseError) {
      console.warn("AI returned non-JSON, using fallback:", text);
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
  // Remove common task prefixes
  text = text.replace(/^(i need to|i have to|i must|i should|todo:|task:)/gi, "").trim();

  // Split on common separators
  const separators = /\s+and\s+|\s*,\s*|\s+then\s+|\s*;\s*/gi;

  const tasks = text
    .split(separators)
    .map(t => t.trim())
    .filter(Boolean)
    .map(t => t.charAt(0).toUpperCase() + t.slice(1));

  return tasks.length > 0 ? tasks : [text];
};

/**
 * Whisper speech-to-text using OpenAI's Whisper model
 */
export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', audioBlob as any, 'recording.m4a');
    formData.append('model', 'whisper-1'); // Correct Whisper model name

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`OpenAI error: ${response.status} - ${text}`);
    }

    const json = await response.json();
    return json.text ?? '';
  } catch (error) {
    console.error('Transcription failed:', error);
    throw new Error('Failed to transcribe audio.');
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