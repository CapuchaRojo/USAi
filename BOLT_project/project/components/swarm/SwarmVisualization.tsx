import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Agent } from '@/types/database';
import { Network, Radio, Shield, Zap, Cpu, Eye, Command } from 'lucide-react-native';

interface SwarmVisualizationProps {
  agents: Agent[];
}

const { width } = Dimensions.get('window');

export function SwarmVisualization({ agents }: SwarmVisualizationProps) {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 4);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getAgentPosition = (index: number, total: number) => {
    const centerX = width * 0.4;
    const centerY = 200;
    
    if (total === 1) {
      return { x: centerX - 25, y: centerY - 25 };
    }
    
    const radius = Math.min(width * 0.25, 100);
    const angle = (index / total) * 2 * Math.PI;
    
    return {
      x: centerX + radius * Math.cos(angle) - 25,
      y: centerY + radius * Math.sin(angle) - 25,
    };
  };

  const getAgentIcon = (type: string) => {
    switch (type) {
      case 'Controller':
        return <Command size={16} color={Colors.secondary} />;
      case 'Oracle':
        return <Eye size={16} color={Colors.primary} />;
      case 'Dispatcher':
        return <Network size={16} color={Colors.success} />;
      case 'Modular':
        return <Cpu size={16} color={Colors.warning} />;
      default:
        return <Cpu size={16} color={Colors.textMuted} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return Colors.online;
      case 'busy':
        return Colors.busy;
      case 'offline':
        return Colors.offline;
      case 'mission-critical':
        return Colors.missionCritical;
      default:
        return Colors.textMuted;
    }
  };

  const connectionLines = agents.map((agent, index) => {
    if (!agent.parent_id) return null;
    
    const parentIndex = agents.findIndex(a => a.id === agent.parent_id);
    if (parentIndex === -1) return null;
    
    const agentPos = getAgentPosition(index, agents.length);
    const parentPos = getAgentPosition(parentIndex, agents.length);
    
    return { 
      from: { x: agentPos.x + 25, y: agentPos.y + 25 }, 
      to: { x: parentPos.x + 25, y: parentPos.y + 25 }, 
      key: `${agent.id}-${agent.parent_id}` 
    };
  }).filter(Boolean);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>SWARM NETWORK</Text>
        <Text style={styles.subtitle}>
          {agents.length} Active Agents | 
          {agents.filter(a => a.status === 'online').length} Online
        </Text>
      </View>

      <View style={styles.visualization}>
        {/* Grid Background */}
        <View style={styles.gridBackground}>
          {Array.from({ length: 8 }).map((_, i) => (
            <View key={`h-${i}`} style={[styles.gridLine, styles.horizontalLine, { top: i * 50 }]} />
          ))}
          {Array.from({ length: 12 }).map((_, i) => (
            <View key={`v-${i}`} style={[styles.gridLine, styles.verticalLine, { left: i * 50 }]} />
          ))}
        </View>

        {/* Connection lines */}
        {connectionLines.map((line, index) => (
          line && (
            <View key={line.key} style={styles.connectionContainer}>
              <View
                style={[
                  styles.connectionLine,
                  {
                    position: 'absolute',
                    left: Math.min(line.from.x, line.to.x),
                    top: Math.min(line.from.y, line.to.y),
                    width: Math.abs(line.to.x - line.from.x),
                    height: Math.abs(line.to.y - line.from.y),
                  },
                ]}
              />
              {/* Animated data flow */}
              <View
                style={[
                  styles.dataFlow,
                  {
                    position: 'absolute',
                    left: line.from.x + (line.to.x - line.from.x) * (animationPhase / 4),
                    top: line.from.y + (line.to.y - line.from.y) * (animationPhase / 4),
                  },
                ]}
              />
            </View>
          )
        ))}

        {/* Agent nodes */}
        {agents.map((agent, index) => {
          const position = getAgentPosition(index, agents.length);
          const isSelected = selectedAgent === agent.id;
          const statusColor = getStatusColor(agent.status);
          
          return (
            <TouchableOpacity
              key={agent.id}
              style={[
                styles.agentNode,
                {
                  position: 'absolute',
                  left: position.x,
                  top: position.y,
                  borderColor: isSelected ? Colors.secondary : statusColor,
                  shadowColor: statusColor,
                },
              ]}
              onPress={() => setSelectedAgent(isSelected ? null : agent.id)}
            >
              <View style={styles.agentIcon}>
                {getAgentIcon(agent.agent_type)}
              </View>
              
              <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
              
              <Text style={styles.agentName}>{agent.name.split('-')[0]}</Text>
              <Text style={styles.agentLevel}>L{agent.level}</Text>
              
              {/* Pulse animation for online agents */}
              {agent.status === 'online' && (
                <View style={[styles.pulseRing, { borderColor: statusColor }]} />
              )}
            </TouchableOpacity>
          );
        })}

        {/* Central hub */}
        <View style={styles.centralHub}>
          <Shield size={24} color={Colors.primary} />
          <Text style={styles.hubText}>USAi</Text>
          <Text style={styles.hubSubtext}>CORE</Text>
          
          {/* Hub pulse animation */}
          <View style={[styles.hubPulse, { borderColor: Colors.primary }]} />
        </View>
      </View>

      {/* Agent Details Panel */}
      {selectedAgent && (
        <View style={styles.detailsPanel}>
          {(() => {
            const agent = agents.find(a => a.id === selectedAgent);
            if (!agent) return null;
            
            return (
              <View style={styles.agentDetails}>
                <Text style={styles.detailsTitle}>{agent.name}</Text>
                <Text style={styles.detailsRole}>{agent.role}</Text>
                
                <View style={styles.detailsMetrics}>
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>EFF</Text>
                    <Text style={styles.metricValue}>{(agent.efficiency * 100).toFixed(0)}%</Text>
                  </View>
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>ACC</Text>
                    <Text style={styles.metricValue}>{(agent.accuracy * 100).toFixed(0)}%</Text>
                  </View>
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>ADP</Text>
                    <Text style={styles.metricValue}>{(agent.adaptability * 100).toFixed(0)}%</Text>
                  </View>
                </View>
                
                <View style={styles.detailsStatus}>
                  <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(agent.status) }]} />
                  <Text style={[styles.statusLabel, { color: getStatusColor(agent.status) }]}>
                    {agent.status.toUpperCase()}
                  </Text>
                </View>
              </View>
            );
          })()}
        </View>
      )}

      {/* Legend */}
      <View style={styles.legend}>
        <Text style={styles.legendTitle}>AGENT TYPES</Text>
        <View style={styles.legendItems}>
          <View style={styles.legendItem}>
            <Command size={16} color={Colors.secondary} />
            <Text style={styles.legendText}>Controller</Text>
          </View>
          <View style={styles.legendItem}>
            <Eye size={16} color={Colors.primary} />
            <Text style={styles.legendText}>Oracle</Text>
          </View>
          <View style={styles.legendItem}>
            <Network size={16} color={Colors.success} />
            <Text style={styles.legendText}>Dispatcher</Text>
          </View>
          <View style={styles.legendItem}>
            <Cpu size={16} color={Colors.warning} />
            <Text style={styles.legendText}>Modular</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: Colors.panelBorder,
    backgroundColor: Colors.cardOverlay,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 2,
    textShadowColor: Colors.glowPrimary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 8,
  },
  visualization: {
    height: 400,
    margin: 20,
    position: 'relative',
    backgroundColor: Colors.cardOverlay,
    borderWidth: 2,
    borderColor: Colors.panelBorder,
  },
  gridBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: Colors.lightGray,
    opacity: 0.3,
  },
  horizontalLine: {
    width: '100%',
    height: 1,
  },
  verticalLine: {
    height: '100%',
    width: 1,
  },
  connectionContainer: {
    position: 'absolute',
  },
  connectionLine: {
    backgroundColor: Colors.secondary,
    opacity: 0.6,
    height: 2,
    shadowColor: Colors.glowSecondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  dataFlow: {
    width: 6,
    height: 6,
    backgroundColor: Colors.primary,
    borderRadius: 3,
    shadowColor: Colors.glowPrimary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  agentNode: {
    width: 50,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.cardOverlay,
    borderWidth: 2,
    borderRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  agentIcon: {
    marginBottom: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    position: 'absolute',
    top: 4,
    right: 4,
    shadowColor: 'currentColor',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  agentName: {
    fontSize: 8,
    color: Colors.textPrimary,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 2,
  },
  agentLevel: {
    fontSize: 7,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    opacity: 0.6,
  },
  centralHub: {
    position: 'absolute',
    left: width * 0.4 - 30,
    top: 170,
    width: 60,
    height: 60,
    backgroundColor: Colors.primary,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.glowPrimary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 10,
  },
  hubText: {
    fontSize: 8,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  hubSubtext: {
    fontSize: 6,
    color: Colors.textPrimary,
    opacity: 0.8,
  },
  hubPulse: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    opacity: 0.4,
  },
  detailsPanel: {
    margin: 20,
    padding: 16,
    backgroundColor: Colors.cardOverlay,
    borderWidth: 2,
    borderColor: Colors.secondary,
    shadowColor: Colors.glowSecondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  agentDetails: {
    alignItems: 'center',
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  detailsRole: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  detailsMetrics: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  detailsStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  legend: {
    margin: 20,
    padding: 16,
    backgroundColor: Colors.cardOverlay,
    borderWidth: 2,
    borderColor: Colors.panelBorder,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  legendItems: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legendItem: {
    alignItems: 'center',
    gap: 4,
  },
  legendText: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
});