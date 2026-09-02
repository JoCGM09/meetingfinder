'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const EmailSchema = z.string().email();

export async function loginWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback`,
    },
  });

  if (error) {
    console.error('Error logging in with Google:', error.message);
    return;
  }

  if (data.url) {
    redirect(data.url);
  }
}

export async function loginWithMagicLink(formData: FormData) {
  const email = formData.get('email') as string;
  
  // Security: Validate email format
  const validatedEmail = EmailSchema.safeParse(email);
  if (!validatedEmail.success) {
    throw new Error('Email inválido');
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOtp({
    email: validatedEmail.data,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback`,
    },
  });

  if (error) {
    console.error('Error logging in with Magic Link:', error.message);
    throw new Error(error.message);
  }
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}
