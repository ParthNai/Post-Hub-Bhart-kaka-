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

export default function CreateTabScreen() {
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
    }, 1200);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: '#F8F7FC' }]}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <View style={{ width: 28 }} />
        <Text style={styles.topHeaderTitle}>Create a poster with AI</Text>
        <View style={{ width: 28 }} />
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

        {/* Example prompts */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionLabel}>Example prompts</Text>
          <View style={styles.chipsRow}>
            {examplePrompts.map((example) => (
              <TouchableOpacity
                key={example}
                style={styles.exampleChip}
                onPress={() => setPrompt(example)}
                activeOpacity={0.75}
              >
                <Text style={styles.exampleChipText}>{example}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Category selector */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionLabel}>Category</Text>
          <View style={styles.dropdownButton}>
            <View style={styles.dropdownLeft}>
              <Ionicons name="briefcase-outline" size={17} color="#7956C9" />
              <Text style={styles.dropdownSelectedText}>{selectedCategory}</Text>
            </View>
            <Ionicons name="chevron-down" size={18} color="#9A93A8" />
          </View>
        </View>

        {/* Select Poster Format */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionLabel}>Select Poster Format</Text>
          <View style={styles.formatsRow}>
            {/* Square 1:1 */}
            <TouchableOpacity
              style={[
                styles.formatCard,
                selectedFormat === 'square' && styles.formatCardActive,
              ]}
              onPress={() => setSelectedFormat('square')}
              activeOpacity={0.8}
            >
              <View style={[styles.ratioBoxSquare, selectedFormat === 'square' && styles.ratioBoxActive]} />
              <Text style={[styles.formatName, selectedFormat === 'square' && styles.formatTextActive]}>
                Square
              </Text>
              <Text style={styles.formatRatio}>1:1</Text>
            </TouchableOpacity>

            {/* Portrait 4:5 */}
            <TouchableOpacity
              style={[
                styles.formatCard,
                selectedFormat === 'portrait' && styles.formatCardActive,
              ]}
              onPress={() => setSelectedFormat('portrait')}
              activeOpacity={0.8}
            >
              <View style={[styles.ratioBoxPortrait, selectedFormat === 'portrait' && styles.ratioBoxActive]} />
              <Text style={[styles.formatName, selectedFormat === 'portrait' && styles.formatTextActive]}>
                Portrait
              </Text>
              <Text style={styles.formatRatio}>4:5</Text>
            </TouchableOpacity>

            {/* Story 9:16 */}
            <TouchableOpacity
              style={[
                styles.formatCard,
                selectedFormat === 'story' && styles.formatCardActive,
              ]}
              onPress={() => setSelectedFormat('story')}
              activeOpacity={0.8}
            >
              <View style={[styles.ratioBoxStory, selectedFormat === 'story' && styles.ratioBoxActive]} />
              <Text style={[styles.formatName, selectedFormat === 'story' && styles.formatTextActive]}>
                Story
              </Text>
              <Text style={styles.formatRatio}>9:16</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Add Image (Optional) */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionLabel}>Add Image (Optional)</Text>
          <TouchableOpacity style={styles.uploadDropzone} activeOpacity={0.8}>
            <Ionicons name="image-outline" size={26} color="#7956C9" style={{ marginBottom: 6 }} />
            <Text style={styles.uploadTitle}>Upload your own image</Text>
            <Text style={styles.uploadSub}>JPG, PNG (Max 10MB)</Text>
          </TouchableOpacity>
        </View>

        {/* CTA Button */}
        <TouchableOpacity
          style={styles.generateButton}
          activeOpacity={0.85}
          onPress={handleGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <View style={styles.buttonInner}>
              <Ionicons name="sparkles" size={17} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.generateButtonText}>Generate Poster</Text>
            </View>
          )}
        </TouchableOpacity>

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
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 14 : 10,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0EFF4',
  },
  topHeaderTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#24213A',
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 40,
  },
  subtitleText: {
    fontSize: 13,
    color: '#716C80',
    lineHeight: 18,
    marginBottom: 14,
  },
  promptCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8E6EF',
    padding: 14,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 1,
  },
  promptInput: {
    fontSize: 14,
    color: '#24213A',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  sectionBlock: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#24213A',
    marginBottom: 8,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  exampleChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFDDE7',
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 18,
  },
  exampleChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#5C566E',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DFDDE7',
    paddingHorizontal: 14,
    height: 46,
  },
  dropdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dropdownSelectedText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#24213A',
  },
  formatsRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  formatCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFDDE7',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  formatCardActive: {
    borderColor: '#7956C9',
    backgroundColor: 'rgba(121, 86, 201, 0.04)',
    borderWidth: 2,
  },
  ratioBoxSquare: {
    width: 22,
    height: 22,
    borderWidth: 1.5,
    borderColor: '#9A93A8',
    borderRadius: 4,
    marginBottom: 6,
  },
  ratioBoxPortrait: {
    width: 18,
    height: 24,
    borderWidth: 1.5,
    borderColor: '#9A93A8',
    borderRadius: 4,
    marginBottom: 6,
  },
  ratioBoxStory: {
    width: 14,
    height: 25,
    borderWidth: 1.5,
    borderColor: '#9A93A8',
    borderRadius: 4,
    marginBottom: 6,
  },
  ratioBoxActive: {
    borderColor: '#7956C9',
  },
  formatName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B364C',
  },
  formatTextActive: {
    color: '#7956C9',
    fontWeight: '700',
  },
  formatRatio: {
    fontSize: 10,
    color: '#8A8599',
    marginTop: 2,
  },
  uploadDropzone: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#D4CFE2',
    borderStyle: 'dashed',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3B364C',
  },
  uploadSub: {
    fontSize: 11,
    color: '#9A93A8',
    marginTop: 2,
  },
  generateButton: {
    backgroundColor: '#7956C9',
    borderRadius: 14,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#7956C9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

