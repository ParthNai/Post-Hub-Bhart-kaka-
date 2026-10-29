import React, { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

const TEMPLATE_ITEMS = [
  { id: '1', title: 'Grand Opening Announcement', category: 'Business', color: '#3A86FF', downloads: '1.2k' },
  { id: '2', title: 'Festival Greeting Card', category: 'Festivals', color: '#FF006E', downloads: '3.4k' },
  { id: '3', title: 'Hiring Talented Developers', category: 'Hiring', color: '#8338EC', downloads: '920' },
  { id: '4', title: 'Weekend Flash Sale 50%', category: 'Offers', color: '#FB5607', downloads: '4.1k' },
  { id: '5', title: 'Mindset & Success Quote', category: 'Motivation', color: '#06D6A0', downloads: '2.8k' },
  { id: '6', title: 'Product Launch Webinar', category: 'Business', color: '#7956C9', downloads: '1.5k' },
];

export default function TemplatesScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Business', 'Festivals', 'Offers', 'Motivation'];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Search */}
      <View style={styles.searchWrapper}>
        <View style={[styles.searchBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Ionicons name="search" size={18} color={theme.tabIconDefault} style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Search all templates..."
            placeholderTextColor={theme.tabIconDefault}
            style={[styles.searchInput, { color: theme.text }]}
          />
        </View>
      </View>

      {/* Filter Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
        {filters.map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setActiveFilter(f)}
            style={[
              styles.filterChip,
              {
                backgroundColor: activeFilter === f ? theme.primary : theme.card,
                borderColor: activeFilter === f ? theme.primary : theme.border,
              },
            ]}
          >
            <Text style={{ color: activeFilter === f ? '#FFFFFF' : theme.text, fontSize: 13, fontWeight: '600' }}>
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Grid */}
      <View style={styles.grid}>
        {TEMPLATE_ITEMS.map((item) => (
          <View
            key={item.id}
            style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
          >
            <View style={[styles.cardPreview, { backgroundColor: item.color }]}>
              <Ionicons name="sparkles" size={36} color="rgba(255,255,255,0.75)" />
            </View>
            <View style={styles.cardInfo}>
              <Text style={[styles.cardTitle, { color: theme.text }]} numberOfLines={1}>
                {item.title}
              </Text>
              <View style={styles.cardFooter}>
                <Text style={{ fontSize: 11, color: theme.tabIconDefault }}>{item.category}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Ionicons name="arrow-down-circle-outline" size={13} color={theme.primary} />
                  <Text style={{ fontSize: 11, color: theme.primary, fontWeight: '600' }}>{item.downloads}</Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchWrapper: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  searchBox: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, borderWidth: 1, paddingHorizontal: 12, height: 44 },
  searchInput: { flex: 1, fontSize: 14 },
  filterScroll: { paddingHorizontal: 16, gap: 8, paddingVertical: 8 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 18, borderWidth: 1 },
  grid: { paddingHorizontal: 16, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, marginTop: 8 },
  card: { width: '48%', borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
  cardPreview: { height: 170, alignItems: 'center', justifyContent: 'center' },
  cardInfo: { padding: 10 },
  cardTitle: { fontSize: 13, fontWeight: '700', marginBottom: 6 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});

