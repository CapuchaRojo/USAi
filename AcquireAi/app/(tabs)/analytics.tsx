import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/Styles';
import { MetricCard } from '@/components/ui/MetricCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Activity, TrendingUp, Target, Zap, ChartBar as BarChart3, ChartPie as PieChart, Gauge, TriangleAlert as AlertTriangle } from 'lucide-react-native';

const { width } = Dimensions.get('window');

// STATIC DEMO DATA - Linktree Analysis Results
const STATIC_AGENTS = [
  {
    id: 'agent-001',
    name: 'Profile-Manager-ALPHA',
    agent_type: 'Controller',
    role: 'Profile Interface Controller',
    status: 'online',
    level: 8,
    efficiency: 0.89,
    accuracy: 0.94,
    adaptability: 0.82,
    specialization: 0.91,
  },
  {
    id: 'agent-002',
    name: 'Link-Coordinator-BETA',
    agent_type: 'Dispatcher',
    role: 'Link Management Specialist',
    status: 'online',
    level: 6,
    efficiency: 0.92,
    accuracy: 0.88,
    adaptability: 0.85,
    specialization: 0.87,
  },
  {
    id: 'agent-003',
    name: 'Analytics-Oracle-GAMMA',
    agent_type: 'Oracle',
    role: 'Data Intelligence Analyst',
    status: 'online',
    level: 12,
    efficiency: 0.85,
    accuracy: 0.96,
    adaptability: 0.79,
    specialization: 0.93,
  },
  {
    id: 'agent-004',
    name: 'Theme-Designer-DELTA',
    agent_type: 'Modular',
    role: 'Visual Design Specialist',
    status: 'online',
    level: 5,
    efficiency: 0.78,
    accuracy: 0.91,
    adaptability: 0.88,
    specialization: 0.84,
  },
  {
    id: 'agent-005',
    name: 'Monetization-Controller-EPSILON',
    agent_type: 'Controller',
    role: 'Revenue Optimization Commander',
    status: 'mission-critical',
    level: 10,
    efficiency: 0.93,
    accuracy: 0.89,
    adaptability: 0.86,
    specialization: 0.95,
  },
  {
    id: 'agent-006',
    name: 'SEO-Optimizer-ZETA',
    agent_type: 'Modular',
    role: 'Search Engine Optimization Specialist',
    status: 'online',
    level: 7,
    efficiency: 0.87,
    accuracy: 0.92,
    adaptability: 0.83,
    specialization: 0.89,
  }
];

const STATIC_MISSIONS = [
  {
    id: 'mission-001',
    title: 'Optimize Profile Performance',
    status: 'active',
  },
  {
    id: 'mission-002',
    title: 'Implement Advanced Analytics',
    status: 'completed',
  }
];

const STATIC_PIPELINES = [
  {
    id: 'pipeline-001',
    pipeline_id: 'ECRR-LINKTREE-001',
    status: 'completed',
  }
];

const STATIC_SWARMS = [
  {
    id: 'swarm-001',
    swarm_id: 'SWARM-LINKTREE-ALPHA',
    status: 'active',
  }
];
export default function AnalyticsScreen() {
  const [agents] = useState(STATIC_AGENTS);
  const [missions] = useState(STATIC_MISSIONS);
  const [pipelines] = useState(STATIC_PIPELINES);
  const [swarms] = useState(STATIC_SWARMS);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Calculate performance metrics
  const calculateMetrics = () => {
    const totalAgents = agents.length;
    const onlineAgents = agents.filter(a => a.status === 'online').length;
    const avgLevel = totalAgents > 0 ? agents.reduce((sum, a) => sum + a.level, 0) / totalAgents : 0;
    const avgEfficiency = totalAgents > 0 ? agents.reduce((sum, a) => sum + a.efficiency, 0) / totalAgents : 0;
    const avgAccuracy = totalAgents > 0 ? agents.reduce((sum, a) => sum + a.accuracy, 0) / totalAgents : 0;
    const avgAdaptability = totalAgents > 0 ? agents.reduce((sum, a) => sum + a.adaptability, 0) / totalAgents : 0;

    const totalMissions = missions.length;
    const completedMissions = missions.filter(m => m.status === 'completed').length;
    const activeMissions = missions.filter(m => m.status === 'active').length;
    const missionSuccessRate = totalMissions > 0 ? (completedMissions / totalMissions) * 100 : 0;

    const totalPipelines = pipelines.length;
    const completedPipelines = pipelines.filter(p => p.status === 'completed').length;
    const runningPipelines = pipelines.filter(p => p.status === 'running').length;
    const pipelineSuccessRate = totalPipelines > 0 ? (completedPipelines / totalPipelines) * 100 : 0;

    const totalSwarms = swarms.length;
    const activeSwarms = swarms.filter(s => s.status === 'active').length;

    return {
      totalAgents,
      onlineAgents,
      avgLevel,
      avgEfficiency,
      avgAccuracy,
      avgAdaptability,
      uptime: totalAgents > 0 ? (onlineAgents / totalAgents) * 100 : 0,
      totalMissions,
      completedMissions,
      activeMissions,
      missionSuccessRate,
      totalPipelines,
      completedPipelines,
      runningPipelines,
      pipelineSuccessRate,
      totalSwarms,
      activeSwarms,
    };
  };

  const metrics = calculateMetrics();

  // Agent type distribution
  const agentTypeDistribution = {
    Controller: agents.filter(a => a.agent_type === 'Controller').length,
    Oracle: agents.filter(a => a.agent_type === 'Oracle').length,
    Dispatcher: agents.filter(a => a.agent_type === 'Dispatcher').length,
    Modular: agents.filter(a => a.agent_type === 'Modular').length,
  };

  // Performance trends (simulated)
  const performanceTrends = {
    efficiency: Array.from({ length: 7 }, (_, i) => ({
      day: i + 1,
      value: Math.random() * 20 + 70 + (i * 2), // Trending upward
    })),
    missions: Array.from({ length: 7 }, (_, i) => ({
      day: i + 1,
      completed: Math.floor(Math.random() * 5) + 2,
      active: Math.floor(Math.random() * 3) + 1,
    })),
  };

  return (
    <SafeAreaView style={GlobalStyles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Activity size={24} color={Colors.primary} />
          <Text style={styles.title}>SYSTEM ANALYTICS</Text>
          <Text style={styles.subtitle}>
            Real-time Performance Metrics & Intelligence
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
          {/* System Overview */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SYSTEM OVERVIEW</Text>
            <View style={styles.metricsGrid}>
              <MetricCard
                title="UPTIME"
                value={metrics.uptime}
                unit="%"
                color={Colors.success}
                showProgress
              />
              <MetricCard
                title="AGENTS"
                value={metrics.totalAgents}
                color={Colors.primary}
              />
              <MetricCard
                title="MISSIONS"
                value={metrics.totalMissions}
                color={Colors.secondary}
              />
              <MetricCard
                title="SWARMS"
                value={metrics.totalSwarms}
                color={Colors.warning}
              />
            </View>
          </View>

          {/* Performance Metrics */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PERFORMANCE METRICS</Text>
            <View style={styles.performanceContainer}>
              <View style={styles.performanceCard}>
                <Gauge size={20} color={Colors.success} />
                <Text style={styles.performanceTitle}>EFFICIENCY</Text>
                <Text style={styles.performanceValue}>
                  {(metrics.avgEfficiency * 100).toFixed(1)}%
                </Text>
                <ProgressBar
                  progress={metrics.avgEfficiency * 100}
                  color={Colors.success}
                  showPercentage={false}
                  height={4}
                />
              </View>
              
              <View style={styles.performanceCard}>
                <Target size={20} color={Colors.secondary} />
                <Text style={styles.performanceTitle}>ACCURACY</Text>
                <Text style={styles.performanceValue}>
                  {(metrics.avgAccuracy * 100).toFixed(1)}%
                </Text>
                <ProgressBar
                  progress={metrics.avgAccuracy * 100}
                  color={Colors.secondary}
                  showPercentage={false}
                  height={4}
                />
              </View>
              
              <View style={styles.performanceCard}>
                <Zap size={20} color={Colors.primary} />
                <Text style={styles.performanceTitle}>ADAPTABILITY</Text>
                <Text style={styles.performanceValue}>
                  {(metrics.avgAdaptability * 100).toFixed(1)}%
                </Text>
                <ProgressBar
                  progress={metrics.avgAdaptability * 100}
                  color={Colors.primary}
                  showPercentage={false}
                  height={4}
                />
              </View>
            </View>
          </View>

          {/* Mission Analytics */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>MISSION ANALYTICS</Text>
            <View style={styles.missionStats}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{metrics.completedMissions}</Text>
                <Text style={styles.statLabel}>COMPLETED</Text>
                <ProgressBar
                  progress={(metrics.completedMissions / Math.max(metrics.totalMissions, 1)) * 100}
                  color={Colors.success}
                  showPercentage={false}
                  height={4}
                />
              </View>
              
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{metrics.activeMissions}</Text>
                <Text style={styles.statLabel}>ACTIVE</Text>
                <ProgressBar
                  progress={(metrics.activeMissions / Math.max(metrics.totalMissions, 1)) * 100}
                  color={Colors.primary}
                  showPercentage={false}
                  height={4}
                />
              </View>
              
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{metrics.missionSuccessRate.toFixed(1)}%</Text>
                <Text style={styles.statLabel}>SUCCESS RATE</Text>
                <ProgressBar
                  progress={metrics.missionSuccessRate}
                  color={Colors.success}
                  showPercentage={false}
                  height={4}
                />
              </View>
            </View>
          </View>

          {/* Agent Distribution */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>AGENT DISTRIBUTION</Text>
            <View style={styles.distributionContainer}>
              {Object.entries(agentTypeDistribution).map(([type, count]) => {
                const percentage = metrics.totalAgents > 0 ? (count / metrics.totalAgents) * 100 : 0;
                const colors = {
                  Controller: Colors.primary,
                  Oracle: Colors.secondary,
                  Dispatcher: Colors.success,
                  Modular: Colors.warning,
                };
                
                return (
                  <View key={type} style={styles.distributionItem}>
                    <View style={styles.distributionHeader}>
                      <Text style={styles.distributionType}>{type}</Text>
                      <Text style={[styles.distributionCount, { color: colors[type as keyof typeof colors] }]}>
                        {count}
                      </Text>
                    </View>
                    <ProgressBar
                      progress={percentage}
                      color={colors[type as keyof typeof colors]}
                      showPercentage
                      height={6}
                    />
                  </View>
                );
              })}
            </View>
          </View>

          {/* E.C.R.R. Pipeline Status */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>E.C.R.R. PIPELINE STATUS</Text>
            <View style={styles.pipelineStats}>
              <MetricCard
                title="TOTAL PIPELINES"
                value={metrics.totalPipelines}
                color={Colors.primary}
              />
              <MetricCard
                title="COMPLETED"
                value={metrics.completedPipelines}
                color={Colors.success}
              />
              <MetricCard
                title="RUNNING"
                value={metrics.runningPipelines}
                color={Colors.warning}
              />
              <MetricCard
                title="SUCCESS RATE"
                value={metrics.pipelineSuccessRate}
                unit="%"
                color={Colors.secondary}
                showProgress
              />
            </View>
          </View>

          {/* System Health Alerts */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SYSTEM HEALTH</Text>
            <View style={styles.healthContainer}>
              {metrics.uptime < 80 && (
                <View style={styles.alertItem}>
                  <AlertTriangle size={16} color={Colors.error} />
                  <Text style={styles.alertText}>Low system uptime detected</Text>
                </View>
              )}
              
              {metrics.avgEfficiency < 0.6 && (
                <View style={styles.alertItem}>
                  <AlertTriangle size={16} color={Colors.warning} />
                  <Text style={styles.alertText}>Agent efficiency below optimal</Text>
                </View>
              )}
              
              {metrics.activeMissions === 0 && metrics.totalMissions > 0 && (
                <View style={styles.alertItem}>
                  <AlertTriangle size={16} color={Colors.warning} />
                  <Text style={styles.alertText}>No active missions</Text>
                </View>
              )}
              
              {metrics.uptime >= 80 && metrics.avgEfficiency >= 0.6 && (
                <View style={styles.alertItem}>
                  <TrendingUp size={16} color={Colors.success} />
                  <Text style={[styles.alertText, { color: Colors.success }]}>
                    All systems operating optimally
                  </Text>
                </View>
              )}
            </View>
          </View>
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 2,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  section: {
    margin: 16,
    padding: 16,
    backgroundColor: Colors.cardOverlay,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 12,
    letterSpacing: 1,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  performanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  performanceCard: {
    flex: 1,
    backgroundColor: Colors.darkGray,
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  performanceTitle: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 4,
    marginBottom: 2,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  performanceValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  missionStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.darkGray,
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  statLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 4,
    marginBottom: 8,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  statIndicator: {
    width: '100%',
    height: 4,
    backgroundColor: Colors.mediumGray,
    borderRadius: 2,
    overflow: 'hidden',
  },
  distributionContainer: {
    gap: 12,
  },
  distributionItem: {
    backgroundColor: Colors.darkGray,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  distributionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  distributionType: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  distributionCount: {
    fontSize: 16,
    fontWeight: '700',
  },
  pipelineStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  healthContainer: {
    gap: 8,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.darkGray,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  alertText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 8,
    flex: 1,
  },
});