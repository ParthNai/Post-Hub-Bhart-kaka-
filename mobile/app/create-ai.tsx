import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function CreateWithAIScreen() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Business');
  const [selectedFormat, setSelectedFormat] = useState<'square' | 'portrait' | 'story'>('portrait');
  const [isGenerating, setIsGenerating] = useState(false);

  const examplePrompts = [
    'Festival Greeting',
    'Business Offer',
    'Education Admission',
  ];

  const handleGenerate = () => {
    if (!prompt.trim()) {
      setPrompt('Diwali greeting celebration poster with golden lights for my customers');
    }
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      router.push({
        pathname: '/poster-editor',
        params: {
          title: prompt ? `${prompt.slice(0, 20)}...` : 'AI Generated Poster',
          category: selectedCategory,
        },
      });
    }, 1500);
  };

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
        <Text style={styles.topHeaderTitle}>Create a poster with AI</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitleText}>
          Tell us what you want to create and we'll design it for you.
        </Text>

        {/* Prompt Input Box */}
        <View style={styles.promptCard}>
          <TextInput
            style={styles.promptInput}
            multiline
            numberOfLines={4}
            placeholder="Describe your poster in simple words...&#10;e.g. Diwali greeting for my customers"
            placeholderTextColor="#9A93A8"
            value={prompt}
            onChangeText={setPrompt}
          />
        </View>

        {/* Example Prompt Chips */}
        <View style={styles.examplesSection}>
          <Text style={styles.sectionLabel}>Example prompts</Text>
          <View style={styles.chipsRow}>
            {examplePrompts.map((item) => (
              <TouchableOpacity
                key={item}
                style={styles.exampleChip}
                onPress={() => setPrompt(`Create a stunning ${item.toLowerCase()} poster with elegant typography`)}
              >
                <Text style={styles.exampleChipText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Category Dropdown */}
        <View style={styles.formGroup}>
          <Text style={styles.sectionLabel}>Category</Text>
          <View style={styles.dropdownField}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="briefcase-outline" size={18} color="#7956C9" />
              <Text style={styles.dropdownSelectedText}>{selectedCategory}</Text>
            </View>
            <Ionicons name="chevron-down" size={18} color="#777184" />
          </View>
        </View>

        {/* Select Poster Format */}
        <View style={styles.formGroup}>
          <Text style={styles.sectionLabel}>Select Poster Format</Text>
          <View style={styles.formatCardsRow}>
            {/* Square 1:1 */}
            <TouchableOpacity
              style={[
                styles.formatCard,
                selectedFormat === 'square' && styles.activeFormatCard,
              ]}
              onPress={() => setSelectedFormat('square')}
              activeOpacity={0.8}
            >
              <View style={[styles.formatIconOutline, styles.squareRatioBox]} />
              <Text style={[styles.formatTitle, selectedFormat === 'square' && styles.activeFormatText]}>
                Square
              </Text>
              <Text style={styles.formatRatioText}>1:1</Text>
            </TouchableOpacity>

            {/* Portrait 4:5 */}
            <TouchableOpacity
              style={[
                styles.formatCard,
                selectedFormat === 'portrait' && styles.activeFormatCard,
              ]}
              onPress={() => setSelectedFormat('portrait')}
              activeOpacity={0.8}
            >
              <View style={[styles.formatIconOutline, styles.portraitRatioBox]} />
              <Text style={[styles.formatTitle, selectedFormat === 'portrait' && styles.activeFormatText]}>
                Portrait
              </Text>
              <Text style={styles.formatRatioText}>4:5</Text>
            </TouchableOpacity>

            {/* Story 9:16 */}
            <TouchableOpacity
              style={[
                styles.formatCard,
                selectedFormat === 'story' && styles.activeFormatCard,
              ]}
              onPress={() => setSelectedFormat('story')}
              activeOpacity={0.8}
            >
              <View style={[styles.formatIconOutline, styles.storyRatioBox]} />
              <Text style={[styles.formatTitle, selectedFormat === 'story' && styles.activeFormatText]}>
                Story
              </Text>
              <Text style={styles.formatRatioText}>9:16</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Add Image (Optional) */}
        <View style={styles.formGroup}>
          <Text style={styles.sectionLabel}>Add Image (Optional)</Text>
          <TouchableOpacity style={styles.uploadDottedBox} activeOpacity={0.7}>
            <View style={styles.uploadIconCircle}>
              <Ionicons name="cloud-upload-outline" size={22} color="#7956C9" />
            </View>
            <Text style={styles.uploadMainText}>Upload your own image</Text>
            <Text style={styles.uploadSubText}>PNG, JPG (Max 10MB)</Text>
          </TouchableOpacity>
        </View>

        {/* Generate Poster CTA */}
        <TouchableOpacity
          style={[styles.generateButton, isGenerating && { opacity: 0.8 }]}
          activeOpacity={0.88}
          onPress={handleGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="sparkles" size={18} color="#FFFFFF" />
              <Text style={styles.generateButtonText}>Generate Poster</Text>
            </View>
          )}
        </TouchableOpacity>
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
    borderBottomWidth: 1,
    borderBottomColor: '#ECE7F0',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FAF9FC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ECE7F0',
  },
  topHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#24213A',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  subtitleText: {
    fontSize: 13,
    color: '#777184',
    lineHeight: 18,
    marginBottom: 16,
  },
  promptCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E6E0EB',
    padding: 14,
    minHeight: 100,
    shadowColor: '#24213A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 14,
  },
  promptInput: {
    fontSize: 14,
    color: '#24213A',
    lineHeight: 20,
    textAlignVertical: 'top',
  },
  examplesSection: {
    marginBottom: 18,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#24213A',
    marginBottom: 8,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  exampleChip: {
    backgroundColor: '#F3EFFF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8DFF5',
  },
  exampleChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7956C9',
  },
  formGroup: {
    marginBottom: 18,
  },
  dropdownField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E6E0EB',
    paddingHorizontal: 14,
    height: 46,
  },
  dropdownSelectedText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#24213A',
  },
  formatCardsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  formatCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#ECE7F0',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  activeFormatCard: {
    borderColor: '#7956C9',
    backgroundColor: '#FAF7FD',
  },
  formatIconOutline: {
    borderWidth: 1.5,
    borderColor: '#7956C9',
    borderRadius: 3,
  },
  squareRatioBox: {
    width: 20,
    height: 20,
  },
  portraitRatioBox: {
    width: 18,
    height: 22,
  },
  storyRatioBox: {
    width: 14,
    height: 24,
  },
  formatTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#777184',
  },
  activeFormatText: {
    color: '#7956C9',
    fontWeight: '700',
  },
  formatRatioText: {
    fontSize: 10,
    color: '#9A93A8',
  },
  uploadDottedBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#D4C9E8',
    borderStyle: 'dashed',
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  uploadIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3EFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  uploadMainText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#24213A',
  },
  uploadSubText: {
    fontSize: 11,
    color: '#9A93A8',
  },
  generateButton: {
    backgroundColor: '#7956C9',
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#7956C9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
