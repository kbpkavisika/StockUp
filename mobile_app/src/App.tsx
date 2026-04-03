import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from './utils/ThemeContext';
import { useTheme } from './utils/ThemeContext';
import Home from './screens/Home';
import ItemForm from './screens/ItemForm';
import type { RootStackParamList } from './types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator() {
  const { isDark } = useTheme();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: isDark ? '#1E293B' : '#2563EB' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: 'bold' },
          headerTitleAlign: 'center',
          contentStyle: { backgroundColor: isDark ? '#0F172A' : '#F8FAFC' },
        }}
      >
        <Stack.Screen name="Home" component={Home} options={{ title: 'StockUp' }} />
        <Stack.Screen name="ItemForm" component={ItemForm} options={{ title: 'Item Form' }} />
      </Stack.Navigator>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppNavigator />
    </ThemeProvider>
  );
}
