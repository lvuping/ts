import type { APIRoute } from 'astro';
import { getNoteById, updateNote, deleteNote } from '../../../lib/notes';

export const GET: APIRoute = async ({ params }) => {
  try {
    const note = await getNoteById(params.id!);
    
    if (!note) {
      return new Response(JSON.stringify({ error: 'Note not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    return new Response(JSON.stringify(note), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch note' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

export const PUT: APIRoute = async ({ params, request }) => {
  try {
    const body = await request.json();
    const note = await updateNote(params.id!, body);
    
    if (!note) {
      return new Response(JSON.stringify({ error: 'Note not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    return new Response(JSON.stringify(note), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to update note' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

export const DELETE: APIRoute = async ({ params }) => {
  try {
    const success = await deleteNote(params.id!);
    
    if (!success) {
      return new Response(JSON.stringify({ error: 'Note not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    return new Response(null, {
      status: 204
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to delete note' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};