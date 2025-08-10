import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="sign-in" options={{ title: 'Anmelden' }} />
      <Stack.Screen name="sign-up" options={{ title: 'Registrieren' }} />
    </Stack>
  );
}