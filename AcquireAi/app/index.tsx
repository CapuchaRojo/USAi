import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { WebBanner } from '@/components/WebBanner';

export default function HomeScreen() {
  const handleDeployAgent = () => {
    console.log('Deploy Agent action triggered');
  };

  const handleInitiateECRR = () => {
    console.log('Initiate E.C.R.R. action triggered');
  };

  const handleViewSwarm = () => {
    console.log('View Swarm action triggered');
  };

  const handleSystemStatus = () => {
    console.log('System Status action triggered');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <WebBanner
          onDeployAgent={handleDeployAgent}
          onInitiateECRR={handleInitiateECRR}
          onViewSwarm={handleViewSwarm}
          onSystemStatus={handleSystemStatus}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark,
  },
  content: {
    flex: 1,
  },
});