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

const FESTIVALS = [
  { id: 'f1', name: 'Diwali Festival of Lights', date: 'November 1, 2026', daysLeft: '3 Days', color: '#FF9900', count: '48 Designs' },
  { id: 'f2', name: 'Bhai Dooj', date: 'November 3, 2026', daysLeft: '5 Days', color: '#E63946', count: '24 Designs' },
  { id: 'f3', name: 'Guru Nanak Jayanti', date: 'November 15, 2026', daysLeft: '17 Days', color: '#457B9D', count: '18 Designs' },
  { id: 'f4', name: 'Christmas Celebration', date: 'December 25, 2026', daysLeft: '57 Days', color: '#2A9D8F', count: '65 Designs' },
  { id: 'f5', name: 'New Year 2027', date: 'January 1, 2027', daysLeft: '64 Days', color: '#7956C9', count: '90 Designs' },
];

export default function FestivalsScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Upcoming Seasonal Events</Text>
        <Text style={[styles.sectionSubtitle, { color: theme.tabIconDefault }]}>
          Never miss an occasion. Ready-to-share posters and greetings.
        </Text>

        <View style={styles.list}>
          {FESTIVALS.map((fest) => (
            <TouchableOpacity
              key={fest.id}
              activeOpacity={0.88}
              style={[styles.festivalCard, { backgroundColor: theme.card, borderColor: theme.border }]}
            >
              <View style={[styles.colorIndicator, { backgroundColor: fest.color }]}>
                <Ionicons name="calendar" size={24} color="#FFFFFF" />
              </View>
              <View style={styles.festInfo}>
                <View style={styles.headerRow}>
                  <Text style={[styles.festName, { color: theme.text }]}>{fest.name}</Text>
                  <View style={styles.daysBadge}>
                    <Text style={styles.daysBadgeText}>{fest.daysLeft}</Text>
                  </View>
                </View>
                <Text style={{ fontSize: 12, color: theme.tabIconDefault, marginTop: 4 }}>{fest.date}</Text>
                <View style={styles.footerRow}>
                  <Text style={{ fontSize: 12, color: theme.primary, fontWeight: '600' }}>{fest.count}</Text>
                  <Ionicons name="chevron-forward" size={16} color={theme.tabIconDefault} />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
  sectionSubtitle: { fontSize: 13, marginTop: 4, marginBottom: 16 },
  list: { gap: 12 },
  festivalCard: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center',
    gap: 12,
  },
  colorIndicator: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  festInfo: { flex: 1 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  festName: { fontSize: 14, fontWeight: '700' },
  daysBadge: { backgroundColor: 'rgba(121,86,201,0.1)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  daysBadgeText: { color: '#7956C9', fontSize: 11, fontWeight: '700' },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
});

