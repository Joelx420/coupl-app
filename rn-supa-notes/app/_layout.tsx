import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import { Stack } from 'expo-router';
import { AppProvider } from '../src/providers/AppProvider';
import { AuthProvider } from '../src/providers/AuthProvider';

export default function RootLayout() {
  return (
    <AppProvider>
      <AuthProvider>
        <Stack>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(app)" options={{ headerShown: false }} />
        </Stack>
      </AuthProvider>
    </AppProvider>
  );
}