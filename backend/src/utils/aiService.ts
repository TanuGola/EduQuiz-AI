import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI("AIzaSyCcNnSfyPmeQkd3NMd9euRjvrso5XYfxeo");

export interface GeneratedQuestion {
  questionText: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export async function generateQuestionsFromText(text: string, category: string, count: number = 10): Promise<GeneratedQuestion[]> {
  const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-flash' });

  const prompt = `You are an expert quiz question generator. Based on the following text, generate exactly ${count} multiple-choice questions.

TEXT:
${text.substring(0, 4000)}

REQUIREMENTS:
- Generate exactly ${count} questions
- Each question must have exactly 4 options
- One option must be correct, three must be plausible but incorrect distractors
- Include a brief explanation (max 30 words) for each correct answer
- Category: ${category}

Return ONLY a valid JSON array with this exact structure (no markdown, no extra text):
[
  {
    "questionText": "Question here?",
    "correctAnswer": "The correct answer",
    "option2": "Incorrect option 1",
    "option3": "Incorrect option 2",
    "option4": "Incorrect option 3",
    "explanation": "Brief explanation here"
  }
]`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let responseText = response.text();

    
    // Clean up response
    responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const questionsData = JSON.parse(responseText);
    
    return questionsData.map((q: any) => {
      const options = [q.correctAnswer, q.option2, q.option3, q.option4];
      const correctIndex = 0;
      
      // Shuffle options
      for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
      }
      
      const newCorrectIndex = options.indexOf(q.correctAnswer);
      
      return {
        questionText: q.questionText,
        options,
        correctIndex: newCorrectIndex,
        explanation: q.explanation || ''
      };
    });
  } catch (error) {
    console.error('AI generation error:', error);
    throw new Error('Failed to generate questions');
  }
}
