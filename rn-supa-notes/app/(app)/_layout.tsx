import { Stack, Redirect } from 'expo-router';
import { useAuth } from '../../src/providers/AuthProvider';

export default function AppLayout() {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!session) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Notizen' }} />
      <Stack.Screen name="note/[id]" options={{ title: 'Notiz' }} />
    </Stack>
  );
}