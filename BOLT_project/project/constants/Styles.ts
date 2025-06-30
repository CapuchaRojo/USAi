import { StyleSheet, Dimensions, Platform } from 'react-native';
import { Colors } from './Colors';

const { width, height } = Dimensions.get('window');

export const GlobalStyles = StyleSheet.create({
  // Base containers
  container: {
    flex: 1,
    backgroundColor: Colors.dark,
  },
  
  safeArea: {
    flex: 1,
    backgroundColor: Colors.dark,
  },
  
  // StarCraft-inspired panels
  commandPanel: {
    backgroundColor: Colors.cardOverlay,
    borderRadius: 0,
    borderWidth: 2,
    borderColor: Colors.panelBorder,
    padding: 16,
    margin: 8,
    shadowColor: Colors.glowPrimary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
    position: 'relative',
  },
  
  // Metallic frame with angled corners
  metallicFrame: {
    backgroundColor: Colors.cardOverlay,
    borderWidth: 2,
    borderColor: Colors.frameBorder,
    padding: 12,
    margin: 4,
    shadowColor: Colors.glowSecondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
    position: 'relative',
  },
  
  // Neon glow effect
  neonGlow: {
    shadowColor: Colors.glowPrimary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 10,
  },
  
  // Typography
  titleText: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 2,
    textShadowColor: Colors.glowPrimary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 12,
    letterSpacing: 1,
  },
  
  bodyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  
  accentText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.secondary,
    letterSpacing: 0.5,
  },
  
  // Status indicators
  statusOnline: {
    color: Colors.online,
    fontSize: 12,
    fontWeight: '600',
    textShadowColor: Colors.glowSuccess,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
  
  statusOffline: {
    color: Colors.offline,
    fontSize: 12,
    fontWeight: '600',
  },
  
  statusBusy: {
    color: Colors.busy,
    fontSize: 12,
    fontWeight: '600',
    textShadowColor: Colors.glowPrimary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
  
  // Buttons
  primaryButton: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    borderWidth: 2,
    borderColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.glowPrimary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 6,
  },
  
  secondaryButton: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    borderWidth: 2,
    borderColor: Colors.secondary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.glowSecondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 4,
  },
  
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    letterSpacing: 1,
  },
  
  // Progress bars
  progressContainer: {
    height: 8,
    backgroundColor: Colors.mediumGray,
    borderRadius: 0,
    overflow: 'hidden',
    marginVertical: 8,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 0,
    shadowColor: Colors.glowPrimary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  
  // Cards and panels
  agentCard: {
    backgroundColor: Colors.cardOverlay,
    borderWidth: 2,
    borderColor: Colors.frameBorder,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: Colors.glowSecondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    position: 'relative',
  },
  
  metricCard: {
    backgroundColor: Colors.darkGray,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    padding: 12,
    margin: 4,
    alignItems: 'center',
    minWidth: 80,
    shadowColor: Colors.glowPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  
  // Layout helpers
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  flex1: {
    flex: 1,
  },
  
  // Spacing
  marginSmall: {
    margin: 4,
  },
  
  marginMedium: {
    margin: 8,
  },
  
  marginLarge: {
    margin: 16,
  },
  
  paddingSmall: {
    padding: 4,
  },
  
  paddingMedium: {
    padding: 8,
  },
  
  paddingLarge: {
    padding: 16,
  },
  
  // StarCraft specific styles
  angledCorners: {
    position: 'relative',
  },
  
  neonBorder: {
    borderWidth: 2,
    borderColor: Colors.primary,
    shadowColor: Colors.glowPrimary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  
  metallicSurface: {
    backgroundColor: Colors.metallic,
    borderWidth: 1,
    borderColor: Colors.chrome,
  },
  
  holographicText: {
    color: Colors.textPrimary,
    textShadowColor: Colors.glowPrimary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
    letterSpacing: 1,
  },
});

export const AnimationConfig = {
  duration: {
    fast: 200,
    medium: 300,
    slow: 500,
  },
  easing: {
    easeInOut: 'ease-in-out',
    easeOut: 'ease-out',
    linear: 'linear',
  },
};