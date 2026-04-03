import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from './utils/ThemeContext';
import Home from './screens/Home';
import ItemForm from './screens/ItemForm';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: '#0F172A' },
            headerTintColor: '#F8FAFC',
            headerTitleStyle: { fontWeight: '700' },
            contentStyle: { backgroundColor: '#F8FAFC' },
          }}
        >
          <Stack.Screen name="Home" component={Home} options={{ title: 'StockUp' }} />
          <Stack.Screen name="ItemForm" component={ItemForm} options={{ title: 'Item Form' }} />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </ThemeProvider>
  );
}
