import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { TaskProvider } from '@/context/TaskContext';
import { RootStackParamList } from '@/types';
import { HomeScreen } from '../screen/HomeScreen';
import { AddTaskScreen } from '../screen/AddTask';

export const unstable_settings = {
  anchor: '(tabs)',
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <ThemeProvider value={theme}>
      <TaskProvider>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ title: 'My Tasks' }}
          />
          <Stack.Screen 
            name="AddTask" 
            component={AddTaskScreen} 
            options={{ title: 'Add Task', presentation: 'modal' }}
          />
        </Stack.Navigator>
      </TaskProvider>
    </ThemeProvider>
  );
}
