import type { APIRoute } from 'astro';
import { validatePassword } from '../../middleware';

const AUTH_COOKIE_NAME = "authenticated";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const password = formData.get('password')?.toString();

  if (!password) {
    return redirect('/login?error=missing');
  }

  if (validatePassword(password)) {
    // Set authentication cookie
    cookies.set(AUTH_COOKIE_NAME, "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });
    
    return redirect('/');
  }

  return redirect('/login?error=invalid');
};