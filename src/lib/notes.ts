import type { Note, NoteInput, NotesData } from '../types/note';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'src/lib/data/notes.json');

// Initialize data file if it doesn't exist
async function initializeDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    const initialData: NotesData = {
      notes: [],
      categories: ['Frontend', 'Backend', 'Database', 'DevOps', 'Security', 'Other'],
      tags: []
    };
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(initialData, null, 2));
  }
}

// Read notes data
export async function getNotesData(): Promise<NotesData> {
  await initializeDataFile();
  const data = await fs.readFile(DATA_FILE, 'utf-8');
  return JSON.parse(data);
}

// Write notes data
async function saveNotesData(data: NotesData): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

// Get all notes
export async function getAllNotes(): Promise<Note[]> {
  const data = await getNotesData();
  return data.notes.sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

// Get notes by category
export async function getNotesByCategory(category: string): Promise<Note[]> {
  const data = await getNotesData();
  return data.notes
    .filter(note => note.category === category)
    .sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
}

// Get notes by tag
export async function getNotesByTag(tag: string): Promise<Note[]> {
  const data = await getNotesData();
  return data.notes
    .filter(note => note.tags.includes(tag))
    .sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
}

// Search notes
export async function searchNotes(query: string): Promise<Note[]> {
  const data = await getNotesData();
  const lowercaseQuery = query.toLowerCase();
  
  return data.notes
    .filter(note => 
      note.title.toLowerCase().includes(lowercaseQuery) ||
      note.content.toLowerCase().includes(lowercaseQuery) ||
      note.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    )
    .sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
}

// Get single note
export async function getNoteById(id: string): Promise<Note | null> {
  const data = await getNotesData();
  return data.notes.find(note => note.id === id) || null;
}

// Create note
export async function createNote(input: NoteInput): Promise<Note> {
  const data = await getNotesData();
  
  const newNote: Note = {
    id: Date.now().toString(),
    ...input,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  data.notes.push(newNote);
  
  // Update tags list
  input.tags.forEach(tag => {
    if (!data.tags.includes(tag)) {
      data.tags.push(tag);
    }
  });
  
  await saveNotesData(data);
  return newNote;
}

// Update note
export async function updateNote(id: string, input: NoteInput): Promise<Note | null> {
  const data = await getNotesData();
  const index = data.notes.findIndex(note => note.id === id);
  
  if (index === -1) return null;
  
  const updatedNote: Note = {
    ...data.notes[index],
    ...input,
    updatedAt: new Date().toISOString()
  };
  
  data.notes[index] = updatedNote;
  
  // Update tags list
  input.tags.forEach(tag => {
    if (!data.tags.includes(tag)) {
      data.tags.push(tag);
    }
  });
  
  await saveNotesData(data);
  return updatedNote;
}

// Delete note
export async function deleteNote(id: string): Promise<boolean> {
  const data = await getNotesData();
  const index = data.notes.findIndex(note => note.id === id);
  
  if (index === -1) return false;
  
  data.notes.splice(index, 1);
  await saveNotesData(data);
  return true;
}

// Get all categories
export async function getAllCategories(): Promise<string[]> {
  const data = await getNotesData();
  return data.categories;
}

// Get all tags
export async function getAllTags(): Promise<string[]> {
  const data = await getNotesData();
  return data.tags.sort();
}