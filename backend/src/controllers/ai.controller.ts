import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as openaiService from '../services/openai.service';

export const explainConcept = async (req: AuthRequest, res: Response) => {
  try {
    const { concept, level } = req.body;

    if (!concept) {
      return res.status(400).json({ message: 'Concept is required' });
    }

    const explanation = await openaiService.explainConcept(concept, level);

    res.json({
      success: true,
      data: { explanation },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const generatePracticeProblems = async (req: AuthRequest, res: Response) => {
  try {
    const { topic, count, difficulty } = req.body;

    if (!topic) {
      return res.status(400).json({ message: 'Topic is required' });
    }

    const problems = await openaiService.generatePracticeProblems(
      topic,
      count || 5,
      difficulty || 'medium'
    );

    res.json({
      success: true,
      data: { problems },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const provideEssayFeedback = async (req: AuthRequest, res: Response) => {
  try {
    const { essay, rubric } = req.body;

    if (!essay) {
      return res.status(400).json({ message: 'Essay is required' });
    }

    const feedback = await openaiService.provideEssayFeedback(essay, rubric);

    res.json({
      success: true,
      data: { feedback },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const summarizeText = async (req: AuthRequest, res: Response) => {
  try {
    const { text, maxLength } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Text is required' });
    }

    const summary = await openaiService.summarizeText(text, maxLength);

    res.json({
      success: true,
      data: { summary },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
