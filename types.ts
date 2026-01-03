export interface ProjectFile {
  fileName: string;
  code: string;
  language: string;
}

export interface VivaQuestion {
  question: string;
  answer: string;
}

export interface StudentProject {
  projectTitle: string;
  domain: string;
  techStack: string;
  folderStructure: string;
  files: ProjectFile[];
  howToRun: string[];
  apiFlowExplanation: string; // New field for API architecture
  conceptExplanation: string;
  vivaQuestions: VivaQuestion[];
  futureEnhancements: string[];
}

// Deprecated interfaces kept for compatibility
export interface GeneratedFile {
  path: string;
  content: string;
  language: string;
}
export interface GeneratedProject {
  overview: string;
  files: GeneratedFile[];
}