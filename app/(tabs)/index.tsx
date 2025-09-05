import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, Eye, EyeOff, Wifi, WifiOff } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  FadeInUp,
  FadeInDown 
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface Card {
  id: string;
  nickname: string;
  last4: string;
  type: 'credit' | 'debit' | 'loyalty';
  brand: string;
  color: string;
}

export default function WalletScreen() {
  const [cards, setCards] = useState<Card[]>([
    {
      id: '1',
      nickname: 'Main Credit',
      last4: '4567',
      type: 'credit',
      brand: 'Visa',
      color: '#1E3A8A',
    },
    {
      id: '2',
      nickname: 'Debit Card',
      last4: '8901',
      type: 'debit',
      brand: 'Mastercard',
      color: '#059669',
    },
    {
      id: '3',
      nickname: 'Starbucks',
      last4: '2345',
      type: 'loyalty',
      brand: 'Loyalty',
      color: '#DC2626',
    },
  ]);
  const [hideBalance, setHideBalance] = useState(false);
  const [isOffline] = useState(true);

  const balance = '$2,847.63';

  const handleAddCard = () => {
    router.push('/(tabs)/add-card');
  };

  const CardComponent = ({ card, index }: { card: Card; index: number }) => {
    const rotateY = useSharedValue(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const frontAnimatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ rotateY: `${rotateY.value}deg` }],
        opacity: rotateY.value > 90 ? 0 : 1,
      };
    });

    const backAnimatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ rotateY: `${rotateY.value - 180}deg` }],
        opacity: rotateY.value > 90 ? 1 : 0,
      };
    });

    const handleCardFlip = () => {
      const newValue = isFlipped ? 0 : 180;
      rotateY.value = withSpring(newValue, { damping: 15, stiffness: 100 });
      setIsFlipped(!isFlipped);
    };

    return (
      <Animated.View
        entering={FadeInUp.delay(index * 100)}
        style={styles.cardContainer}
      >
        <TouchableOpacity onPress={handleCardFlip} activeOpacity={0.95}>
          {/* Front of Card */}
          <Animated.View style={[styles.cardFront, frontAnimatedStyle]}>
            <LinearGradient
              colors={[card.color, `${card.color}CC`]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.card}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardNickname}>{card.nickname}</Text>
                <Text style={styles.cardBrand}>{card.brand}</Text>
              </View>
              <View style={styles.cardNumber}>
                <Text style={styles.cardNumberText}>•••• •••• •••• {card.last4}</Text>
              </View>
              <View style={styles.cardFooter}>
                <Text style={styles.cardType}>{card.type.toUpperCase()}</Text>
                <View style={styles.cardChip} />
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Back of Card */}
          <Animated.View style={[styles.cardBack, backAnimatedStyle]}>
            <LinearGradient
              colors={[card.color, `${card.color}CC`]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.card}
            >
              <View style={styles.magneticStrip} />
              <View style={styles.signaturePanel}>
                <Text style={styles.signatureText}>Authorized Signature</Text>
              </View>
              <View style={styles.cvvPanel}>
                <Text style={styles.cvvLabel}>CVV</Text>
                <Text style={styles.cvvNumber}>•••</Text>
              </View>
            </LinearGradient>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <Animated.View entering={FadeInDown} style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.username}>Alex Johnson</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.statusIndicator}>
              {isOffline ? (
                <WifiOff color="#EF4444" size={16} />
              ) : (
                <Wifi color="#10B981" size={16} />
              )}
              <Text style={[styles.statusText, { color: isOffline ? '#EF4444' : '#10B981' }]}>
                {isOffline ? 'Offline' : 'Online'}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Balance Section */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.balanceSection}>
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <TouchableOpacity onPress={() => setHideBalance(!hideBalance)}>
              {hideBalance ? (
                <EyeOff color="#64748B" size={20} />
              ) : (
                <Eye color="#64748B" size={20} />
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.balanceAmount}>
            {hideBalance ? '••••••' : balance}
          </Text>
        </Animated.View>

        {/* Cards Section */}
        <ScrollView 
          style={styles.cardsSection}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.cardsContainer}
        >
          <Animated.View entering={FadeInDown.delay(400)} style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Cards</Text>
            <TouchableOpacity style={styles.addButton} onPress={handleAddCard}>
              <Plus color="#06B6D4" size={20} strokeWidth={2} />
            </TouchableOpacity>
          </Animated.View>

          {cards.map((card, index) => (
            <CardComponent key={card.id} card={card} index={index} />
          ))}

          <Animated.View entering={FadeInUp.delay(800)}>
            <TouchableOpacity style={styles.addCardButton} onPress={handleAddCard}>
              <Plus color="#64748B" size={24} strokeWidth={2} />
              <Text style={styles.addCardText}>Add New Card</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '400',
  },
  username: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '700',
    marginTop: 2,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  balanceSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
  },
  balanceAmount: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  cardsSection: {
    flex: 1,
  },
  cardsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#1E293B',
    padding: 8,
    borderRadius: 12,
  },
  cardContainer: {
    marginBottom: 20,
  },
  cardFront: {
    position: 'absolute',
    width: '100%',
    height: 200,
    backfaceVisibility: 'hidden',
  },
  cardBack: {
    position: 'absolute',
    width: '100%',
    height: 200,
    backfaceVisibility: 'hidden',
  },
  card: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    padding: 20,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardNickname: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  cardBrand: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
    opacity: 0.8,
  },
  cardNumber: {
    marginTop: 20,
  },
  cardNumberText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '500',
    letterSpacing: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardType: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
    opacity: 0.8,
  },
  cardChip: {
    width: 32,
    height: 24,
    backgroundColor: '#FFD700',
    borderRadius: 4,
  },
  magneticStrip: {
    width: '100%',
    height: 40,
    backgroundColor: '#000',
    marginTop: 20,
    borderRadius: 2,
  },
  signaturePanel: {
    width: '100%',
    height: 30,
    backgroundColor: '#FFFFFF',
    marginTop: 20,
    borderRadius: 4,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  signatureText: {
    fontSize: 10,
    color: '#000',
    opacity: 0.6,
  },
  cvvPanel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  cvvLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  cvvNumber: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  addCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E293B',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#334155',
    borderStyle: 'dashed',
    marginTop: 10,
  },
  addCardText: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '600',
    marginLeft: 8,
  },
});