import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Alert,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { QrCode, Camera, Flashlight as FlashLightOn, FlashlightOff as FlashLightOff, ArrowLeft, Zap, Smartphone } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat,
  withTiming,
  withSpring,
  FadeInUp,
  FadeInDown 
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [scanMode, setScanMode] = useState<'camera' | 'qr' | 'nfc'>('camera');
  const [nfcAnimating, setNfcAnimating] = useState(false);
  
  const scanLinePosition = useSharedValue(0);
  const nfcScale = useSharedValue(1);
  const nfcOpacity = useSharedValue(1);

  useEffect(() => {
    if (scanMode === 'camera') {
      scanLinePosition.value = withRepeat(
        withTiming(280, { duration: 2000 }),
        -1,
        true
      );
    }
  }, [scanMode]);

  useEffect(() => {
    if (nfcAnimating) {
      nfcScale.value = withRepeat(
        withSpring(1.2, { damping: 2, stiffness: 80 }),
        -1,
        true
      );
      nfcOpacity.value = withRepeat(
        withTiming(0.3, { duration: 1000 }),
        -1,
        true
      );
    } else {
      nfcScale.value = withSpring(1);
      nfcOpacity.value = withSpring(1);
    }
  }, [nfcAnimating]);

  const scanLineStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: scanLinePosition.value }],
    };
  });

  const nfcAnimationStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: nfcScale.value }],
      opacity: nfcOpacity.value,
    };
  });

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.permissionContainer}>
            <Camera color="#06B6D4" size={64} strokeWidth={1} />
            <Text style={styles.permissionTitle}>Camera Access Required</Text>
            <Text style={styles.permissionText}>
              We need access to your camera to scan QR codes and capture card details.
            </Text>
            <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
              <Text style={styles.permissionButtonText}>Grant Permission</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    Alert.alert('QR Code Scanned!', `Type: ${type}\nData: ${data}`, [
      { text: 'Scan Again', onPress: () => setScanned(false) },
      { text: 'OK' }
    ]);
  };

  const handleNFCTap = () => {
    setNfcAnimating(true);
    setTimeout(() => {
      setNfcAnimating(false);
      Alert.alert('NFC Payment Simulated!', 'Payment of $24.99 processed successfully', [
        { text: 'OK' }
      ]);
    }, 3000);
  };

  const renderCameraView = () => (
    <View style={styles.cameraContainer}>
      <CameraView
        style={styles.camera}
        facing={facing}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr', 'pdf417'],
        }}
      >
        <View style={styles.cameraOverlay}>
          {/* Header */}
          <Animated.View entering={FadeInDown} style={styles.cameraHeader}>
            <TouchableOpacity 
              style={styles.cameraHeaderButton}
              onPress={() => setScanMode('camera')}
            >
              <ArrowLeft color="#FFFFFF" size={24} />
            </TouchableOpacity>
            <Text style={styles.cameraTitle}>Scan QR Code</Text>
            <TouchableOpacity 
              style={styles.cameraHeaderButton}
              onPress={() => setFlash(!flash)}
            >
              {flash ? (
                <FlashLightOn color="#FFFFFF" size={24} />
              ) : (
                <FlashLightOff color="#FFFFFF" size={24} />
              )}
            </TouchableOpacity>
          </Animated.View>

          {/* Scan Frame */}
          <View style={styles.scanFrame}>
            <View style={styles.scanFrameCorner} />
            <Animated.View style={[styles.scanLine, scanLineStyle]} />
          </View>

          {/* Instructions */}
          <Animated.View entering={FadeInUp} style={styles.scanInstructions}>
            <Text style={styles.scanInstructionText}>
              Position the QR code within the frame
            </Text>
          </Animated.View>
        </View>
      </CameraView>
    </View>
  );

  const renderNFCView = () => (
    <View style={styles.nfcContainer}>
      <Animated.View entering={FadeInDown} style={styles.nfcHeader}>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => setScanMode('camera')}
        >
          <ArrowLeft color="#FFFFFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>NFC Payment</Text>
        <View style={styles.headerButton} />
      </Animated.View>

      <View style={styles.nfcContent}>
        <Animated.View style={nfcAnimationStyle}>
          <TouchableOpacity 
            style={styles.nfcButton}
            onPress={handleNFCTap}
            disabled={nfcAnimating}
          >
            <LinearGradient
              colors={['#06B6D4', '#0EA5E9']}
              style={styles.nfcButtonGradient}
            >
              <Smartphone color="#FFFFFF" size={48} strokeWidth={1} />
              <Text style={styles.nfcButtonText}>
                {nfcAnimating ? 'Processing...' : 'Tap to Pay'}
              </Text>
              <Text style={styles.nfcAmount}>$24.99</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        <Text style={styles.nfcInstructions}>
          Hold your phone near the payment terminal
        </Text>
        
        {nfcAnimating && (
          <Animated.View entering={FadeInUp} style={styles.processingIndicator}>
            <Zap color="#06B6D4" size={20} />
            <Text style={styles.processingText}>Processing payment...</Text>
          </Animated.View>
        )}
      </View>
    </View>
  );

  if (scanMode === 'qr') {
    return renderCameraView();
  }

  if (scanMode === 'nfc') {
    return renderNFCView();
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <Animated.View entering={FadeInDown} style={styles.header}>
          <Text style={styles.title}>Scan & Pay</Text>
          <Text style={styles.subtitle}>Choose your payment method</Text>
        </Animated.View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          <Animated.View entering={FadeInUp.delay(200)}>
            <TouchableOpacity 
              style={styles.optionCard}
              onPress={() => setScanMode('qr')}
            >
              <LinearGradient
                colors={['#1E293B', '#334155']}
                style={styles.optionGradient}
              >
                <QrCode color="#06B6D4" size={48} strokeWidth={1} />
                <Text style={styles.optionTitle}>QR Code</Text>
                <Text style={styles.optionDescription}>
                  Scan QR codes for instant payments
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(400)}>
            <TouchableOpacity 
              style={styles.optionCard}
              onPress={() => setScanMode('nfc')}
            >
              <LinearGradient
                colors={['#1E293B', '#334155']}
                style={styles.optionGradient}
              >
                <Smartphone color="#10B981" size={48} strokeWidth={1} />
                <Text style={styles.optionTitle}>NFC Payment</Text>
                <Text style={styles.optionDescription}>
                  Tap your phone to pay contactless
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Recent Transactions */}
        <Animated.View entering={FadeInUp.delay(600)} style={styles.recentSection}>
          <Text style={styles.recentTitle}>Recent Scans</Text>
          <View style={styles.recentItem}>
            <View style={styles.recentIcon}>
              <QrCode color="#06B6D4" size={20} />
            </View>
            <View style={styles.recentDetails}>
              <Text style={styles.recentName}>Coffee Shop</Text>
              <Text style={styles.recentAmount}>$4.50</Text>
            </View>
            <Text style={styles.recentTime}>2m ago</Text>
          </View>
        </Animated.View>
      </SafeAreaView>
    </View>
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  title: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '400',
  },
  optionsContainer: {
    paddingHorizontal: 20,
    gap: 20,
  },
  optionCard: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  optionGradient: {
    padding: 24,
    alignItems: 'center',
    minHeight: 160,
    justifyContent: 'center',
  },
  optionTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    fontWeight: '400',
  },
  recentSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  recentTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 16,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 12,
  },
  recentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  recentDetails: {
    flex: 1,
  },
  recentName: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  recentAmount: {
    fontSize: 14,
    color: '#06B6D4',
    fontWeight: '500',
  },
  recentTime: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '400',
  },
  // Camera styles
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  cameraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  cameraHeaderButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  scanFrame: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  scanFrameCorner: {
    width: 280,
    height: 280,
    borderWidth: 2,
    borderColor: '#06B6D4',
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  scanLine: {
    position: 'absolute',
    top: 0,
    left: (width - 280) / 2,
    width: 280,
    height: 2,
    backgroundColor: '#06B6D4',
    shadowColor: '#06B6D4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  scanInstructions: {
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 80,
  },
  scanInstructionText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '400',
  },
  // NFC styles
  nfcContainer: {
    flex: 1,
  },
  nfcHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  nfcContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  nfcButton: {
    borderRadius: 120,
    overflow: 'hidden',
    elevation: 20,
    shadowColor: '#06B6D4',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  nfcButtonGradient: {
    width: 240,
    height: 240,
    borderRadius: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nfcButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
    marginTop: 16,
  },
  nfcAmount: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '700',
    marginTop: 8,
  },
  nfcInstructions: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 40,
    fontWeight: '400',
  },
  processingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#1E293B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  processingText: {
    fontSize: 14,
    color: '#06B6D4',
    fontWeight: '600',
    marginLeft: 8,
  },
  // Permission styles
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  permissionTitle: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    fontWeight: '400',
    lineHeight: 24,
    marginBottom: 32,
  },
  permissionButton: {
    backgroundColor: '#06B6D4',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#06B6D4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  permissionButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});