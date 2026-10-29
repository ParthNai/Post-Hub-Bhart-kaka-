import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

interface DesignItem {
  id: string;
  title: string;
  category: string;
  status: 'Saved' | 'Draft';
  gradient: string[];
  textColor: string;
  badgeColor: string;
  iconName: string;
}

const DESIGNS_DATA: DesignItem[] = [
  {
    id: 'd1',
    title: 'Happy Diwali',
    category: 'Festivals',
    status: 'Saved',
    gradient: ['#6B1700', '#B83200'],
    textColor: '#FFD700',
    badgeColor: '#10B981',
    iconName: 'flame',
  },
  {
    id: 'd2',
    title: 'Summer Sale\nUP TO 50% OFF',
    category: 'Offers',
    status: 'Draft',
    gradient: ['#FA8231', '#FFB142'],
    textColor: '#FFFFFF',
    badgeColor: '#F59E0B',
    iconName: 'pricetag',
  },
  {
    id: 'd3',
    title: 'ADMISSION\nOPEN',
    category: 'Education',
    status: 'Saved',
    gradient: ['#2F80ED', '#56CCF2'],
    textColor: '#FFFFFF',
    badgeColor: '#10B981',
    iconName: 'school',
  },
  {
    id: 'd4',
    title: 'HAPPY\nNEW YEAR 2025',
    category: 'Festivals',
    status: 'Draft',
    gradient: ['#1C1E24', '#2C3E50'],
    textColor: '#F1C40F',
    badgeColor: '#F59E0B',
    iconName: 'sparkles',
  },
];

export default function MyDesignsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const [activeTab, setActiveTab] = useState<'All' | 'Drafts' | 'Saved'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDesigns = DESIGNS_DATA.filter((design) => {
    const matchesTab =
      activeTab === 'All' ? true : design.status.toLowerCase() === activeTab.slice(0, -1).toLowerCase() || design.status === activeTab;
    const matchesSearch = design.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: '#F8F7FC' }]}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="chevron-back" size={22} color="#24213A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Designs</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={18} color="#9A93A8" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search your designs..."
              placeholderTextColor="#9A93A8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={16} color="#9A93A8" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Filter Pills */}
        <View style={styles.filterTabsRow}>
          {(['All', 'Drafts', 'Saved'] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.filterTab,
                  isActive ? styles.filterTabActive : styles.filterTabInactive,
                ]}
                onPress={() => setActiveTab(tab)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.filterTabText,
                    isActive ? styles.filterTabTextActive : styles.filterTabTextInactive,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 2-Column Masonry Grid */}
        <View style={styles.grid}>
          {filteredDesigns.map((design) => (
            <TouchableOpacity
              key={design.id}
              style={styles.designCard}
              activeOpacity={0.88}
              onPress={() =>
                router.push({
                  pathname: '/poster-editor',
                  params: { title: design.title.replace('\n', ' '), category: design.category },
                })
              }
            >
              {/* Card Canvas Preview */}
              <View
                style={[
                  styles.cardPreview,
                  { backgroundColor: design.gradient[0] },
                ]}
              >
                {/* Top Badges */}
                <View style={styles.cardHeader}>
                  <View style={[styles.statusBadge, { backgroundColor: design.badgeColor }]}>
                    <Text style={styles.statusBadgeText}>{design.status}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.moreButton}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons name="ellipsis-horizontal" size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>

                {/* Poster Content */}
                <View style={styles.cardContent}>
                  <Ionicons name={design.iconName as any} size={28} color="rgba(255,255,255,0.7)" style={{ marginBottom: 6 }} />
                  <Text style={[styles.cardTitle, { color: design.textColor }]}>
                    {design.title}
                  </Text>
                </View>

                {/* Sub info */}
                <View style={styles.cardFooter}>
                  <Text style={styles.categoryTag}>{design.category}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Empty state watermark */}
        <View style={styles.watermarkContainer}>
          <View style={styles.watermarkIconBox}>
            <Ionicons name="documents-outline" size={24} color="#B4AEC1" />
          </View>
          <Text style={styles.watermarkText}>Your creations will appear here.</Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 14 : 10,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0EFF4',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F4F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#24213A',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E7E5ED',
    paddingHorizontal: 14,
    height: 44,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#24213A',
  },
  filterTabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterTabActive: {
    backgroundColor: '#7956C9',
  },
  filterTabInactive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E5ED',
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: '600',
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },
  filterTabTextInactive: {
    color: '#6B667A',
  },
  grid: {
    paddingHorizontal: 16,
    paddingTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  designCard: {
    width: '48%',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 6,
  },
  cardPreview: {
    height: 175,
    padding: 10,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  moreButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 17,
  },
  cardFooter: {
    alignItems: 'flex-start',
  },
  categoryTag: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '600',
  },
  watermarkContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
    marginBottom: 10,
  },
  watermarkIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ECEAF2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  watermarkText: {
    fontSize: 12,
    color: '#9A93A8',
    fontWeight: '500',
  },
});

