export type ClassLevel = '11th' | '12th';

export type SubjectName = 'Biology' | 'Physics' | 'Chemistry' | 'Mathematics';

export interface StudyTask {
  id: string;
  title: string;
  description: string;
  subject: SubjectName;
  classLevel: ClassLevel;
  completed: boolean;
  type: 'syllabus' | 'custom' | 'scanned' | 'ai-generated';
  createdAt: string;
  timeSpentSeconds: number;
}

export interface Model3D {
  id: string;
  name: string;
  category: string;
  description: string;
  nodes: string[];
  subject: SubjectName;
  classLevel: ClassLevel;
  scannedAt: string;
  mastered: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: string;
  tasksToImport?: Array<{ title: string; description: string }>;
  attachedFile?: { name: string; mimeType: string };
}
