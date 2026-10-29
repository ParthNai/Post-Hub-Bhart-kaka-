import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function PosterEditorScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const screenTitle = (params.title as string) || 'Business Promotion';

  // Editor states
  const [headlineText, setHeadlineText] = useState('GROW YOUR BUSINESS');
  const [subheadingText, setSubheadingText] = useState('Smart Strategies for Lasting Success');
  const [activeElement, setActiveElement] = useState<'headline' | 'subheading'>('headline');
  const [activeTool, setActiveTool] = useState<'text' | 'photos' | 'colours' | 'background' | 'layout'>('text');
  const [headlineFontSize, setHeadlineFontSize] = useState(24);
  const [accentColor, setAccentColor] = useState('#7956C9');
  const [savedNotification, setSavedNotification] = useState(false);

  const handleSave = () => {
    setSavedNotification(true);
    setTimeout(() => {
      setSavedNotification(false);
      router.push('/(tabs)/my-designs');
    }, 1200);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: '#F8F7FC' }]}>
      {/* Top Navigation Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="chevron-back" size={22} color="#24213A" />
        </TouchableOpacity>

        <Text style={styles.screenHeaderTitle} numberOfLines={1}>
          {screenTitle}
        </Text>

        <TouchableOpacity style={styles.saveButton} activeOpacity={0.85} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Save Toast Notification */}
      {savedNotification && (
        <View style={styles.toastNotification}>
          <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.toastText}>Design saved to My Designs!</Text>
        </View>
      )}

      {/* Main Interactive Canvas Area */}
      <View style={styles.canvasContainer}>
        <View style={styles.canvasCard}>
          {/* Poster Header */}
          <View style={styles.posterHeader}>
            <View style={styles.logoPill}>
              <Ionicons name="sparkles" size={12} color={accentColor} />
              <Text style={[styles.logoPillText, { color: accentColor }]}>YOUR LOGO</Text>
            </View>
          </View>

          {/* Editable Headline with active Selection Handles */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setActiveElement('headline')}
            style={[
              styles.editableElementBox,
              activeElement === 'headline' && styles.selectedElementBox,
            ]}
          >
            {activeElement === 'headline' && (
              <>
                <View style={[styles.cornerHandle, styles.topLeftHandle]} />
                <View style={[styles.cornerHandle, styles.topRightHandle]} />
                <View style={[styles.cornerHandle, styles.bottomLeftHandle]} />
                <View style={[styles.cornerHandle, styles.bottomRightHandle]} />
              </>
            )}
            <Text style={[styles.canvasHeadline, { fontSize: headlineFontSize }]}>
              {headlineText}
            </Text>
          </TouchableOpacity>

          {/* Editable Subheading */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setActiveElement('subheading')}
            style={[
              styles.editableElementBox,
              activeElement === 'subheading' && styles.selectedElementBox,
              { marginTop: 4 },
            ]}
          >
            {activeElement === 'subheading' && (
              <>
                <View style={[styles.cornerHandle, styles.topLeftHandle]} />
                <View style={[styles.cornerHandle, styles.topRightHandle]} />
                <View style={[styles.cornerHandle, styles.bottomLeftHandle]} />
                <View style={[styles.cornerHandle, styles.bottomRightHandle]} />
              </>
            )}
            <Text style={styles.canvasSubheading}>{subheadingText}</Text>
          </TouchableOpacity>

          {/* Bullet points */}
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <View style={[styles.bulletDot, { backgroundColor: accentColor }]} />
              <Text style={styles.bulletText}>Digital Marketing</Text>
            </View>
            <View style={styles.bulletItem}>
              <View style={[styles.bulletDot, { backgroundColor: accentColor }]} />
              <Text style={styles.bulletText}>Branding</Text>
            </View>
            <View style={styles.bulletItem}>
              <View style={[styles.bulletDot, { backgroundColor: accentColor }]} />
              <Text style={styles.bulletText}>Social Media</Text>
            </View>
            <View style={styles.bulletItem}>
              <View style={[styles.bulletDot, { backgroundColor: accentColor }]} />
              <Text style={styles.bulletText}>Business Growth</Text>
            </View>
          </View>

          {/* Bottom Button Graphic on poster */}
          <View style={[styles.posterActionButton, { backgroundColor: accentColor }]}>
            <Text style={styles.posterActionButtonText}>Get Started</Text>
          </View>

          {/* Avatar / Person Graphic Placeholder */}
          <View style={styles.canvasPersonGraphic}>
            <View style={styles.personCircle}>
              <Ionicons name="person" size={54} color="#5C3DA3" />
            </View>
          </View>
        </View>
      </View>

      {/* Editor Tool Strip */}
      <View style={styles.editorToolsRow}>
        {[
          { id: 'text', label: 'Text', icon: 'text-outline' },
          { id: 'photos', label: 'Photos', icon: 'image-outline' },
          { id: 'colours', label: 'Colours', icon: 'color-palette-outline' },
          { id: 'background', label: 'Background', icon: 'grid-outline' },
          { id: 'layout', label: 'Layout', icon: 'layers-outline' },
        ].map((tool) => {
          const isActive = activeTool === tool.id;
          return (
            <TouchableOpacity
              key={tool.id}
              style={[styles.toolButton, isActive && styles.activeToolButton]}
              onPress={() => setActiveTool(tool.id as any)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={tool.icon as any}
                size={20}
                color={isActive ? '#7956C9' : '#777184'}
              />
              <Text style={[styles.toolLabel, isActive && styles.activeToolLabel]}>
                {tool.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Bottom Floating Control Panel */}
      <View style={styles.bottomControlPanel}>
        {/* Quick Text Input Pill with Undo/Redo */}
        <View style={styles.inputAndActionsRow}>
          <View style={styles.textInputPill}>
            <Ionicons name="pencil" size={14} color="#7956C9" style={{ marginRight: 6 }} />
            <TextInput
              value={activeElement === 'headline' ? headlineText : subheadingText}
              onChangeText={(t) =>
                activeElement === 'headline' ? setHeadlineText(t) : setSubheadingText(t)
              }
              style={styles.pillTextInput}
              placeholder="Edit text..."
            />
          </View>

          <View style={styles.historyRow}>
            <TouchableOpacity style={styles.iconActionCircle}>
              <Ionicons name="arrow-undo-outline" size={16} color="#777184" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconActionCircle}>
              <Ionicons name="arrow-redo-outline" size={16} color="#777184" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Font Size / Scale Slider Control */}
        <View style={styles.sliderControlRow}>
          <TouchableOpacity
            onPress={() => setHeadlineFontSize((s) => Math.max(16, s - 2))}
            style={styles.sizeStepBtn}
          >
            <Text style={styles.sizeStepText}>A-</Text>
          </TouchableOpacity>

          <View style={styles.sliderTrack}>
            <View
              style={[
                styles.sliderProgress,
                { width: `${((headlineFontSize - 16) / 20) * 100}%` },
              ]}
            />
            <View
              style={[
                styles.sliderThumb,
                { left: `${((headlineFontSize - 16) / 20) * 94}%` },
              ]}
            />
          </View>

          <TouchableOpacity
            onPress={() => setHeadlineFontSize((s) => Math.min(36, s + 2))}
            style={styles.sizeStepBtn}
          >
            <Text style={styles.sizeStepText}>A+</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.doneButton}
            activeOpacity={0.85}
            onPress={handleSave}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 24 : 0,
  },
  topBar: {
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
  },
  screenHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#24213A',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 12,
  },
  saveButton: {
    backgroundColor: '#7956C9',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 16,
    shadowColor: '#7956C9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  toastNotification: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: '#12805C',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99,
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  canvasContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  canvasCard: {
    width: '100%',
    aspectRatio: 0.85,
    maxWidth: 350,
    borderRadius: 18,
    backgroundColor: '#F3EFFF',
    borderWidth: 1,
    borderColor: '#E6DCF5',
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#7956C9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  posterHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  logoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8DFF5',
  },
  logoPillText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  editableElementBox: {
    position: 'relative',
    padding: 4,
    alignSelf: 'flex-start',
    maxWidth: '65%',
  },
  selectedElementBox: {
    borderWidth: 1.5,
    borderColor: '#7956C9',
    borderStyle: 'dashed',
    borderRadius: 4,
  },
  cornerHandle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#7956C9',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  topLeftHandle: { top: -4, left: -4 },
  topRightHandle: { top: -4, right: -4 },
  bottomLeftHandle: { bottom: -4, left: -4 },
  bottomRightHandle: { bottom: -4, right: -4 },
  canvasHeadline: {
    fontWeight: '900',
    color: '#1A1729',
    lineHeight: 28,
  },
  canvasSubheading: {
    fontSize: 11,
    fontWeight: '600',
    color: '#655E75',
    lineHeight: 15,
  },
  bulletList: {
    marginTop: 10,
    gap: 4,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  bulletDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  bulletText: {
    fontSize: 10,
    color: '#3C374D',
    fontWeight: '500',
  },
  posterActionButton: {
    marginTop: 14,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
  },
  posterActionButtonText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  canvasPersonGraphic: {
    position: 'absolute',
    right: -10,
    bottom: -10,
    width: 130,
    height: 180,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  personCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#E8DFF5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  editorToolsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: '#ECE7F0',
  },
  toolButton: {
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  activeToolButton: {
    backgroundColor: '#F3EFFF',
  },
  toolLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#777184',
  },
  activeToolLabel: {
    color: '#7956C9',
    fontWeight: '700',
  },
  bottomControlPanel: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0ECF5',
    gap: 10,
  },
  inputAndActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  textInputPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF9FC',
    borderWidth: 1,
    borderColor: '#E6E0EB',
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 38,
  },
  pillTextInput: {
    flex: 1,
    fontSize: 12,
    color: '#24213A',
    fontWeight: '600',
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconActionCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FAF9FC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E6E0EB',
  },
  sliderControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sizeStepBtn: {
    paddingHorizontal: 6,
  },
  sizeStepText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#777184',
  },
  sliderTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ECE7F0',
    position: 'relative',
    justifyContent: 'center',
  },
  sliderProgress: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#7956C9',
  },
  sliderThumb: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#7956C9',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    top: -5,
    shadowColor: '#24213A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  doneButton: {
    backgroundColor: '#7956C9',
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 16,
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
