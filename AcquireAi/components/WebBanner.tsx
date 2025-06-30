import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert, ScrollView } from 'react-native';
import { Colors } from '@/constants/Colors';
import { GlowButton } from '@/components/ui/GlowButton'; 
import { MetricCard } from '@/components/ui/MetricCard'; 
import { ProgressBar } from '@/components/ui/ProgressBar'; 
import { StatusIndicator } from '@/components/ui/StatusIndicator'; 
import { CommandLineInterface } from '@/components/cli/CommandLineInterface'; 
import { SwarmVisualization } from '@/components/swarm/SwarmVisualization'; 
import { Shield, Zap, Network, Command, Activity, Users, Target, Brain, Eye, Cpu, Settings, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Clock } from 'lucide-react-native';

const { width } = Dimensions.get('window');

// STATIC DEMO DATA - Linktree Analysis Results
const STATIC_AGENTS = [
  {
    id: 'agent-001',
    name: 'Profile-Manager-ALPHA',
    agent_type: 'Controller',
    role: 'Profile Interface Controller',
    status: 'online',
    parent_id: undefined,
    level: 8,
    experience_points: 1250,
    efficiency: 0.89,
    accuracy: 0.94,
    adaptability: 0.82,
    specialization: 0.91,
    skills: ['profile_management', 'user_interface', 'content_curation', 'brand_consistency'],
    collected_tools: [],
    configuration: {
      specialization_focus: 'User profile management and interface optimization',
      ecrr_source: 'Linktree',
      deployment_mode: 'ecrr_based'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_heartbeat: new Date().toISOString(),
  },
  {
    id: 'agent-002',
    name: 'Link-Coordinator-BETA',
    agent_type: 'Dispatcher',
    role: 'Link Management Specialist',
    status: 'online',
    parent_id: 'agent-001',
    level: 6,
    experience_points: 890,
    efficiency: 0.92,
    accuracy: 0.88,
    adaptability: 0.85,
    specialization: 0.87,
    skills: ['link_management', 'url_optimization', 'click_tracking', 'redirect_handling'],
    collected_tools: [],
    configuration: {
      specialization_focus: 'Link coordination and traffic management',
      ecrr_source: 'Linktree',
      deployment_mode: 'ecrr_based'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_heartbeat: new Date().toISOString(),
  },
  {
    id: 'agent-003',
    name: 'Analytics-Oracle-GAMMA',
    agent_type: 'Oracle',
    role: 'Data Intelligence Analyst',
    status: 'online',
    parent_id: 'agent-001',
    level: 12,
    experience_points: 2100,
    efficiency: 0.85,
    accuracy: 0.96,
    adaptability: 0.79,
    specialization: 0.93,
    skills: ['data_analysis', 'user_behavior', 'performance_metrics', 'predictive_modeling'],
    collected_tools: [],
    configuration: {
      specialization_focus: 'Analytics and user behavior intelligence',
      ecrr_source: 'Linktree',
      deployment_mode: 'ecrr_based'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_heartbeat: new Date().toISOString(),
  },
  {
    id: 'agent-004',
    name: 'Theme-Designer-DELTA',
    agent_type: 'Modular',
    role: 'Visual Design Specialist',
    status: 'online',
    parent_id: 'agent-001',
    level: 5,
    experience_points: 650,
    efficiency: 0.78,
    accuracy: 0.91,
    adaptability: 0.88,
    specialization: 0.84,
    skills: ['visual_design', 'color_theory', 'typography', 'brand_alignment'],
    collected_tools: [],
    configuration: {
      specialization_focus: 'Visual design and brand consistency',
      ecrr_source: 'Linktree',
      deployment_mode: 'ecrr_based'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_heartbeat: new Date().toISOString(),
  },
  {
    id: 'agent-005',
    name: 'Monetization-Controller-EPSILON',
    agent_type: 'Controller',
    role: 'Revenue Optimization Commander',
    status: 'mission-critical',
    parent_id: undefined,
    level: 10,
    experience_points: 1800,
    efficiency: 0.93,
    accuracy: 0.89,
    adaptability: 0.86,
    specialization: 0.95,
    skills: ['revenue_optimization', 'conversion_tracking', 'pricing_strategy', 'payment_integration'],
    collected_tools: [],
    configuration: {
      specialization_focus: 'Revenue generation and monetization strategies',
      ecrr_source: 'Linktree',
      deployment_mode: 'ecrr_based'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_heartbeat: new Date().toISOString(),
  },
  {
    id: 'agent-006',
    name: 'SEO-Optimizer-ZETA',
    agent_type: 'Modular',
    role: 'Search Engine Optimization Specialist',
    status: 'online',
    parent_id: 'agent-003',
    level: 7,
    experience_points: 980,
    efficiency: 0.87,
    accuracy: 0.92,
    adaptability: 0.83,
    specialization: 0.89,
    skills: ['seo_optimization', 'keyword_research', 'meta_tags', 'search_visibility'],
    collected_tools: [],
    configuration: {
      specialization_focus: 'Search engine optimization and visibility',
      ecrr_source: 'Linktree',
      deployment_mode: 'ecrr_based'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_heartbeat: new Date().toISOString(),
  }
];

const STATIC_MISSIONS = [
  {
    id: 'mission-001',
    title: 'Optimize Profile Performance',
    description: 'Enhance user profile engagement and conversion rates',
    mission_type: 'optimization',
    status: 'active',
    priority: 'high',
    assigned_agents: ['agent-001', 'agent-004'],
    requirements: { performance_target: 0.85, completion_deadline: '2025-02-01' },
    progress: 67.5,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date().toISOString(),
    deadline: new Date(Date.now() + 604800000).toISOString(),
  },
  {
    id: 'mission-002',
    title: 'Implement Advanced Analytics',
    description: 'Deploy comprehensive user behavior tracking system',
    mission_type: 'analytics',
    status: 'completed',
    priority: 'medium',
    assigned_agents: ['agent-003'],
    requirements: { data_accuracy: 0.95, real_time_processing: true },
    progress: 100,
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 3600000).toISOString(),
    completed_at: new Date(Date.now() - 3600000).toISOString(),
  }
];

interface WebBannerProps {
  onDeployAgent?: () => void;
  onInitiateECRR?: () => void;
  onViewSwarm?: () => void;
  onSystemStatus?: () => void;
}

export function WebBanner({ 
  onDeployAgent, 
  onInitiateECRR, 
  onViewSwarm, 
  onSystemStatus 
}: WebBannerProps) {
  const [systemStatus, setSystemStatus] = useState('OPERATIONAL');
  const [agents] = useState(STATIC_AGENTS);
  const [missions] = useState(STATIC_MISSIONS);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [showCLI, setShowCLI] = useState(false);
  const [showSwarm, setShowSwarm] = useState(false);
  const [currentView, setCurrentView] = useState('overview');

  useEffect(() => {
    // Simulate real-time system updates
    const interval = setInterval(() => {
      setSystemStatus(prev => prev === 'OPERATIONAL' ? 'SCANNING' : 'OPERATIONAL');
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleDeployAgent = async () => {
    setActiveButton('deploy');
    setIsProcessing(true);
    
    // Simulate deployment process
    setTimeout(() => {
      if (onDeployAgent) {
        onDeployAgent();
      }
      
      Alert.alert(
        'Agent Deployed Successfully',
        `New agent deployed!\nType: Modular\nRole: General Purpose Agent\nStatus: Initializing\n\nNote: This is a demo showing agent deployment`,
        [{ text: 'OK', style: 'default' }]
      );
      
      setIsProcessing(false);
      setActiveButton(null);
    }, 1500);
  };

  const handleInitiateECRR = async () => {
    setActiveButton('ecrr');
    setIsProcessing(true);
    
    // Simulate ECRR process
    setTimeout(() => {
      if (onInitiateECRR) {
        onInitiateECRR();
      }
      
      Alert.alert(
        'E.C.R.R. Pipeline Initiated',
        `Target: Auto-detected System\nStatus: Processing...\n\nPhases:\n• Emulate: Analyzing target system\n• Condense: Extracting core functions\n• Repurpose: Adapting for Legion\n• Redeploy: Generating agents\n\nNote: This is a demo showing the ECRR concept`,
        [{ text: 'Monitor Progress', style: 'default' }]
      );
      
      setIsProcessing(false);
      setActiveButton(null);
    }, 2000);
  };

  const handleViewSwarm = () => {
    setActiveButton('swarm');
    setShowSwarm(!showSwarm);
    
    if (onViewSwarm) {
      onViewSwarm();
    }
    
    setTimeout(() => setActiveButton(null), 1000);
  };

  const handleSystemStatus = () => {
    setActiveButton('status');
    
    const onlineAgents = agents.filter(a => a.status === 'online').length;
    const activeMissions = missions.filter(m => m.status === 'active').length;
    
    if (onSystemStatus) {
      onSystemStatus();
    }
    
    Alert.alert(
      'System Status Report',
      `Status: ${systemStatus}\nAgents Online: ${onlineAgents}/${agents.length}\nActive Missions: ${activeMissions}\nUptime: 99.9%\nSecurity Level: ALPHA\nNetwork: ONLINE\nDatabase: CONNECTED\n\nAll systems operational\n\nNote: This is a demo showing system status`,
      [{ text: 'Detailed Report', style: 'default' }]
    );
    
    setTimeout(() => setActiveButton(null), 1000);
  };

  const handleEmergencyProtocol = () => {
    Alert.alert(
      'Emergency Protocol',
      'This will initiate emergency shutdown procedures. All active agents will be recalled and missions suspended.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm Emergency', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Emergency Activated', 'Emergency protocols initiated. All systems entering safe mode.');
          }
        },
      ]
    );
  };

  const getStatusColor = () => {
    return systemStatus === 'OPERATIONAL' ? Colors.success : Colors.primary;
  };

  const onlineAgents = agents.filter(a => a.status === 'online').length;
  const criticalAgents = agents.filter(a => a.status === 'mission-critical').length;
  const activeMissions = missions.filter(m => m.status === 'active').length;
  const completedMissions = missions.filter(m => m.status === 'completed').length;

  const getAgentTypeIcon = (type: string) => {
    switch (type) {
      case 'Controller':
        return <Command size={20} color={Colors.secondary} />;
      case 'Oracle':
        return <Eye size={20} color={Colors.primary} />;
      case 'Dispatcher':
        return <Network size={20} color={Colors.success} />;
      case 'Modular':
        return <Cpu size={20} color={Colors.warning} />;
      default:
        return <Cpu size={20} color={Colors.textMuted} />;
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Shield size={32} color={Colors.primary} />
          <View style={styles.titleContainer}>
            <Text style={styles.title}>USAi COMMAND CENTER</Text>
            <Text style={styles.subtitle}>Universal Swarm AI - Legion Control Interface</Text>
          </View>
        </View>

        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            SYSTEM {systemStatus}
          </Text>
        </View>
      </View>

      {/* Navigation Tabs */}
      <View style={styles.navigationTabs}>
        {[
          { id: 'overview', title: 'OVERVIEW', icon: <Activity size={16} color={currentView === 'overview' ? Colors.textPrimary : Colors.textMuted} /> },
          { id: 'agents', title: 'AGENTS', icon: <Users size={16} color={currentView === 'agents' ? Colors.textPrimary : Colors.textMuted} /> },
          { id: 'ecrr', title: 'ECRR', icon: <Brain size={16} color={currentView === 'ecrr' ? Colors.textPrimary : Colors.textMuted} /> },
          { id: 'swarm', title: 'SWARM', icon: <Network size={16} color={currentView === 'swarm' ? Colors.textPrimary : Colors.textMuted} /> },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.navTab, currentView === tab.id && styles.navTabActive]}
            onPress={() => setCurrentView(tab.id)}
          >
            {tab.icon}
            <Text style={[styles.navTabText, currentView === tab.id && styles.navTabTextActive]}>
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Overview Tab */}
      {currentView === 'overview' && (
        <View style={styles.content}>
          {/* Metrics Bar */}
          <View style={styles.metricsBar}>
            <MetricCard title="ONLINE" value={onlineAgents} color={Colors.success} />
            <MetricCard title="CRITICAL" value={criticalAgents} color={Colors.error} />
            <MetricCard title="MISSIONS" value={activeMissions} color={Colors.primary} />
            <MetricCard title="COMPLETED" value={completedMissions} color={Colors.secondary} />
          </View>

          {/* Agent Distribution */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>AGENT DISTRIBUTION</Text>
            <View style={styles.agentTypes}>
              {['Controller', 'Oracle', 'Dispatcher', 'Modular'].map((type) => (
                <View key={type} style={styles.agentTypeCard}>
                  {getAgentTypeIcon(type)} 
                  <Text style={styles.agentTypeCount}>
                    {agents.filter(a => a.agent_type === type).length} 
                  </Text>
                  <Text style={styles.agentTypeLabel}>{type}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionSection}>
            <Text style={styles.sectionTitle}>QUICK DEPLOYMENT</Text>
            <View style={styles.actionGrid}>
              <GlowButton
                title={isProcessing && activeButton === 'deploy' ? 'DEPLOYING...' : 'DEPLOY AGENT'}
                onPress={handleDeployAgent}
                variant="primary"
                disabled={isProcessing}
                style={[styles.actionButton, activeButton === 'deploy' && styles.activeButton]}
              />
              
              <GlowButton
                title={isProcessing && activeButton === 'ecrr' ? 'PROCESSING...' : 'E.C.R.R. SCAN'}
                onPress={handleInitiateECRR}
                variant="secondary"
                disabled={isProcessing}
                style={[styles.actionButton, activeButton === 'ecrr' && styles.activeButton]}
              />
              
              <GlowButton
                title="VIEW SWARM"
                onPress={handleViewSwarm}
                variant="success"
                disabled={isProcessing}
                style={[styles.actionButton, activeButton === 'swarm' && styles.activeButton]}
              />
              
              <GlowButton
                title="SYSTEM STATUS"
                onPress={handleSystemStatus}
                variant="warning"
                disabled={isProcessing}
                style={[styles.actionButton, activeButton === 'status' && styles.activeButton]}
              />
            </View>
          </View>

          {/* Emergency Controls */}
          <View style={styles.emergencySection}>
            <Text style={[styles.sectionTitle, { color: Colors.error }]}>EMERGENCY CONTROLS</Text>
            <GlowButton
              title="EMERGENCY PROTOCOL"
              onPress={handleEmergencyProtocol}
              variant="error"
              style={styles.emergencyButton}
            />
          </View>
        </View>
      )}

      {/* Agents Tab */}
      {currentView === 'agents' && (
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ACTIVE AGENTS</Text>
            {agents.length === 0 ? (
              <View style={styles.emptyState}> 
                <Users size={48} color={Colors.textMuted} /> 
                <Text style={styles.emptyTitle}>No Agents Deployed</Text> 
                <Text style={styles.emptySubtitle}>Deploy your first agent to begin</Text> 
              </View> 
            ) : (
              <View style={styles.agentsList}>
                {agents.map((agent) => (
                  <View key={agent.id} style={styles.agentCard}>
                    <View style={styles.agentHeader}>
                      {getAgentTypeIcon(agent.agent_type)}
                      <Text style={styles.agentName}>{agent.name}</Text>
                      <StatusIndicator status={agent.status} />
                    </View>
                    <Text style={styles.agentRole}>{agent.role}</Text>
                    <View style={styles.agentMetrics}>
                      <Text style={styles.agentLevel}>Level {agent.level}</Text>
                      <Text style={styles.agentXP}>{agent.experience_points} XP</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      )}

      {/* E.C.R.R. Tab */}
      {currentView === 'ecrr' && (
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>E.C.R.R. PROTOCOL</Text>
            <Text style={styles.description}>
              Emulate • Condense • Repurpose • Redeploy
            </Text>
            
            <View style={styles.ecrrPhases}>
              {[
                { name: 'EMULATE', desc: 'Analyze target system', icon: <Target size={16} color={Colors.primary} /> },
                { name: 'CONDENSE', desc: 'Extract core functions', icon: <Brain size={16} color={Colors.secondary} /> },
                { name: 'REPURPOSE', desc: 'Adapt for Legion', icon: <Zap size={16} color={Colors.success} /> },
                { name: 'REDEPLOY', desc: 'Generate agents', icon: <CheckCircle size={16} color={Colors.warning} /> },
              ].map((phase, index) => (
                <View key={phase.name} style={styles.phaseCard}>
                  {phase.icon}
                  <Text style={styles.phaseName}>{phase.name}</Text>
                  <Text style={styles.phaseDesc}>{phase.desc}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* Swarm Tab */}
      {currentView === 'swarm' && (
        <View style={styles.content}>
          {agents.length > 0 ? (
            <SwarmVisualization agents={agents} />
          ) : (
            <View style={styles.emptyState}>
              <Network size={48} color={Colors.textMuted} />
              <Text style={styles.emptyTitle}>No Swarm Active</Text>
              <Text style={styles.emptySubtitle}>Deploy agents to visualize swarm network</Text>
            </View>
          )}
        </View>
      )}

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

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>RECENT ACTIVITY</Text>
        <View style={styles.activityList}>
          <View style={styles.activityItem}>
            <CheckCircle size={16} color={Colors.success} />
            <Text style={styles.activityText}>Linktree ECRR analysis complete - 6 agents deployed</Text>
            <Text style={styles.activityTime}>1h ago</Text>
          </View>
          
          <View style={styles.activityItem}>
            <Brain size={16} color={Colors.secondary} />
            <Text style={styles.activityText}>Profile-Manager-ALPHA optimizing user interfaces</Text>
            <Text style={styles.activityTime}>2h ago</Text>
          </View>
          
          <View style={styles.activityItem}>
            <Network size={16} color={Colors.primary} />
            <Text style={styles.activityText}>Analytics-Oracle-GAMMA processing user behavior data</Text>
            <Text style={styles.activityTime}>3h ago</Text>
          </View>
          
          <View style={styles.activityItem}>
            <Activity size={16} color={Colors.warning} />
            <Text style={styles.activityText}>Monetization-Controller-EPSILON revenue optimization active</Text>
            <Text style={styles.activityTime}>4h ago</Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          USAi - Universal Swarm AI
        </Text>
        <Text style={styles.footerSubtext}>
          The Legion Awaits Your Command
        </Text>
        <Text style={styles.footerVersion}>
          Build 2025.01.21 - CLASSIFIED
        </Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 2,
    borderBottomColor: Colors.panelBorder,
    backgroundColor: Colors.cardOverlay,
  },
  
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  titleContainer: {
    marginLeft: 12,
  },
  
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: 2,
    textShadowColor: Colors.glowPrimary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  
  subtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.darkGray,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
    shadowColor: 'currentColor',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  
  navigationTabs: {
    flexDirection: 'row',
    backgroundColor: Colors.cardOverlay,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  
  navTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    gap: 6,
  },
  
  navTabActive: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.glowPrimary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  
  navTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  
  navTabTextActive: {
    color: Colors.textPrimary,
  },
  
  content: {
    padding: 16,
  },
  
  metricsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  
  section: {
    backgroundColor: Colors.cardOverlay,
    borderWidth: 2,
    borderColor: Colors.panelBorder,
    padding: 16,
    marginBottom: 16,
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
  
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 1,
  },
  
  agentTypes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  
  agentTypeCard: {
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.darkGray,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    minWidth: 70,
  },
  
  agentTypeCount: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginVertical: 4,
  },
  
  agentTypeLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  
  actionSection: {
    backgroundColor: Colors.cardOverlay,
    borderWidth: 2,
    borderColor: Colors.panelBorder,
    padding: 16,
    marginBottom: 16,
  },
  
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  
  actionButton: {
    flex: 1,
    minWidth: '45%',
  },
  
  activeButton: {
    shadowColor: Colors.glowPrimary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 10,
  },
  
  emergencySection: {
    backgroundColor: Colors.cardOverlay,
    borderWidth: 2,
    borderColor: Colors.error,
    padding: 16,
    marginBottom: 16,
  },
  
  emergencyButton: {
    width: '100%',
  },
  
  emptyState: {
    alignItems: 'center',
    padding: 40,
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
  },
  
  agentsList: {
    gap: 12,
  },
  
  agentCard: {
    backgroundColor: Colors.darkGray,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  
  agentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  
  agentName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    flex: 1,
    marginLeft: 8,
  },
  
  agentRole: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  
  agentMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  agentLevel: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
  },
  
  agentXP: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  
  ecrrPhases: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  
  phaseCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.darkGray,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  
  phaseName: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 4,
    letterSpacing: 0.5,
  },
  
  phaseDesc: {
    fontSize: 8,
    color: Colors.textMuted,
    marginTop: 2,
    textAlign: 'center',
  },
  
  cliToggle: {
    padding: 16,
  },
  
  cliSection: {
    margin: 16,
    height: 400,
    backgroundColor: Colors.cardOverlay,
    borderWidth: 2,
    borderColor: Colors.secondary,
    overflow: 'hidden',
  },
  
  activityList: {
    gap: 12,
  },
  
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.darkGray,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  
  activityText: {
    flex: 1,
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 8,
  },
  
  activityTime: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  
  footer: {
    alignItems: 'center',
    padding: 32,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    marginTop: 20,
  },
  
  footerText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 1,
    textShadowColor: Colors.glowPrimary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  
  footerSubtext: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
    fontStyle: 'italic',
  },
  
  footerVersion: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 8,
    fontFamily: 'monospace',
  },
});