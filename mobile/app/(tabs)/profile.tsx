import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useAuth } from '@/context/AuthContext';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const { user, logout } = useAuth();

  const stats = [
    { label: 'Designs Made', value: '28' },
    { label: 'AI Credits', value: '142' },
    { label: 'Downloads', value: '54' },
  ];

  const menuItems = [
    { icon: 'images-outline', title: 'My Saved Designs', badge: '12' },
    { icon: 'sparkles-outline', title: 'AI Generation History', badge: '16' },
    { icon: 'color-palette-outline', title: 'Brand Kit & Logos' },
    { icon: 'notifications-outline', title: 'Notifications' },
    { icon: 'settings-outline', title: 'App Settings' },
    { icon: 'shield-checkmark-outline', title: 'Privacy & Terms' },
  ];

  const displayName = user?.name || 'Post Hub Creator';
  const displayEmail = user?.email || 'creator@posthub.io';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        {/* User Card */}
        <View style={[styles.profileCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <Text style={[styles.userName, { color: theme.text }]}>{displayName}</Text>
          <Text style={[styles.userEmail, { color: theme.tabIconDefault }]}>{displayEmail}</Text>
          <View style={styles.planBadge}>
            <Ionicons name="star" size={12} color="#FFFFFF" />
            <Text style={styles.planText}>{user?.role === 'admin' ? 'Superadmin' : 'Pro Member'}</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={[styles.statsCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          {stats.map((s, idx) => (
            <View key={s.label} style={[styles.statItem, idx !== stats.length - 1 && { borderRightWidth: 1, borderRightColor: theme.border }]}>
              <Text style={[styles.statValue, { color: theme.primary }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: theme.tabIconDefault }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Menu list */}
        <View style={[styles.menuCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.title}
              activeOpacity={0.7}
              style={[
                styles.menuRow,
                index !== menuItems.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.border },
              ]}
            >
              <View style={styles.menuLeft}>
                <Ionicons name={item.icon as any} size={20} color={theme.tabIconDefault} />
                <Text style={[styles.menuTitle, { color: theme.text }]}>{item.title}</Text>
              </View>
              <View style={styles.menuRight}>
                {item.badge && (
                  <View style={styles.menuBadge}>
                    <Text style={styles.menuBadgeText}>{item.badge}</Text>
                  </View>
                )}
                <Ionicons name="chevron-forward" size={16} color={theme.tabIconDefault} />
              </View>
            </TouchableOpacity>
          ))}

          {/* Logout Button */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.menuRow, { borderTopWidth: 1, borderTopColor: theme.border }]}
            onPress={logout}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="log-out-outline" size={20} color="#D9383A" />
              <Text style={[styles.menuTitle, { color: '#D9383A', fontWeight: '700' }]}>Sign Out</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#D9383A" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  profileCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
    marginBottom: 14,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#7956C9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  avatarText: { color: '#FFFFFF', fontSize: 24, fontWeight: '800' },
  userName: { fontSize: 17, fontWeight: '700' },
  userEmail: { fontSize: 13, marginTop: 2, marginBottom: 8 },
  planBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#7956C9',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  planText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  statsCard: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 14,
    marginBottom: 14,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '800' },
  statLabel: { fontSize: 11, marginTop: 2 },
  menuCard: { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuTitle: { fontSize: 14, fontWeight: '600' },
  menuRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  menuBadge: { backgroundColor: 'rgba(121,86,201,0.12)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  menuBadgeText: { color: '#7956C9', fontSize: 11, fontWeight: '700' },
});

