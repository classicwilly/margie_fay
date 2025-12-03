'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database.types';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Auth error:', error);
        router.push('/onboarding?error=auth_failed');
        return;
      }

      if (session) {
        // Create user profile if doesn't exist
        const userInsert = {
          id: session.user.id,
          email: session.user.email || '',
          full_name: session.user.user_metadata.full_name || 'New User',
          avatar_url: session.user.user_metadata.avatar_url,
        } as Database['public']['Tables']['users']['Insert'];

        const { error: profileError } = await supabase
          .from('users')
          .upsert([userInsert]);

        if (profileError) {
          console.error('Profile creation error:', profileError);
        }

        router.push('/mesh');
      } else {
        router.push('/onboarding');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400 mx-auto mb-4"></div>
        <p className="text-slate-300">Completing authentication...</p>
      </div>
    </div>
  );
}
