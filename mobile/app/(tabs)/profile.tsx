import React, { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Switch,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const userName = user?.name || 'Parth Patel';
  const userTagline = 'Create. Design. Share.';
  const userInitial = userName.charAt(0).toUpperCase();

  const handleSignOut = () => {
    logout();
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: '#F8F7FC' }]}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <Text style={styles.headerTitle}>Profile & Settings</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitial}>{userInitial}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userName}</Text>
            <Text style={styles.profileTagline}>{userTagline}</Text>
          </View>
        </View>

        {/* Menu Items List */}
        <View style={styles.menuContainer}>
          {/* My Designs */}
          <TouchableOpacity
            style={styles.menuRow}
            activeOpacity={0.7}
            onPress={() => router.push('/(tabs)/my-designs')}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="images-outline" size={20} color="#5C566E" style={styles.menuIcon} />
              <Text style={styles.menuLabel}>My Designs</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#B4AEC1" />
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Favourite Templates */}
          <TouchableOpacity
            style={styles.menuRow}
            activeOpacity={0.7}
            onPress={() => router.push('/(tabs)/templates')}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="heart-outline" size={20} color="#5C566E" style={styles.menuIcon} />
              <Text style={styles.menuLabel}>Favourite Templates</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#B4AEC1" />
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Language */}
          <TouchableOpacity style={styles.menuRow} activeOpacity={0.7}>
            <View style={styles.menuLeft}>
              <Ionicons name="globe-outline" size={20} color="#5C566E" style={styles.menuIcon} />
              <Text style={styles.menuLabel}>Language</Text>
            </View>
            <View style={styles.menuRightInfo}>
              <Text style={styles.menuValueText}>English</Text>
              <Ionicons name="chevron-forward" size={18} color="#B4AEC1" />
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Notifications */}
          <View style={styles.menuRow}>
            <View style={styles.menuLeft}>
              <Ionicons name="notifications-outline" size={20} color="#5C566E" style={styles.menuIcon} />
              <Text style={styles.menuLabel}>Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#DFDDE7', true: '#7956C9' }}
              thumbColor="#FFFFFF"
              style={{ transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }] }}
            />
          </View>

          <View style={styles.divider} />

          {/* Help & Support */}
          <TouchableOpacity style={styles.menuRow} activeOpacity={0.7}>
            <View style={styles.menuLeft}>
              <Ionicons name="help-circle-outline" size={20} color="#5C566E" style={styles.menuIcon} />
              <Text style={styles.menuLabel}>Help & Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#B4AEC1" />
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Privacy and Account Settings */}
          <TouchableOpacity style={styles.menuRow} activeOpacity={0.7}>
            <View style={styles.menuLeft}>
              <Ionicons name="lock-closed-outline" size={20} color="#5C566E" style={styles.menuIcon} />
              <Text style={styles.menuLabel}>Privacy and Account Settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#B4AEC1" />
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Sign Out */}
          <TouchableOpacity
            style={styles.menuRow}
            activeOpacity={0.7}
            onPress={handleSignOut}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="log-out-outline" size={20} color="#D92D20" style={styles.menuIcon} />
              <Text style={[styles.menuLabel, { color: '#D92D20', fontWeight: '700' }]}>Sign Out</Text>
            </View>
          </TouchableOpacity>
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
    paddingHorizontal: 18,
    paddingTop: Platform.OS === 'android' ? 14 : 10,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0EFF4',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#24213A',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ECEAF2',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 16,
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#7956C9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarInitial: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#24213A',
  },
  profileTagline: {
    fontSize: 12,
    color: '#716C80',
    marginTop: 2,
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ECEAF2',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuIcon: {
    width: 22,
  },
  menuLabel: {
    fontSize: 14,
    color: '#24213A',
    fontWeight: '500',
  },
  menuRightInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  menuValueText: {
    fontSize: 13,
    color: '#716C80',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F2F7',
    marginLeft: 50,
  },
});
