import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

const TabsContext = React.createContext<{
  activeTab: string;
  setActiveTab: (value: string) => void;
}>({
  activeTab: '',
  setActiveTab: () => {},
});

export const Tabs: React.FC<TabsProps> = ({ value, onValueChange, children, className = "" }) => {
  return (
    <TabsContext.Provider value={{ activeTab: value, setActiveTab: onValueChange }}>
      <View style={styles.tabsContainer}>
        {children}
      </View>
    </TabsContext.Provider>
  );
};

export const TabsList: React.FC<TabsListProps> = ({ children, className = "" }) => {
  return (
    <View style={styles.tabsList}>
      {children}
    </View>
  );
};

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, children, className = "" }) => {
  const { activeTab, setActiveTab } = React.useContext(TabsContext);
  const isActive = activeTab === value;

  return (
    <TouchableOpacity
      style={[
        styles.tabsTrigger,
        isActive && styles.tabsTriggerActive
      ]}
      onPress={() => setActiveTab(value)}
      activeOpacity={0.8}
    >
      <Text style={[
        styles.tabsTriggerText,
        isActive && styles.tabsTriggerTextActive
      ]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

export const TabsContent: React.FC<TabsContentProps> = ({ value, children, className = "" }) => {
  const { activeTab } = React.useContext(TabsContext);
  
  if (activeTab !== value) {
    return null;
  }

  return (
    <View style={styles.tabsContent}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  tabsContainer: {
    flex: 1,
  },
  tabsList: {
    flexDirection: 'row',
    backgroundColor: Colors.cardOverlay,
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  tabsTrigger: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabsTriggerActive: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.glowPrimary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 4,
  },
  tabsTriggerText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tabsTriggerTextActive: {
    color: Colors.textPrimary,
  },
  tabsContent: {
    flex: 1,
  },
});