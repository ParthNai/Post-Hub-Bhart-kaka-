import React, { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

const CATEGORIES = ['All', 'Festivals', 'Business', 'Motivation', 'Wishes', 'Marketing', 'Offers'];

const FEATURED_TEMPLATES = [
  {
    id: 't1',
    title: 'Diwali Grand Celebration',
    category: 'Festivals',
    gradient: '#FF9900',
    tag: 'Trending',
  },
  {
    id: 't2',
    title: 'Modern Business Summit',
    category: 'Business',
    gradient: '#7956C9',
    tag: 'Popular',
  },
  {
    id: 't3',
    title: 'New Year Mega Sale',
    category: 'Offers',
    gradient: '#E63946',
    tag: '50% OFF',
  },
  {
    id: 't4',
    title: 'Daily Motivational Quote',
    category: 'Motivation',
    gradient: '#2A9D8F',
    tag: 'Daily',
  },
];

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Ionicons name="search" size={20} color={theme.tabIconDefault} style={styles.searchIcon} />
          <TextInput
            placeholder="Search templates, festivals, business..."
            placeholderTextColor={theme.tabIconDefault}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[styles.searchInput, { color: theme.text }]}
          />
        </View>
      </View>

      {/* Hero Banner */}
      <View style={styles.heroWrapper}>
        <View style={styles.heroCard}>
          <View style={styles.heroBadge}>
            <Ionicons name="sparkles" size={14} color="#FFFFFF" />
            <Text style={styles.heroBadgeText}>AI Studio 2.0</Text>
          </View>
          <Text style={styles.heroTitle}>Create Creative Posts & Posters</Text>
          <Text style={styles.heroSubtitle}>
            Generate high-resolution social posts and branding graphics in one click.
          </Text>
          <TouchableOpacity
            style={styles.heroCta}
            activeOpacity={0.85}
            onPress={() => router.push('/(tabs)/ai-generator')}
          >
            <Ionicons name="color-wand" size={18} color="#7956C9" />
            <Text style={styles.heroCtaText}>Try AI Generator</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Category Rail */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Categories</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroll}
      >
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              style={[
                styles.categoryChip,
                {
                  backgroundColor: isSelected ? theme.primary : theme.card,
                  borderColor: isSelected ? theme.primary : theme.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  { color: isSelected ? '#FFFFFF' : theme.text },
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Featured Templates Section */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Featured Posters</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/templates')}>
          <Text style={[styles.seeAllText, { color: theme.primary }]}>View All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.templatesGrid}>
        {FEATURED_TEMPLATES.map((tmpl) => (
          <TouchableOpacity
            key={tmpl.id}
            activeOpacity={0.88}
            style={[styles.templateCard, { backgroundColor: theme.card, borderColor: theme.border }]}
          >
            <View style={[styles.templatePoster, { backgroundColor: tmpl.gradient }]}>
              <View style={styles.tagBadge}>
                <Text style={styles.tagBadgeText}>{tmpl.tag}</Text>
              </View>
              <Ionicons name="image-outline" size={42} color="rgba(255,255,255,0.7)" />
            </View>
            <View style={styles.templateDetails}>
              <Text style={[styles.templateTitle, { color: theme.text }]} numberOfLines={1}>
                {tmpl.title}
              </Text>
              <View style={styles.templateFooter}>
                <Text style={[styles.templateCategory, { color: theme.tabIconDefault }]}>
                  {tmpl.category}
                </Text>
                <TouchableOpacity style={styles.useBtn}>
                  <Text style={styles.useBtnText}>Customize</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 46,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  heroWrapper: {
    paddingHorizontal: 16,
    marginVertical: 12,
  },
  heroCard: {
    backgroundColor: '#7956C9',
    borderRadius: 18,
    padding: 22,
    shadowColor: '#7956C9',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 4,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 12,
  },
  heroBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
    lineHeight: 28,
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#E8DFF5',
    lineHeight: 18,
    marginBottom: 16,
  },
  heroCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  heroCtaText: {
    color: '#7956C9',
    fontWeight: '700',
    fontSize: 13,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600',
  },
  categoryScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
  },
  templatesGrid: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  templateCard: {
    width: '48%',
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 8,
  },
  templatePoster: {
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  tagBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  templateDetails: {
    padding: 10,
  },
  templateTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  templateFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  templateCategory: {
    fontSize: 11,
  },
  useBtn: {
    backgroundColor: 'rgba(121,86,201,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  useBtnText: {
    color: '#7956C9',
    fontSize: 10,
    fontWeight: '700',
  },
});
