import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../../utils/constants';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: 'none' | 'small' | 'medium' | 'large';
  elevation?: 'none' | 'small' | 'medium' | 'large';
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  padding = 'medium',
  elevation = 'medium',
}) => {
  const getPaddingStyle = (): ViewStyle => {
    const paddingStyles: Record<string, ViewStyle> = {
      none: {},
      small: { padding: SPACING.sm },
      medium: { padding: SPACING.md },
      large: { padding: SPACING.lg },
    };
    return paddingStyles[padding];
  };

  const getElevationStyle = (): ViewStyle => {
    const elevationStyles: Record<string, ViewStyle> = {
      none: {},
      small: SHADOWS.small,
      medium: SHADOWS.medium,
      large: SHADOWS.large,
    };
    return elevationStyles[elevation];
  };

  return (
    <View
      style={[
        styles.card,
        getPaddingStyle(),
        getElevationStyle(),
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
});