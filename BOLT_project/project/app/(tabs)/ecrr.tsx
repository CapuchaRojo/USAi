import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/Styles';
import { GlowButton } from '@/components/ui/GlowButton';
import { api } from '@/lib/api';
import { ECRRPipeline } from '@/types/database';
import { Brain, Scan, RefreshCw, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Clock, ArrowRight, Zap, Target, Cpu } from 'lucide-react-native';

export default function ECRRScreen() {
  const [pipelines, setPipelines] = useState<ECRRPipeline[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [targetInput, setTargetInput] = useState('');
  const [depthLevel, setDepthLevel] = useState<'basic' | 'standard' | 'deep'>('standard');
  const [isProcessing, setIsProcessing] = useState(false);

  const loadPipelines = async () => {
    try {
      const data = await api.ecrrService.getAll();
      setPipelines(data || []);
    } catch (error) {
      console.error('Error loading ECRR pipelines:', error);
      setPipelines([]);
    }
  };

  useEffect(() => {
    loadPipelines();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPipelines();
    setRefreshing(false);
  };

  const initiateECRR = async () => {
    if (!targetInput.trim()) return;

    setIsProcessing(true);
    
    try {
      const result = await api.ecrrService.execute(
        targetInput.trim(),
        'external_system',
        depthLevel
      );
      
      setIsProcessing(false);
      setTargetInput('');
      await loadPipelines();

    } catch (error) {
      console.error('Error initiating ECRR:', error);
      setIsProcessing(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} color={Colors.success} />;
      case 'running':
        return <RefreshCw size={16} color={Colors.primary} />;
      case 'failed':
        return <AlertCircle size={16} color={Colors.error} />;
      default:
        return <Clock size={16} color={Colors.warning} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return Colors.success;
      case 'running':
        return Colors.primary;
      case 'failed':
        return Colors.error;
      default:
        return Colors.warning;
    }
  };

  return (
    <SafeAreaView style={GlobalStyles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Brain size={24} color={Colors.primary} />
          <Text style={styles.title}>E.C.R.R. PROTOCOL</Text>
          <Text style={styles.subtitle}>
            Emulate â€¢ Condense â€¢ Repurpose â€¢ Redeploy
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
          {/* Protocol Overview */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PROTOCOL OVERVIEW</Text>
            <Text style={styles.description}>
              The E.C.R.R. Protocol enables USAi to analyze any external system, 
              extract its core functionality, and deploy specialized agents that 
              can replicate and enhance those capabilities within the Legion ecosystem.
            </Text>
            
            <View style={styles.phases}>
              <View style={styles.phase}>
                <Scan size={20} color={Colors.primary} />
                <Text style={styles.phaseTitle}>EMULATE</Text>
                <Text style={styles.phaseDesc}>Deep system analysis</Text>
              </View>
              <ArrowRight size={16} color={Colors.textMuted} />
              <View style={styles.phase}>
                <Brain size={20} color={Colors.secondary} />
                <Text style={styles.phaseTitle}>CONDENSE</Text>
                <Text style={styles.phaseDesc}>Extract core functions</Text>
              </View>
              <ArrowRight size={16} color={Colors.textMuted} />
              <View style={styles.phase}>
                <RefreshCw size={20} color={Colors.success} />
                <Text style={styles.phaseTitle}>REPURPOSE</Text>
                <Text style={styles.phaseDesc}>Adapt for Legion</Text>
              </View>
              <ArrowRight size={16} color={Colors.textMuted} />
              <View style={styles.phase}>
                <CheckCircle size={20} color={Colors.warning} />
                <Text style={styles.phaseTitle}>REDEPLOY</Text>
                <Text style={styles.phaseDesc}>Generate agents</Text>
              </View>
            </View>
          </View>

          {/* Target Input */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>INITIATE NEW ANALYSIS</Text>
            
            <TextInput
              style={styles.targetInput}
              placeholder="Enter target system, application, or concept..."
              placeholderTextColor={Colors.textMuted}
              value={targetInput}
              onChangeText={setTargetInput}
              multiline
              textAlignVertical="top"
            />

            <View style={styles.depthSelector}>
              <Text style={styles.depthLabel}>Analysis Depth:</Text>
              <View style={styles.depthButtons}>
                {(['basic', 'standard', 'deep'] as const).map((depth) => (
                  <GlowButton
                    key={depth}
                    title={depth.toUpperCase()}
                    onPress={() => setDepthLevel(depth)}
                    variant={depthLevel === depth ? 'primary' : 'secondary'}
                    size="small"
                    style={styles.depthButton}
                  />
                ))}
              </View>
            </View>

            <GlowButton
              title={isProcessing ? "PROCESSING..." : "INITIATE E.C.R.R."}
              onPress={initiateECRR}
              variant="success"
              disabled={!targetInput.trim() || isProcessing}
              style={styles.initiateButton}
            />
          </View>

          {/* Quick Targets */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>QUICK TARGETS</Text>
            <View style={styles.quickTargets}>
              {[
                { name: 'Instagram', type: 'Social Media', icon: <Target size={16} color={Colors.secondary} /> },
                { name: 'Netflix', type: 'Streaming', icon: <Zap size={16} color={Colors.primary} /> },
                { name: 'Uber', type: 'Logistics', icon: <Cpu size={16} color={Colors.success} /> },
                { name: 'Slack', type: 'Communication', icon: <Brain size={16} color={Colors.warning} /> },
              ].map((target) => (
                <TouchableOpacity
                  key={target.name}
                  style={styles.quickTarget}
                  onPress={() => setTargetInput(target.name)}
                >
                  {target.icon}
                  <Text style={styles.quickTargetName}>{target.name}</Text>
                  <Text style={styles.quickTargetType}>{target.type}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Active Pipelines */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PIPELINE STATUS</Text>
            
            {pipelines.length === 0 ? (
              <View style={styles.emptyState}>
                <Brain size={48} color={Colors.textMuted} />
                <Text style={styles.emptyTitle}>No Active Pipelines</Text>
                <Text style={styles.emptySubtitle}>
                  Initiate your first E.C.R.R. analysis to begin
                </Text>
              </View>
            ) : (
              pipelines.map((pipeline) => (
                <View key={pipeline.id} style={styles.pipelineCard}>
                  <View style={styles.pipelineHeader}>
                    <View style={styles.pipelineInfo}>
                      <Text style={styles.pipelineId}>{pipeline.pipeline_id}</Text>
                      <Text style={styles.pipelineTarget}>{pipeline.target}</Text>
                    </View>
                    <View style={styles.pipelineStatus}>
                      {getStatusIcon(pipeline.status)}
                      <Text style={[styles.statusText, { color: getStatusColor(pipeline.status) }]}>
                        {pipeline.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  {pipeline.status === 'running' && (
                    <View style={styles.progressSection}>
                      <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: '60%' }]} />
                      </View>
                      <Text style={styles.progressText}>Processing...</Text>
                    </View>
                  )}

                  {pipeline.status === 'completed' && pipeline.summary && (
                    <View style={styles.resultsSection}>
                      <Text style={styles.resultsTitle}>RESULTS</Text>
                      <View style={styles.resultsList}>
                        <Text style={styles.resultItem}>
                          â€¢ Capabilities Acquired: {pipeline.summary.new_capabilities_acquired || 'N/A'}
                        </Text>
                        <Text style={styles.resultItem}>
                          â€¢ Agents Generated: {pipeline.deployment_result?.agents_generated || 0}
                        </Text>
                        <Text style={styles.resultItem}>
                          â€¢ Success Rate: {((pipeline.summary.success_rate || 0) * 100).toFixed(1)}%
                        </Text>
                        <Text style={styles.resultItem}>
                          â€¢ Duration: {pipeline.pipeline_duration?.toFixed(1) || 0}s
                        </Text>
                      </View>
                    </View>
                  )}

                  <Text style={styles.pipelineTime}>
                    {pipeline.completed_at 
                      ? `Completed: ${new Date(pipeline.completed_at).toLocaleString()}`
                      : `Started: ${new Date(pipeline.created_at).toLocaleString()}`
                    }
                  </Text>
                </View>
              ))
            )}
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
    letterSpacing: 1,
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
  
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 12,
    letterSpacing: 1,
  },
  
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  
  phases: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  phase: {
    alignItems: 'center',
    flex: 1,
  },
  
  phaseArrow: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  phaseTitle: {
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
  
  targetInput: {
    backgroundColor: Colors.darkGray,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    padding: 12,
    fontSize: 14,
    color: Colors.textPrimary,
    height: 80,
    marginBottom: 16,
    fontFamily: 'monospace',
  },
  
  depthSelector: {
    marginBottom: 16,
  },
  
  depthLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  
  depthButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  
  depthButton: {
    flex: 1,
  },
  
  initiateButton: {
    width: '100%',
  },
  
  quickTargets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  
  quickTarget: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.darkGray,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    alignItems: 'center',
  },
  
  quickTargetName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: 4,
  },
  
  quickTargetType: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
  },
  
  pipelineCard: {
    backgroundColor: Colors.darkGray,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    padding: 12,
    marginBottom: 12,
  },
  
  pipelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  
  pipelineInfo: {
    flex: 1,
  },
  
  pipelineId: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  
  pipelineTarget: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  
  pipelineStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  
  progressSection: {
    marginVertical: 8,
  },
  
  progressBar: {
    height: 4,
    backgroundColor: Colors.mediumGray,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  
  progressText: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  
  resultsSection: {
    marginTop: 8,
    padding: 8,
    backgroundColor: Colors.mediumGray,
    borderRadius: 6,
  },
  
  resultsTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.success,
    marginBottom: 6,
  },
  
  resultsList: {
    gap: 2,
  },
  
  resultItem: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  
  pipelineTime: {
    fontSize: 10,
    color: Colors.textMuted,
    textAlign: 'right',
    marginTop: 8,
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
});