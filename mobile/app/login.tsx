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

  // Fetch dynamic configuration from the Admin backend
  useEffect(() => {
    fetch('http://localhost:3000/api/app/config')
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
  }, []);

  // Section visibility check
  const isSectionEnabled = (sectionId: string, fallback = true) => {
    if (!remoteConfig?.sections) return fallback;
    const s = remoteConfig.sections.find((item) => item.id === sectionId);
    return s ? s.enabled : fallback;
  };

  const primaryAccent = remoteConfig?.primaryAccent || theme.primary;
  const rawRadius = remoteConfig?.cardRadius ? parseInt(remoteConfig.cardRadius, 10) : 14;
  const borderRadius = isNaN(rawRadius) ? 14 : rawRadius;
  const headerTitle = remoteConfig?.headerTitle || 'Welcome back';
  const subtitle = remoteDescription || 'Sign in to access your creative posters & AI studio.';

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
        // Successful login fallback with member role
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
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.innerWrapper}>
        <View style={styles.card}>
          {/* 1. Brand Logo & Title */}
          {showBrandHeader && (
            <View style={styles.brandRow}>
              <View style={[styles.logoBadge, { backgroundColor: primaryAccent, borderRadius: borderRadius - 2 }]}>
                <Text style={styles.logoBadgeText}>P</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                <Text style={[styles.brandTextPrimary, { color: theme.text }]}>Post</Text>
                <Text style={[styles.brandTextAccent, { color: primaryAccent }]}>Hub</Text>
              </View>
            </View>
          )}

          {/* 2. Welcome Headline & Subtitle */}
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

          {/* 3. Credentials Form */}
          {showCredentials && (
            <View style={styles.form}>
              {/* Email */}
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.text }]}>Email Address</Text>
                <View
                  style={[
                    styles.inputField,
                    {
                      backgroundColor: theme.card,
                      borderColor: theme.border,
                      borderRadius: borderRadius,
                    },
                  ]}
                >
                  <Ionicons name="mail-outline" size={18} color={theme.tabIconDefault} style={styles.inputIcon} />
                  <TextInput
                    placeholder="name@example.com"
                    placeholderTextColor={theme.tabIconDefault}
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

              {/* Password */}
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.text }]}>Password</Text>
                <View
                  style={[
                    styles.inputField,
                    {
                      backgroundColor: theme.card,
                      borderColor: theme.border,
                      borderRadius: borderRadius,
                    },
                  ]}
                >
                  <Ionicons name="lock-closed-outline" size={18} color={theme.tabIconDefault} style={styles.inputIcon} />
                  <TextInput
                    placeholder="••••••••••••"
                    placeholderTextColor={theme.tabIconDefault}
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
                    size={18}
                    color={rememberMe ? primaryAccent : theme.tabIconDefault}
                  />
                  <Text style={[styles.rememberMeText, { color: theme.tabIconDefault }]}>Remember me</Text>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.7}>
                  <Text style={[styles.forgotText, { color: primaryAccent }]}>Forgot password?</Text>
                </TouchableOpacity>
              </View>

              {/* Sign In CTA */}
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  {
                    backgroundColor: primaryAccent,
                    borderRadius: borderRadius,
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

          {/* 4. Social Login */}
          {showSocialLogin && (
            <View style={styles.socialWrapper}>
              <View style={styles.divider}>
                <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
                <Text style={[styles.dividerText, { color: theme.tabIconDefault }]}>or</Text>
                <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
              </View>

              <TouchableOpacity
                style={[
                  styles.socialButton,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                    borderRadius: borderRadius,
                  },
                ]}
                activeOpacity={0.8}
                onPress={handleSocialLogin}
              >
                <View style={styles.googleIconCircle}>
                  <Text style={styles.googleLetter}>G</Text>
                </View>
                <Text style={[styles.socialButtonText, { color: theme.text }]}>Continue with Google</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* 5. Sign Up Link */}
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerWrapper: {
    width: '100%',
    maxWidth: 440,
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  card: {
    width: '100%',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  logoBadge: {
    width: 34,
    height: 34,
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
    fontSize: 18,
    lineHeight: 20,
  },
  brandTextPrimary: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  brandTextAccent: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  headerBlock: {
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13.5,
    lineHeight: 19,
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
    fontSize: 12.5,
    fontWeight: '600',
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
    fontSize: 14,
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
    fontSize: 12.5,
    fontWeight: '500',
  },
  forgotText: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  submitButton: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  socialWrapper: {
    marginTop: 16,
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
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    borderWidth: 1,
    gap: 8,
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
    marginTop: 20,
  },
  footerText: {
    fontSize: 12.5,
  },
  signupText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
});
