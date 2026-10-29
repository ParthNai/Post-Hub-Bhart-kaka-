import React, { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface TemplateCard {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  dimensions: string;
  badge: string;
  gradient: string;
  accent: string;
  icon: string;
}

const TEMPLATES: TemplateCard[] = [
  {
    id: 't1',
    title: 'Digital Marketing\nAgency',
    subtitle: 'Grow Your Brand Online',
    category: 'Business',
    dimensions: '1080 × 1350',
    badge: 'Trending',
    gradient: '#1E293B',
    accent: '#38BDF8',
    icon: 'megaphone',
  },
  {
    id: 't2',
    title: 'ADMISSION\nOPEN',
    subtitle: 'For All Higher Secondary',
    category: 'Education',
    dimensions: '1080 × 1350',
    badge: 'Popular',
    gradient: '#0284C7',
    accent: '#BAE6FD',
    icon: 'school',
  },
  {
    id: 't3',
    title: 'Happy\nDiwali',
    subtitle: 'Grand Festive Celebration',
    category: 'Festivals',
    dimensions: '1080 × 1080',
    badge: 'Festive',
    gradient: '#7C2D12',
    accent: '#FDE047',
    icon: 'flame',
  },
  {
    id: 't4',
    title: 'SPECIAL\nOFFERS',
    subtitle: 'UP TO 50% OFF',
    category: 'Offers',
    dimensions: '1080 × 1080',
    badge: 'Hot Deal',
    gradient: '#BE123C',
    accent: '#FECDD3',
    icon: 'headset',
  },
  {
    id: 't5',
    title: 'GROW YOUR\nBUSINESS',
    subtitle: 'Smart Strategies for Success',
    category: 'Business',
    dimensions: '1080 × 1350',
    badge: 'Pro',
    gradient: '#4C1D95',
    accent: '#DDD6FE',
    icon: 'trending-up',
  },
  {
    id: 't6',
    title: 'HAPPY NEW\nYEAR 2025',
    subtitle: 'New Beginnings & Dreams',
    category: 'Festivals',
    dimensions: '1080 × 1080',
    badge: 'New',
    gradient: '#0F172A',
    accent: '#FBBF24',
    icon: 'sparkles',
  },
];

const CATEGORIES = ['Business', 'Festivals', 'Education', 'Offers', 'Social Media'];

export default function TemplatesScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('Business');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<'Newest' | 'Popular'>('Newest');

  const filteredTemplates = TEMPLATES.filter((tmpl) => {
    const matchesCategory =
      selectedCategory === 'All' ? true : tmpl.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      tmpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tmpl.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: '#F8F7FC' }]}>
      {/* Top Search Bar with Filter Icon */}
      <View style={styles.topSearchWrapper}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#9A93A8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search templates..."
            placeholderTextColor="#9A93A8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={{ marginRight: 6 }}>
              <Ionicons name="close-circle" size={16} color="#9A93A8" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setSortOption(sortOption === 'Newest' ? 'Popular' : 'Newest')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="options-outline" size={18} color="#7956C9" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Category Pills Row */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryRail}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryPill,
                  isSelected ? styles.categoryPillActive : styles.categoryPillInactive,
                ]}
                onPress={() => setSelectedCategory(cat)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.categoryPillText,
                    isSelected ? styles.categoryPillTextActive : styles.categoryPillTextInactive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Filter & Sort Bar */}
        <View style={styles.filterSortRow}>
          <TouchableOpacity
            style={styles.filterRowButton}
            onPress={() => setSelectedCategory(selectedCategory === 'Business' ? 'All' : 'Business')}
            activeOpacity={0.7}
          >
            <Ionicons name="filter" size={14} color="#5C566E" />
            <Text style={styles.filterRowText}>Filter</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sortRowButton}
            onPress={() => setSortOption(sortOption === 'Newest' ? 'Popular' : 'Newest')}
            activeOpacity={0.7}
          >
            <Text style={styles.sortRowText}>Sort: {sortOption}</Text>
            <Ionicons name="chevron-down" size={13} color="#5C566E" />
          </TouchableOpacity>
        </View>

        {/* 2-Column Template Grid */}
        <View style={styles.grid}>
          {filteredTemplates.map((template) => (
            <TouchableOpacity
              key={template.id}
              style={styles.templateCard}
              activeOpacity={0.88}
              onPress={() =>
                router.push({
                  pathname: '/template-preview',
                  params: {
                    title: template.title.replace('\n', ' '),
                    category: template.category,
                    dimensions: template.dimensions,
                  },
                })
              }
            >
              <View style={[styles.cardCanvas, { backgroundColor: template.gradient }]}>
                {/* Top Badge */}
                <View style={styles.cardHeader}>
                  <View style={styles.badgePill}>
                    <Text style={styles.badgePillText}>{template.badge}</Text>
                  </View>
                  <View style={styles.miniLogoIcon}>
                    <Ionicons name="sparkles" size={11} color="rgba(255,255,255,0.8)" />
                  </View>
                </View>

                {/* Poster Content Graphic */}
                <View style={styles.cardGraphicBox}>
                  <Ionicons name={template.icon as any} size={28} color={template.accent} style={{ marginBottom: 6 }} />
                  <Text style={[styles.cardTitleText, { color: template.accent }]}>
                    {template.title}
                  </Text>
                  <Text style={styles.cardSubtitleText}>{template.subtitle}</Text>
                </View>

                {/* Bottom Dimension tag */}
                <View style={styles.cardBottomBar}>
                  <Text style={styles.categoryLabel}>{template.category}</Text>
                  <Text style={styles.dimensionLabel}>{template.dimensions}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
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
  topSearchWrapper: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 14 : 10,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0EFF4',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F4F9',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#24213A',
  },
  filterButton: {
    padding: 6,
    marginLeft: 4,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  categoryRail: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
  },
  categoryPillActive: {
    backgroundColor: '#7956C9',
  },
  categoryPillInactive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E5ED',
  },
  categoryPillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  categoryPillTextActive: {
    color: '#FFFFFF',
  },
  categoryPillTextInactive: {
    color: '#6B667A',
  },
  filterSortRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterRowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  filterRowText: {
    fontSize: 13,
    color: '#5C566E',
    fontWeight: '600',
  },
  sortRowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sortRowText: {
    fontSize: 13,
    color: '#5C566E',
    fontWeight: '600',
  },
  grid: {
    paddingHorizontal: 16,
    paddingTop: 6,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  templateCard: {
    width: '48%',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 4,
  },
  cardCanvas: {
    height: 195,
    padding: 10,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgePill: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 5,
  },
  badgePillText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  miniLogoIcon: {
    width: 20,
    height: 20,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardGraphicBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitleText: {
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 15,
  },
  cardSubtitleText: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    marginTop: 2,
  },
  cardBottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryLabel: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '600',
  },
  dimensionLabel: {
    fontSize: 8,
    color: 'rgba(255,255,255,0.65)',
  },
});
