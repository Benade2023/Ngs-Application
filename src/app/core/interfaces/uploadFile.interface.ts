export interface UploadedFile {
  id: number;
  originalName: string;
  fileName: string;
  mimeType: string;
  size: number;
  filePath: string;
  createdAt: string;
  matriculeAgent?: string;
  projectId?: string;
  type?: string;
}