import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { transitionGuestToUser } from '@/lib/actions';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  let next = searchParams.get('next') ?? '/dashboard';

  // Security: Prevent Open Redirect by ensuring 'next' starts with '/' and not '//'
  if (!next.startsWith('/') || next.startsWith('//')) {
    next = '/dashboard';
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Transition history from sessionId to userId
      const cookieStore = await cookies();
      const lastSessionId = cookieStore.get('last_session_id')?.value;
      if (lastSessionId) {
        await transitionGuestToUser(lastSessionId);
      }

      // Security: Avoid relying on x-forwarded-host to prevent Host Header Injection
      // Prefer using the origin from the request URL which is more reliable in most environments
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
