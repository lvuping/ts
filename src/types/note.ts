export interface Note {
  id: string;
  title: string;
  content: string;
  language: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
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
}