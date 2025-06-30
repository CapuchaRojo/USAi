import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: any;
  textStyle?: any;
  variant?: 'default' | 'secondary' | 'outline';
  size?: 'sm' | 'default' | 'lg';
  disabled?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onPress, 
  style, 
  textStyle,
  variant = 'default',
  size = 'default',
  disabled = false,
  className = "",
  ...props 
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: Colors.secondary,
          borderColor: Colors.secondary,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: Colors.primary,
          borderWidth: 2,
        };
      default:
        return {
          backgroundColor: Colors.primary,
          borderColor: Colors.primary,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          paddingVertical: 8,
          paddingHorizontal: 16,
        };
      case 'lg':
        return {
          paddingVertical: 16,
          paddingHorizontal: 32,
        };
      default:
        return {
          paddingVertical: 12,
          paddingHorizontal: 24,
        };
    }
  };

  const getTextColor = () => {
    if (variant === 'outline') {
      return Colors.primary;
    }
    return Colors.textPrimary;
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getVariantStyles(),
        getSizeStyles(),
        disabled && styles.disabled,
        style
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      {...props}
    >
      <Text style={[
        styles.buttonText,
        { color: getTextColor() },
        textStyle
      ]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.glowPrimary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
});