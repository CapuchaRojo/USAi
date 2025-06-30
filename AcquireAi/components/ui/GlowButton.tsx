import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '@/constants/Colors';

interface GlowButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function GlowButton({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  style,
  textStyle,
}: GlowButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          borderColor: Colors.primary,
          shadowColor: Colors.glowPrimary,
        };
      case 'secondary':
        return {
          borderColor: Colors.secondary,
          shadowColor: Colors.glowSecondary,
        };
      case 'success':
        return {
          borderColor: Colors.success,
          shadowColor: Colors.glowSuccess,
        };
      case 'warning':
        return {
          borderColor: Colors.warning,
          shadowColor: Colors.glowWarning,
        };
      case 'error':
        return {
          borderColor: Colors.error,
          shadowColor: Colors.error,
        };
      default:
        return {
          borderColor: Colors.primary,
          shadowColor: Colors.glowPrimary,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 8,
          paddingHorizontal: 16,
          fontSize: 12,
        };
      case 'medium':
        return {
          paddingVertical: 12,
          paddingHorizontal: 24,
          fontSize: 14,
        };
      case 'large':
        return {
          paddingVertical: 16,
          paddingHorizontal: 32,
          fontSize: 16,
        };
      default:
        return {
          paddingVertical: 12,
          paddingHorizontal: 24,
          fontSize: 14,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        variantStyles,
        {
          paddingVertical: sizeStyles.paddingVertical,
          paddingHorizontal: sizeStyles.paddingHorizontal,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.text,
          { fontSize: sizeStyles.fontSize },
          textStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderRadius: 0,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 6,
  },
  text: {
    fontWeight: '600',
    color: Colors.textPrimary,
    letterSpacing: 1,
    fontFamily: 'Orbitron-Bold',
  },
});