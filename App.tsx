import React from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types/navigation';

// Import screens
import HomeScreen from './screens/HomeScreen';
import TagRideScreen from './screens/TagRideScreen';
import ChatScreen from './screens/ChatScreen';
import MatchingScreen from './screens/MatchingScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppContent = () => {
  const { theme, themeType } = useTheme();

  return (
    <NavigationContainer>
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <StatusBar
          barStyle={themeType === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={theme.colors.background}
        />
        <Stack.Navigator 
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: theme.colors.background,
            },
            headerTintColor: theme.colors.text,
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ title: 'Hope Together' }} 
          />
          <Stack.Screen 
            name="TagRide" 
            component={TagRideScreen} 
            options={{ title: 'Create Ride' }} 
          />
          <Stack.Screen 
            name="Chat" 
            component={ChatScreen} 
            options={{ title: 'Chat' }} 
          />
          <Stack.Screen 
            name="Matching" 
            component={MatchingScreen} 
            options={{ title: 'Finding Matches' }} 
          />
        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
