import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

interface ProgressBarProps {
  progress: number; // 0-100
  label?: string;
  color?: string;
  showPercentage?: boolean;
  height?: number;
}

export function ProgressBar({ 
  progress, 
  label, 
  color = Colors.primary, 
  showPercentage = true,
  height = 8 
}: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
          {showPercentage && (
            <Text style={[styles.percentage, { color }]}>
              {clampedProgress.toFixed(1)}%
            </Text>
          )}
        </View>
      )}
      <View style={[styles.track, { height }]}>
        <View
          style={[
            styles.progress,
            {
              width: `${clampedProgress}%`,
              backgroundColor: color,
              height,
              shadowColor: color,
            }
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  percentage: {
    fontSize: 12,
    fontWeight: '600',
  },
  track: {
    backgroundColor: Colors.mediumGray,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progress: {
    borderRadius: 4,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 3,
  },
});