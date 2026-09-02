import { ChatAttachment } from '../types';

const MAX_FILE_SIZE_MB = 25;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const ALLOWED_MIME_TYPES: Record<string, 'image' | 'document'> = {
  // Images
  'image/jpeg': 'image',
  'image/png': 'image',
  'image/webp': 'image',
  'image/svg+xml': 'image',
  'image/gif': 'image',

  // Documents
  'application/pdf': 'document',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'document', // docx
  'application/msword': 'document', // doc
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'document', // xlsx
  'application/vnd.ms-excel': 'document', // xls
  'text/csv': 'document',
  'text/plain': 'document',
};

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  type?: 'image' | 'document';
}

export function validateFile(file: File): FileValidationResult {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `El archivo supera el tamaño máximo permitido de ${MAX_FILE_SIZE_MB}MB (${(file.size / (1024 * 1024)).toFixed(1)}MB).`,
    };
  }

  const detectedType = ALLOWED_MIME_TYPES[file.type] || (file.name.match(/\.(png|jpe?g|webp|svg)$/i) ? 'image' : 'document');

  return {
    valid: true,
    type: detectedType,
  };
}

export async function processFileForChat(file: File): Promise<ChatAttachment> {
  const validation = validateFile(file);
  if (!validation.valid) {
    throw new Error(validation.error || 'Archivo no soportado');
  }

  const dataUrl = await readFileAsDataUrl(file);

  const attachment: ChatAttachment = {
    id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: file.name,
    size: file.size,
    type: validation.type || 'document',
    mimeType: file.type || 'application/octet-stream',
    dataUrl,
    uploadedAt: new Date().toISOString(),
  };

  return attachment;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
