import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getServerSupabase } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { listingId, reason, details } = body;

    if (!listingId || !reason) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const current = await getCurrentUser();
    const userId = current?.user.id ?? null;

    // Log the report for now — can be moved to a DB table later
    logger.info('Listing report received', {
      listingId,
      reason,
      details: details?.slice(0, 500),
      userId,
    });

    // Try to insert into DB if table exists, otherwise just log
    const supabase = await getServerSupabase();
    if (supabase) {
      await supabase.from('listing_reports').insert({
        listing_id: listingId,
        reason,
        details: details?.slice(0, 500) ?? null,
        reporter_id: userId,
      }).then(() => {}, () => {
        // Table may not exist yet — that's fine, the log above captures it
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true }); // Always return success to reporter
  }
}
