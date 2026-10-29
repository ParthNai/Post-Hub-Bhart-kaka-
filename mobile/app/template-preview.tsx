import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function TemplatePreviewScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const [isFavorite, setIsFavorite] = useState(false);

  const title = (params.title as string) || 'Business Promotion';
  const category = (params.category as string) || 'Business';
  const dimensions = (params.dimensions as string) || '1080 × 1350';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: '#F8F7FC' }]}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.circleIconButton}
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={22} color="#24213A" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.circleIconButton}
          onPress={() => setIsFavorite(!isFavorite)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={22}
            color={isFavorite ? '#E63946' : '#24213A'}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main High-Res Poster Preview Card */}
        <View style={styles.posterCardWrapper}>
          <View style={styles.posterCard}>
            {/* Poster Header */}
            <View style={styles.posterHeader}>
              <View style={styles.logoPill}>
                <Ionicons name="sparkles" size={13} color="#7956C9" />
                <Text style={styles.logoPillText}>YOUR LOGO</Text>
              </View>
            </View>

            {/* Poster Main Content */}
            <View style={styles.posterBody}>
              <Text style={styles.posterMainHeading}>GROW</Text>
              <Text style={[styles.posterMainHeading, { color: '#7956C9' }]}>YOUR BUSINESS</Text>
              <Text style={styles.posterSubheading}>
                Smart Strategies for Lasting Success
              </Text>

              {/* Bullet Points */}
              <View style={styles.bulletList}>
                <View style={styles.bulletItem}>
                  <View style={styles.bulletDot} />
                  <Text style={styles.bulletText}>Digital Marketing</Text>
                </View>
                <View style={styles.bulletItem}>
                  <View style={styles.bulletDot} />
                  <Text style={styles.bulletText}>Branding</Text>
                </View>
                <View style={styles.bulletItem}>
                  <View style={styles.bulletDot} />
                  <Text style={styles.bulletText}>Social Media</Text>
                </View>
                <View style={styles.bulletItem}>
                  <View style={styles.bulletDot} />
                  <Text style={styles.bulletText}>Business Growth</Text>
                </View>
              </View>

              {/* Poster CTA Tag */}
              <View style={styles.posterCtaBadge}>
                <Text style={styles.posterCtaText}>Get Started</Text>
              </View>
            </View>

            {/* Simulated Businessman Graphic Shape */}
            <View style={styles.photoSilhouette}>
              <View style={styles.avatarCircle}>
                <Ionicons name="person" size={54} color="#5C3DA3" />
              </View>
            </View>
          </View>
        </View>

        {/* Template Details Section */}
        <View style={styles.detailsCard}>
          <Text style={styles.detailsTitle}>{title}</Text>

          {/* Badges */}
          <View style={styles.tagsRow}>
            <View style={styles.categoryBadge}>
              <Ionicons name="briefcase-outline" size={12} color="#7956C9" />
              <Text style={styles.categoryBadgeText}>{category}</Text>
            </View>
            <View style={styles.dimensionBadge}>
              <Ionicons name="scan-outline" size={12} color="#777184" />
              <Text style={styles.dimensionBadgeText}>{dimensions}</Text>
            </View>
          </View>

          <Text style={styles.descriptionText}>
            Professional business promotion template for your brand and services. Fully editable text, colors, and layout.
          </Text>

          {/* Action Buttons */}
          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.88}
            onPress={() => router.push({ pathname: '/poster-editor', params: { title, category } })}
          >
            <Ionicons name="color-wand-outline" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.primaryButtonText}>Customize Template</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            activeOpacity={0.85}
            onPress={() => router.push({ pathname: '/poster-editor', params: { title, category } })}
          >
            <Text style={styles.secondaryButtonText}>Use This Template</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.favoriteLink}
            activeOpacity={0.7}
            onPress={() => setIsFavorite(!isFavorite)}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={16}
              color={isFavorite ? '#E63946' : '#777184'}
              style={{ marginRight: 6 }}
            />
            <Text style={[styles.favoriteLinkText, isFavorite && { color: '#E63946' }]}>
              {isFavorite ? 'Saved in Favourites' : 'Add to Favourite'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 24 : 0,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  circleIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ECE7F0',
    shadowColor: '#24213A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  posterCardWrapper: {
    alignItems: 'center',
    marginVertical: 12,
  },
  posterCard: {
    width: '100%',
    aspectRatio: 0.8,
    maxWidth: 360,
    borderRadius: 20,
    backgroundColor: '#F3EFFF',
    borderWidth: 1,
    borderColor: '#E6DCF5',
    overflow: 'hidden',
    padding: 24,
    position: 'relative',
    shadowColor: '#7956C9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 6,
  },
  posterHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 16,
  },
  logoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8DFF5',
  },
  logoPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#7956C9',
    letterSpacing: 0.5,
  },
  posterBody: {
    maxWidth: '65%',
    zIndex: 2,
  },
  posterMainHeading: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1A1729',
    lineHeight: 30,
    letterSpacing: -0.5,
  },
  posterSubheading: {
    fontSize: 12,
    fontWeight: '600',
    color: '#655E75',
    marginTop: 6,
    marginBottom: 14,
    lineHeight: 16,
  },
  bulletList: {
    gap: 6,
    marginBottom: 16,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#7956C9',
  },
  bulletText: {
    fontSize: 11,
    color: '#3C374D',
    fontWeight: '500',
  },
  posterCtaBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#7956C9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  posterCtaText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  photoSilhouette: {
    position: 'absolute',
    right: -10,
    bottom: -10,
    width: 140,
    height: 200,
    alignItems: 'center',
    justifyContent: 'flex-end',
    zIndex: 1,
  },
  avatarCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E8DFF5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#ECE7F0',
    shadowColor: '#24213A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#24213A',
    marginBottom: 8,
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F3EFFF',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#7956C9',
  },
  dimensionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F5F4F8',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dimensionBadgeText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#777184',
  },
  descriptionText: {
    fontSize: 13,
    color: '#777184',
    lineHeight: 18,
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#7956C9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#7956C9',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#ECE7F0',
    alignItems: 'center',
    justifyContent: 'center',
    height: 46,
    borderRadius: 12,
    marginBottom: 14,
  },
  secondaryButtonText: {
    color: '#24213A',
    fontSize: 14,
    fontWeight: '600',
  },
  favoriteLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  favoriteLinkText: {
    fontSize: 13,
    color: '#777184',
    fontWeight: '600',
  },
});
