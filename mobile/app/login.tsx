import React, { useState, useEffect } from 'react';
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
  primaryAccent?: string;
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

  // Live polling of admin configuration (every 2.5s) so admin changes reflect in real-time
  const fetchAdminConfig = () => {
    fetch(`http://localhost:3000/api/app/config?t=${Date.now()}`, { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.navigation) {
          const screen = data.navigation.find((s: any) => s.key === 'login');
          if (screen?.layoutConfig) {
            setRemoteConfig(screen.layoutConfig);
          }
          if (screen?.description) {
            setRemoteDescription(screen.description);
          }
        }
      })
      .catch(() => {});
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

  const primaryAccent = remoteConfig?.primaryAccent || theme.primary;
  const rawRadius = remoteConfig?.cardRadius ? parseInt(remoteConfig.cardRadius, 10) : 16;
  const borderRadius = isNaN(rawRadius) ? 16 : rawRadius;
  const headerTitle = remoteConfig?.headerTitle || 'Welcome back';
  const subtitle = remoteDescription && remoteDescription !== '.'
    ? remoteDescription
    : 'Sign in to access your creative posters & AI studio.';

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
      const response = await fetch('http://localhost:3000/api/auth/login', {
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.viewport, { backgroundColor: theme.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollWrapper}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cardContainer}>
          {/* Main White Card with Elevation */}
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
                borderRadius: borderRadius,
              },
            ]}
          >
            {/* 1. Brand Logo & Name */}
            {showBrandHeader && (
              <View style={styles.brandRow}>
                <View
                  style={[
                    styles.logoBadge,
                    {
                      backgroundColor: primaryAccent,
                      borderRadius: Math.max(8, borderRadius - 6),
                      shadowColor: primaryAccent,
                    },
                  ]}
                >
                  <Text style={styles.logoBadgeText}>P</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                  <Text style={[styles.brandTextPrimary, { color: theme.text }]}>Post</Text>
                  <Text style={[styles.brandTextAccent, { color: primaryAccent }]}>Hub</Text>
                </View>
              </View>
            )}

            {/* 2. Welcome Headline & Subtitle (Live editable from Admin) */}
            {showWelcomeText && (
              <View style={styles.headerBlock}>
                <Text style={[styles.title, { color: theme.text }]}>{headerTitle}</Text>
                <Text style={[styles.subtitle, { color: theme.tabIconDefault }]}>{subtitle}</Text>
              </View>
            )}

            {/* Error Message */}
            {errorMessage ? (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={16} color="#D9383A" style={{ marginRight: 6 }} />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            {/* 3. Credentials Input Form */}
            {showCredentials && (
              <View style={styles.form}>
                {/* Email Field */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: theme.text }]}>Email address</Text>
                  <View
                    style={[
                      styles.inputField,
                      {
                        backgroundColor: '#FAF9FC',
                        borderColor: '#E6E0EB',
                        borderRadius: Math.max(8, borderRadius - 4),
                      },
                    ]}
                  >
                    <Ionicons name="mail-outline" size={18} color={theme.tabIconDefault} style={styles.inputIcon} />
                    <TextInput
                      placeholder="admin@yourdomain.com"
                      placeholderTextColor="#9A93A8"
                      value={email}
                      onChangeText={(t) => {
                        setEmail(t);
                        setErrorMessage('');
                      }}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      style={[styles.textInput, { color: theme.text }]}
                    />
                  </View>
                </View>

                {/* Password Field */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: theme.text }]}>Password</Text>
                  <View
                    style={[
                      styles.inputField,
                      {
                        backgroundColor: '#FAF9FC',
                        borderColor: '#E6E0EB',
                        borderRadius: Math.max(8, borderRadius - 4),
                      },
                    ]}
                  >
                    <Ionicons name="lock-closed-outline" size={18} color={theme.tabIconDefault} style={styles.inputIcon} />
                    <TextInput
                      placeholder="••••••••••••"
                      placeholderTextColor="#9A93A8"
                      value={password}
                      onChangeText={(t) => {
                        setPassword(t);
                        setErrorMessage('');
                      }}
                      secureTextEntry={!showPassword}
                      style={[styles.textInput, { color: theme.text }]}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Ionicons
                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        size={18}
                        color={theme.tabIconDefault}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Remember Me & Forgot Password Row */}
                <View style={styles.metaRow}>
                  <TouchableOpacity
                    style={styles.rememberMeContainer}
                    activeOpacity={0.7}
                    onPress={() => setRememberMe(!rememberMe)}
                  >
                    <Ionicons
                      name={rememberMe ? 'checkbox' : 'square-outline'}
                      size={17}
                      color={rememberMe ? primaryAccent : theme.tabIconDefault}
                    />
                    <Text style={[styles.rememberMeText, { color: theme.tabIconDefault }]}>Remember me</Text>
                  </TouchableOpacity>

                  <TouchableOpacity activeOpacity={0.7}>
                    <Text style={[styles.forgotText, { color: primaryAccent }]}>Forgot password?</Text>
                  </TouchableOpacity>
                </View>

                {/* Sign In CTA Button */}
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    {
                      backgroundColor: primaryAccent,
                      borderRadius: Math.max(8, borderRadius - 4),
                      shadowColor: primaryAccent,
                    },
                  ]}
                  activeOpacity={0.88}
                  onPress={handleLogin}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <Text style={styles.submitButtonText}>Sign In</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}

            {/* 4. Social Login (Google SSO) */}
            {showSocialLogin && (
              <View style={styles.socialWrapper}>
                <View style={styles.divider}>
                  <View style={[styles.dividerLine, { backgroundColor: '#ECE7F0' }]} />
                  <Text style={[styles.dividerText, { color: '#9A93A8' }]}>OR</Text>
                  <View style={[styles.dividerLine, { backgroundColor: '#ECE7F0' }]} />
                </View>

                <TouchableOpacity
                  style={[
                    styles.socialButton,
                    {
                      backgroundColor: '#FFFFFF',
                      borderColor: '#E6E0EB',
                      borderRadius: Math.max(8, borderRadius - 4),
                    },
                  ]}
                  activeOpacity={0.82}
                  onPress={handleSocialLogin}
                >
                  <View style={styles.googleIconCircle}>
                    <Text style={styles.googleLetter}>G</Text>
                  </View>
                  <Text style={[styles.socialButtonText, { color: theme.text }]}>Continue with Google</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* 5. Footer Sign Up Link */}
            {showSignupLink && (
              <View style={styles.footerRow}>
                <Text style={[styles.footerText, { color: theme.tabIconDefault }]}>Don't have an account? </Text>
                <TouchableOpacity activeOpacity={0.7}>
                  <Text style={[styles.signupText, { color: primaryAccent }]}>Create account</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  viewport: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  scrollWrapper: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  cardContainer: {
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    borderWidth: 1,
    paddingHorizontal: 28,
    paddingVertical: 32,
    shadowColor: '#24213A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 3,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  logoBadge: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  logoBadgeText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 17,
    lineHeight: 19,
  },
  brandTextPrimary: {
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  brandTextAccent: {
    fontSize: 19,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  headerBlock: {
    marginBottom: 22,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(217, 56, 58, 0.08)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(217, 56, 58, 0.18)',
  },
  errorText: {
    color: '#D9383A',
    fontSize: 12.5,
    fontWeight: '500',
    flex: 1,
  },
  form: {
    gap: 14,
  },
  inputGroup: {
    gap: 5,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 46,
  },
  inputIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 13.5,
    paddingVertical: 0,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rememberMeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  forgotText: {
    fontSize: 12,
    fontWeight: '600',
  },
  submitButton: {
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  socialWrapper: {
    marginTop: 18,
    gap: 12,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    borderWidth: 1,
    gap: 8,
    shadowColor: '#24213A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  googleIconCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleLetter: {
    color: '#EA4335',
    fontWeight: '800',
    fontSize: 14,
  },
  socialButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  footerText: {
    fontSize: 12.5,
  },
  signupText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
});
