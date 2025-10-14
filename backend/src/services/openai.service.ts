import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateFlashcards = async (content: string, count: number = 10) => {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful study assistant that generates flashcards from study materials. Generate flashcards in JSON format with "question" and "answer" fields.',
      },
      {
        role: 'user',
        content: `Generate ${count} flashcards from the following study material:\n\n${content}\n\nReturn only a JSON array of flashcards with this format: [{"question": "...", "answer": "..."}]`,
      },
    ],
    temperature: 0.7,
  });

  const flashcardsText = response.choices[0].message.content || '[]';
  return JSON.parse(flashcardsText);
};

export const generateQuiz = async (content: string, numQuestions: number = 5) => {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful study assistant that generates multiple-choice quiz questions from study materials. Generate questions in JSON format.',
      },
      {
        role: 'user',
        content: `Generate ${numQuestions} multiple-choice questions from the following material:\n\n${content}\n\nReturn only a JSON array with this format: [{"question": "...", "options": ["A", "B", "C", "D"], "correctAnswer": "A", "explanation": "..."}]`,
      },
    ],
    temperature: 0.7,
  });

  const quizText = response.choices[0].message.content || '[]';
  return JSON.parse(quizText);
};

export const explainConcept = async (concept: string, level: string = 'simple') => {
  const response = await openai.chat.completions.create({
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
  const response = await openai.chat.completions.create({
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

  const response = await openai.chat.completions.create({
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
  const response = await openai.chat.completions.create({
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
