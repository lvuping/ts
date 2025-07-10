export interface Note {
  id: string;
  title: string;
  content: string;
  language: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  favorite?: boolean;
  relatedNotes?: string[]; // IDs of related notes
  template?: string; // Template name if created from template
}

export interface NoteInput {
  title: string;
  content: string;
  language: string;
  category: string;
  tags: string[];
}

export interface NotesData {
  notes: Note[];
  categories: string[];
  tags: string[];
  templates?: NoteTemplate[];
}

export interface NoteTemplate {
  id: string;
  name: string;
  description: string;
  content: string;
  language: string;
  category: string;
  tags: string[];
}