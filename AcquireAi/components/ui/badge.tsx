import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

interface BadgeProps {
  children: React.ReactNode;
  style?: any;
  textStyle?: any;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'outline';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  style, 
  textStyle,
  variant = 'default',
  className = "" 
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return {
          backgroundColor: Colors.success,
          color: Colors.textPrimary,
        };
      case 'warning':
        return {
          backgroundColor: Colors.warning,
          color: Colors.dark,
        };
      case 'error':
        return {
          backgroundColor: Colors.error,
          color: Colors.textPrimary,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: Colors.lightGray,
          borderWidth: 1,
          color: Colors.textSecondary,
        };
      default:
        return {
          backgroundColor: Colors.mediumGray,
          color: Colors.textPrimary,
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <View style={[
      styles.badge,
      { backgroundColor: variantStyles.backgroundColor },
      variantStyles.borderWidth && { 
        borderWidth: variantStyles.borderWidth,
        borderColor: variantStyles.borderColor 
      },
      style
    ]}>
      <Text style={[
        styles.badgeText,
        { color: variantStyles.color },
        textStyle
      ]}>
        {children}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});