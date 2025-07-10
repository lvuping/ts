import type { APIRoute } from 'astro';
import { getAllNotes, createNote, searchNotes, getNotesByCategory, getNotesByTag } from '../../../lib/notes';

export const GET: APIRoute = async ({ url }) => {
  try {
    const searchQuery = url.searchParams.get('search');
    const category = url.searchParams.get('category');
    const tag = url.searchParams.get('tag');
    
    let notes;
    
    if (searchQuery) {
      notes = await searchNotes(searchQuery);
    } else if (category) {
      notes = await getNotesByCategory(category);
    } else if (tag) {
      notes = await getNotesByTag(tag);
    } else {
      notes = await getAllNotes();
    }
    
    return new Response(JSON.stringify(notes), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch notes' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const note = await createNote(body);
    
    return new Response(JSON.stringify(note), {
      status: 201,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create note' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};