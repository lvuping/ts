import type { APIRoute } from 'astro';
import { getAllCategories, getAllTags } from '../../../lib/notes';

export const GET: APIRoute = async () => {
  try {
    const categories = await getAllCategories();
    const tags = await getAllTags();
    
    return new Response(JSON.stringify({ categories, tags }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch metadata' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};