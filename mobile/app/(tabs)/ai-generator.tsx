import React, { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

const STYLES = ['Photorealistic', 'Cinematic', '3D Render', 'Minimalist Art', 'Cyberpunk', 'Watercolor'];
const RATIOS = ['1:1 (Square)', '9:16 (Story)', '16:9 (Landscape)', '4:5 (Portrait)'];

export default function AiGeneratorScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('Photorealistic');
  const [selectedRatio, setSelectedRatio] = useState('1:1 (Square)');

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        {/* Prompt Input */}
        <Text style={[styles.label, { color: theme.text }]}>Describe what you want to create</Text>
        <View style={[styles.inputContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <TextInput
            multiline
            numberOfLines={4}
            placeholder="E.g., Diwali celebration poster with golden diyas, modern typography, elegant lighting..."
            placeholderTextColor={theme.tabIconDefault}
            value={prompt}
            onChangeText={setPrompt}
            style={[styles.textInput, { color: theme.text }]}
          />
        </View>

        {/* Style Presets */}
        <Text style={[styles.label, { color: theme.text, marginTop: 18 }]}>Art Style</Text>
        <View style={styles.chipsRow}>
          {STYLES.map((style) => (
            <TouchableOpacity
              key={style}
              onPress={() => setSelectedStyle(style)}
              style={[
                styles.chip,
                {
                  backgroundColor: selectedStyle === style ? theme.primary : theme.card,
                  borderColor: selectedStyle === style ? theme.primary : theme.border,
                },
              ]}
            >
              <Text style={{ color: selectedStyle === style ? '#FFFFFF' : theme.text, fontSize: 12, fontWeight: '600' }}>
                {style}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Aspect Ratio */}
        <Text style={[styles.label, { color: theme.text, marginTop: 18 }]}>Aspect Ratio</Text>
        <View style={styles.chipsRow}>
          {RATIOS.map((ratio) => (
            <TouchableOpacity
              key={ratio}
              onPress={() => setSelectedRatio(ratio)}
              style={[
                styles.chip,
                {
                  backgroundColor: selectedRatio === ratio ? theme.primary : theme.card,
                  borderColor: selectedRatio === ratio ? theme.primary : theme.border,
                },
              ]}
            >
              <Text style={{ color: selectedRatio === ratio ? '#FFFFFF' : theme.text, fontSize: 12, fontWeight: '600' }}>
                {ratio}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Generate CTA Button */}
        <TouchableOpacity style={styles.generateBtn} activeOpacity={0.88}>
          <Ionicons name="sparkles" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.generateBtnText}>Generate with Post Hub AI</Text>
        </TouchableOpacity>

        {/* Preview / Canvas Placeholder */}
        <View style={[styles.canvasCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Ionicons name="sparkles-outline" size={48} color={theme.tabIconDefault} style={{ marginBottom: 12 }} />
          <Text style={[styles.canvasTitle, { color: theme.text }]}>Your AI Poster Appears Here</Text>
          <Text style={[styles.canvasSub, { color: theme.tabIconDefault }]}>
            Type your prompt above and hit generate to craft custom social posts.
          </Text>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  label: { fontSize: 14, fontWeight: '700', marginBottom: 8 },
  inputContainer: { borderRadius: 14, borderWidth: 1, padding: 12, minHeight: 100 },
  textInput: { fontSize: 14, textAlignVertical: 'top' },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18, borderWidth: 1 },
  generateBtn: {
    backgroundColor: '#7956C9',
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#7956C9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  generateBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  canvasCard: {
    marginTop: 20,
    borderRadius: 16,
    borderWidth: 1,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  canvasTitle: { fontSize: 15, fontWeight: '700', marginBottom: 6 },
  canvasSub: { fontSize: 12, textAlign: 'center', lineHeight: 18 },
});

