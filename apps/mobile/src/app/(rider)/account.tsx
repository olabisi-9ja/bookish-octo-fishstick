import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FloatingTabBar, TAB_BAR_CLEARANCE } from '../../components/figma/TabBar';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { User, ChevronRight, CreditCard, Shield, Bell, HelpCircle, Settings, LogOut, ArrowLeftRight, CheckCircle } from 'lucide-react-native';
import { colors, fontFamily, fontSize, spacing, radii, shadows } from '../../constants/theme';
import { useComuta } from '../../store';
import { authService } from '../../services/authService';
import { VERIFICATION_LABEL } from '../../constants';

export default function AccountScreen() {
  const router = useRouter();
  const session = useComuta((s) => s.session);
  const users = useComuta((s) => s.users);

  const currentUser = useMemo(
    () => users.find((u) => u.id === session?.userId),
    [users, session?.userId],
  );

  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: () => { authService.logout(); router.replace('/(auth)/login'); } },
    ]);
  };

  const handleSwitchToDriver = () => {
    if (session?.driverOnboarded) {
      authService.switchMode('driver');
      router.replace('/(driver)/drive');
    } else {
      router.push('/(auth)/driver-onboarding');
    }
  };

  const menuItems = [
    { icon: CreditCard, label: 'Payment methods', subtitle: 'Manage cards and payment options' },
    { icon: Shield, label: 'Trusted contacts', subtitle: 'Emergency contacts for trip sharing' },
    { icon: Bell, label: 'Notifications', subtitle: 'Push and email preferences' },
    { icon: HelpCircle, label: 'Help & Support', subtitle: 'FAQs, tickets, and contact us' },
    { icon: Settings, label: 'Settings', subtitle: 'Language, appearance, and more' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.screenTitle}>Account</Text>

        {/* Profile card */}
        <Animated.View entering={FadeInDown.duration(300)}>
          <Pressable style={styles.profileCard}>
            <View style={[styles.avatar, { backgroundColor: currentUser?.avatarColor || colors.forest[600] }]}>
              <Text style={styles.avatarText}>{currentUser?.photoInitials || 'U'}</Text>
            </View>
            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.profileName}>{currentUser?.firstName} {currentUser?.lastName}</Text>
                {currentUser?.verificationStatus === 'verified' && (
                  <CheckCircle size={16} color={colors.forest[600]} />
                )}
              </View>
              <Text style={styles.profileEmail}>{currentUser?.email}</Text>
              <Text style={styles.profilePhone}>{currentUser?.phone}</Text>
            </View>
            <ChevronRight size={18} color={colors.muted} />
          </Pressable>
        </Animated.View>

        {/* Switch to driver */}
        <Animated.View entering={FadeInDown.delay(100).duration(300)}>
          <Pressable onPress={handleSwitchToDriver} style={styles.switchCard}>
            <ArrowLeftRight size={20} color={colors.forest[950]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.switchTitle}>Switch to Driver</Text>
              <Text style={styles.switchSubtitle}>
                {session?.driverOnboarded ? 'Manage your rides and earnings' : 'Set up your driver profile'}
              </Text>
            </View>
            <ChevronRight size={18} color={colors.forest[800]} />
          </Pressable>
        </Animated.View>

        {/* Menu items */}
        <Animated.View entering={FadeInDown.delay(200).duration(300)}>
          <View style={styles.menuSection}>
            {menuItems.map((item, i) => (
              <Pressable key={item.label} style={[styles.menuItem, i < menuItems.length - 1 && styles.menuItemBorder]}>
                <item.icon size={20} color={colors.muted} />
                <View style={styles.menuContent}>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>
                <ChevronRight size={16} color={colors.faint} />
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {/* Logout */}
        <Animated.View entering={FadeInDown.delay(300).duration(300)}>
          <Pressable onPress={handleLogout} style={styles.logoutButton}>
            <LogOut size={20} color={colors.red[500]} />
            <Text style={styles.logoutText}>Log out</Text>
          </Pressable>
        </Animated.View>

        {/* Dev utility */}
        <Pressable
          onPress={() => { authService.clearLocalState(); router.replace('/'); }}
          style={styles.devButton}
        >
          <Text style={styles.devText}>Reset prototype data</Text>
        </Pressable>

        <Text style={styles.version}>Comuta v0.1.0 · Lagos</Text>
      </ScrollView>
          <FloatingTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  scrollContent: { paddingHorizontal: spacing[5], paddingBottom: TAB_BAR_CLEARANCE},
  screenTitle: { fontFamily: fontFamily.bold, fontSize: fontSize.headlineLarge, color: colors.onsurface, paddingTop: spacing[4], marginBottom: spacing[5] },
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: spacing[4], padding: spacing[5], backgroundColor: colors.white, borderRadius: radii.xl, ...shadows.soft, marginBottom: spacing[4] },
  avatar: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: fontFamily.bold, fontSize: 20, color: colors.white },
  profileInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  profileName: { fontFamily: fontFamily.semibold, fontSize: fontSize.titleMedium, color: colors.onsurface },
  profileEmail: { fontFamily: fontFamily.regular, fontSize: fontSize.bodySmall, color: colors.muted, marginTop: 2 },
  profilePhone: { fontFamily: fontFamily.regular, fontSize: fontSize.labelSmall, color: colors.faint },
  switchCard: { flexDirection: 'row', alignItems: 'center', gap: spacing[3], padding: spacing[5], backgroundColor: colors.lime[50], borderRadius: radii.xl, marginBottom: spacing[5] },
  switchTitle: { fontFamily: fontFamily.semibold, fontSize: fontSize.bodyMedium, color: colors.forest[950] },
  switchSubtitle: { fontFamily: fontFamily.regular, fontSize: fontSize.labelSmall, color: colors.forest[800], marginTop: 2 },
  menuSection: { backgroundColor: colors.white, borderRadius: radii.xl, ...shadows.soft, marginBottom: spacing[5], overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: spacing[3], paddingVertical: spacing[4], paddingHorizontal: spacing[5] },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: colors.lineSoft },
  menuContent: { flex: 1 },
  menuLabel: { fontFamily: fontFamily.medium, fontSize: fontSize.bodyMedium, color: colors.onsurface },
  menuSubtitle: { fontFamily: fontFamily.regular, fontSize: fontSize.labelSmall, color: colors.muted, marginTop: 2 },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing[2], paddingVertical: spacing[4], borderRadius: radii.lg, borderWidth: 1.5, borderColor: colors.red[100], marginBottom: spacing[6] },
  logoutText: { fontFamily: fontFamily.semibold, fontSize: fontSize.bodyMedium, color: colors.red[500] },
  devButton: { alignItems: 'center', paddingVertical: spacing[3] },
  devText: { fontFamily: fontFamily.medium, fontSize: fontSize.labelSmall, color: colors.faint },
  version: { fontFamily: fontFamily.regular, fontSize: fontSize.caption, color: colors.faint, textAlign: 'center', marginTop: spacing[4] },
});
