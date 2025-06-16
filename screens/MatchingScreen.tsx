import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

const MatchingScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const dotAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start the dots animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(dotAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(dotAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Navigate to Home after 3 seconds
    const timer = setTimeout(() => {
      navigation.navigate('Home');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  const dots = dotAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ActivityIndicator size="large" color={theme.colors.primary} style={styles.spinner} />
      <Text style={[styles.text, { color: theme.colors.text }]}>Finding ride buddies</Text>
      <Animated.Text style={[styles.dots, { opacity: dots, color: theme.colors.text }]}>...</Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    marginBottom: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 5,
  },
  dots: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default MatchingScreen; 