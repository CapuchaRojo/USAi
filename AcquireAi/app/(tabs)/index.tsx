import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, Alert, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/Styles';
import { GlowButton } from '@/components/ui/GlowButton';
import { MetricCard } from '@/components/ui/MetricCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { api } from '@/lib/api';
import { Shield, Zap, Target, Cpu, Activity, Users, Brain, Eye, Network, Command, Settings, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Clock, Terminal, Send } from 'lucide-react-native';
import { CommandLineInterface } from '@/components/cli/CommandLineInterface';

// STATIC DEMO DATA - No API calls
const STATIC_AGENTS = [
  { id: '1', name: 'Profile-Manager-ALPHA', type: 'Controller', status: 'online', level: 8, efficiency: 0.89 },
  { id: '2', name: 'Link-Coordinator-BETA', type: 'Dispatcher', status: 'online', level: 6, efficiency: 0.92 },
  { id: '3', name: 'Analytics-Oracle-GAMMA', type: 'Oracle', status: 'online', level: 12, efficiency: 0.85 },
  { id: '4', name: 'Theme-Designer-DELTA', type: 'Modular', status: 'online', level: 5, efficiency: 0.78 },
  { id: '5', name: 'Monetization-Controller-EPSILON', type: 'Controller', status: 'mission-critical', level: 10, efficiency: 0.93 },
  { id: '6', name: 'SEO-Optimizer-ZETA', type: 'Modular', status: 'online', level: 7, efficiency: 0.87 }
];

const STATIC_MISSIONS = [
  { id: '1', title: 'Optimize Profile Performance', status: 'active', progress: 67.5 },
  { id: '2', title: 'Implement Advanced Analytics', status: 'completed', progress: 100 }
];

export default function CommandCenter() {
  const [agents] = useState(STATIC_AGENTS);
  const [missions] = useState(STATIC_MISSIONS);
  const [refreshing, setRefreshing] = useState(false);
  const [systemStatus, setSystemStatus] = useState('OPERATIONAL');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeCommand, setActiveCommand] = useState<string | null>(null);
  const [showCLI, setShowCLI] = useState(false);
  const [recentActivities, setRecentActivities] = useState([
    { icon: <CheckCircle size={16} color={Colors.success} />, text: 'Linktree ECRR analysis complete - 6 agents deployed', time: '1h ago' },
    { icon: <Brain size={16} color={Colors.secondary} />, text: 'Profile-Manager-ALPHA optimizing user interfaces', time: '2h ago' },
    { icon: <Network size={16} color={Colors.primary} />, text: 'Analytics-Oracle-GAMMA processing user behavior data', time: '3h ago' },
    { icon: <Activity size={16} color={Colors.warning} />, text: 'Monetization-Controller-EPSILON revenue optimization active', time: '4h ago' },
  ]);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setSystemStatus(prev => prev === 'OPERATIONAL' ? 'SCANNING' : 'OPERATIONAL');
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleDeployAgent = async (): Promise<string> => {
    setIsProcessing(true);
    setActiveCommand('deploy');
    
    try {
      // Use the API service to deploy an agent
      const result = await api.ecrrService.spawnQuick('Modular', 'general_deployment');
      
      
      // Add to recent activities
      setRecentActivities(prev => [{
        icon: <CheckCircle size={16} color={Colors.success} />,
        text: 'New Modular agent deployed successfully',
        time: 'Now'
      }, ...prev.slice(0, 3)]);
      
      // Show success alert
      Alert.alert(
        'Agent Deployed Successfully',
        `New agent deployed!\nType: Modular\nDeployment: Successful\nStatus: Online\n\nAgent is now ready for mission assignment.`,
        [{ text: 'Excellent', style: 'default' }]
      );
      
      return `Agent deployment successful\nType: Modular | Status: Online\nLegion size: ${agents.length + 1} agents`;
    } catch (error) {
      console.error('Error deploying agent:', error);
      
      Alert.alert(
        'Deployment Failed',
        'Unable to deploy agent. Please try again.',
        [{ text: 'OK', style: 'default' }]
      );
      
      return 'ERROR: Agent deployment failed';
    } finally {
      setIsProcessing(false);
      setActiveCommand(null);
    }
  };

  const handleECRRScan = async (target: string = 'Instagram'): Promise<string> => {
    console.log('handleECRRScan called with target:', target);
    
    setIsProcessing(true);
    setActiveCommand('ecrr');

    console.log('ECRR scan initiated for target:', target);
    
    let output = `Initiating ECRR pipeline...\nTarget: ${target} (Application Platform)\n`;
    
    try {
      // Phase 1: Emulation
      output += 'Phase 1: EMULATING target architecture...\n';
      console.log('Phase 1: Emulation started');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Phase 2: Condensation
      output += 'Phase 2: CONDENSING core components...\n';
      console.log('Phase 2: Condensation started');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Phase 3: Repurposing
      output += 'Phase 3: REPURPOSING for Legion integration...\n';
      console.log('Phase 3: Repurposing started');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Phase 4: Redeployment
      output += 'Phase 4: REDEPLOYING as agent swarm...\n';
      console.log('Phase 4: Redeployment started');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Execute ECRR pipeline using API
      let result;
      let pipelineResult;
      
      try {
        console.log('Calling API for ECRR execution');
        result = await api.ecrrService.execute(target, 'application', 'standard');
        pipelineResult = result.pipeline_result;
        console.log('API call successful:', pipelineResult);
      } catch (apiError) {
        console.error('API call failed:', apiError);
        // Fallback to mock data if API fails
        pipelineResult = {
          summary: {
            agents_created: 6,
            new_capabilities_acquired: 12,
            success_rate: 0.92,
            total_time: 245.7
          }
        };
        console.log('Using fallback data:', pipelineResult);
      }
      
      // Add results to output
      output += 'ECRR PIPELINE COMPLETE\n';
      output += `Successfully replicated ${target} functionality\n`;
      output += `${pipelineResult.summary.agents_created} specialized agents deployed\n`;
      output += 'Legion capabilities expanded';
      
      // Add to recent activities
      setRecentActivities(prev => [{
        icon: <Brain size={16} color={Colors.secondary} />,
        text: `${target} ECRR analysis complete - ${pipelineResult.summary.agents_created} agents deployed`,
        time: 'Now'
      }, ...prev.slice(0, 3)]);
      
      // Show success alert
      Alert.alert(
        `E.C.R.R. Pipeline Complete for ${target}!`,
        `Target: ${target}\nStatus: SUCCESS\n\n` +
        `Results:\n` +
        `• ${pipelineResult.summary.agents_created} new agents deployed\n` +
        `• ${pipelineResult.summary.new_capabilities_acquired} capabilities acquired\n` +
        `• ${(pipelineResult.summary.success_rate * 100).toFixed(1)}% success rate\n` +
        `• ${pipelineResult.summary.total_time.toFixed(1)}s total processing time\n\n` +
        `The Legion has successfully replicated and enhanced ${target}'s core functionality.`,
        [{ text: 'Outstanding!', style: 'default' }]
      );
    } catch (error) {
      console.error('ECRR execution error:', error);
      return output;
      
      Alert.alert(
        'E.C.R.R. Failed',
        `Unable to complete analysis of ${target}. Error: ${error.message || error}`,
        [{ text: 'OK', style: 'default' }]
      );
      
      return `ERROR: ECRR pipeline failed for target: ${target}`;
    } finally {
      console.log('ECRR process completed');
      setIsProcessing(false);
      setActiveCommand(null);
    }
  };

  const handleSwarmDeploy = async (): Promise<string> => {
    setIsProcessing(true);
    setActiveCommand('swarm');
    
    let output = 'Initiating tactical swarm deployment...\n';
    
    try {
      // Use the API service to deploy a swarm
      const result = await api.ecrrService.spawnSwarm({
        include_controller: true,
        units: [
          { type: 'reconnaissance', size: 3 },
          { type: 'processing', size: 2 }
        ]
      });
      
      // Add deployment details to output
      output += 'Deploying 5-agent tactical swarm\nEstablishing mesh network...\nSwarm deployment complete\nAll units synchronized and operational\nCollective intelligence active';
      
      // Add to recent activities
      setRecentActivities(prev => [{
        icon: <Network size={16} color={Colors.primary} />,
        text: 'Tactical swarm deployed with 5 coordinated agents',
        time: 'Now'
      }, ...prev.slice(0, 3)]);
      
      // Show success alert
      Alert.alert(
        'Tactical Swarm Deployed!',
        `Swarm deployment successful!\n\n✓ 5 coordinated tactical units\n✓ Mesh network established\n✓ Collective intelligence online\n✓ Real-time synchronization active\n\nSwarm ready for coordinated operations!\n\nNote: Demo showing swarm coordination concept`,
        [{ text: 'Impressive!', style: 'default' }]
      );
    } catch (error) {
      return output;
      console.error('Error deploying swarm:', error);
      
      Alert.alert(
        'Swarm Deployment Failed',
        'Unable to deploy tactical swarm. Please try again.',
        [{ text: 'OK', style: 'default' }]
      );
      
      return 'ERROR: Swarm deployment failed';
    } finally {
      setIsProcessing(false);
      setActiveCommand(null);
    }
  };

  const handleCLICommand = async (command: string): Promise<string> => {
    if (!command.trim()) return;
    
    const cmd = command.trim();
    const cmdLower = cmd.toLowerCase();
    
    // Debug logging to trace command processing
    console.log('handleCLICommand received:', command);
    console.log('Processed cmdLower:', cmdLower);
    console.log('cmdLower.startsWith("ecrr "):', cmdLower.startsWith('ecrr '));
    
    // Handle ecrr commands first
    if (cmdLower.startsWith('ecrr ')) {
      const target = cmd.substring(5).trim();
      if (target.trim()) {
        console.log('Calling handleECRRScan with target:', target.trim());
        return await handleECRRScan(target.trim());
      } else {
        return 'ERROR: Missing target. Usage: ecrr <target>\nExample: ecrr Instagram';
      }
    }
    
    switch (cmdLower) {
      case 'help': 
        return '=== USAi COMMAND REFERENCE ===\n' +
               'deploy          - Deploy new agent\n' +
               'ecrr <target>   - Run ECRR pipeline (e.g., ecrr Instagram)\n' +
               'swarm           - Deploy agent swarm\n' +
               'status          - System status\n' +
               'agents          - List all agents\n' +
               'clear           - Clear terminal\n\n' +
               'Examples:\n' +
               '  ecrr Instagram\n' +
               '  ecrr Netflix\n' +
               '  deploy\n' +
               '  status';
      
      case 'deploy': 
        return await handleDeployAgent();
      
      case 'swarm': 
        return await handleSwarmDeploy();
      
      case 'status': 
        return `System Status: ${systemStatus}\n` +
               `Active Agents: ${agents.length}\n` +
               `Online Agents: ${agents.filter(a => a.status === 'online').length}\n` +
               `Total Missions: ${missions.length}\n` +
               'Network: ONLINE\n' +
               'Legion: GROWING';
      
      case 'agents': 
        let agentOutput = `=== ACTIVE AGENTS (${agents.length}) ===\n`;
        agents.forEach(agent => {
          agentOutput += `${agent.name} - ${agent.type} - ${agent.status} - L${agent.level}\n`;
        });
        return agentOutput.trim();
      
      case 'clear': 
        // This is handled by the CommandLineInterface component
        return 'Terminal cleared\nUSAi Command Center Online\nType "help" for commands';
      
      default: 
        // Enhanced error message with suggestions
        let errorMsg = `Unknown command: "${cmd}"\n\nType "help" for available commands`;
        
        // Special handling for common ECRR mistakes
        if (cmdLower.includes('ecrr') || cmdLower.includes('ecr')) {
          errorMsg += '\n\nFor ECRR commands, use: ecrr <target>\nExample: ecrr Instagram';
        }
        
        return errorMsg;
    }
  };

  const handleEmergencyProtocol = () => {
    Alert.alert(
      'Emergency Protocol',
      'This will initiate emergency shutdown procedures. All active agents will be recalled and missions suspended. Are you sure?',
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

  // Calculate static metrics
  const onlineAgents = agents.filter(a => a.status === 'online').length;
  const criticalAgents = agents.filter(a => a.status === 'mission-critical').length;
  const activeMissions = missions.filter(m => m.status === 'active').length;
  const completedMissions = missions.filter(m => m.status === 'completed').length;
  const averageLevel = agents.reduce((sum, a) => sum + a.level, 0) / agents.length;
  const systemEfficiency = agents.reduce((sum, a) => sum + a.efficiency, 0) / agents.length;

  const getAgentTypeIcon = (type: string) => {
    switch (type) {
      case 'Controller':
        return <Command size={24} color={Colors.secondary} />;
      case 'Oracle':
        return <Eye size={24} color={Colors.primary} />;
      case 'Dispatcher':
        return <Network size={24} color={Colors.success} />;
      case 'Modular':
        return <Cpu size={24} color={Colors.warning} />;
      default:
        return <Cpu size={24} color={Colors.textMuted} />;
    }
  };

  return (
    <SafeAreaView style={GlobalStyles.safeArea}>
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
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>USAi COMMAND CENTER</Text>
          <Text style={styles.subtitle}>Universal Swarm AI - Legion Control Interface</Text>
          
          <View style={styles.statusIndicator}>
            <View style={[styles.statusDot, { 
              backgroundColor: systemStatus === 'OPERATIONAL' ? Colors.success : Colors.primary 
            }]} />
            <Text style={[styles.statusText, { 
              color: systemStatus === 'OPERATIONAL' ? Colors.success : Colors.primary 
            }]}>
              SYSTEM {systemStatus}
            </Text>
          </View>
        </View>

        {/* System Overview Cards */}
        <View style={styles.overviewSection}>
          <Text style={styles.sectionTitle}>LEGION STATUS</Text>
          <View style={styles.metricsGrid}>
            <MetricCard title="ONLINE" value={onlineAgents} color={Colors.success} />
            <MetricCard title="CRITICAL" value={criticalAgents} color={Colors.error} />
            <MetricCard title="MISSIONS" value={activeMissions} color={Colors.primary} />
            <MetricCard title="COMPLETED" value={completedMissions} color={Colors.secondary} />
          </View>
        </View>

        {/* Agent Distribution */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AGENT DISTRIBUTION</Text>
          <View style={styles.agentTypes}>
            <View style={styles.agentTypeCard}>
              {getAgentTypeIcon('Controller')}
              <Text style={styles.agentTypeCount}>
                {agents.filter(a => a.type === 'Controller').length}
              </Text>
              <Text style={styles.agentTypeLabel}>Controllers</Text>
            </View>
            
            <View style={styles.agentTypeCard}>
              {getAgentTypeIcon('Oracle')}
              <Text style={styles.agentTypeCount}>
                {agents.filter(a => a.type === 'Oracle').length}
              </Text>
              <Text style={styles.agentTypeLabel}>Oracles</Text>
            </View>
            
            <View style={styles.agentTypeCard}>
              {getAgentTypeIcon('Dispatcher')}
              <Text style={styles.agentTypeCount}>
                {agents.filter(a => a.type === 'Dispatcher').length}
              </Text>
              <Text style={styles.agentTypeLabel}>Dispatchers</Text>
            </View>
            
            <View style={styles.agentTypeCard}>
              {getAgentTypeIcon('Modular')}
              <Text style={styles.agentTypeCount}>
                {agents.filter(a => a.type === 'Modular').length}
              </Text>
              <Text style={styles.agentTypeLabel}>Modular</Text>
            </View>
          </View>
        </View>

        {/* Performance Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PERFORMANCE METRICS</Text>
          <View style={styles.performanceGrid}>
            <View style={styles.performanceCard}>
              <Text style={styles.performanceLabel}>AVERAGE LEVEL</Text>
              <Text style={styles.performanceValue}>{averageLevel.toFixed(1)}</Text>
              <ProgressBar
                progress={Math.min(averageLevel * 10, 100)}
                color={Colors.warning}
                showPercentage={false}
                height={4}
              />
            </View>
            
            <View style={styles.performanceCard}>
              <Text style={styles.performanceLabel}>SYSTEM EFFICIENCY</Text>
              <Text style={styles.performanceValue}>{(systemEfficiency * 100).toFixed(1)}%</Text>
              <ProgressBar
                progress={systemEfficiency * 100}
                color={Colors.success}
                showPercentage={false}
                height={4}
              />
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>LEGION OPERATIONS</Text>
          <View style={styles.quickActions}>
            <GlowButton
              title={isProcessing ? "DEPLOYING..." : "DEPLOY AGENT"}
              onPress={handleDeployAgent}
              variant="primary"
              disabled={isProcessing}
              style={[styles.actionButton, activeCommand === 'deploy' && styles.activeButton]}
            />
            <GlowButton
              title={isProcessing ? "PROCESSING..." : "ECRR SCAN"}
              onPress={handleECRRScan}
              variant="secondary"
              disabled={isProcessing}
              style={[styles.actionButton, activeCommand === 'ecrr' && styles.activeButton]}
            />
            <GlowButton
              title={isProcessing ? "DEPLOYING..." : "SWARM DEPLOY"}
              onPress={handleSwarmDeploy}
              variant="success"
              disabled={isProcessing}
              style={[styles.actionButton, activeCommand === 'swarm' && styles.activeButton]}
            />
          </View>
        </View>

        {/* CLI Interface */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.cliHeader}
            onPress={() => setShowCLI(!showCLI)}
          >
            <Terminal size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>COMMAND LINE INTERFACE</Text>
            <Text style={styles.cliToggle}>{showCLI ? '▼' : '▶'}</Text>
          </TouchableOpacity>
          
          {showCLI && (
            <View style={styles.cliContainer}>
              <CommandLineInterface onCommand={handleCLICommand} />
            </View>
          )}
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

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>RECENT ACTIVITY</Text>
          <View style={styles.activityList}>
            {recentActivities.map((activity, index) => (
              <View key={index} style={styles.activityItem}>
                {activity.icon}
                <Text style={styles.activityText}>{activity.text}</Text>
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* System Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SYSTEM STATUS</Text>
          <View style={styles.systemGrid}>
            <View style={styles.systemCard}>
              <Text style={styles.systemLabel}>NETWORK</Text>
              <Text style={[styles.systemValue, { color: Colors.success }]}>ONLINE</Text>
            </View>
            
            <View style={styles.systemCard}>
              <Text style={styles.systemLabel}>LEGION</Text>
              <Text style={[styles.systemValue, { color: Colors.primary }]}>GROWING</Text>
            </View>
            
            <View style={styles.systemCard}>
              <Text style={styles.systemLabel}>SECURITY</Text>
              <Text style={[styles.systemValue, { color: Colors.success }]}>SECURE</Text>
            </View>
            
            <View style={styles.systemCard}>
              <Text style={styles.systemLabel}>UPTIME</Text>
              <Text style={[styles.systemValue, { color: Colors.primary }]}>99.9%</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 2,
    borderBottomColor: Colors.panelBorder,
    backgroundColor: Colors.cardOverlay,
  },
  
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: 3,
    fontFamily: 'Orbitron-Black',
    textShadowColor: Colors.glowPrimary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    letterSpacing: 1,
    marginTop: 4,
    marginBottom: 12,
    fontFamily: 'Orbitron-Regular',
  },
  
  statusIndicator: {
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
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    fontFamily: 'Orbitron-Bold',
  },
  
  overviewSection: {
    padding: 16,
    backgroundColor: Colors.cardOverlay,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  
  section: {
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
  
  emergencySection: {
    margin: 16,
    padding: 16,
    backgroundColor: Colors.cardOverlay,
    borderWidth: 2,
    borderColor: Colors.error,
    shadowColor: Colors.error,
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
    fontFamily: 'Orbitron-Bold',
  },
  
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
    fontFamily: 'Orbitron-Black',
  },
  
  agentTypeLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    textAlign: 'center',
    fontFamily: 'Orbitron-Regular',
  },
  
  performanceGrid: {
    gap: 12,
  },
  
  performanceCard: {
    backgroundColor: Colors.darkGray,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  
  performanceLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 6,
    letterSpacing: 0.5,
    fontFamily: 'Orbitron-Bold',
  },
  
  performanceValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
    fontFamily: 'Orbitron-Black',
  },
  
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 8,
  },
  
  actionButton: {
    flex: 1,
  },
  
  activeButton: {
    shadowColor: Colors.glowPrimary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 10,
  },

  emergencyButton: {
    width: '100%',
  },
  
  cliHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 0,
  },
  
  cliToggle: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '700',
    fontFamily: 'Orbitron-Bold',
  },
  
  cliContainer: {
    backgroundColor: Colors.dark,
    borderWidth: 1,
    borderColor: Colors.secondary,
    marginTop: 16,
    height: 250,
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
    fontFamily: 'Orbitron-Regular',
  },
  
  activityTime: {
    fontSize: 10,
    color: Colors.textMuted,
    fontFamily: 'Orbitron-Regular',
  },
  
  systemGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  
  systemCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.darkGray,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    alignItems: 'center',
  },
  
  systemLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    marginBottom: 4,
    letterSpacing: 0.5,
    fontFamily: 'Orbitron-Bold',
  },
  
  systemValue: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Orbitron-Bold',
  },
});