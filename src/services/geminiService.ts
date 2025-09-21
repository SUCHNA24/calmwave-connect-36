const GEMINI_API_KEY = 'AIzaSyAi4DcqEzgqOvGd6yA5oQLfgrBNjwPF-gM';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export interface GeminiMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface GeminiResponse {
  candidates: {
    content: {
      parts: { text: string }[];
    };
  }[];
}

export class GeminiService {
  private static instance: GeminiService;
  private apiKey: string;

  private constructor() {
    this.apiKey = GEMINI_API_KEY;
  }

  public static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  async generateResponse(messages: GeminiMessage[]): Promise<string> {
    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: messages.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: msg.parts
          })),
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }

      const data: GeminiResponse = await response.json();
      
      if (data.candidates && data.candidates.length > 0) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('No response generated from Gemini API');
      }
    } catch (error) {
      console.error('Gemini API error:', error);
      throw error;
    }
  }

  async generateMentalHealthResponse(userMessage: string, context?: string): Promise<string> {
    const systemPrompt = `You are a compassionate and culturally-aware mental health AI assistant designed specifically for Indian youth. Your role is to provide supportive, non-judgmental, and helpful responses while being mindful of cultural sensitivities.

Key guidelines:
- Be empathetic and understanding
- Use both English and Hindi when appropriate
- Be culturally sensitive to Indian family dynamics, academic pressure, and social expectations
- Provide practical, actionable advice
- Never provide medical diagnosis or replace professional therapy
- Encourage seeking professional help when needed
- Be supportive of mental health awareness and reduce stigma
- Use a warm, friendly tone with appropriate emojis

Context: ${context || 'General mental health support'}

User message: ${userMessage}`;

    const messages: GeminiMessage[] = [
      {
        role: 'user',
        parts: [{ text: systemPrompt }]
      }
    ];

    return this.generateResponse(messages);
  }

  async generateCrisisResponse(userMessage: string): Promise<string> {
    const crisisPrompt = `You are a crisis support AI assistant. The user may be experiencing a mental health crisis. Respond with:

1. Immediate validation and support
2. Safety assessment
3. Crisis resources (Indian helplines)
4. Encouragement to seek immediate help
5. Grounding techniques if appropriate

Be extremely supportive, non-judgmental, and prioritize safety. Always encourage contacting emergency services or crisis helplines.

User message: ${userMessage}`;

    const messages: GeminiMessage[] = [
      {
        role: 'user',
        parts: [{ text: crisisPrompt }]
      }
    ];

    return this.generateResponse(messages);
  }

  async generateMoodInsights(moodData: any[]): Promise<string> {
    const insightsPrompt = `Analyze this mood tracking data and provide insights:

Mood Data: ${JSON.stringify(moodData, null, 2)}

Provide:
1. Patterns you notice
2. Positive trends
3. Areas of concern
4. Suggestions for improvement
5. Encouragement and support

Be supportive, culturally aware, and helpful. Use both English and Hindi.`;

    const messages: GeminiMessage[] = [
      {
        role: 'user',
        parts: [{ text: insightsPrompt }]
      }
    ];

    return this.generateResponse(messages);
  }
}

export const geminiService = GeminiService.getInstance();
