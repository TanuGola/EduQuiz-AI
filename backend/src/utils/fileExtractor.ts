import pdf from 'pdf-parse';
import mammoth from 'mammoth';
import fs from 'fs';

export async function extractTextFromFile(filePath: string, fileType: string): Promise<string> {
  try {
    if (fileType === 'application/pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdf(dataBuffer);
      return data.text;
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileType === 'application/msword') {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    } else if (fileType === 'text/plain') {
      return fs.readFileSync(filePath, 'utf-8');
    } else {
      throw new Error('Unsupported file type');
    }
  } catch (error) {
    console.error('File extraction error:', error);
    throw new Error('Failed to extract text from file');
  }
}
