import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Terminal, Send, Activity, Brain, Network, Command, Eye, Cpu } from 'lucide-react-native';

interface CLICommand {
  command: string;
  output: string;
  timestamp: Date;
  type: 'success' | 'error' | 'info' | 'system';
}

interface CommandLineInterfaceProps {
  onCommand?: (command: string) => Promise<string>;
}

export function CommandLineInterface({ onCommand }: CommandLineInterfaceProps) {
  const [currentCommand, setCurrentCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<CLICommand[]>([
    {
      command: 'ecrr Linktree',
      output: 'Linktree ECRR Pipeline Complete\n✓ 6 specialized agents deployed\n✓ Profile management capabilities acquired\n✓ Link coordination system established\n✓ Analytics engine integrated\n✓ Theme design system deployed\n✓ Monetization controller active\n✓ SEO optimization enabled',
      timestamp: new Date(Date.now() - 3600000),
      type: 'success',
    },
    {
      command: 'system status',
      output: 'USAi Command Center Online\nAll systems operational\nAgent network: ACTIVE\nLegion status: GROWING',
      timestamp: new Date(Date.now() - 7200000),
      type: 'success',
    },
    {
      command: 'legion deploy production 3',
      output: 'Deploying production swarm...\n✓ Controller-ALPHA deployed\n✓ Oracle-BETA deployed\n✓ Dispatcher-GAMMA deployed\nSwarm coordination established',
      timestamp: new Date(Date.now() - 10800000),
      type: 'success',
    },
  ]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);

  const availableCommands = [
    'help',
    'status',
    'deploy',
    'ecrr',
    'swarm',
    'agents',
    'clear',
    // Keep some of the fun commands for demo
    'legendary',
    'deploy swarm',
    'system stats'
  ];

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [commandHistory]);

  const executeCommand = async (command: string) => {
    const trimmedCommand = command.trim().toLowerCase();
    
    console.log('CLI executing command:', trimmedCommand);
    
    if (!trimmedCommand) return;

    let output = '';
    let type: 'success' | 'error' | 'info' | 'system' = 'info';
    
    try {
      if (onCommand) {
        console.log('Passing command to parent handler:', trimmedCommand);
        // Pass command to parent component handler
        try {
          output = await onCommand(trimmedCommand);
          type = 'success';
          console.log('Parent handler returned:', output);
        } catch (error) {
          // If parent handler throws, fall back to built-in commands
          console.error('Parent command handler error:', error);
        }
        
        // If output was set by parent handler, add to history and return
        if (output) {
          const newCommand: CLICommand = {
            command: command,
            output,
            timestamp: new Date(),
            type,
          };
          
          setCommandHistory(prev => [...prev, newCommand]);
          setCurrentCommand('');
          setHistoryIndex(-1);
          return;
        }
      } else {
        // Built-in commands matching the wireframe
        switch (trimmedCommand) {
          case 'help':
            output = `USAi Command Interface - Available Commands:
═══════════════════════════════════════════════
deploy               - Deploy new agent
ecrr <target>        - Execute ECRR pipeline on target
  Examples: ecrr Linktree, ecrr Instagram, ecrr Netflix
ecxa tastompeted     - Execute advanced analysis
swarm.staids         - Display swarm status
ssqrv statet.engaged - Query server state
legion deploy production 3 - Deploy production swarm
leq                  - Legion query
legiom               - Legion command interface
legendary            - Access legendary protocols
list agents          - Show all active agents
system stats         - Display system statistics
clear                - Clear terminal history`;
            type = 'info';
            break;

          case 'status':
          case 'system stats':
            output = `USAi System Status:
═══════════════════════
Network: ONLINE
Agents: 12 active, 3 standby
Missions: 5 active, 2 completed
ECRR Pipelines: 3 running
Performance: OPTIMAL
Legion Health: 90%
Threat Level: MEDIUM`;
            type = 'success';
            break;

          case 'deploy':
            output = `Spawning new agent...
Agent initialization: SUCCESS
Network integration: SUCCESS
Agent ID: ${Math.random().toString(36).substr(2, 9)}
Status: ONLINE
Type: Modular
Ready for deployment`;
            type = 'success';
            break;

          case 'ecxa tastompeted':
            output = `Advanced Analysis Protocol Engaged
Scanning target parameters...
Complexity analysis: 73% reduction achieved
Optimization vectors identified: 12
Deployment recommendations: 5 agent types
Analysis complete - Ready for implementation`;
            type = 'success';
            break;

          case 'swarm.staids':
            output = `Swarm Status Display:
Active Swarms: 3
Total Agents: 47
Coordination Efficiency: 94%
Network Latency: 12ms
Resource Utilization: 67%
All swarms operational`;
            type = 'success';
            break;

          case 'ssqrv statet.engaged':
            output = `Server State Query Results:
Primary Server: ENGAGED
Backup Systems: STANDBY
Load Balancer: ACTIVE
Database: SYNCHRONIZED
Cache: OPTIMIZED
All systems nominal`;
            type = 'success';
            break;

          case 'legion deploy production 3':
            output = `Legion Production Deployment Initiated
Deploying 3 production-grade agents...
✓ Controller-ALPHA-PROD deployed
✓ Oracle-BETA-PROD deployed  
✓ Dispatcher-GAMMA-PROD deployed
Swarm coordination established
Production environment: ACTIVE`;
            type = 'success';
            break;

          case 'leq':
            output = `Legion Query Interface Active
Available queries:
- agent.status
- mission.progress
- swarm.health
- network.topology
Enter query or type 'exit' to return`;
            type = 'info';
            break;

          case 'legiom':
            output = `Legion Command Interface
Command authority: GRANTED
Available operations:
- Strategic deployment
- Resource reallocation
- Emergency protocols
- Swarm coordination
Legion awaits your command`;
            type = 'system';
            break;

          case 'legendary':
            output = `Legendary Protocol Access
Classification: RESTRICTED
Clearance level: ALPHA required
Advanced capabilities unlocked:
- Autonomous evolution
- Cross-dimensional analysis
- Quantum coordination
- Reality manipulation protocols
Use with extreme caution`;
            type = 'system';
            break;

          case 'list agents':
            output = `Active Agents:
═══════════════
Controller-Alpha [ONLINE] - Level 15
Oracle-Beta [ONLINE] - Level 12
Dispatcher-Gamma [CRITICAL] - Level 18
Modular-Delta [ONLINE] - Level 8
Modular-Echo [BUSY] - Level 6
... +7 more agents`;
            type = 'success';
            break;

          case 'clear':
            setCommandHistory([]);
            return;

          default:
            if (trimmedCommand.startsWith('deploy swarm')) {
              output = `Initiating swarm deployment...
Configuring agent hierarchy...
Establishing communication mesh...
Swarm deployment: SUCCESS
Swarm ID: SWARM-${Math.random().toString(36).substr(2, 6).toUpperCase()}
Agents deployed: ${Math.floor(Math.random() * 10) + 5}`;
              type = 'success';
            } else {
              output = `Command not recognized: ${trimmedCommand}
Type 'help' for available commands
Did you mean one of: ${availableCommands.filter(cmd => 
                cmd.includes(trimmedCommand.split(' ')[0])
              ).slice(0, 3).join(', ')}?`;
              type = 'error';
            }
        }
      }
    } catch (error) {
      output = `Error executing command: ${error}`;
      type = 'error';
    }

    const newCommand: CLICommand = {
      command: command,
      output,
      timestamp: new Date(),
      type,
    };

    setCommandHistory(prev => [...prev, newCommand]);
    setCurrentCommand('');
    setHistoryIndex(-1);
  };

  const getCommandSuggestions = () => {
    if (!currentCommand) return [];
    
    // Special case for ECRR commands
    if (currentCommand.toLowerCase().startsWith('ecrr')) {
      return ['ecrr Instagram', 'ecrr Netflix', 'ecrr Spotify'].filter(cmd => 
        !currentCommand.includes(' ') || cmd.toLowerCase().includes(currentCommand.toLowerCase())
      );
    }
    
    // Regular command suggestions
    const suggestions = availableCommands.filter(cmd => 
      cmd.toLowerCase().includes(currentCommand.toLowerCase().split(' ')[0])
    ).slice(0, 3);
    
    return suggestions;
  };

  const getLogColor = (type: string) => {
    switch (type) {
      case 'error': return Colors.error;
      case 'success': return Colors.primary;
      case 'system': return Colors.secondary;
      default: return Colors.primary;
    }
  };

  const suggestions = getCommandSuggestions();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Terminal size={20} color={Colors.secondary} />
        <Text style={styles.headerText}>USAi COMMAND INTERFACE</Text>
        <View style={styles.statusIndicator}>
          <Activity size={16} color={Colors.success} />
          <Text style={styles.statusText}>SYSTEM HEALTH: OPTIMAL</Text>
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.output}
        showsVerticalScrollIndicator={false}
      >
        {commandHistory.map((cmd, index) => (
          <View key={index} style={styles.commandBlock}>
            <Text style={styles.commandInput}>
              <Text style={styles.prompt}>(USAi)$ </Text>{cmd.command}
            </Text>
            <Text style={[
              styles.commandOutput,
              { color: getLogColor(cmd.type) }
            ]}>
              {cmd.output}
            </Text>
            <Text style={styles.timestamp}>
              [{cmd.timestamp.toLocaleTimeString()}]
            </Text>
          </View>
        ))}
        
        <View style={styles.activeCommandLine}>
          <Text style={styles.prompt}>(USAi)$ </Text>
          {currentCommand && <Text style={styles.currentCommand}>{currentCommand}</Text>}
          <View style={styles.cursor} />
        </View>
      </ScrollView>

      {suggestions.length > 0 && (
        <View style={styles.suggestions}>
          <Text style={styles.suggestionsTitle}>Suggestions:</Text>
          {suggestions.map((suggestion, index) => {
            // For ECRR commands, show the full command with target
            const displayText = suggestion.startsWith('ecrr ') && suggestion.split(' ').length > 1 
              ? suggestion 
              : suggestion;
              
            return (
            <TouchableOpacity
              key={index}
              style={styles.suggestionItem}
              onPress={() => setCurrentCommand(displayText)}
            >
              <Text style={styles.suggestionText}>{displayText}</Text>
            </TouchableOpacity>
            );
          })}
        </View>
      )}

      <View style={styles.inputContainer}>
        <Text style={styles.prompt}>(USAi)$ </Text>
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={currentCommand}
          onChangeText={setCurrentCommand}
          onSubmitEditing={() => executeCommand(currentCommand)}
          placeholder="Enter command..."
          placeholderTextColor={Colors.textMuted}
          returnKeyType="send"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={() => executeCommand(currentCommand)}
        >
          <Send size={16} color={Colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark,
    borderWidth: 2,
    borderColor: Colors.secondary,
    shadowColor: Colors.glowSecondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: Colors.panelBorder,
    backgroundColor: Colors.cardOverlay,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.secondary,
    letterSpacing: 1,
    flex: 1,
    marginLeft: 8,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 10,
    color: Colors.success,
    fontWeight: '600',
  },
  output: {
    flex: 1,
    padding: 16,
  },
  commandBlock: {
    marginBottom: 16,
  },
  commandInput: {
    fontSize: 14,
    color: Colors.textPrimary,
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  commandOutput: {
    fontSize: 14,
    marginBottom: 4,
    paddingLeft: 16,
    fontFamily: 'monospace',
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 10,
    color: Colors.textMuted,
    textAlign: 'right',
    fontFamily: 'monospace',
  },
  prompt: {
    color: Colors.secondary,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  activeCommandLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  currentCommand: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontFamily: 'monospace',
  },
  cursor: {
    width: 8,
    height: 16,
    backgroundColor: Colors.primary,
    marginLeft: 2,
    opacity: 0.8,
  },
  suggestions: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    backgroundColor: Colors.cardOverlay,
  },
  suggestionsTitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 8,
    fontWeight: '600',
  },
  suggestionItem: {
    backgroundColor: Colors.mediumGray,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  suggestionText: {
    fontSize: 12,
    color: Colors.primary,
    fontFamily: 'monospace',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 2,
    borderTopColor: Colors.panelBorder,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.cardOverlay,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
    marginLeft: 8,
    marginRight: 8,
    fontFamily: 'Orbitron-Regular',
  },
  sendButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: 'transparent',
  },
});