import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert, ScrollView } from 'react-native';
import { Colors } from '@/constants/Colors';
import { GlowButton } from '@/components/ui/GlowButton';
import { MetricCard } from '@/components/ui/MetricCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { StatusIndicator } from '@/components/ui/StatusIndicator';
import { CommandLineInterface } from '@/components/cli/CommandLineInterface';
import { SwarmVisualization } from '@/components/swarm/SwarmVisualization';
import { agentService, missionService, ecrrService } from '@/lib/supabase';
import { Shield, Zap, Network, Command, Activity, Users, Target, Brain, Eye, Cpu, Settings, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Clock } from 'lucide-react-native';

const { width } = Dimensions.get('window');

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
  const [agents, setAgents] = useState<any[]>([]);
  const [missions, setMissions] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [showCLI, setShowCLI] = useState(false);
  const [showSwarm, setShowSwarm] = useState(false);
  const [currentView, setCurrentView] = useState('overview');

  useEffect(() => {
    loadData();
    
    // Simulate real-time system updates
    const interval = setInterval(() => {
      setSystemStatus(prev => prev === 'OPERATIONAL' ? 'SCANNING' : 'OPERATIONAL');
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [agentsData, missionsData] = await Promise.all([
        agentService.getAll(),
        missionService.getAll(),
      ]);
      
      setAgents(agentsData || []);
      setMissions(missionsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleDeployAgent = async () => {
    setActiveButton('deploy');
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newAgent = {
        name: `Agent-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        agent_type: 'Modular',
        role: 'General Purpose Agent',
        status: 'initializing',
        level: 1,
        experience_points: 0,
        efficiency: 0.5,
        accuracy: 0.5,
        adaptability: 0.5,
        specialization: 0.5,
        skills: [],
        collected_tools: [],
        configuration: {},
      };

      await agentService.create(newAgent);
      await loadData();
      
      if (onDeployAgent) {
        onDeployAgent();
      }
      
      Alert.alert(
        'Agent Deployed Successfully',
        `New agent deployed!\nAgent ID: ${newAgent.name}\nType: ${newAgent.agent_type}\nStatus: Initializing`,
        [{ text: 'OK', style: 'default' }]
      );
      
    } catch (error) {
      Alert.alert('Deployment Failed', 'Unable to deploy agent. Please try again.');
    } finally {
      setIsProcessing(false);
      setActiveButton(null);
    }
  };

  const handleInitiateECRR = async () => {
    setActiveButton('ecrr');
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const pipeline = {
        pipeline_id: `ECRR-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
        target: 'Auto-detected System',
        target_type: 'application',
        depth: 'standard',
        status: 'running',
      };

      await ecrrService.create(pipeline);
      
      if (onInitiateECRR) {
        onInitiateECRR();
      }
      
      Alert.alert(
        'E.C.R.R. Pipeline Initiated',
        `Pipeline ID: ${pipeline.pipeline_id}\nTarget: ${pipeline.target}\nStatus: Processing...\n\nPhases:\nâ€¢ Emulate: Analyzing target system\nâ€¢ Condense: Extracting core functions\nâ€¢ Repurpose: Adapting for Legion\nâ€¢ Redeploy: Generating agents`,
        [{ text: 'Monitor Progress', style: 'default' }]
      );
    } catch (error) {
      Alert.alert('E.C.R.R. Failed', 'Unable to initiate pipeline. Please try again.');
    } finally {
      setIsProcessing(false);
      setActiveButton(null);
    }
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
      `Status: ${systemStatus}\nAgents Online: ${onlineAgents}/${agents.length}\nActive Missions: ${activeMissions}\nUptime: 99.9%\nSecurity Level: ALPHA\nNetwork: ONLINE\nDatabase: CONNECTED\n\nAll systems operational`,
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
              Emulate â€¢ Condense â€¢ Repurpose â€¢ Redeploy
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
            <Text style={styles.activityText}>Agent Alpha-7 completed reconnaissance mission</Text>
            <Text style={styles.activityTime}>2m ago</Text>
          </View>
          
          <View style={styles.activityItem}>
            <AlertTriangle size={16} color={Colors.warning} />
            <Text style={styles.activityText}>Oracle Beta-3 detected anomaly in sector 7</Text>
            <Text style={styles.activityTime}>5m ago</Text>
          </View>
          
          <View style={styles.activityItem}>
            <Activity size={16} color={Colors.primary} />
            <Text style={styles.activityText}>New E.C.R.R. pipeline initiated on target: ChatGPT</Text>
            <Text style={styles.activityTime}>12m ago</Text>
          </View>
          
          <View style={styles.activityItem}>
            <Clock size={16} color={Colors.secondary} />
            <Text style={styles.activityText}>Swarm deployment successful - 8 agents deployed</Text>
            <Text style={styles.activityTime}>18m ago</Text>
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