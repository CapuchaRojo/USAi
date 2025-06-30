import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Agent } from '@/types/database';

interface AgentCardProps {
  agent: Agent;
  onPress?: () => void;
}

// Agent avatar images from Pexels
const getAgentAvatar = (agentType: string, name: string) => {
  const avatars = {
    Controller: [
      'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    ],
    Oracle: [
      'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    ],
    Dispatcher: [
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    ],
    Modular: [
      'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    ],
  };
  
  const typeAvatars = avatars[agentType as keyof typeof avatars] || avatars.Modular;
  const hash = name.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  return typeAvatars[hash % typeAvatars.length];
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

const getStatusText = (status: string) => {
  switch (status) {
    case 'online':
      return 'ONLINE';
    case 'busy':
      return 'BUSY';
    case 'offline':
      return 'OFFLINE';
    case 'mission-critical':
      return 'CRITICAL';
    case 'initializing':
      return 'INIT';
    default:
      return 'UNKNOWN';
  }
};

const getBorderColor = (agentType: string) => {
  switch (agentType) {
    case 'Controller':
      return Colors.secondary; // Neon pink
    case 'Oracle':
      return Colors.primary;   // Electric blue
    case 'Dispatcher':
      return Colors.primary;   // Electric blue
    case 'Modular':
      return Colors.warning;   // Amber
    default:
      return Colors.frameBorder;
  }
};

const generateRandomText = (length: number) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export function AgentCard({ agent, onPress }: AgentCardProps) {
  const borderColor = getBorderColor(agent.agent_type);
  const statusColor = getStatusColor(agent.status);
  const avatarUrl = getAgentAvatar(agent.agent_type, agent.name);
  
  // Generate consistent random text based on agent ID
  const hash = agent.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const randomTexts = [
    generateRandomText(8 + (hash % 4)),
    generateRandomText(6 + (hash % 3)),
    generateRandomText(7 + (hash % 5)),
    generateRandomText(9 + (hash % 3)),
  ];

  return (
    <TouchableOpacity
      style={[styles.container, { borderColor }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Corner decorations */}
      <View style={[styles.cornerDecoration, styles.topLeft, { borderColor }]} />
      <View style={[styles.cornerDecoration, styles.topRight, { borderColor }]} />
      <View style={[styles.cornerDecoration, styles.bottomLeft, { borderColor }]} />
      <View style={[styles.cornerDecoration, styles.bottomRight, { borderColor }]} />
      
      {/* Agent Avatar */}
      <View style={[styles.avatarContainer, { borderColor }]}>
        <Image
          source={{ uri: avatarUrl }}
          style={styles.avatar}
          resizeMode="cover"
        />
      </View>
      
      {/* Agent Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.agentName}>{agent.name}</Text>
        <Text style={styles.agentRole}>{agent.role}</Text>
        
        {/* Status Indicator */}
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text style={[styles.statusText, { color: statusColor }]}>
            {getStatusText(agent.status)}
          </Text>
        </View>
      </View>
      
      {/* Random Tech Text */}
      <View style={styles.techTextContainer}>
        <Text style={styles.techText}>{randomTexts[0]}</Text>
        <Text style={styles.techText}>{randomTexts[1]}</Text>
        <Text style={styles.techText}>{randomTexts[2]}</Text>
        <Text style={styles.techText}>{randomTexts[3]}</Text>
      </View>
      
      {/* Performance Metrics */}
      <View style={styles.metricsContainer}>
        <Text style={styles.metricText}>
          EFF {(agent.efficiency * 10).toFixed(1)}
        </Text>
        <Text style={styles.metricText}>
          {(agent.accuracy * 10).toFixed(1)}.{Math.floor(agent.adaptability * 10)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 280,
    height: 180,
    backgroundColor: Colors.cardOverlay,
    borderWidth: 2,
    margin: 8,
    position: 'relative',
    shadowColor: Colors.glowPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  
  // Corner decorations for angled look
  cornerDecoration: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderWidth: 2,
  },
  topLeft: {
    top: -2,
    left: -2,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: -2,
    right: -2,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: -2,
    right: -2,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  
  avatarContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 60,
    height: 60,
    borderWidth: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  
  avatar: {
    width: '100%',
    height: '100%',
  },
  
  infoContainer: {
    position: 'absolute',
    top: 12,
    left: 85,
    right: 12,
  },
  
  agentName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: 1,
    marginBottom: 4,
  },
  
  agentRole: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  
  techTextContainer: {
    position: 'absolute',
    bottom: 45,
    left: 12,
    right: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  
  techText: {
    fontSize: 10,
    color: Colors.primary,
    fontFamily: 'monospace',
    backgroundColor: 'rgba(0, 191, 255, 0.1)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: 'rgba(0, 191, 255, 0.3)',
  },
  
  metricsContainer: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  metricText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    fontFamily: 'monospace',
  },
});