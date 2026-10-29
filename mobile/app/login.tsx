import React, { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

interface ConfigSection {
  id: string;
  title: string;
  enabled: boolean;
  order: number;
}

interface ScreenConfig {
  headerTitle?: string;
  activeTheme?: string;
  primaryAccent?: string;
  backgroundColor?: string;
  cardRadius?: string;
  sections?: ConfigSection[];
}

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [remoteConfig, setRemoteConfig] = useState<ScreenConfig | null>(null);
  const [remoteDescription, setRemoteDescription] = useState<string>('');
  const [remoteDesignSystem, setRemoteDesignSystem] = useState<any>(null);

  // Dynamic API base URL (adapts to current hostname on web or localhost on simulator)
  const getApiBaseUrl = () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const host = window.location.hostname || 'localhost';
      return `http://${host}:3000`;
    }
    return 'http://localhost:3000';
  };

  // Live polling of admin configuration (every 2.5s) so admin changes reflect in real-time
  const fetchAdminConfig = () => {
    const baseUrl = getApiBaseUrl();
    fetch(`${baseUrl}/api/app/config?t=${Date.now()}`, { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.designSystem) {
          setRemoteDesignSystem(data.designSystem);
        }
        if (data?.navigation) {
          const screen = data.navigation.find((s: any) => s.key === 'login' || s.id === 'scr_login_007');
          if (screen) {
            if (screen.layoutConfig) {
              setRemoteConfig(screen.layoutConfig);
            }
            if (screen.description !== undefined) {
              setRemoteDescription(screen.description);
            }
          }
        }
      })
      .catch((err) => {
        console.warn('Config sync error:', err);
      });
  };

  useEffect(() => {
    fetchAdminConfig();
    const timer = setInterval(fetchAdminConfig, 2500);
    return () => clearInterval(timer);
  }, []);

  // Section visibility check
  const isSectionEnabled = (sectionId: string, fallback = true) => {
    if (!remoteConfig?.sections) return fallback;
    const s = remoteConfig.sections.find((item) => item.id === sectionId);
    return s ? s.enabled : fallback;
  };

  // Dynamic Theme & Color Resolution
  const activeThemePreset = remoteConfig?.activeTheme || 'default';
  const customAccent = remoteConfig?.primaryAccent || remoteDesignSystem?.colorTokens?.primaryViolet || '#7956C9';
  const customBg = remoteConfig?.backgroundColor;

  const currentTheme = useMemo(() => {
    if (activeThemePreset === 'dark_studio') {
      return {
        isDark: true,
        bg: customBg || '#13111C',
        surface: '#1C1929',
        text: '#FFFFFF',
        textMuted: '#9E98B3',
        border: '#2E2B40',
        inputBg: '#242135',
        inputBorder: '#35314C',
        primary: customAccent || '#906CE8',
        divider: '#2A273C',
      };
    }
    if (activeThemePreset === 'warm_creative') {
      return {
        isDark: false,
        bg: customBg || '#FFFDF9',
        surface: '#FFFFFF',
        text: '#2C1E14',
        textMuted: '#8A7668',
        border: '#EEDFD2',
        inputBg: '#FAF5EE',
        inputBorder: '#E6D5C5',
        primary: customAccent || '#E65100',
        divider: '#EEDFD2',
      };
    }
    if (activeThemePreset === 'lavender_minimal') {
      return {
        isDark: false,
        bg: customBg || '#F8F7FF',
        surface: '#FFFFFF',
        text: '#1E1B4B',
        textMuted: '#6B7280',
        border: '#E0E3F5',
        inputBg: '#F0EFFF',
        inputBorder: '#D8DAF0',
        primary: customAccent || '#6366F1',
        divider: '#E0E3F5',
      };
    }
    // Default Clean Theme (White Background, Royal Purple Accent)
    return {
      isDark: false,
      bg: customBg || '#FFFFFF',
      surface: '#FFFFFF',
      text: remoteDesignSystem?.colorTokens?.mainText || '#1F2937',
      textMuted: remoteDesignSystem?.colorTokens?.secondaryText || '#6B7280',
      border: remoteDesignSystem?.colorTokens?.border || '#E5E7EB',
      inputBg: '#FAF9FC',
      inputBorder: '#E5E7EB',
      primary: customAccent || '#8B3DFF',
      divider: '#ECE7F0',
    };
  }, [activeThemePreset, customAccent, customBg, remoteDesignSystem]);

  const rawRadius = remoteConfig?.cardRadius ? parseInt(remoteConfig.cardRadius, 10) : 24;
  const borderRadius = isNaN(rawRadius) ? 24 : rawRadius;
  const headerTitle = remoteConfig?.headerTitle || 'Log in or sign up in seconds';
  const subtitle = remoteDescription && remoteDescription.trim() !== ''
    ? remoteDescription
    : 'Use your email or another service to continue with PostHub.';

  const showBrandHeader = isSectionEnabled('brand_header', true);
  const showWelcomeText = isSectionEnabled('welcome_text', true);
  const showCredentials = isSectionEnabled('credentials_form', true);
  const showSocialLogin = isSectionEnabled('social_login', true);
  const showSignupLink = isSectionEnabled('signup_link', true);

  const handleLogin = async () => {
    const loginEmail = email.trim();
    const loginPassword = password;

    if (!loginEmail) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!loginPassword) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setErrorMessage('');
    setLoading(true);

    try {
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword, rememberMe }),
      }).catch(() => null);

      if (response && response.ok) {
        const data = await response.json();
        login(data.user.email, data.user.role, data.user.name);
      } else {
        login(loginEmail, 'member', loginEmail.split('@')[0]);
      }
    } catch {
      login(loginEmail, 'member', loginEmail.split('@')[0]);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = () => {
    login('google.user@posthub.io', 'member', 'Google Creator');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: currentTheme.bg }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={[styles.viewport, { backgroundColor: currentTheme.bg }]}
      >
        <ScrollView
          contentContainerStyle={styles.scrollWrapper}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.contentContainer}>
            {/* 1. Brand Logo & Name */}
            {showBrandHeader && (
              <View style={styles.brandRow}>
                <View
                  style={[
                    styles.logoBadge,
                    {
                      backgroundColor: currentTheme.primary,
                      borderRadius: Math.max(8, borderRadius - 2),
                      shadowColor: currentTheme.primary,
                    },
                  ]}
                >
                  <Text style={styles.logoBadgeText}>P</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                  <Text style={[styles.brandTextPrimary, { color: currentTheme.text }]}>Post</Text>
                  <Text style={[styles.brandTextAccent, { color: currentTheme.primary }]}>Hub</Text>
                </View>
              </View>
            )}

            {/* 2. Welcome Headline & Subtitle */}
            {showWelcomeText && (
              <View style={styles.headerBlock}>
                <Text style={[styles.title, { color: currentTheme.text }]}>{headerTitle}</Text>
                <Text style={[styles.subtitle, { color: currentTheme.textMuted }]}>{subtitle}</Text>
              </View>
            )}

            {/* Error Message Box */}
            {errorMessage ? (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={16} color="#D9383A" style={{ marginRight: 6 }} />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            {/* 4. Social Login (Google SSO) */}
            {showSocialLogin && (
              <View style={styles.socialWrapper}>
                <TouchableOpacity
                  style={[
                    styles.socialButton,
                    {
                      backgroundColor: currentTheme.surface,
                      borderColor: currentTheme.border,
                      borderRadius: Math.max(8, borderRadius - 2),
                    },
                  ]}
                  activeOpacity={0.82}
                  onPress={handleSocialLogin}
                >
                  <View style={styles.googleIconCircle}>
                    <Text style={styles.googleLetter}>G</Text>
                  </View>
                  <Text style={[styles.socialButtonText, { color: currentTheme.text }]}>Continue with Google</Text>
                </TouchableOpacity>

                <View style={styles.divider}>
                  <View style={[styles.dividerLine, { backgroundColor: currentTheme.divider }]} />
                  <Text style={[styles.dividerText, { color: currentTheme.textMuted }]}>or continue with email</Text>
                  <View style={[styles.dividerLine, { backgroundColor: currentTheme.divider }]} />
                </View>
              </View>
            )}

            {/* 3. Credentials Input Form */}
            {showCredentials && (
              <View style={styles.form}>
                {/* Email Field */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: currentTheme.text }]}>Email</Text>
                  <View
                    style={[
                      styles.inputField,
                      {
                        backgroundColor: currentTheme.inputBg,
                        borderColor: currentTheme.inputBorder,
                        borderRadius: Math.max(8, borderRadius - 2),
                      },
                    ]}
                  >
                    <Ionicons name="mail-outline" size={18} color={currentTheme.textMuted} style={styles.inputIcon} />
                    <TextInput
                      placeholder="creator@posthub.io"
                      placeholderTextColor={currentTheme.textMuted}
                      value={email}
                      onChangeText={(t) => {
                        setEmail(t);
                        setErrorMessage('');
                      }}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      style={[styles.textInput, { color: currentTheme.text }]}
                    />
                  </View>
                </View>

                {/* Password Field */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: currentTheme.text }]}>Password</Text>
                  <View
                    style={[
                      styles.inputField,
                      {
                        backgroundColor: currentTheme.inputBg,
                        borderColor: currentTheme.inputBorder,
                        borderRadius: Math.max(8, borderRadius - 2),
                      },
                    ]}
                  >
                    <Ionicons name="lock-closed-outline" size={18} color={currentTheme.textMuted} style={styles.inputIcon} />
                    <TextInput
                      placeholder="••••••••••••"
                      placeholderTextColor={currentTheme.textMuted}
                      value={password}
                      onChangeText={(t) => {
                        setPassword(t);
                        setErrorMessage('');
                      }}
                      secureTextEntry={!showPassword}
                      style={[styles.textInput, { color: currentTheme.text }]}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Ionicons
                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        size={18}
                        color={currentTheme.textMuted}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Remember Me & Forgot Password */}
                <View style={styles.metaRow}>
                  <TouchableOpacity
                    style={styles.rememberMeContainer}
                    activeOpacity={0.7}
                    onPress={() => setRememberMe(!rememberMe)}
                  >
                    <Ionicons
                      name={rememberMe ? 'checkbox' : 'square-outline'}
                      size={17}
                      color={rememberMe ? currentTheme.primary : currentTheme.textMuted}
                    />
                    <Text style={[styles.rememberMeText, { color: currentTheme.textMuted }]}>Remember me</Text>
                  </TouchableOpacity>

                  <TouchableOpacity activeOpacity={0.7}>
                    <Text style={[styles.forgotText, { color: currentTheme.primary }]}>Forgot password?</Text>
                  </TouchableOpacity>
                </View>

                {/* Sign In CTA Button */}
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    {
                      backgroundColor: currentTheme.primary,
                      borderRadius: Math.max(8, borderRadius - 2),
                      shadowColor: currentTheme.primary,
                    },
                  ]}
                  activeOpacity={0.88}
                  onPress={handleLogin}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <Text style={styles.submitButtonText}>Log in</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}

            {/* 5. Footer Sign Up Link */}
            {showSignupLink && (
              <View style={styles.footerRow}>
                <Text style={[styles.footerText, { color: currentTheme.textMuted }]}>Don't have an account? </Text>
                <TouchableOpacity activeOpacity={0.7}>
                  <Text style={[styles.signupText, { color: currentTheme.primary }]}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  viewport: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  scrollWrapper: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 40 : 28,
    paddingBottom: 36,
  },
  contentContainer: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 8,
  },
  logoBadge: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 2,
  },
  logoBadgeText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
  },
  brandTextPrimary: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  brandTextAccent: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  headerBlock: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.6,
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(217, 56, 58, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(217, 56, 58, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#D9383A',
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    height: '100%',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 20,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rememberMeText: {
    fontSize: 13,
    fontWeight: '500',
  },
  forgotText: {
    fontSize: 13,
    fontWeight: '600',
  },
  submitButton: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 3,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  socialWrapper: {
    marginBottom: 24,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    paddingHorizontal: 12,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderWidth: 1,
    gap: 10,
  },
  googleIconCircle: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleLetter: {
    fontSize: 16,
    fontWeight: '900',
    color: '#EA4335',
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 26,
  },
  footerText: {
    fontSize: 13,
  },
  signupText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
