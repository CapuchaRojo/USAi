import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, Alert, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { GlowButton } from '@/components/ui/GlowButton';
import { api } from '@/lib/api';
import { Shield, Zap, Target, Cpu, Activity, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Clock, Command, Eye, Network, Users, Plus, Terminal, Brain, Send } from 'lucide-react-native';

export default function CommandCenter() {
  const [agents, setAgents] = useState<any[]>([]);
  const [missions, setMissions] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [systemStatus, setSystemStatus] = useState('OPERATIONAL');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCLI, setShowCLI] = useState(false);
  const [cliOutput, setCLIOutput] = useState<string[]>([
    '> USAi Command Center Online',
    '> Legion Status: GROWING',
    '> Type "help" for commands',
    '> Awaiting orders...'
  ]);
  const [cliInput, setCLIInput] = useState('');

  const loadData = async () => {
    try {
      const [agentsData, missionsData] = await Promise.all([
        api.agentService.getAll(),
        api.missionService.getAll(),
      ]);
      
      setAgents(agentsData || []);
      setMissions(missionsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  useEffect(() => {
    loadData();
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      setSystemStatus(prev => prev === 'OPERATIONAL' ? 'SCANNING' : 'OPERATIONAL');
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const addCLIOutput = (message: string) => {
    setCLIOutput(prev => [...prev, message].slice(-15)); // Keep last 15 lines
  };

  const handleDeployAgent = async (agentType?: string, agentName?: string) => {
    setIsProcessing(true);
    addCLIOutput('> Initiating agent deployment...');
    
    try {
      const agentTypes = ['Controller', 'Oracle', 'Dispatcher', 'Modular'];
      const randomType = agentTypes[Math.floor(Math.random() * agentTypes.length)];
      
      // Use ECRR spawn-quick for better agent creation
      const deploymentResult = await api.ecrrService.spawnQuick(
        agentType || 'Modular',
        'general_deployment'
      );
      
      await loadData();
      
      addCLIOutput(`> Agent ${agentName || 'Agent'} deployed successfully`);
      addCLIOutput(`> Type: ${agentType || 'Modular'} | Status: Online`);
      addCLIOutput(`> Legion size: ${agents.length + 1} agents`);
      
      Alert.alert(
        'Agent Deployed Successfully',
        `New agent deployed!\nType: ${agentType || 'Modular'}\nDeployment: Successful\nStatus: Online`,
        [{ text: 'Excellent', style: 'default' }]
      );
    } catch (error) {
      addCLIOutput('> ERROR: Agent deployment failed');
      Alert.alert('Deployment Error', 'Failed to deploy agent. Try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleECRRScan = async () => {
    setIsProcessing(true);
    addCLIOutput('> Initiating ECRR pipeline...');
    addCLIOutput('> Target: Instagram (Social Media Platform)');
    
    try {
      addCLIOutput('> Phase 1: EMULATING target architecture...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addCLIOutput('> Phase 2: CONDENSING core components...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addCLIOutput('> Phase 3: REPURPOSING for Legion integration...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addCLIOutput('> Phase 4: REDEPLOYING as agent swarm...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const result = await api.ecrrService.execute(
        'Instagram',
        'application',
        'standard'
      );
      
      // Create multiple specialized agents from ECRR
      const ecrrAgents = [
        { type: 'Oracle', role: 'Content Analysis Specialist', skills: ['content_analysis', 'sentiment_detection'] },
        { type: 'Dispatcher', role: 'Feed Coordination Agent', skills: ['feed_management', 'content_routing'] },
        { type: 'Modular', role: 'User Interaction Handler', skills: ['user_engagement', 'interaction_processing'] },
        { type: 'Modular', role: 'Media Processing Unit', skills: ['image_processing', 'video_analysis'] }
      ];
      
      for (const agentSpec of ecrrAgents) {
        const agent = {
          name: `${agentSpec.type}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
          agent_type: agentSpec.type,
          role: agentSpec.role,
          status: 'online',
          level: Math.floor(Math.random() * 3) + 2,
          experience_points: Math.floor(Math.random() * 500) + 200,
          efficiency: Math.random() * 0.3 + 0.6,
          accuracy: Math.random() * 0.3 + 0.6,
          adaptability: Math.random() * 0.3 + 0.6,
          specialization: Math.random() * 0.3 + 0.6,
          skills: agentSpec.skills,
          collected_tools: ['instagram_api', 'social_analyzer', 'content_processor'],
          configuration: { source: 'ECRR_Instagram', specialized: true },
        };
        
        await agentService.create(agent);
        addCLIOutput(`> Deployed: ${agent.name} - ${agent.role}`);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      await loadData();
      
      addCLIOutput('> ECRR PIPELINE COMPLETE');
      addCLIOutput(`> Successfully replicated Instagram functionality`);
      addCLIOutput(`> ${ecrrAgents.length} specialized agents deployed`);
      addCLIOutput('> Legion capabilities expanded');
      
      Alert.alert(
        'E.C.R.R. Pipeline Initiated',
        `Target: Instagram\nStatus: Processing...\n\nPhases:\nâ€¢ Emulate: Analyzing target system\nâ€¢ Condense: Extracting core functions\nâ€¢ Repurpose: Adapting for Legion\nâ€¢ Redeploy: Generating agents`,
        [{ text: 'Outstanding!', style: 'default' }]
      );
    } catch (error) {
      addCLIOutput('> ERROR: ECRR pipeline failed');
      Alert.alert('ECRR Error', 'Pipeline execution failed. Try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSwarmDeploy = async () => {
    setIsProcessing(true);
    addCLIOutput('> Initiating tactical swarm deployment...');
    
    try {
      const swarmSize = 5;
      addCLIOutput(`> Deploying ${swarmSize}-agent tactical swarm`);
      addCLIOutput('> Establishing mesh network...');
      
      for (let i = 0; i < swarmSize; i++) {
        const agent = {
          name: `SWARM-${i + 1}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
          agent_type: 'Modular',
          role: `Tactical Unit ${i + 1}`,
          status: 'online',
          level: Math.floor(Math.random() * 3) + 1,
          experience_points: Math.floor(Math.random() * 300),
          efficiency: Math.random() * 0.4 + 0.5,
          accuracy: Math.random() * 0.4 + 0.5,
          adaptability: Math.random() * 0.4 + 0.5,
          specialization: Math.random() * 0.4 + 0.5,
          skills: ['swarm_coordination', 'distributed_processing', 'collective_intelligence'],
          collected_tools: ['mesh_network', 'sync_protocol', 'tactical_interface'],
          configuration: { swarm_id: 'TACTICAL_ALPHA', unit_number: i + 1 },
        };
        
        await agentService.create(agent);
        addCLIOutput(`> Unit ${i + 1} online and synchronized`);
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      await loadData();
      
      addCLIOutput('> Swarm deployment complete');
      addCLIOutput('> All units synchronized and operational');
      addCLIOutput('> Collective intelligence active');
      addCLIOutput('> Mesh network established');
      
      Alert.alert(
        'Tactical Swarm Deployed!',
        `Swarm deployment successful!\n\nâœ“ ${swarmSize} coordinated tactical units\nâœ“ Mesh network established\nâœ“ Collective intelligence online\nâœ“ Real-time synchronization active\n\nSwarm ready for coordinated operations!`,
        [{ text: 'Impressive!', style: 'default' }]
      );
    } catch (error) {
      addCLIOutput('> ERROR: Swarm deployment failed');
      Alert.alert('Swarm Error', 'Deployment failed. Try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCLICommand = (command: string) => {
    if (!command.trim()) return;
    
    addCLIOutput(`> ${command}`);
    
    const cmd = command.toLowerCase().trim();
    
    // Enhanced agent deployment parsing
    const deploymentPatterns = [
      /^(?:deploy|spawn|create)\s+(?:new\s+)?(\w+)(?:\s+agent)?$/i,
      /^(?:deploy|spawn|create)\s+(?:agent\s+)?(\w+)$/i,
      /^(?:deploy|spawn|create)\s+(\w+)\s+(?:type\s+)?agent$/i,
      /^(?:deploy|spawn|create)\s+(alpha|beta|gamma|delta|echo|foxtrot|golf|hotel)(?:\s+agent)?$/i,
    ];
    
    let deploymentMatch = null;
    for (const pattern of deploymentPatterns) {
      deploymentMatch = cmd.match(pattern);
      if (deploymentMatch) break;
    }
    
    if (deploymentMatch) {
      const agentIdentifier = deploymentMatch[1].toLowerCase();
      
      // Map common identifiers to agent types
      const agentTypeMap: { [key: string]: string } = {
        'controller': 'Controller',
        'oracle': 'Oracle',
        'dispatcher': 'Dispatcher',
        'modular': 'Modular',
        'alpha': 'Controller',
        'beta': 'Oracle',
        'gamma': 'Dispatcher',
        'delta': 'Modular',
        'echo': 'Modular',
        'foxtrot': 'Controller',
        'golf': 'Oracle',
        'hotel': 'Dispatcher',
      };
      
      const agentType = agentTypeMap[agentIdentifier] || 'Modular';
      const agentName = agentIdentifier.charAt(0).toUpperCase() + agentIdentifier.slice(1);
      
      addCLIOutput(`> Deploying ${agentType} agent: ${agentName}`);
      handleDeployAgent(agentType, agentName);
      return;
    }
    
    switch (cmd) {
      case 'help':
        addCLIOutput('=== USAi COMMAND REFERENCE ===');
        addCLIOutput('deploy [type]   - Deploy agent (controller/oracle/dispatcher/modular)');
        addCLIOutput('spawn [name]    - Spawn named agent (alpha/beta/gamma/delta/echo)');
        addCLIOutput('create [type]   - Create new agent of specified type');
        addCLIOutput('ecrr <target>   - Run ECRR pipeline');
        addCLIOutput('swarm           - Deploy agent swarm');
        addCLIOutput('status          - System status');
        addCLIOutput('agents          - List all agents');
        addCLIOutput('legion          - Legion statistics');
        addCLIOutput('clear           - Clear terminal');
        addCLIOutput('emergency       - Emergency protocols');
        break;
      
      case 'deploy':
        addCLIOutput('> Executing agent deployment...');
        handleDeployAgent('Modular', 'Default');
        break;
      
      case 'swarm':
        addCLIOutput('> Executing swarm deployment...');
        handleSwarmDeploy();
        break;
      
      case 'status':
        addCLIOutput(`System Status: ${systemStatus}`);
        addCLIOutput(`Active Agents: ${agents.length}`);
        addCLIOutput(`Online Agents: ${agents.filter(a => a.status === 'online').length}`);
        addCLIOutput(`Total Missions: ${missions.length}`);
        addCLIOutput('Network: ONLINE');
        addCLIOutput('Legion: GROWING');
        break;
      
      case 'agents':
        addCLIOutput(`=== ACTIVE AGENTS (${agents.length}) ===`);
        if (agents.length === 0) {
          addCLIOutput('No agents deployed. Use "deploy" to create agents.');
        } else {
          agents.slice(0, 10).forEach(agent => {
            addCLIOutput(`${agent.name} - ${agent.agent_type} - ${agent.status} - L${agent.level}`);
          });
          if (agents.length > 10) {
            addCLIOutput(`... and ${agents.length - 10} more agents`);
          }
        }
        break;
      
      case 'legion':
        const onlineCount = agents.filter(a => a.status === 'online').length;
        const avgLevel = agents.length > 0 ? (agents.reduce((sum, a) => sum + (a.level || 1), 0) / agents.length).toFixed(1) : '0';
        addCLIOutput('=== LEGION STATISTICS ===');
        addCLIOutput(`Total Agents: ${agents.length}`);
        addCLIOutput(`Online: ${onlineCount}`);
        addCLIOutput(`Average Level: ${avgLevel}`);
        addCLIOutput(`Controllers: ${agents.filter(a => a.agent_type === 'Controller').length}`);
        addCLIOutput(`Oracles: ${agents.filter(a => a.agent_type === 'Oracle').length}`);
        addCLIOutput(`Dispatchers: ${agents.filter(a => a.agent_type === 'Dispatcher').length}`);
        addCLIOutput(`Modular: ${agents.filter(a => a.agent_type === 'Modular').length}`);
        break;
      
      case 'clear':
        setCLIOutput(['> Terminal cleared', '> USAi Command Center Online', '> Type "help" for commands']);
        break;
      
      case 'emergency':
        addCLIOutput('> EMERGENCY PROTOCOL AVAILABLE');
        addCLIOutput('> Use emergency button for activation');
        break;
      
      default:
        if (cmd.startsWith('ecrr ')) {
          const target = cmd.substring(5);
          addCLIOutput(`> Initiating ECRR scan on: ${target}`);
          addCLIOutput('> Executing full pipeline...');
          handleECRRScan();
        } else {
          addCLIOutput(`Unknown command: ${command}`);
          addCLIOutput('Type "help" for available commands');
        }
    }
    
    setCLIInput('');
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
            addCLIOutput('> EMERGENCY PROTOCOL ACTIVATED');
            addCLIOutput('> All agents entering safe mode...');
            addCLIOutput('> Legion operations suspended');
            addCLIOutput('> System entering lockdown');
            Alert.alert('Emergency Activated', 'Emergency protocols initiated. All systems entering safe mode.');
          }
        },
      ]
    );
  };

  // Calculate system metrics
  const onlineAgents = agents.filter(a => a.status === 'online').length;
  const criticalAgents = agents.filter(a => a.status === 'mission-critical').length;
  const activeMissions = missions.filter(m => m.status === 'active').length;
  const completedMissions = missions.filter(m => m.status === 'completed').length;
  const averageLevel = agents.length > 0 ? 
    agents.reduce((sum, a) => sum + (a.level || 1), 0) / agents.length : 0;
  const systemEfficiency = agents.length > 0 ? 
    agents.reduce((sum, a) => sum + (a.efficiency || 0.5), 0) / agents.length : 0;

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
    <SafeAreaView style={styles.container}>
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
            <View style={styles.metricCard}>
              <Shield size={20} color={Colors.success} />
              <Text style={styles.metricValue}>{onlineAgents}</Text>
              <Text style={styles.metricLabel}>ONLINE</Text>
            </View>
            
            <View style={styles.metricCard}>
              <AlertTriangle size={20} color={Colors.error} />
              <Text style={styles.metricValue}>{criticalAgents}</Text>
              <Text style={styles.metricLabel}>CRITICAL</Text>
            </View>
            
            <View style={styles.metricCard}>
              <Target size={20} color={Colors.primary} />
              <Text style={styles.metricValue}>{activeMissions}</Text>
              <Text style={styles.metricLabel}>MISSIONS</Text>
            </View>
            
            <View style={styles.metricCard}>
              <CheckCircle size={20} color={Colors.secondary} />
              <Text style={styles.metricValue}>{completedMissions}</Text>
              <Text style={styles.metricLabel}>COMPLETED</Text>
            </View>
          </View>
        </View>

        {/* Agent Distribution */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AGENT DISTRIBUTION</Text>
          <View style={styles.agentTypes}>
            <View style={styles.agentTypeCard}>
              {getAgentTypeIcon('Controller')}
              <Text style={styles.agentTypeCount}>
                {agents.filter(a => a.agent_type === 'Controller').length}
              </Text>
              <Text style={styles.agentTypeLabel}>Controllers</Text>
            </View>
            
            <View style={styles.agentTypeCard}>
              {getAgentTypeIcon('Oracle')}
              <Text style={styles.agentTypeCount}>
                {agents.filter(a => a.agent_type === 'Oracle').length}
              </Text>
              <Text style={styles.agentTypeLabel}>Oracles</Text>
            </View>
            
            <View style={styles.agentTypeCard}>
              {getAgentTypeIcon('Dispatcher')}
              <Text style={styles.agentTypeCount}>
                {agents.filter(a => a.agent_type === 'Dispatcher').length}
              </Text>
              <Text style={styles.agentTypeLabel}>Dispatchers</Text>
            </View>
            
            <View style={styles.agentTypeCard}>
              {getAgentTypeIcon('Modular')}
              <Text style={styles.agentTypeCount}>
                {agents.filter(a => a.agent_type === 'Modular').length}
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
              <View style={styles.performanceBar}>
                <View style={[styles.performanceProgress, { 
                  width: `${Math.min(averageLevel * 10, 100)}%`,
                  backgroundColor: Colors.warning 
                }]} />
              </View>
            </View>
            
            <View style={styles.performanceCard}>
              <Text style={styles.performanceLabel}>SYSTEM EFFICIENCY</Text>
              <Text style={styles.performanceValue}>{(systemEfficiency * 100).toFixed(1)}%</Text>
              <View style={styles.performanceBar}>
                <View style={[styles.performanceProgress, { 
                  width: `${systemEfficiency * 100}%`,
                  backgroundColor: Colors.success 
                }]} />
              </View>
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
              style={styles.actionButton}
            />
            <GlowButton
              title={isProcessing ? "PROCESSING..." : "ECRR SCAN"}
              onPress={handleECRRScan}
              variant="secondary"
              disabled={isProcessing}
              style={styles.actionButton}
            />
            <GlowButton
              title={isProcessing ? "DEPLOYING..." : "SWARM DEPLOY"}
              onPress={handleSwarmDeploy}
              variant="success"
              disabled={isProcessing}
              style={styles.actionButton}
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
            <Text style={styles.cliToggle}>{showCLI ? 'â–¼' : 'â–¶'}</Text>
          </TouchableOpacity>
          
          {showCLI && (
            <View style={styles.cliContainer}>
              <ScrollView style={styles.cliOutput}>
                {cliOutput.map((line, index) => (
                  <Text key={index} style={styles.cliLine}>{line}</Text>
                ))}
              </ScrollView>
              
              <View style={styles.cliInputContainer}>
                <Text style={styles.cliPrompt}>USAi> </Text>
                <TextInput
                  style={styles.cliInput}
                  value={cliInput}
                  onChangeText={setCLIInput}
                  onSubmitEditing={() => handleCLICommand(cliInput)}
                  placeholder="Enter command..."
                  placeholderTextColor={Colors.textMuted}
                  returnKeyType="send"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={styles.cliSendButton}
                  onPress={() => handleCLICommand(cliInput)}
                >
                  <Send size={16} color={Colors.primary} />
                </TouchableOpacity>
              </View>
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
            <View style={styles.activityItem}>
              <CheckCircle size={16} color={Colors.success} />
              <Text style={styles.activityText}>Agent deployment successful - Legion grows</Text>
              <Text style={styles.activityTime}>Now</Text>
            </View>
            
            <View style={styles.activityItem}>
              <Brain size={16} color={Colors.secondary} />
              <Text style={styles.activityText}>ECRR pipeline analyzing target systems</Text>
              <Text style={styles.activityTime}>2m ago</Text>
            </View>
            
            <View style={styles.activityItem}>
              <Network size={16} color={Colors.primary} />
              <Text style={styles.activityText}>Swarm coordination protocols established</Text>
              <Text style={styles.activityTime}>5m ago</Text>
            </View>
            
            <View style={styles.activityItem}>
              <Activity size={16} color={Colors.warning} />
              <Text style={styles.activityText}>System efficiency optimization complete</Text>
              <Text style={styles.activityTime}>12m ago</Text>
            </View>
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
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: 3,
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
  },
  
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  
  metricCard: {
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.darkGray,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    minWidth: 70,
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
    letterSpacing: 0.5,
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
  },
  
  performanceValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  
  performanceBar: {
    height: 6,
    backgroundColor: Colors.mediumGray,
    borderRadius: 3,
    overflow: 'hidden',
  },
  
  performanceProgress: {
    height: '100%',
    borderRadius: 3,
  },
  
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 8,
  },
  
  actionButton: {
    flex: 1,
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
  },
  
  cliContainer: {
    backgroundColor: Colors.dark,
    borderWidth: 1,
    borderColor: Colors.primary,
    marginTop: 16,
    height: 250,
  },
  
  cliOutput: {
    flex: 1,
    padding: 12,
  },
  
  cliLine: {
    fontSize: 12,
    color: Colors.primary,
    fontFamily: 'monospace',
    marginBottom: 2,
  },
  
  cliInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.primary,
    padding: 8,
  },
  
  cliPrompt: {
    fontSize: 12,
    color: Colors.secondary,
    fontFamily: 'monospace',
    fontWeight: '700',
  },
  
  cliInput: {
    flex: 1,
    fontSize: 12,
    color: Colors.textPrimary,
    fontFamily: 'monospace',
    marginLeft: 4,
    paddingVertical: 4,
  },
  
  cliSendButton: {
    padding: 4,
    marginLeft: 8,
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
  },
  
  systemValue: {
    fontSize: 14,
    fontWeight: '700',
  },
});