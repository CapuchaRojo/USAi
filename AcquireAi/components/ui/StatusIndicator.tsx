import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

interface StatusIndicatorProps {
  status: 'online' | 'offline' | 'mission-critical' | 'initializing' | 'error';
  size?: 'small' | 'medium' | 'large';
}

export function StatusIndicator({ status, size = 'medium' }: StatusIndicatorProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return Colors.online;
      case 'offline':
        return Colors.offline;
      case 'mission-critical':
        return Colors.missionCritical;
      case 'initializing':
        return Colors.warning;
      case 'error':
        return Colors.error;
      default:
        return Colors.textMuted;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'online':
        return 'ONLINE';
      case 'offline':
        return 'OFFLINE';
      case 'mission-critical':
        return 'CRITICAL';
      case 'initializing':
        return 'INIT';
      case 'error':
        return 'ERROR';
      default:
        return 'UNKNOWN';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { width: 8, height: 8 };
      case 'medium':
        return { width: 12, height: 12 };
      case 'large':
        return { width: 16, height: 16 };
      default:
        return { width: 12, height: 12 };
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.indicator,
          getSizeStyles(),
          { 
            backgroundColor: getStatusColor(),
            shadowColor: getStatusColor(),
          }
        ]}
      />
      <Text style={[styles.text, { color: getStatusColor() }]}>
        {getStatusText()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  indicator: {
    borderRadius: 50,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },
  text: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});