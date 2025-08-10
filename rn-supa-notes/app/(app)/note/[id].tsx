import React, { useMemo, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useAuth } from '../../../src/providers/AuthProvider';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getNoteById, createNote, updateNote } from '../../../src/services/notes';

export default function NoteEditorScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const isNew = params.id === 'new';
  const { session } = useAuth();
  const userId = session!.user.id;
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ['note', params.id],
    queryFn: () => (isNew ? Promise.resolve(null) : getNoteById(params.id as string)),
    enabled: !isNew,
  });

  const [title, setTitle] = useState(data?.title ?? '');
  const [content, setContent] = useState(data?.content ?? '');

  useMemo(() => {
    if (data) {
      setTitle(data.title ?? '');
      setContent(data.content ?? '');
    }
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (isNew) {
        const created = await createNote({ title, content, userId });
        return created.id;
      } else {
        await updateNote({ id: params.id as string, title, content });
        return params.id as string;
      }
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['note', id] });
      router.back();
    },
    onError: (err: any) => Alert.alert('Fehler', err.message ?? 'Konnte nicht speichern'),
  });

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Titel"
        style={styles.title}
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        placeholder="Inhalt"
        style={styles.content}
        value={content}
        onChangeText={setContent}
        multiline
      />
      <Button title={saveMutation.isPending ? 'Speichere…' : 'Speichern'} onPress={() => saveMutation.mutate()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  title: { fontSize: 18, borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8 },
  content: { flex: 1, borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, textAlignVertical: 'top' },
});