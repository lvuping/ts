import type { APIRoute } from 'astro';
import { importNotesFromMarkdown } from '../../../lib/notes';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { markdown } = await request.json();
    
    if (!markdown || typeof markdown !== 'string') {
      return new Response(JSON.stringify({ error: 'Invalid markdown content' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const importedNotes = await importNotesFromMarkdown(markdown);
    
    return new Response(JSON.stringify({ 
      success: true, 
      count: importedNotes.length,
      notes: importedNotes 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Import error:', error);
    return new Response(JSON.stringify({ error: 'Failed to import notes' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};