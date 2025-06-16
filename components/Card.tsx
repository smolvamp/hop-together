import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  elevation?: 'none' | 'sm' | 'md' | 'lg';
  rounded?: 'none' | 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}

const Card: React.FC<CardProps> = ({
  children,
  elevation = 'md',
  rounded = 'md',
  style,
}) => {
  const { theme } = useTheme();

  const getElevation = (): ViewStyle => {
    switch (elevation) {
      case 'none':
        return {};
      case 'sm':
        return {
          shadowColor: theme.colors.text,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.18,
          shadowRadius: 1.0,
          elevation: 1,
        };
      case 'lg':
        return {
          shadowColor: theme.colors.text,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.30,
          shadowRadius: 4.65,
          elevation: 8,
        };
      default:
        return {
          shadowColor: theme.colors.text,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        };
    }
  };

  const getBorderRadius = (): number => {
    switch (rounded) {
      case 'none':
        return 0;
      case 'sm':
        return theme.borderRadius.sm;
      case 'lg':
        return theme.borderRadius.lg;
      default:
        return theme.borderRadius.md;
    }
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.card,
          borderRadius: getBorderRadius(),
          padding: theme.spacing.md,
          margin: theme.spacing.sm,
        },
        getElevation(),
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    // Base styles that don't depend on theme
  },
});

export default Card; 