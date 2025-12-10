import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../utils/constants';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  containerStyle,
  style,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const getInputContainerStyle = (): ViewStyle => {
    return {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: error
        ? COLORS.error
        : isFocused
        ? COLORS.primary
        : COLORS.border,
      borderRadius: BORDER_RADIUS.md,
      backgroundColor: COLORS.surface,
      paddingHorizontal: SPACING.md,
      minHeight: 52,
    };
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={getInputContainerStyle()}>
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
        
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={COLORS.textLight}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...textInputProps}
        />
        
        {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
      {helperText && !error && <Text style={styles.helperText}>{helperText}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  input: {
    flex: 1,
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    paddingVertical: SPACING.sm,
  },
  iconLeft: {
    marginRight: SPACING.sm,
  },
  iconRight: {
    marginLeft: SPACING.sm,
  },
  errorText: {
    ...TYPOGRAPHY.small,
    color: COLORS.error,
    marginTop: SPACING.xs,
    marginLeft: SPACING.xs,
  },
  helperText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    marginLeft: SPACING.xs,
  },
});