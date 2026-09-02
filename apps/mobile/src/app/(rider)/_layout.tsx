import React from 'react';
import { Tabs } from 'expo-router';
import { Home, Clock, DollarSign, User } from 'lucide-react-native';
import { colors, fontFamily, fontSize } from '../../constants/theme';
import { Platform } from 'react-native';

export default function RiderLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.forest[900],
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: {
          fontFamily: fontFamily.medium,
          fontSize: 11,
          marginTop: -2,
        },
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.lineSoft,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="trips"
        options={{
          title: 'Trips',
          tabBarIcon: ({ color, size }) => <Clock size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="pricing"
        options={{
          title: 'Pricing',
          tabBarIcon: ({ color, size }) => <DollarSign size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
      {/* Hidden screens (not shown in tab bar) */}
      <Tabs.Screen name="hub-select" options={{ href: null }} />
      <Tabs.Screen name="search-results" options={{ href: null }} />
      <Tabs.Screen name="booking-confirm" options={{ href: null }} />
    </Tabs>
  );
}
