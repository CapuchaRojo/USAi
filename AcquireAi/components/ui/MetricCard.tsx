import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { ProgressBar } from './ProgressBar';

interface MetricCardProps {
  title: string;
  value: number;
  unit?: string;
  color?: string;
  showProgress?: boolean;
  maxValue?: number;
}

export function MetricCard({ 
  title, 
  value, 
  unit = '', 
  color = Colors.primary,
  showProgress = false,
  maxValue = 100
}: MetricCardProps) {
  const displayValue = typeof value === 'number' ? value.toFixed(2) : '0.00';
  const progressValue = showProgress ? (value / maxValue) * 100 : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.valueContainer}>
        <Text style={[styles.value, { color }]}>
          {displayValue}
        </Text>
        {unit && <Text style={styles.unit}>{unit}</Text>}
      </View>
      {showProgress && (
        <View style={styles.progressContainer}>
          <ProgressBar 
            progress={progressValue} 
            color={color}
            showPercentage={false}
            height={4}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.darkGray,
    borderRadius: 8,
    padding: 12,
    margin: 4,
    alignItems: 'center',
    minWidth: 80,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    shadowColor: Colors.glowSecondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: 'Orbitron-Bold',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    fontFamily: 'Orbitron-Black',
  },
  unit: {
    fontSize: 10,
    color: Colors.textMuted,
    marginLeft: 2,
    fontFamily: 'Orbitron-Regular',
  },
  progressContainer: {
    width: '100%',
    marginTop: 6,
  },
});