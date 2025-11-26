import OpenAI from 'openai';

let openai: OpenAI;

const getOpenAI = () => {
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'sk-placeholder',
    });
  }
  return openai;
};

export const generateFlashcards = async (content: string, count: number = 10) => {
  const response = await getOpenAI().chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are an expert educational content creator specializing in creating effective study flashcards.
Your flashcards should:
- Focus on key concepts and important facts
- Ask clear, specific questions
- Provide concise, accurate answers
- Cover different aspects of the material (definitions, examples, applications, comparisons)
- Be appropriate for active recall practice
Return ONLY valid JSON, no additional text.`,
      },
      {
        role: 'user',
        content: `Generate exactly ${count} high-quality flashcards from the following study material:

${content}

Return ONLY a JSON array in this exact format:
[{"question": "What is...?", "answer": "..."}]

Make sure to:
1. Cover the most important concepts
2. Use clear, direct language
3. Vary question types (what, why, how, when, compare, etc.)`,
      },
    ],
    temperature: 0.7,
    response_format: { type: "json_object" },
  });

  const flashcardsText = response.choices[0].message.content || '{"flashcards":[]}';
  const parsed = JSON.parse(flashcardsText);
  return parsed.flashcards || parsed;
};

export const generateQuiz = async (content: string, numQuestions: number = 5) => {
  const response = await getOpenAI().chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are an expert educational assessment creator. Create high-quality multiple-choice questions that:
- Test true understanding, not just memorization
- Have 4 plausible options with only ONE clearly correct answer
- Include distractors that address common misconceptions
- Provide clear explanations for the correct answer
- Cover different cognitive levels (recall, understanding, application, analysis)
Return ONLY valid JSON, no additional text.`,
      },
      {
        role: 'user',
        content: `Generate exactly ${numQuestions} multiple-choice questions from this study material:

${content}

Return ONLY a JSON array in this exact format:
[{
  "question": "Clear, specific question?",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": "Option A",
  "explanation": "Why this answer is correct and others are wrong"
}]

Requirements:
1. Make questions challenging but fair
2. Ensure options are all plausible
3. Provide detailed explanations
4. Test different aspects of the material`,
      },
    ],
    temperature: 0.7,
    response_format: { type: "json_object" },
  });

  const quizText = response.choices[0].message.content || '{"questions":[]}';
  const parsed = JSON.parse(quizText);
  return parsed.questions || parsed;
};

export const explainConcept = async (concept: string, level: string = 'simple') => {
  const response = await getOpenAI().chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a helpful tutor that explains concepts in a ${level} way.`,
      },
      {
        role: 'user',
        content: `Explain this concept: ${concept}`,
      },
    ],
    temperature: 0.7,
  });

  return response.choices[0].message.content;
};

export const generatePracticeProblems = async (topic: string, count: number = 5, difficulty: string = 'medium') => {
  const response = await getOpenAI().chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a helpful study assistant that generates practice problems. Generate ${difficulty} difficulty problems with solutions.`,
      },
      {
        role: 'user',
        content: `Generate ${count} ${difficulty} difficulty practice problems about: ${topic}\n\nReturn only a JSON array with this format: [{"problem": "...", "solution": "...", "hints": ["hint1", "hint2"]}]`,
      },
    ],
    temperature: 0.7,
  });

  const problemsText = response.choices[0].message.content || '[]';
  return JSON.parse(problemsText);
};

export const provideEssayFeedback = async (essay: string, rubric?: string) => {
  const rubricText = rubric ? `\n\nGrading Rubric:\n${rubric}` : '';

  const response = await getOpenAI().chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful writing tutor that provides constructive feedback on essays.',
      },
      {
        role: 'user',
        content: `Please provide detailed feedback on this essay:${rubricText}\n\nEssay:\n${essay}\n\nProvide feedback in JSON format with: {"overallScore": 0-100, "strengths": [], "improvements": [], "grammar": [], "detailedFeedback": "..."}`,
      },
    ],
    temperature: 0.7,
  });

  const feedbackText = response.choices[0].message.content || '{}';
  return JSON.parse(feedbackText);
};

export const summarizeText = async (text: string, maxLength: number = 200) => {
  const response = await getOpenAI().chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a helpful assistant that summarizes text concisely in about ${maxLength} words.`,
      },
      {
        role: 'user',
        content: `Summarize the following text:\n\n${text}`,
      },
    ],
    temperature: 0.5,
  });

  return response.choices[0].message.content;
};
