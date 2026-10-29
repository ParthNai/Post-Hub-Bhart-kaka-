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
import { useAuth } from '@/context/AuthContext';

const CATEGORIES = ['Business', 'Festivals', 'Education', 'Offers', 'Social Media'];

const FEATURED_POSTERS = [
  {
    id: 'f1',
    title: 'GROW YOUR BUSINESS',
    subtitle: 'Smart Strategies for Lasting Success',
    category: 'Business',
    badge: 'Trending',
    gradient: '#2D1B69',
    accent: '#7956C9',
    aspect: '4:5',
    isBusiness: true,
  },
  {
    id: 'f2',
    title: 'Happy Diwali',
    subtitle: 'Grand Festive Celebration',
    category: 'Festivals',
    badge: 'Popular',
    gradient: '#8B1E00',
    accent: '#FFA500',
    aspect: '4:5',
    isFestive: true,
  },
];

const RECENTLY_USED = [
  {
    id: 'r1',
    title: 'BIG SALE',
    subtitle: 'UP TO 70% OFF',
    category: 'Offers',
    color: '#D92D20',
    badge: 'Sale',
  },
  {
    id: 'r2',
    title: 'ADMISSION OPEN',
    subtitle: 'Session 2025-2026',
    category: 'Education',
    color: '#F79009',
    badge: 'New',
  },
  {
    id: 'r3',
    title: 'HIRING NOW',
    subtitle: 'Join Our Team',
    category: 'Business',
    color: '#079455',
    badge: 'Careers',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('Business');
  const [searchQuery, setSearchQuery] = useState('');

  const userName = user?.name || 'Parth Patel';
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: '#F8F7FC' }]}>
      {/* Top Bar: Brand Logo & User Profile Avatar */}
      <View style={styles.topBar}>
        <View style={styles.brandRow}>
          <View style={styles.logoSquare}>
            <Text style={styles.logoLetter}>P</Text>
          </View>
          <Text style={styles.brandTitle}>
            Post <Text style={styles.brandTitleAccent}>Hub</Text>
          </Text>
        </View>

        <TouchableOpacity
          style={styles.avatarButton}
          activeOpacity={0.8}
          onPress={() => router.push('/(tabs)/profile')}
        >
          <View style={styles.avatarInner}>
            <Text style={styles.avatarText}>{userInitial}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Title & Subtitle */}
        <View style={styles.headlineWrapper}>
          <Text style={styles.mainHeading}>What would you like{'\n'}to create?</Text>
          <Text style={styles.mainSubheading}>
            Design stunning posters for your business,{'\n'}events and social media.
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchWrapper}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={18} color="#9A93A8" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search templates, festivals, business posts..."
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

        {/* Create with AI CTA Button */}
        <View style={styles.ctaWrapper}>
          <TouchableOpacity
            style={styles.aiCtaButton}
            activeOpacity={0.88}
            onPress={() => router.push('/create-ai')}
          >
            <Ionicons name="sparkles" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.aiCtaText}>Create with AI</Text>
          </TouchableOpacity>
        </View>

        {/* Browse Templates Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeaderTitle}>Browse Templates</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push('/(tabs)/templates')}
          >
            <Text style={styles.seeAllLink}>See all</Text>
          </TouchableOpacity>
        </View>

        {/* Category Rail */}
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

        {/* 2 Big Featured Poster Cards */}
        <View style={styles.featuredGrid}>
          {FEATURED_POSTERS.map((poster) => (
            <TouchableOpacity
              key={poster.id}
              style={styles.featuredCard}
              activeOpacity={0.88}
              onPress={() =>
                router.push({
                  pathname: '/template-preview',
                  params: {
                    title: poster.title,
                    category: poster.category,
                    dimensions: '1080 × 1350',
                  },
                })
              }
            >
              <View style={[styles.featuredCanvas, { backgroundColor: poster.gradient }]}>
                {/* Top badge */}
                <View style={styles.featuredCanvasTop}>
                  <View style={styles.featuredLogoPill}>
                    <Ionicons name="sparkles" size={10} color="#FFFFFF" />
                  </View>
                  <View style={styles.featuredBadge}>
                    <Text style={styles.featuredBadgeText}>{poster.badge}</Text>
                  </View>
                </View>

                {/* Poster Graphic Representation */}
                {poster.isBusiness ? (
                  <View style={styles.businessGraphicBox}>
                    <Text style={styles.businessMainText}>GROW</Text>
                    <Text style={[styles.businessMainText, { color: '#BDB4FE' }]}>YOUR BUSINESS</Text>
                    <Text style={styles.businessSubText}>Smart Strategies</Text>
                    <View style={styles.miniIllustration}>
                      <Ionicons name="person-circle-outline" size={42} color="rgba(255,255,255,0.85)" />
                    </View>
                  </View>
                ) : (
                  <View style={styles.festiveGraphicBox}>
                    <Ionicons name="flame" size={32} color="#FFD700" style={{ marginBottom: 4 }} />
                    <Text style={styles.festiveTitle}>Happy Diwali</Text>
                    <Text style={styles.festiveSub}>Festival of Lights</Text>
                    <View style={styles.diyaRow}>
                      <Ionicons name="sparkles" size={16} color="#FFD700" />
                      <Ionicons name="sparkles" size={20} color="#FFA500" />
                      <Ionicons name="sparkles" size={16} color="#FFD700" />
                    </View>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recently Used Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeaderTitle}>Recently Used</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.recentRail}
        >
          {RECENTLY_USED.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.recentCard, { backgroundColor: item.color }]}
              activeOpacity={0.88}
              onPress={() =>
                router.push({
                  pathname: '/poster-editor',
                  params: {
                    title: item.title,
                    category: item.category,
                  },
                })
              }
            >
              <View style={styles.recentBadge}>
                <Text style={styles.recentBadgeText}>{item.badge}</Text>
              </View>
              <View style={styles.recentContent}>
                <Text style={styles.recentTitle}>{item.title}</Text>
                <Text style={styles.recentSubtitle}>{item.subtitle}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: Platform.OS === 'android' ? 14 : 10,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0EFF4',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoSquare: {
    width: 34,
    height: 34,
    borderRadius: 9,
    backgroundColor: '#7956C9',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7956C9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  logoLetter: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E1B2E',
    letterSpacing: -0.3,
  },
  brandTitleAccent: {
    color: '#7956C9',
  },
  avatarButton: {
    padding: 2,
  },
  avatarInner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#7956C9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ECEAF8',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  headlineWrapper: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 8,
  },
  mainHeading: {
    fontSize: 23,
    fontWeight: '800',
    color: '#1E1B2E',
    lineHeight: 29,
    letterSpacing: -0.4,
  },
  mainSubheading: {
    fontSize: 13,
    color: '#6B667A',
    lineHeight: 18,
    marginTop: 6,
  },
  searchWrapper: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 6,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E7E5ED',
    paddingHorizontal: 14,
    height: 46,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1E1B2E',
  },
  ctaWrapper: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 14,
  },
  aiCtaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7956C9',
    borderRadius: 14,
    height: 48,
    shadowColor: '#7956C9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 3,
  },
  aiCtaText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginTop: 14,
    marginBottom: 10,
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E1B2E',
  },
  seeAllLink: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7956C9',
  },
  categoryRail: {
    paddingHorizontal: 18,
    gap: 8,
    paddingBottom: 10,
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
  featuredGrid: {
    flexDirection: 'row',
    paddingHorizontal: 18,
    gap: 12,
    marginTop: 4,
  },
  featuredCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  featuredCanvas: {
    height: 195,
    padding: 12,
    justifyContent: 'space-between',
  },
  featuredCanvasTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featuredLogoPill: {
    width: 20,
    height: 20,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  featuredBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  businessGraphicBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  businessMainText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 16,
  },
  businessSubText: {
    color: '#E0DBF7',
    fontSize: 9,
    marginTop: 3,
  },
  miniIllustration: {
    marginTop: 8,
    alignItems: 'center',
  },
  festiveGraphicBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  festiveTitle: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
  },
  festiveSub: {
    color: '#FFA500',
    fontSize: 9,
    marginTop: 2,
  },
  diyaRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  recentRail: {
    paddingHorizontal: 18,
    gap: 12,
    paddingTop: 2,
  },
  recentCard: {
    width: 140,
    height: 85,
    borderRadius: 14,
    padding: 10,
    justifyContent: 'space-between',
  },
  recentBadge: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  recentBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  recentContent: {},
  recentTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  recentSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 9,
    fontWeight: '500',
    marginTop: 1,
  },
});
