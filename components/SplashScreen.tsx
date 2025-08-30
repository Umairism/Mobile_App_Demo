import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CreditCard } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withDelay,
  withSequence,
  runOnJS
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onAnimationComplete: () => void;
}

export default function SplashScreen({ onAnimationComplete }: SplashScreenProps) {
  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const backgroundOpacity = useSharedValue(1);

  useEffect(() => {
    // Logo animation
    logoScale.value = withSpring(1, { damping: 8, stiffness: 100 });
    logoOpacity.value = withSpring(1, { damping: 8, stiffness: 100 });
    
    // Text animation with delay
    textOpacity.value = withDelay(500, withSpring(1));
    
    // Exit animation
    backgroundOpacity.value = withDelay(
      2500, 
      withSpring(0, { damping: 8, stiffness: 100 }, () => {
        runOnJS(onAnimationComplete)();
      })
    );
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: logoScale.value }],
      opacity: logoOpacity.value,
    };
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: textOpacity.value,
    };
  });

  const backgroundAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: backgroundOpacity.value,
    };
  });

  return (
    <Animated.View style={[StyleSheet.absoluteFillObject, backgroundAnimatedStyle]}>
      <LinearGradient
        colors={['#0F172A', '#1E293B', '#334155']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <View style={styles.content}>
          <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
            <View style={styles.logoBackground}>
              <CreditCard color="#FFFFFF" size={48} strokeWidth={1.5} />
            </View>
          </Animated.View>
          
          <Animated.View style={[styles.textContainer, textAnimatedStyle]}>
            <Text style={styles.appName}>Offline Card Wallet</Text>
            <Text style={styles.tagline}>Secure • Private • Offline</Text>
          </Animated.View>
        </View>
        
        <View style={styles.footer}>
          <View style={styles.loadingIndicator}>
            <View style={styles.loadingDot} />
            <View style={[styles.loadingDot, styles.loadingDotDelay1]} />
            <View style={[styles.loadingDot, styles.loadingDotDelay2]} />
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 40,
  },
  logoBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#06B6D4',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 20,
    shadowColor: '#06B6D4',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  textContainer: {
    alignItems: 'center',
  },
  appName: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '400',
    textAlign: 'center',
  },
  footer: {
    paddingBottom: 80,
  },
  loadingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#06B6D4',
  },
  loadingDotDelay1: {
    backgroundColor: '#0EA5E9',
  },
  loadingDotDelay2: {
    backgroundColor: '#38BDF8',
  },
});