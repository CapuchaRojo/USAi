﻿import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/Styles';
import { SwarmVisualization } from '@/components/swarm/SwarmVisualization';
import { CommandLineInterface } from '@/components/cli/CommandLineInterface';
import { GlowButton } from '@/components/ui/GlowButton';
import { agentService, swarmService } from '@/lib/supabase';
import { Agent } from '@/types/database';
import { Network, Command, Activity, Users, Zap, Shield, Target, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle } from 'lucide-react-native';

export default function SwarmScreen() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showCLI, setShowCLI] = useState(false);
  const [swarmStats, setSwarmStats] = useState({
    totalSwarms: 3,
    activeAgents: 47,
    coordinationEfficiency: 94,
    networkLatency: 12,
    resourceUtilization: 67,
  });

  const loadData = async () => {
    try {
      const agentsData = await agentService.getAll();
      setAgents(agentsData || []);
    } catch (error) {
      console.error('Error loading swarm data:', error);
    }
  };

  useEffect(() => {
    loadData();
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      setSwarmStats(prev => ({
        ...prev,
        coordinationEfficiency: Math.min(99, prev.coordinationEfficiency + Math.random() * 2 - 1),
        networkLatency: Math.max(5, prev.networkLatency + Math.random() * 4 - 2),
        resourceUtilization: Math.min(95, Math.max(30, prev.resourceUtilization + Math.random() * 10 - 5)),
      }));
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleSwarmDeploy = async () => {
    try {
      const newSwarm = await swarmService.create({
        swarm_id: `SWARM-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        swarm_type: 'tactical',
        agent_ids: [],
        configuration: {
          deployment_mode: 'coordinated',
          mission_type: 'reconnaissance',
        },
        status: 'active',
      });
      
      console.log('Swarm deployed:', newSwarm);
      await loadData();
    } catch (error) {
      console.error('Error deploying swarm:', error);
    }
  };

  const handleEmergencyRecall = async () => {
    console.log('Emergency recall initiated');
    // Implement emergency recall logic
  };

  return (
    <SafeAreaView style={GlobalStyles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Network size={24} color={Colors.primary} />
          <Text style={styles.title}>SWARM MAP</Text>
          <Text style={styles.subtitle}>
            Real-time Agent Network Visualization
          </Text>
        </View>

        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
            />
          }
          showsVerticalScrollIndicator={false}
        >
          {/* Network Status Bar */}
          <View style={styles.statusBar}>
            <View style={styles.statusItem}>
              <Activity size={16} color={Colors.success} />
              <Text style={styles.statusLabel}>NETWORK</Text>
              <Text style={[styles.statusValue, { color: Colors.success }]}>ONLINE</Text>
            </View>
            
            <View style={styles.statusItem}>
              <Users size={16} color={Colors.primary} />
              <Text style={styles.statusLabel}>AGENTS</Text>
              <Text style={[styles.statusValue, { color: Colors.primary }]}>{agents.length}</Text>
            </View>
            
            <View style={styles.statusItem}>
              <Zap size={16} color={Colors.warning} />
              <Text style={styles.statusLabel}>EFFICIENCY</Text>
              <Text style={[styles.statusValue, { color: Colors.warning }]}>{swarmStats.coordinationEfficiency.toFixed(0)}%</Text>
            </View>
            
            <View style={styles.statusItem}>
              <Target size={16} color={Colors.secondary} />
              <Text style={styles.statusLabel}>LATENCY</Text>
              <Text style={[styles.statusValue, { color: Colors.secondary }]}>{swarmStats.networkLatency}ms</Text>
            </View>
          </View>

          {/* Swarm Visualization */}
          {agents.length > 0 ? (
            <SwarmVisualization agents={agents} />
          ) : (
            <View style={styles.emptySwarm}>
              <Network size={64} color={Colors.textMuted} />
              <Text style={styles.emptyTitle}>No Active Swarms</Text>
              <Text style={styles.emptySubtitle}>
                Deploy your first swarm to begin network visualization
              </Text>
            </View>
          )}

          {/* Control Panel */}
          <View style={styles.controlPanel}>
            <Text style={styles.sectionTitle}>SWARM CONTROL</Text>
            
            <View style={styles.controlGrid}>
              <GlowButton
                title="DEPLOY SWARM"
                onPress={handleSwarmDeploy}
                variant="primary"
                style={styles.controlButton}
              />
              
              <GlowButton
                title="TACTICAL UNIT"
                onPress={() => {}}
                variant="secondary"
                style={styles.controlButton}
              />
              
              <GlowButton
                title="RECON SQUAD"
                onPress={() => {}}
                variant="success"
                style={styles.controlButton}
              />
              
              <GlowButton
                title="EMERGENCY RECALL"
                onPress={handleEmergencyRecall}
                variant="error"
                style={styles.controlButton}
              />
            </View>
          </View>

          {/* Performance Metrics */}
          <View style={styles.metricsPanel}>
            <Text style={styles.sectionTitle}>PERFORMANCE METRICS</Text>
            
            <View style={styles.metricsGrid}>
              <View style={styles.metricCard}>
                <Shield size={20} color={Colors.success} />
                <Text style={styles.metricValue}>{swarmStats.totalSwarms}</Text>
                <Text style={styles.metricLabel}>ACTIVE SWARMS</Text>
                <View style={styles.metricBar}>
                  <View style={[styles.metricProgress, { 
                    width: `${(swarmStats.totalSwarms / 5) * 100}%`,
                    backgroundColor: Colors.success 
                  }]} />
                </View>
              </View>
              
              <View style={styles.metricCard}>
                <Users size={20} color={Colors.primary} />
                <Text style={styles.metricValue}>{swarmStats.activeAgents}</Text>
                <Text style={styles.metricLabel}>TOTAL AGENTS</Text>
                <View style={styles.metricBar}>
                  <View style={[styles.metricProgress, { 
                    width: `${(swarmStats.activeAgents / 50) * 100}%`,
                    backgroundColor: Colors.primary 
                  }]} />
                </View>
              </View>
              
              <View style={styles.metricCard}>
                <Activity size={20} color={Colors.warning} />
                <Text style={styles.metricValue}>{swarmStats.resourceUtilization}%</Text>
                <Text style={styles.metricLabel}>RESOURCE USE</Text>
                <View style={styles.metricBar}>
                  <View style={[styles.metricProgress, { 
                    width: `${swarmStats.resourceUtilization}%`,
                    backgroundColor: Colors.warning 
                  }]} />
                </View>
              </View>
              
              <View style={styles.metricCard}>
                <Zap size={20} color={Colors.secondary} />
                <Text style={styles.metricValue}>{swarmStats.coordinationEfficiency.toFixed(0)}%</Text>
                <Text style={styles.metricLabel}>COORDINATION</Text>
                <View style={styles.metricBar}>
                  <View style={[styles.metricProgress, { 
                    width: `${swarmStats.coordinationEfficiency}%`,
                    backgroundColor: Colors.secondary 
                  }]} />
                </View>
              </View>
            </View>
          </View>

          {/* Mission Status */}
          <View style={styles.missionPanel}>
            <Text style={styles.sectionTitle}>ACTIVE MISSIONS</Text>
            
            <View style={styles.missionList}>
              <View style={styles.missionItem}>
                <CheckCircle size={16} color={Colors.success} />
                <View style={styles.missionInfo}>
                  <Text style={styles.missionTitle}>Perimeter Reconnaissance</Text>
                  <Text style={styles.missionDetails}>Swarm Alpha-7 | 3 agents | 85% complete</Text>
                </View>
                <Text style={styles.missionTime}>12m</Text>
              </View>
              
              <View style={styles.missionItem}>
                <Activity size={16} color={Colors.primary} />
                <View style={styles.missionInfo}>
                  <Text style={styles.missionTitle}>Data Collection Protocol</Text>
                  <Text style={styles.missionDetails}>Swarm Beta-3 | 5 agents | In progress</Text>
                </View>
                <Text style={styles.missionTime}>8m</Text>
              </View>
              
              <View style={styles.missionItem}>
                <AlertTriangle size={16} color={Colors.warning} />
                <View style={styles.missionInfo}>
                  <Text style={styles.missionTitle}>Security Sweep</Text>
                  <Text style={styles.missionDetails}>Swarm Gamma-1 | 2 agents | Anomaly detected</Text>
                </View>
                <Text style={styles.missionTime}>3m</Text>
              </View>
            </View>
          </View>

          {/* CLI Toggle */}
          <View style={styles.cliToggle}>
            <GlowButton
              title={showCLI ? "HIDE COMMAND INTERFACE" : "SHOW COMMAND INTERFACE"}
              onPress={() => setShowCLI(!showCLI)}
              variant="secondary"
            />
          </View>

          {/* Command Line Interface */}
          {showCLI && (
            <View style={styles.cliSection}>
              <CommandLineInterface />
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark,
  },
  
  header: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 2,
    borderBottomColor: Colors.panelBorder,
    backgroundColor: Colors.cardOverlay,
  },
  
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 2,
    marginTop: 8,
    textShadowColor: Colors.glowPrimary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: Colors.cardOverlay,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  
  statusItem: {
    alignItems: 'center',
    gap: 4,
  },
  
  statusLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  
  statusValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  
  emptySwarm: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 60,
    margin: 20,
    backgroundColor: Colors.cardOverlay,
    borderWidth: 2,
    borderColor: Colors.panelBorder,
  },
  
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 16,
    marginBottom: 8,
  },
  
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  
  controlPanel: {
    margin: 16,
    padding: 16,
    backgroundColor: Colors.cardOverlay,
    borderWidth: 2,
    borderColor: Colors.panelBorder,
    shadowColor: Colors.glowSecondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 2,
  },
  
  controlGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  
  controlButton: {
    flex: 1,
    minWidth: '45%',
  },
  
  metricsPanel: {
    margin: 16,
    padding: 16,
    backgroundColor: Colors.cardOverlay,
    borderWidth: 2,
    borderColor: Colors.panelBorder,
    shadowColor: Colors.glowSecondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  
  metricCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.darkGray,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    alignItems: 'center',
  },
  
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginVertical: 4,
  },
  
  metricLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  
  metricBar: {
    width: '100%',
    height: 4,
    backgroundColor: Colors.mediumGray,
    borderRadius: 2,
    overflow: 'hidden',
  },
  
  metricProgress: {
    height: '100%',
    borderRadius: 2,
  },
  
  missionPanel: {
    margin: 16,
    padding: 16,
    backgroundColor: Colors.cardOverlay,
    borderWidth: 2,
    borderColor: Colors.panelBorder,
    shadowColor: Colors.glowSecondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  
  missionList: {
    gap: 12,
  },
  
  missionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.darkGray,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  
  missionInfo: {
    flex: 1,
    marginLeft: 12,
  },
  
  missionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  
  missionDetails: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  
  missionTime: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  
  cliToggle: {
    margin: 16,
  },
  
  cliSection: {
    margin: 16,
    height: 400,
    backgroundColor: Colors.cardOverlay,
    borderWidth: 2,
    borderColor: Colors.secondary,
    overflow: 'hidden',
  },
});