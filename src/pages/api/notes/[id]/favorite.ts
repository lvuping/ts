import type { APIRoute } from 'astro';
import { toggleFavorite } from '../../../../lib/notes';

export const POST: APIRoute = async ({ params }) => {
  const { id } = params;
  
  if (!id) {
    return new Response(JSON.stringify({ error: 'Note ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  const note = await toggleFavorite(id);
  
  if (!note) {
    return new Response(JSON.stringify({ error: 'Note not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  return new Response(JSON.stringify(note), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};