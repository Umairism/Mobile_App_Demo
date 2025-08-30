import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Camera, CreditCard, Eye, EyeOff, Check, CircleAlert as AlertCircle } from 'lucide-react-native';
import Animated, { 
  FadeInUp,
  FadeInDown,
  FadeInLeft,
  useSharedValue,
  useAnimatedStyle,
  withSpring
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

interface CardForm {
  nickname: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardType: 'credit' | 'debit' | 'loyalty';
  brand: string;
}

export default function AddCardScreen() {
  const [form, setForm] = useState<CardForm>({
    nickname: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardType: 'credit',
    brand: '',
  });
  const [showCVV, setShowCVV] = useState(false);
  const [errors, setErrors] = useState<Partial<CardForm>>({});
  const [isLoading, setIsLoading] = useState(false);

  const cardScale = useSharedValue(1);

  const validateForm = (): boolean => {
    const newErrors: Partial<CardForm> = {};

    if (!form.nickname.trim()) {
      newErrors.nickname = 'Card nickname is required';
    }

    if (!form.cardNumber.trim()) {
      newErrors.cardNumber = 'Card number is required';
    } else if (form.cardNumber.replace(/\s/g, '').length < 13) {
      newErrors.cardNumber = 'Card number must be at least 13 digits';
    }

    if (!form.expiryDate.trim()) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(form.expiryDate)) {
      newErrors.expiryDate = 'Format: MM/YY';
    }

    if (!form.cvv.trim()) {
      newErrors.cvv = 'CVV is required';
    } else if (form.cvv.length < 3) {
      newErrors.cvv = 'CVV must be 3-4 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, '');
    const match = cleaned.match(/.{1,4}/g);
    return match ? match.join(' ') : cleaned;
  };

  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const detectCardBrand = (cardNumber: string): string => {
    const cleaned = cardNumber.replace(/\s/g, '');
    if (cleaned.startsWith('4')) return 'Visa';
    if (cleaned.startsWith('5') || cleaned.startsWith('2')) return 'Mastercard';
    if (cleaned.startsWith('3')) return 'American Express';
    return 'Unknown';
  };

  const handleCardNumberChange = (text: string) => {
    const formatted = formatCardNumber(text);
    const brand = detectCardBrand(text);
    setForm(prev => ({ ...prev, cardNumber: formatted, brand }));
    if (errors.cardNumber) {
      setErrors(prev => ({ ...prev, cardNumber: undefined }));
    }
  };

  const handleExpiryChange = (text: string) => {
    const formatted = formatExpiryDate(text);
    setForm(prev => ({ ...prev, expiryDate: formatted }));
    if (errors.expiryDate) {
      setErrors(prev => ({ ...prev, expiryDate: undefined }));
    }
  };

  const handleSaveCard = async () => {
    if (!validateForm()) {
      cardScale.value = withSpring(0.95, {}, () => {
        cardScale.value = withSpring(1);
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Card Added Successfully!',
        `${form.nickname} has been added to your wallet.`,
        [
          { 
            text: 'OK', 
            onPress: () => router.back()
          }
        ]
      );
    }, 2000);
  };

  const handleScanCard = () => {
    Alert.alert(
      'Scan Card',
      'Camera scanning feature would be implemented here using OCR to automatically fill card details.',
      [{ text: 'OK' }]
    );
  };

  const cardAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: cardScale.value }],
    };
  });

  const getCardColor = () => {
    switch (form.cardType) {
      case 'credit': return '#1E3A8A';
      case 'debit': return '#059669';
      case 'loyalty': return '#DC2626';
      default: return '#1E3A8A';
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <Animated.View entering={FadeInDown} style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft color="#FFFFFF" size={24} />
          </TouchableOpacity>
          <Text style={styles.title}>Add New Card</Text>
          <TouchableOpacity 
            style={styles.scanButton}
            onPress={handleScanCard}
          >
            <Camera color="#06B6D4" size={24} />
          </TouchableOpacity>
        </Animated.View>

        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Card Preview */}
          <Animated.View 
            entering={FadeInUp.delay(200)}
            style={[styles.cardPreviewContainer, cardAnimatedStyle]}
          >
            <LinearGradient
              colors={[getCardColor(), `${getCardColor()}CC`]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cardPreview}
            >
              <View style={styles.cardPreviewHeader}>
                <Text style={styles.cardPreviewNickname}>
                  {form.nickname || 'Card Nickname'}
                </Text>
                <Text style={styles.cardPreviewBrand}>
                  {form.brand || 'Brand'}
                </Text>
              </View>
              <View style={styles.cardPreviewNumber}>
                <Text style={styles.cardPreviewNumberText}>
                  {form.cardNumber || '•••• •••• •••• ••••'}
                </Text>
              </View>
              <View style={styles.cardPreviewFooter}>
                <Text style={styles.cardPreviewExpiry}>
                  {form.expiryDate || 'MM/YY'}
                </Text>
                <View style={styles.cardPreviewChip} />
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Card Type Selector */}
          <Animated.View entering={FadeInLeft.delay(400)} style={styles.typeSelector}>
            <Text style={styles.sectionTitle}>Card Type</Text>
            <View style={styles.typeButtons}>
              {(['credit', 'debit', 'loyalty'] as const).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeButton,
                    form.cardType === type && styles.typeButtonActive
                  ]}
                  onPress={() => setForm(prev => ({ ...prev, cardType: type }))}
                >
                  <Text style={[
                    styles.typeButtonText,
                    form.cardType === type && styles.typeButtonTextActive
                  ]}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>

          {/* Form Fields */}
          <Animated.View entering={FadeInLeft.delay(600)} style={styles.formSection}>
            <Text style={styles.sectionTitle}>Card Details</Text>
            
            {/* Card Nickname */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Card Nickname</Text>
              <TextInput
                style={[styles.input, errors.nickname && styles.inputError]}
                value={form.nickname}
                onChangeText={(text) => {
                  setForm(prev => ({ ...prev, nickname: text }));
                  if (errors.nickname) {
                    setErrors(prev => ({ ...prev, nickname: undefined }));
                  }
                }}
                placeholder="e.g., Main Credit Card"
                placeholderTextColor="#64748B"
                maxLength={20}
              />
              {errors.nickname && (
                <View style={styles.errorContainer}>
                  <AlertCircle color="#EF4444" size={16} />
                  <Text style={styles.errorText}>{errors.nickname}</Text>
                </View>
              )}
            </View>

            {/* Card Number */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Card Number</Text>
              <TextInput
                style={[styles.input, errors.cardNumber && styles.inputError]}
                value={form.cardNumber}
                onChangeText={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
                placeholderTextColor="#64748B"
                keyboardType="numeric"
                maxLength={19}
              />
              {errors.cardNumber && (
                <View style={styles.errorContainer}>
                  <AlertCircle color="#EF4444" size={16} />
                  <Text style={styles.errorText}>{errors.cardNumber}</Text>
                </View>
              )}
            </View>

            {/* Expiry and CVV Row */}
            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
                <Text style={styles.inputLabel}>Expiry Date</Text>
                <TextInput
                  style={[styles.input, errors.expiryDate && styles.inputError]}
                  value={form.expiryDate}
                  onChangeText={handleExpiryChange}
                  placeholder="MM/YY"
                  placeholderTextColor="#64748B"
                  keyboardType="numeric"
                  maxLength={5}
                />
                {errors.expiryDate && (
                  <View style={styles.errorContainer}>
                    <AlertCircle color="#EF4444" size={16} />
                    <Text style={styles.errorText}>{errors.expiryDate}</Text>
                  </View>
                )}
              </View>

              <View style={[styles.inputGroup, { flex: 1, marginLeft: 12 }]}>
                <Text style={styles.inputLabel}>CVV</Text>
                <View style={styles.cvvInputContainer}>
                  <TextInput
                    style={[styles.input, styles.cvvInput, errors.cvv && styles.inputError]}
                    value={form.cvv}
                    onChangeText={(text) => {
                      setForm(prev => ({ ...prev, cvv: text.replace(/\D/g, '') }));
                      if (errors.cvv) {
                        setErrors(prev => ({ ...prev, cvv: undefined }));
                      }
                    }}
                    placeholder="123"
                    placeholderTextColor="#64748B"
                    keyboardType="numeric"
                    maxLength={4}
                    secureTextEntry={!showCVV}
                  />
                  <TouchableOpacity
                    style={styles.cvvToggle}
                    onPress={() => setShowCVV(!showCVV)}
                  >
                    {showCVV ? (
                      <EyeOff color="#64748B" size={20} />
                    ) : (
                      <Eye color="#64748B" size={20} />
                    )}
                  </TouchableOpacity>
                </View>
                {errors.cvv && (
                  <View style={styles.errorContainer}>
                    <AlertCircle color="#EF4444" size={16} />
                    <Text style={styles.errorText}>{errors.cvv}</Text>
                  </View>
                )}
              </View>
            </View>
          </Animated.View>

          {/* Security Notice */}
          <Animated.View entering={FadeInUp.delay(800)} style={styles.securityNotice}>
            <View style={styles.securityIcon}>
              <Check color="#10B981" size={20} />
            </View>
            <View style={styles.securityContent}>
              <Text style={styles.securityTitle}>Secure Offline Storage</Text>
              <Text style={styles.securityText}>
                Your card details are encrypted and stored locally on your device only.
              </Text>
            </View>
          </Animated.View>
        </ScrollView>

        {/* Save Button */}
        <Animated.View entering={FadeInUp.delay(1000)} style={styles.saveButtonContainer}>
          <TouchableOpacity
            style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
            onPress={handleSaveCard}
            disabled={isLoading}
          >
            <LinearGradient
              colors={isLoading ? ['#64748B', '#475569'] : ['#06B6D4', '#0EA5E9']}
              style={styles.saveButtonGradient}
            >
              {isLoading ? (
                <Text style={styles.saveButtonText}>Adding Card...</Text>
              ) : (
                <>
                  <CreditCard color="#FFFFFF" size={20} />
                  <Text style={styles.saveButtonText}>Add Card to Wallet</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  scanButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  cardPreviewContainer: {
    marginBottom: 32,
  },
  cardPreview: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    padding: 20,
    justifyContent: 'space-between',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  cardPreviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardPreviewNickname: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  cardPreviewBrand: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
    opacity: 0.8,
  },
  cardPreviewNumber: {
    marginTop: 20,
  },
  cardPreviewNumberText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '500',
    letterSpacing: 2,
  },
  cardPreviewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardPreviewExpiry: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
    opacity: 0.8,
  },
  cardPreviewChip: {
    width: 32,
    height: 24,
    backgroundColor: '#FFD700',
    borderRadius: 4,
  },
  typeSelector: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 16,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  typeButtonActive: {
    backgroundColor: '#06B6D4',
    borderColor: '#0EA5E9',
  },
  typeButtonText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  typeButtonTextActive: {
    color: '#FFFFFF',
  },
  formSection: {
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1E293B',
    borderWidth: 2,
    borderColor: '#334155',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  rowInputs: {
    flexDirection: 'row',
  },
  cvvInputContainer: {
    position: 'relative',
  },
  cvvInput: {
    paddingRight: 50,
  },
  cvvToggle: {
    position: 'absolute',
    right: 16,
    top: 17,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '500',
    marginLeft: 6,
  },
  securityNotice: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  securityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  securityContent: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
    marginBottom: 4,
  },
  securityText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '400',
    lineHeight: 16,
  },
  saveButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0F172A',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  saveButton: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#06B6D4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  saveButtonDisabled: {
    elevation: 0,
    shadowOpacity: 0,
  },
  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  saveButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});