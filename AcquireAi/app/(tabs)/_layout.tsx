import { Tabs } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { 
  Command, 
  Users, 
  Brain, 
  Activity, 
  Settings,
  Network
} from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.dark,
          borderTopColor: Colors.lightGray,
          borderTopWidth: 1,
          height: 70,
          paddingBottom: 10,
          paddingTop: 5,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          letterSpacing: 0.5,
          fontFamily: 'Orbitron-Bold',
        },
        tabBarIconStyle: {
          marginBottom: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'COMMAND',
          tabBarIcon: ({ size, color }) => (
            <Command size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="agents"
        options={{
          title: 'AGENTS',
          tabBarIcon: ({ size, color }) => (
            <Users size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ecrr"
        options={{
          title: 'ECRR',
          tabBarIcon: ({ size, color }) => (
            <Brain size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="swarm"
        options={{
          title: 'SWARM',
          tabBarIcon: ({ size, color }) => (
            <Network size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'ANALYTICS',
          tabBarIcon: ({ size, color }) => (
            <Activity size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'SETTINGS',
          tabBarIcon: ({ size, color }) => (
            <Settings size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}