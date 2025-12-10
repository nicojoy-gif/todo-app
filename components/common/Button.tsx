import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../../utils/constants';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  icon,
}) => {
  const isDisabled = disabled || loading;

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: BORDER_RADIUS.md,
    
    };

    // Size styles
    const sizeStyles: Record<string, ViewStyle> = {
      small: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        minHeight: 36,
      },
      medium: {
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        minHeight: 48,
      },
      large: {
        paddingHorizontal: SPACING.xl,
        paddingVertical: SPACING.lg,
        minHeight: 56,
      },
    };

    // Variant styles
    const variantStyles: Record<string, ViewStyle> = {
      primary: {
        backgroundColor: COLORS.primary,
      },
      secondary: {
        backgroundColor: COLORS.secondary,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: COLORS.primary,
      },
      danger: {
        backgroundColor: COLORS.error,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...(fullWidth && { width: '100%' }),
      ...(isDisabled && {
        opacity: 0.5,
        ...SHADOWS.small,
      }),
    };
  };

  const getTextStyle = (): TextStyle => {
    const sizeStyles: Record<string, TextStyle> = {
      small: {
        fontSize: 14,
        fontWeight: '600',
      },
      medium: {
        fontSize: 16,
        fontWeight: '600',
      },
      large: {
        fontSize: 18,
        fontWeight: '600',
      },
    };

    const variantStyles: Record<string, TextStyle> = {
      primary: {
        color: COLORS.surface,
      },
      secondary: {
        color: COLORS.surface,
      },
      outline: {
        color: COLORS.primary,
      },
      danger: {
        color: COLORS.surface,
      },
    };

    return {
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' ? COLORS.primary : COLORS.surface}
        />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text
  style={[
    getTextStyle(),
    textStyle,
    icon ? { marginLeft: SPACING.sm } : undefined, 
  ]}
>
  {title}
</Text>

        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({});