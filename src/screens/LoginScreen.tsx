import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useEmailAuth } from '../hooks/useEmailAuth';
import { useAuth } from '../contexts/AuthContext';
import AnimatedLogo from '../components/AnimatedLogo';
import { colors } from '../constants/colors';

const LoginScreen: React.FC = () => {
  const { signIn, signUp, resetPassword, loading, error, message, clearMessages } = useEmailAuth();
  const { isConfigured, setDemoUser } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      return;
    }

    if (isSignUp) {
      const result = await signUp(email, password);
      if (result.needsVerification) {
        setShowVerificationMessage(true);
      }
    } else {
      await signIn(email, password);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      return;
    }
    await resetPassword(email);
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setShowVerificationMessage(false);
    clearMessages();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Brand Section */}
          <View style={styles.brandSection}>
            <AnimatedLogo />
            <Text style={styles.title}>MealSwipe</Text>
            <Text style={styles.subtitle}>
              Discover your next favorite meal
            </Text>
          </View>

          {/* Auth Card */}
          <View style={styles.authCard}>
            {!isConfigured && (
              <View style={styles.demoNotice}>
                <Text style={styles.demoNoticeText}>
                  Demo Mode — No backend connected
                </Text>
              </View>
            )}

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {message && (
              <View style={styles.successContainer}>
                <Text style={styles.successText}>{message}</Text>
              </View>
            )}

            {showVerificationMessage && (
              <View style={styles.verificationContainer}>
                <Text style={styles.verificationTitle}>Check your inbox!</Text>
                <Text style={styles.verificationText}>
                  We sent a verification link to {email}
                </Text>
              </View>
            )}

            {isConfigured ? (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="your@email.com"
                    placeholderTextColor={colors.textLight}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoComplete="email"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Password</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor={colors.textLight}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  />
                </View>

                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    (!email || !password) && styles.submitButtonDisabled,
                  ]}
                  onPress={handleSubmit}
                  disabled={loading || !email || !password}
                  activeOpacity={0.8}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.submitButtonText}>
                      {isSignUp ? 'Create Account' : 'Sign In'}
                    </Text>
                  )}
                </TouchableOpacity>

                {!isSignUp && (
                  <TouchableOpacity
                    style={styles.forgotButton}
                    onPress={handleForgotPassword}
                    disabled={loading || !email}
                  >
                    <Text style={styles.forgotButtonText}>Forgot password?</Text>
                  </TouchableOpacity>
                )}

                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or</Text>
                  <View style={styles.dividerLine} />
                </View>

                <TouchableOpacity
                  style={styles.toggleButton}
                  onPress={toggleMode}
                >
                  <Text style={styles.toggleText}>
                    {isSignUp
                      ? 'Already have an account? '
                      : "Don't have an account? "}
                    <Text style={styles.toggleTextBold}>
                      {isSignUp ? 'Sign In' : 'Sign Up'}
                    </Text>
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={styles.submitButton}
                onPress={setDemoUser}
                activeOpacity={0.8}
              >
                <Text style={styles.submitButtonText}>Continue in Demo Mode</Text>
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.termsText}>
            By continuing, you agree to our Terms & Privacy Policy
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    justifyContent: 'center',
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textMuted,
    marginTop: 6,
  },
  authCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#8B7355',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
  },
  demoNotice: {
    backgroundColor: colors.warningBg,
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  demoNoticeText: {
    color: colors.warning,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '500',
  },
  errorContainer: {
    backgroundColor: colors.errorBg,
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  errorText: {
    color: colors.error,
    textAlign: 'center',
    fontSize: 13,
  },
  successContainer: {
    backgroundColor: colors.successBg,
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  successText: {
    color: colors.success,
    textAlign: 'center',
    fontSize: 13,
  },
  verificationContainer: {
    backgroundColor: colors.infoBg,
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
  },
  verificationTitle: {
    color: colors.info,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  verificationText: {
    color: colors.info,
    fontSize: 13,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: colors.inputBg,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1.5,
    borderColor: colors.inputBorder,
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: colors.primaryLight,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  forgotButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  forgotButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.inputBorder,
  },
  dividerText: {
    marginHorizontal: 16,
    color: colors.textLight,
    fontSize: 13,
  },
  toggleButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  toggleText: {
    color: colors.textMuted,
    fontSize: 14,
  },
  toggleTextBold: {
    color: colors.primary,
    fontWeight: '600',
  },
  termsText: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: 24,
  },
});

export default LoginScreen;
