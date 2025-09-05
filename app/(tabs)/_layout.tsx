import { Tabs } from 'expo-router';
import { CreditCard, Scan, History, Settings } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#06B6D4',
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: {
          backgroundColor: '#0F172A',
          borderTopColor: '#1E293B',
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: 8,
          height: 80,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Wallet',
          tabBarIcon: ({ size, color }) => (
            <CreditCard color={color} size={size} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="add-card"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scan',
          tabBarIcon: ({ size, color }) => (
            <Scan color={color} size={size} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ size, color }) => (
            <History color={color} size={size} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ size, color }) => (
            <Settings color={color} size={size} strokeWidth={2} />
          ),
        }}
      />
    </Tabs>
  );
}