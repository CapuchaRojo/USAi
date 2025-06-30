import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, TextInput, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/Styles';
import { AgentCard } from '@/components/agents/AgentCard';
import { GlowButton } from '@/components/ui/GlowButton';
import { api } from '@/lib/api';
import { Agent } from '@/types/database';
import { Search, Filter, Plus, ChevronDown, Grid2x2 as Grid, List } from 'lucide-react-native';

export default function AgentsScreen() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedSumme, setSelectedSumme] = useState('All');
  
  // Filter toggles
  const [showController, setShowController] = useState(true);
  const [showOracle, setShowOracle] = useState(true);
  const [showDispatcher, setShowDispatcher] = useState(true);
  const [showModular, setShowModular] = useState(true);

  const loadAgents = async () => {
    try {
      const data = await api.agentService.getAll();
      setAgents(data || []);
    } catch (error) {
      console.error('Error loading agents:', error);
      setAgents([]);
    }
  };

  useEffect(() => {
    loadAgents();
  }, []);

  useEffect(() => {
    let filtered = agents;

    // Filter by agent type toggles
    filtered = filtered.filter(agent => {
      switch (agent.agent_type) {
        case 'Controller':
          return showController;
        case 'Oracle':
          return showOracle;
        case 'Dispatcher':
          return showDispatcher;
        case 'Modular':
          return showModular;
        default:
          return true;
      }
    });

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(agent =>
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.role.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by name
    filtered.sort((a, b) => a.name.localeCompare(b.name));

    setFilteredAgents(filtered);
  }, [agents, searchQuery, showController, showOracle, showDispatcher, showModular]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAgents();
    setRefreshing(false);
  };

  const handleCreateAgent = async () => {
    try {
      const agentTypes = ['Controller', 'Oracle', 'Dispatcher', 'Modular'];
      const randomType = agentTypes[Math.floor(Math.random() * agentTypes.length)];
      
      const newAgent = {
        name: `${randomType}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        agent_type: randomType,
        role: `${randomType} Agent - Specialized Operations`,
        status: 'initializing',
        level: 1,
        experience_points: 0,
        efficiency: Math.random() * 0.5 + 0.25,
        accuracy: Math.random() * 0.5 + 0.25,
        adaptability: Math.random() * 0.5 + 0.25,
        specialization: Math.random() * 0.5 + 0.25,
        skills: [],
        collected_tools: [],
        configuration: {},
      };

      await api.agentService.create(newAgent);
      await loadAgents();
    } catch (error) {
      console.error('Error creating agent:', error);
    }
  };

  return (
    <SafeAreaView style={GlobalStyles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>USAi</Text>
          <Text style={styles.subtitle}>AGENT PROFILE DATABASE</Text>
          
          <View style={styles.headerControls}>
            <View style={styles.sortContainer}>
              <Text style={styles.sortLabel}>SORT BY: NAME</Text>
            </View>
            <View style={styles.headerButtons}>
              <TouchableOpacity style={styles.headerButton}>
                <Grid size={20} color={Colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton}>
                <List size={20} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.mainContent}>
          {/* Left Panel - Search and Filters */}
          <View style={styles.leftPanel}>
            <View style={styles.searchSection}>
              <Text style={styles.sectionTitle}>Search and Filter</Text>
              
              {/* Search Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Name</Text>
                <View style={styles.searchContainer}>
                  <TextInput
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search agents..."
                    placeholderTextColor={Colors.textMuted}
                  />
                  <ChevronDown size={16} color={Colors.textMuted} />
                </View>
              </View>

              {/* Role Filter */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Role</Text>
                <TouchableOpacity style={styles.dropdown}>
                  <Text style={styles.dropdownText}>{selectedRole}</Text>
                  <ChevronDown size={16} color={Colors.textMuted} />
                </TouchableOpacity>
              </View>

              {/* Summe Filter */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Summe</Text>
                <TouchableOpacity style={styles.dropdown}>
                  <Text style={styles.dropdownText}>{selectedSumme}</Text>
                  <ChevronDown size={16} color={Colors.textMuted} />
                </TouchableOpacity>
              </View>

              {/* Agent Type Filters */}
              <View style={styles.checkboxGroup}>
                <View style={styles.checkboxItem}>
                  <Switch
                    value={showController}
                    onValueChange={setShowController}
                    trackColor={{ false: Colors.mediumGray, true: Colors.secondary }}
                    thumbColor={showController ? Colors.textPrimary : Colors.textMuted}
                  />
                  <Text style={styles.checkboxLabel}>Controller</Text>
                </View>
                
                <View style={styles.checkboxItem}>
                  <Switch
                    value={showOracle}
                    onValueChange={setShowOracle}
                    trackColor={{ false: Colors.mediumGray, true: Colors.primary }}
                    thumbColor={showOracle ? Colors.textPrimary : Colors.textMuted}
                  />
                  <Text style={styles.checkboxLabel}>Oracle</Text>
                </View>
                
                <View style={styles.checkboxItem}>
                  <Switch
                    value={showDispatcher}
                    onValueChange={setShowDispatcher}
                    trackColor={{ false: Colors.mediumGray, true: Colors.primary }}
                    thumbColor={showDispatcher ? Colors.textPrimary : Colors.textMuted}
                  />
                  <Text style={styles.checkboxLabel}>Dispatcher</Text>
                </View>
                
                <View style={styles.checkboxItem}>
                  <Switch
                    value={showModular}
                    onValueChange={setShowModular}
                    trackColor={{ false: Colors.mediumGray, true: Colors.warning }}
                    thumbColor={showModular ? Colors.textPrimary : Colors.textMuted}
                  />
                  <Text style={styles.checkboxLabel}>Modular</Text>
                </View>
              </View>

              <GlowButton
                title="SEARCH"
                onPress={() => {}}
                variant="primary"
                style={styles.searchButton}
              />
            </View>

            {/* Featured Agent Card */}
            <View style={styles.featuredAgent}>
              <View style={[styles.featuredCard, { borderColor: Colors.secondary }]}>
                <View style={styles.featuredAvatar}>
                  <Text style={styles.featuredAvatarText}>G</Text>
                </View>
                <View style={styles.featuredInfo}>
                  <Text style={styles.featuredName}>Grant</Text>
                  <Text style={styles.featuredRole}>CONTROLLER</Text>
                  <View style={styles.featuredStatus}>
                    <View style={[styles.statusDot, { backgroundColor: Colors.online }]} />
                    <Text style={[styles.statusText, { color: Colors.online }]}>ONLINE</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Right Panel - Agent Grid */}
          <View style={styles.rightPanel}>
            <ScrollView
              style={styles.agentGrid}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor={Colors.primary}
                  colors={[Colors.primary]}
                />
              }
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.gridContent}
            >
              <View style={styles.agentRow}>
                {filteredAgents.map((agent, index) => (
                  <AgentCard
                    key={agent.id}
                    agent={agent}
                    onPress={() => {
                      console.log('Agent selected:', agent.name);
                    }}
                  />
                ))}
              </View>

              {filteredAgents.length === 0 && (
                <View style={styles.emptyState}>
                  <Plus size={48} color={Colors.textMuted} />
                  <Text style={styles.emptyTitle}>No Agents Found</Text>
                  <Text style={styles.emptySubtitle}>
                    {agents.length === 0
                      ? 'Deploy your first agent to get started'
                      : 'Try adjusting your search or filter criteria'
                    }
                  </Text>
                  <GlowButton
                    title="DEPLOY NEW AGENT"
                    onPress={handleCreateAgent}
                    variant="success"
                    style={styles.deployButton}
                  />
                </View>
              )}
            </ScrollView>
          </View>
        </View>
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
    padding: 20,
    borderBottomWidth: 2,
    borderBottomColor: Colors.panelBorder,
    backgroundColor: Colors.cardOverlay,
  },
  
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: 3,
    textShadowColor: Colors.glowPrimary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    letterSpacing: 2,
    marginTop: 4,
  },
  
  headerControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  
  sortContainer: {
    backgroundColor: Colors.darkGray,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  
  sortLabel: {
    fontSize: 12,
    color: Colors.textPrimary,
    fontWeight: '600',
    letterSpacing: 1,
  },
  
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  
  headerButton: {
    width: 40,
    height: 40,
    backgroundColor: Colors.darkGray,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  mainContent: {
    flex: 1,
    flexDirection: 'row',
  },
  
  leftPanel: {
    width: 300,
    backgroundColor: Colors.cardOverlay,
    borderRightWidth: 2,
    borderRightColor: Colors.panelBorder,
    padding: 16,
  },
  
  searchSection: {
    marginBottom: 20,
  },
  
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 16,
    letterSpacing: 1,
  },
  
  inputGroup: {
    marginBottom: 16,
  },
  
  inputLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.darkGray,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.darkGray,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  
  dropdownText: {
    fontSize: 14,
    color: Colors.textPrimary,
  },
  
  checkboxGroup: {
    marginTop: 16,
    gap: 12,
  },
  
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  
  checkboxLabel: {
    fontSize: 14,
    color: Colors.textPrimary,
    letterSpacing: 0.5,
  },
  
  searchButton: {
    marginTop: 20,
    width: '100%',
  },
  
  featuredAgent: {
    marginTop: 20,
  },
  
  featuredCard: {
    backgroundColor: Colors.cardOverlay,
    borderWidth: 2,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  featuredAvatar: {
    width: 50,
    height: 50,
    backgroundColor: Colors.success,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  
  featuredAvatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  
  featuredInfo: {
    flex: 1,
  },
  
  featuredName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  
  featuredRole: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  
  featuredStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  
  rightPanel: {
    flex: 1,
    backgroundColor: Colors.dark,
  },
  
  agentGrid: {
    flex: 1,
    padding: 16,
  },
  
  gridContent: {
    paddingBottom: 20,
  },
  
  agentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 8,
  },
  
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 60,
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
    marginBottom: 20,
  },
  
  deployButton: {
    paddingHorizontal: 24,
  },
});