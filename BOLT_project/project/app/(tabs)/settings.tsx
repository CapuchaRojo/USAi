import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Switch, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/Styles';
import { GlowButton } from '@/components/ui/GlowButton';
import { Settings, Shield, Bell, Database, Wifi, Monitor, Zap, TriangleAlert as AlertTriangle, Info, CircleHelp as HelpCircle, User, Lock, Globe } from 'lucide-react-native';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [autoHeartbeat, setAutoHeartbeat] = useState(true);
  const [debugMode, setDebugMode] = useState(false);
  const [highPerformanceMode, setHighPerformanceMode] = useState(false);
  const [autoDeployment, setAutoDeployment] = useState(false);
  const [ecrrAutoApprove, setEcrrAutoApprove] = useState(false);

  const handleSystemReset = () => {
    Alert.alert(
      'System Reset',
      'This will reset all USAi settings to default values. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => {
            // Reset all settings
            setNotifications(true);
            setAutoHeartbeat(true);
            setDebugMode(false);
            setHighPerformanceMode(false);
            setAutoDeployment(false);
            setEcrrAutoApprove(false);
            Alert.alert('Success', 'System settings have been reset to defaults.');
          }
        },
      ]
    );
  };

  const handleEmergencyShutdown = () => {
    Alert.alert(
      'Emergency Shutdown',
      'This will immediately terminate all active agents and missions. Use only in critical situations.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Shutdown', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Emergency Protocol', 'Emergency shutdown initiated. All systems will be terminated.');
          }
        },
      ]
    );
  };

  const SettingItem = ({ 
    icon, 
    title, 
    description, 
    value, 
    onValueChange, 
    type = 'switch' 
  }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    value?: boolean;
    onValueChange?: (value: boolean) => void;
    type?: 'switch' | 'info' | 'button';
  }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingIcon}>
        {icon}
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      {type === 'switch' && (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: Colors.mediumGray, true: Colors.primary }}
          thumbColor={value ? Colors.textPrimary : Colors.textMuted}
        />
      )}
    </View>
  );

  return (
    <SafeAreaView style={GlobalStyles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Settings size={24} color={Colors.primary} />
          <Text style={styles.title}>SYSTEM SETTINGS</Text>
          <Text style={styles.subtitle}>
            Configure USAi Command Center
          </Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* User Profile */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>USER PROFILE</Text>
            
            <View style={styles.profileCard}>
              <View style={styles.profileAvatar}>
                <User size={32} color={Colors.textPrimary} />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>Commander</Text>
                <Text style={styles.profileRole}>System Administrator</Text>
                <Text style={styles.profileStatus}>Clearance Level: ALPHA</Text>
              </View>
            </View>
          </View>

          {/* System Configuration */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SYSTEM CONFIGURATION</Text>
            
            <SettingItem
              icon={<Bell size={20} color={Colors.secondary} />}
              title="Notifications"
              description="Receive alerts for agent status changes and mission updates"
              value={notifications}
              onValueChange={setNotifications}
            />
            
            <SettingItem
              icon={<Wifi size={20} color={Colors.success} />}
              title="Auto Heartbeat"
              description="Automatically sync agent heartbeats every 30 seconds"
              value={autoHeartbeat}
              onValueChange={setAutoHeartbeat}
            />
            
            <SettingItem
              icon={<Zap size={20} color={Colors.warning} />}
              title="High Performance Mode"
              description="Optimize system for maximum agent processing speed"
              value={highPerformanceMode}
              onValueChange={setHighPerformanceMode}
            />
            
            <SettingItem
              icon={<Monitor size={20} color={Colors.primary} />}
              title="Debug Mode"
              description="Enable detailed logging and diagnostic information"
              value={debugMode}
              onValueChange={setDebugMode}
            />
          </View>

          {/* Agent Management */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>AGENT MANAGEMENT</Text>
            
            <SettingItem
              icon={<Shield size={20} color={Colors.primary} />}
              title="Auto Deployment"
              description="Automatically deploy agents based on system load"
              value={autoDeployment}
              onValueChange={setAutoDeployment}
            />
            
            <SettingItem
              icon={<Database size={20} color={Colors.secondary} />}
              title="E.C.R.R. Auto-Approve"
              description="Automatically approve low-risk E.C.R.R. pipeline deployments"
              value={ecrrAutoApprove}
              onValueChange={setEcrrAutoApprove}
            />
          </View>

          {/* Security Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SECURITY</Text>
            
            <TouchableOpacity style={styles.securityItem}>
              <Lock size={20} color={Colors.warning} />
              <View style={styles.securityContent}>
                <Text style={styles.securityTitle}>Change Access Codes</Text>
                <Text style={styles.securityDesc}>Update system authentication</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.securityItem}>
              <Globe size={20} color={Colors.primary} />
              <View style={styles.securityContent}>
                <Text style={styles.securityTitle}>Network Security</Text>
                <Text style={styles.securityDesc}>Configure firewall and encryption</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* System Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SYSTEM INFORMATION</Text>
            
            <SettingItem
              icon={<Info size={20} color={Colors.textMuted} />}
              title="Version"
              description="USAi Command Center v1.0.0"
              type="info"
            />
            
            <SettingItem
              icon={<Database size={20} color={Colors.textMuted} />}
              title="Database"
              description="Connected to Supabase - All systems operational"
              type="info"
            />
            
            <SettingItem
              icon={<Wifi size={20} color={Colors.success} />}
              title="Network Status"
              description="Connected - Latency: 45ms"
              type="info"
            />
          </View>

          {/* Danger Zone */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: Colors.error }]}>DANGER ZONE</Text>
            
            <View style={styles.dangerZone}>
              <AlertTriangle size={20} color={Colors.error} />
              <Text style={styles.dangerText}>
                These actions are irreversible and may cause system downtime.
              </Text>
            </View>
            
            <View style={styles.dangerActions}>
              <GlowButton
                title="RESET SYSTEM"
                onPress={handleSystemReset}
                variant="warning"
                style={styles.dangerButton}
              />
              
              <GlowButton
                title="EMERGENCY SHUTDOWN"
                onPress={handleEmergencyShutdown}
                variant="error"
                style={styles.dangerButton}
              />
            </View>
          </View>

          {/* Help & Support */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>HELP & SUPPORT</Text>
            
            <View style={styles.helpContainer}>
              <HelpCircle size={20} color={Colors.secondary} />
              <View style={styles.helpContent}>
                <Text style={styles.helpTitle}>Need Help?</Text>
                <Text style={styles.helpDescription}>
                  Access the USAi documentation, command reference, and troubleshooting guides.
                </Text>
              </View>
            </View>
            
            <GlowButton
              title="VIEW DOCUMENTATION"
              onPress={() => Alert.alert('Documentation', 'Opening USAi Command Reference...')}
              variant="secondary"
              style={styles.helpButton}
            />
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
    marginBottom: 16,
    letterSpacing: 1,
  },
  
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.darkGray,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  
  profileAvatar: {
    width: 60,
    height: 60,
    backgroundColor: Colors.primary,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  
  profileInfo: {
    flex: 1,
  },
  
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  
  profileRole: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  
  profileStatus: {
    fontSize: 12,
    color: Colors.success,
    fontWeight: '600',
  },
  
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  
  settingIcon: {
    marginRight: 12,
  },
  
  settingContent: {
    flex: 1,
  },
  
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  
  settingDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  
  securityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.darkGray,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    marginBottom: 8,
  },
  
  securityContent: {
    marginLeft: 12,
    flex: 1,
  },
  
  securityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  
  securityDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  
  dangerZone: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.darkGray,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.error,
    marginBottom: 16,
  },
  
  dangerText: {
    fontSize: 12,
    color: Colors.error,
    marginLeft: 8,
    flex: 1,
  },
  
  dangerActions: {
    gap: 12,
  },
  
  dangerButton: {
    width: '100%',
  },
  
  helpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.darkGray,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    marginBottom: 12,
  },
  
  helpContent: {
    marginLeft: 12,
    flex: 1,
  },
  
  helpTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  
  helpDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  
  helpButton: {
    width: '100%',
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