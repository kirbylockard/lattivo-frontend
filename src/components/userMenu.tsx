import { getSupabaseServerClient } from '@/lib/supabase/server';
import { signOutAction } from '@/app/actions/auth';

export default async function UserMenu() {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null; // or a "Log in" link
  }

  return (
    <form action={signOutAction}>
      <span className="mr-3 text-sm opacity-80">{user.email}</span>
      <button className="rounded bg-gray-700 text-light px-3 py-1">Sign out</button>
    </form>
  );
}
