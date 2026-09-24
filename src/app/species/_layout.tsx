import { Stack } from 'expo-router';
import { Colors } from '../../constants/Colors';

export default function SpeciesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: Colors.background,
        },
      }}
    >
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
