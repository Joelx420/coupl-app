import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useRealtimeNotes({ userId, onEvent }: { userId: string; onEvent: () => void }) {
  useEffect(() => {
    const channel = supabase
      .channel('notes-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notes', filter: `user_id=eq.${userId}` }, () => {
        onEvent();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, onEvent]);
}