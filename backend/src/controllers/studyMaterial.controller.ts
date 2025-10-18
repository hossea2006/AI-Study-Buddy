import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../utils/prisma';
import { extractTextFromPDF } from '../utils/pdfParser';
import path from 'path';
import fs from 'fs/promises';

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

export const uploadStudyMaterial = async (req: AuthRequest, res: Response) => {
  try {
    const { title } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    let content = '';
    const filePath = file.path;
    const fileType = path.extname(file.originalname).toLowerCase();

    // Extract text based on file type
    if (fileType === '.pdf') {
      content = await extractTextFromPDF(filePath);
    } else if (fileType === '.txt') {
      content = await fs.readFile(filePath, 'utf-8');
    } else {
      // For .doc and .docx, you'd need additional libraries
      content = 'File uploaded successfully. Text extraction for this format coming soon.';
    }

    // Create study material
    const material = await prisma.studyMaterial.create({
      data: {
        title: title || file.originalname,
        content: content,
        fileUrl: `/uploads/${file.filename}`,
        fileType: fileType,
        userId: req.userId!,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Study material uploaded successfully',
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
            Flashcard: true,
            Quiz: true,
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
        Flashcard: true,
        Quiz: true,
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
