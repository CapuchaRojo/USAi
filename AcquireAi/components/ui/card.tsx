import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

interface CardProps {
  children: React.ReactNode;
  style?: any;
  className?: string;
}

interface CardHeaderProps {
  children: React.ReactNode;
  style?: any;
  className?: string;
}

interface CardTitleProps {
  children: React.ReactNode;
  style?: any;
  className?: string;
}

interface CardContentProps {
  children: React.ReactNode;
  style?: any;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, style, className = "" }) => (
  <View style={[styles.card, style]}>
    {children}
  </View>
);

export const CardHeader: React.FC<CardHeaderProps> = ({ children, style, className = "" }) => (
  <View style={[styles.cardHeader, style]}>
    {children}
  </View>
);

export const CardTitle: React.FC<CardTitleProps> = ({ children, style, className = "" }) => (
  <Text style={[styles.cardTitle, style]}>
    {children}
  </Text>
);

export const CardContent: React.FC<CardContentProps> = ({ children, style, className = "" }) => (
  <View style={[styles.cardContent, style]}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardOverlay,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    padding: 16,
    shadowColor: Colors.glowSecondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  cardHeader: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    letterSpacing: 1,
  },
  cardContent: {
    // No specific styling needed for content wrapper
  },
});