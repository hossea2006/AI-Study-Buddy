import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../utils/prisma';

export const createStudyMaterial = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, fileUrl, fileType } = req.body;

    const material = await prisma.studyMaterial.create({
      data: {
        title,
        content,
        fileUrl,
        fileType,
        userId: req.userId!,
      },
    });

    res.status(201).json({
      success: true,
      data: material,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getStudyMaterials = async (req: AuthRequest, res: Response) => {
  try {
    const materials = await prisma.studyMaterial.findMany({
      where: { userId: req.userId },
      include: {
        _count: {
          select: {
            flashcards: true,
            quizzes: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: materials,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getStudyMaterialById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const material = await prisma.studyMaterial.findUnique({
      where: { id, userId: req.userId },
      include: {
        flashcards: true,
        quizzes: true,
      },
    });

    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    res.json({
      success: true,
      data: material,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteStudyMaterial = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.studyMaterial.delete({
      where: { id, userId: req.userId },
    });

    res.json({
      success: true,
      message: 'Material deleted',
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
