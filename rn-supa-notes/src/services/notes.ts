import { supabase } from '../lib/supabase';
import { z } from 'zod';

export const noteSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  title: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Note = z.infer<typeof noteSchema>;

export async function listNotes(userId: string): Promise<Note[]> {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return z.array(noteSchema).parse(data);
}

export async function getNoteById(id: string): Promise<Note> {
  const { data, error } = await supabase.from('notes').select('*').eq('id', id).single();
  if (error) throw error;
  return noteSchema.parse(data);
}

export async function createNote(input: { title?: string; content?: string; userId: string }): Promise<Note> {
  const { data, error } = await supabase
    .from('notes')
    .insert({ title: input.title ?? null, content: input.content ?? null, user_id: input.userId })
    .select()
    .single();
  if (error) throw error;
  return noteSchema.parse(data);
}

export async function updateNote(input: { id: string; title?: string; content?: string }): Promise<Note> {
  const { data, error } = await supabase
    .from('notes')
    .update({ title: input.title ?? null, content: input.content ?? null })
    .eq('id', input.id)
    .select()
    .single();
  if (error) throw error;
  return noteSchema.parse(data);
}

export async function deleteNote(id: string): Promise<void> {
  const { error } = await supabase.from('notes').delete().eq('id', id);
  if (error) throw error;
}