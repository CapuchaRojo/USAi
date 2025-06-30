import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

interface ProgressProps {
  value?: number;
  style?: any;
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({ value = 0, style, className = "" }) => {
  const clampedValue = Math.min(100, Math.max(0, value));
  
  return (
    <View style={[styles.progressContainer, style]}>
      <View 
        style={[
          styles.progressBar,
          { width: `${clampedValue}%` }
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  progressContainer: {
    width: '100%',
    height: 8,
    backgroundColor: Colors.mediumGray,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
    shadowColor: Colors.glowPrimary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 3,
  },
});