import React from 'react';
import { View, FlatList, Text, Button, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Link } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listNotes, deleteNote } from '../../src/services/notes';
import { useAuth } from '../../src/providers/AuthProvider';
import { useRealtimeNotes } from '../../src/services/realtime';
import { supabase } from '../../src/lib/supabase';

export default function NotesScreen() {
  const { session } = useAuth();
  const userId = session!.user.id;
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['notes'],
    queryFn: () => listNotes(userId),
  });

  useRealtimeNotes({ userId, onEvent: () => queryClient.invalidateQueries({ queryKey: ['notes'] }) });

  const removeMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes'] }),
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (isLoading) return <Text style={{ padding: 16 }}>Lade…</Text>;
  if (error) return <Text style={{ padding: 16 }}>Fehler beim Laden</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Deine Notizen</Text>
        <Button title="Abmelden" onPress={handleSignOut} />
      </View>
      <FlatList
        data={data ?? []}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <TouchableOpacity style={{ flex: 1 }}>
              <Link href={{ pathname: '/(app)/note/[id]', params: { id: item.id } }}>
                <Text style={styles.itemTitle}>{item.title || 'Ohne Titel'}</Text>
                <Text numberOfLines={2} style={styles.itemContent}>{item.content || ''}</Text>
              </Link>
            </TouchableOpacity>
            <Button
              title="Löschen"
              color="#cc0000"
              onPress={() =>
                Alert.alert('Löschen?', 'Diese Notiz wirklich löschen?', [
                  { text: 'Abbrechen', style: 'cancel' },
                  { text: 'Löschen', style: 'destructive', onPress: () => removeMutation.mutate(item.id) },
                ])
              }
            />
          </View>
        )}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 24 }}>Noch keine Notizen</Text>}
      />
      <Link href="/(app)/note/new" asChild>
        <TouchableOpacity style={styles.fab}>
          <Text style={styles.fabText}>＋</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 22, fontWeight: 'bold' },
  item: { flexDirection: 'row', alignItems: 'center', padding: 12, borderWidth: 1, borderColor: '#eee', borderRadius: 8 },
  itemTitle: { fontSize: 16, fontWeight: '600' },
  itemContent: { color: '#666', marginTop: 4 },
  fab: { position: 'absolute', right: 16, bottom: 16, backgroundColor: '#0077ff', width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  fabText: { color: 'white', fontSize: 28, marginTop: -2 },
});