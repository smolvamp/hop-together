import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../context/ThemeContext';

type BadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'info';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'primary',
  size = 'md',
  style,
  textStyle,
}) => {
  const { theme } = useTheme();

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'success':
        return {
          backgroundColor: theme.colors.success,
        };
      case 'warning':
        return {
          backgroundColor: theme.colors.warning,
        };
      case 'error':
        return {
          backgroundColor: theme.colors.error,
        };
      case 'info':
        return {
          backgroundColor: theme.colors.info,
        };
      default:
        return {
          backgroundColor: theme.colors.secondary,
        };
    }
  };

  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case 'sm':
        return {
          paddingVertical: theme.spacing.xs / 2,
          paddingHorizontal: theme.spacing.xs,
        };
      case 'lg':
        return {
          paddingVertical: theme.spacing.sm / 2,
          paddingHorizontal: theme.spacing.sm,
        };
      default:
        return {
          paddingVertical: theme.spacing.xs / 2,
          paddingHorizontal: theme.spacing.sm,
        };
    }
  };

  const getTextSize = (): number => {
    switch (size) {
      case 'sm':
        return 12;
      case 'lg':
        return 16;
      default:
        return 14;
    }
  };

  return (
    <View
      style={[
        styles.badge,
        getVariantStyles(),
        getSizeStyles(),
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          { fontSize: getTextSize(), color: theme.colors.card },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 9999,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default Badge; 