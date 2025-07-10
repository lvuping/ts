import type { Note, NoteInput, NotesData, NoteTemplate } from '../types/note';
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
      tags: [],
      templates: [
        {
          id: 'api-endpoint',
          name: 'API Endpoint',
          description: 'RESTful API endpoint template',
          content: `// API Route: /api/[resource]

export async function GET(request: Request) {
  try {
    // Fetch data
    const data = await fetchData();
    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}`,
          language: 'typescript',
          category: 'Backend',
          tags: ['api', 'rest', 'template']
        },
        {
          id: 'react-component',
          name: 'React Component',
          description: 'React functional component with hooks',
          content: `import React, { useState, useEffect } from 'react';

interface ComponentProps {
  // Define props here
}

export const Component: React.FC<ComponentProps> = (props) => {
  const [state, setState] = useState<string>('');
  
  useEffect(() => {
    // Component mount logic
    return () => {
      // Cleanup
    };
  }, []);
  
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
};`,
          language: 'typescript',
          category: 'Frontend',
          tags: ['react', 'component', 'template']
        },
        {
          id: 'sql-query',
          name: 'SQL Query',
          description: 'Common SQL query patterns',
          content: `-- Query with JOIN and aggregation
SELECT 
    t1.column1,
    t1.column2,
    COUNT(t2.id) as count,
    SUM(t2.amount) as total
FROM 
    table1 t1
    LEFT JOIN table2 t2 ON t1.id = t2.table1_id
WHERE 
    t1.status = 'active'
    AND t2.created_at >= DATEADD(day, -30, GETDATE())
GROUP BY 
    t1.column1, t1.column2
HAVING 
    COUNT(t2.id) > 0
ORDER BY 
    total DESC;`,
          language: 'sql',
          category: 'Database',
          tags: ['sql', 'query', 'template']
        }
      ]
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

// Toggle favorite status
export async function toggleFavorite(id: string): Promise<Note | null> {
  const data = await getNotesData();
  const index = data.notes.findIndex(note => note.id === id);
  
  if (index === -1) return null;
  
  data.notes[index].favorite = !data.notes[index].favorite;
  data.notes[index].updatedAt = new Date().toISOString();
  
  await saveNotesData(data);
  return data.notes[index];
}

// Get all templates
export async function getAllTemplates(): Promise<NoteTemplate[]> {
  const data = await getNotesData();
  return data.templates || [];
}

// Get template by ID
export async function getTemplateById(id: string): Promise<NoteTemplate | null> {
  const data = await getNotesData();
  return data.templates?.find(template => template.id === id) || null;
}

// Add related note
export async function addRelatedNote(noteId: string, relatedId: string): Promise<Note | null> {
  const data = await getNotesData();
  const index = data.notes.findIndex(note => note.id === noteId);
  
  if (index === -1) return null;
  
  if (!data.notes[index].relatedNotes) {
    data.notes[index].relatedNotes = [];
  }
  
  if (!data.notes[index].relatedNotes!.includes(relatedId)) {
    data.notes[index].relatedNotes!.push(relatedId);
    data.notes[index].updatedAt = new Date().toISOString();
    await saveNotesData(data);
  }
  
  return data.notes[index];
}

// Remove related note
export async function removeRelatedNote(noteId: string, relatedId: string): Promise<Note | null> {
  const data = await getNotesData();
  const index = data.notes.findIndex(note => note.id === noteId);
  
  if (index === -1 || !data.notes[index].relatedNotes) return null;
  
  data.notes[index].relatedNotes = data.notes[index].relatedNotes!.filter(id => id !== relatedId);
  data.notes[index].updatedAt = new Date().toISOString();
  
  await saveNotesData(data);
  return data.notes[index];
}

// Get related notes
export async function getRelatedNotes(noteId: string): Promise<Note[]> {
  const data = await getNotesData();
  const note = data.notes.find(n => n.id === noteId);
  
  if (!note || !note.relatedNotes) return [];
  
  return data.notes.filter(n => note.relatedNotes!.includes(n.id));
}

// Bulk delete notes
export async function bulkDeleteNotes(noteIds: string[]): Promise<number> {
  const data = await getNotesData();
  const initialCount = data.notes.length;
  
  data.notes = data.notes.filter(note => !noteIds.includes(note.id));
  
  await saveNotesData(data);
  return initialCount - data.notes.length;
}

// Bulk update category
export async function bulkUpdateCategory(noteIds: string[], category: string): Promise<number> {
  const data = await getNotesData();
  let updatedCount = 0;
  
  data.notes.forEach(note => {
    if (noteIds.includes(note.id)) {
      note.category = category;
      note.updatedAt = new Date().toISOString();
      updatedCount++;
    }
  });
  
  await saveNotesData(data);
  return updatedCount;
}

// Import notes from markdown
export async function importNotesFromMarkdown(markdown: string): Promise<Note[]> {
  const data = await getNotesData();
  const importedNotes: Note[] = [];
  
  // Split markdown by horizontal rules
  const sections = markdown.split(/\n---\n/g);
  
  for (const section of sections) {
    const lines = section.trim().split('\n');
    if (lines.length < 3) continue;
    
    // Extract title (first line starting with #)
    const titleLine = lines.find(line => line.startsWith('#'));
    if (!titleLine) continue;
    const title = titleLine.replace(/^#+\s*/, '');
    
    // Extract metadata
    let category = 'Other';
    let tags: string[] = [];
    let language = 'text';
    
    for (const line of lines) {
      if (line.startsWith('**Category:**')) {
        category = line.replace('**Category:**', '').trim();
      } else if (line.startsWith('**Tags:**')) {
        tags = line.replace('**Tags:**', '')
          .split(',')
          .map(tag => tag.trim().replace('#', ''))
          .filter(tag => tag);
      }
    }
    
    // Extract code content
    const codeMatch = section.match(/```(\w+)?\n([\s\S]*?)```/m);
    if (!codeMatch) continue;
    
    if (codeMatch[1]) {
      language = codeMatch[1];
    }
    const content = codeMatch[2].trim();
    
    // Create new note
    const newNote: Note = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 11),
      title,
      content,
      language,
      category,
      tags,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    data.notes.push(newNote);
    importedNotes.push(newNote);
    
    // Update tags list
    tags.forEach(tag => {
      if (!data.tags.includes(tag)) {
        data.tags.push(tag);
      }
    });
  }
  
  await saveNotesData(data);
  return importedNotes;
}