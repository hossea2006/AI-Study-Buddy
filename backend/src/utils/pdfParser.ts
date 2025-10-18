import fs from 'fs/promises';
import * as pdfParse from 'pdf-parse';

export const extractTextFromPDF = async (filePath: string): Promise<string> => {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const data = await (pdfParse as any)(dataBuffer);
    return data.text;
  } catch (error) {
    throw new Error(`Failed to parse PDF: ${error}`);
  }
};

export const extractTextFromPDFBuffer = async (buffer: Buffer): Promise<string> => {
  try {
    const data = await (pdfParse as any)(buffer);
    return data.text;
  } catch (error) {
    throw new Error(`Failed to parse PDF: ${error}`);
  }
};
