import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Calendar,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Smartphone,
  QrCode,
  TrendingUp,
  DollarSign
} from 'lucide-react-native';
import Animated, { 
  FadeInUp,
  FadeInDown,
  FadeInLeft 
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Transaction {
  id: string;
  type: 'payment' | 'received' | 'refund';
  method: 'nfc' | 'qr' | 'card';
  merchant: string;
  amount: number;
  date: Date;
  status: 'completed' | 'pending' | 'failed';
  category: string;
}

export default function HistoryScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [transactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'payment',
      method: 'nfc',
      merchant: 'Starbucks Coffee',
      amount: -4.50,
      date: new Date('2024-01-20T10:30:00'),
      status: 'completed',
      category: 'Food & Drink',
    },
    {
      id: '2',
      type: 'payment',
      method: 'qr',
      merchant: 'Metro Transport',
      amount: -2.75,
      date: new Date('2024-01-20T08:15:00'),
      status: 'completed',
      category: 'Transportation',
    },
    {
      id: '3',
      type: 'received',
      method: 'qr',
      merchant: 'John Smith',
      amount: 25.00,
      date: new Date('2024-01-19T16:45:00'),
      status: 'completed',
      category: 'Transfer',
    },
    {
      id: '4',
      type: 'payment',
      method: 'card',
      merchant: 'Amazon Online',
      amount: -89.99,
      date: new Date('2024-01-19T14:20:00'),
      status: 'completed',
      category: 'Shopping',
    },
    {
      id: '5',
      type: 'payment',
      method: 'nfc',
      merchant: 'Shell Gas Station',
      amount: -45.67,
      date: new Date('2024-01-18T19:30:00'),
      status: 'completed',
      category: 'Gas',
    },
    {
      id: '6',
      type: 'refund',
      method: 'card',
      merchant: 'Best Buy',
      amount: 156.78,
      date: new Date('2024-01-18T11:15:00'),
      status: 'completed',
      category: 'Refund',
    },
  ]);

  const totalSpent = transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const totalReceived = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const getTransactionIcon = (method: string, type: string) => {
    if (method === 'nfc') return <Smartphone color="#10B981" size={20} />;
    if (method === 'qr') return <QrCode color="#06B6D4" size={20} />;
    return <CreditCard color="#8B5CF6" size={20} />;
  };

  const getAmountColor = (amount: number, type: string) => {
    if (type === 'received' || type === 'refund') return '#10B981';
    return '#EF4444';
  };

  const formatAmount = (amount: number) => {
    const prefix = amount > 0 ? '+' : '';
    return `${prefix}$${Math.abs(amount).toFixed(2)}`;
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const periods = [
    { key: 'week', label: 'Week' },
    { key: 'month', label: 'Month' },
    { key: 'year', label: 'Year' },
  ];

  const TransactionItem = ({ transaction, index }: { transaction: Transaction; index: number }) => (
    <Animated.View 
      entering={FadeInLeft.delay(index * 100)}
      style={styles.transactionItem}
    >
      <View style={styles.transactionIcon}>
        {getTransactionIcon(transaction.method, transaction.type)}
      </View>
      
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionMerchant}>{transaction.merchant}</Text>
        <View style={styles.transactionMeta}>
          <Text style={styles.transactionCategory}>{transaction.category}</Text>
          <Text style={styles.transactionTime}>
            {formatDate(transaction.date)} • {formatTime(transaction.date)}
          </Text>
        </View>
      </View>

      <View style={styles.transactionAmount}>
        <Text 
          style={[
            styles.transactionAmountText,
            { color: getAmountColor(transaction.amount, transaction.type) }
          ]}
        >
          {formatAmount(transaction.amount)}
        </Text>
        <View style={styles.transactionStatus}>
          <View 
            style={[
              styles.statusDot,
              { backgroundColor: transaction.status === 'completed' ? '#10B981' : '#EF4444' }
            ]} 
          />
          <Text style={styles.statusText}>{transaction.status}</Text>
        </View>
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <Animated.View entering={FadeInDown} style={styles.header}>
          <Text style={styles.title}>Transaction History</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Filter color="#64748B" size={20} />
          </TouchableOpacity>
        </Animated.View>

        {/* Stats Cards */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.statsContainer}>
          <View style={styles.statCard}>
            <LinearGradient
              colors={['#EF4444', '#DC2626']}
              style={styles.statGradient}
            >
              <ArrowUpRight color="#FFFFFF" size={20} />
              <Text style={styles.statLabel}>Spent</Text>
              <Text style={styles.statAmount}>${totalSpent.toFixed(2)}</Text>
            </LinearGradient>
          </View>

          <View style={styles.statCard}>
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={styles.statGradient}
            >
              <ArrowDownLeft color="#FFFFFF" size={20} />
              <Text style={styles.statLabel}>Received</Text>
              <Text style={styles.statAmount}>${totalReceived.toFixed(2)}</Text>
            </LinearGradient>
          </View>
        </Animated.View>

        {/* Period Selector */}
        <Animated.View entering={FadeInDown.delay(400)} style={styles.periodSelector}>
          {periods.map((period) => (
            <TouchableOpacity
              key={period.key}
              style={[
                styles.periodButton,
                selectedPeriod === period.key && styles.periodButtonActive
              ]}
              onPress={() => setSelectedPeriod(period.key)}
            >
              <Text 
                style={[
                  styles.periodButtonText,
                  selectedPeriod === period.key && styles.periodButtonTextActive
                ]}
              >
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Transactions List */}
        <ScrollView 
          style={styles.transactionsList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.transactionsContainer}
        >
          <Animated.View entering={FadeInUp.delay(600)} style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <View style={styles.transactionCount}>
              <Text style={styles.transactionCountText}>{transactions.length}</Text>
            </View>
          </Animated.View>

          {transactions.map((transaction, index) => (
            <TransactionItem 
              key={transaction.id} 
              transaction={transaction} 
              index={index}
            />
          ))}

          {/* Load More */}
          <Animated.View entering={FadeInUp.delay(1000)}>
            <TouchableOpacity style={styles.loadMoreButton}>
              <TrendingUp color="#06B6D4" size={20} />
              <Text style={styles.loadMoreText}>Load More Transactions</Text>
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
    paddingTop: 20,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  statGradient: {
    padding: 20,
    alignItems: 'flex-start',
  },
  statLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
    opacity: 0.8,
    marginTop: 8,
    marginBottom: 4,
  },
  statAmount: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  periodSelector: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 8,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#1E293B',
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: '#06B6D4',
  },
  periodButtonText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  periodButtonTextActive: {
    color: '#FFFFFF',
  },
  transactionsList: {
    flex: 1,
  },
  transactionsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
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
  transactionCount: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  transactionCountText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  transactionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionMerchant: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 4,
  },
  transactionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionCategory: {
    fontSize: 12,
    color: '#06B6D4',
    fontWeight: '500',
    marginRight: 8,
  },
  transactionTime: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '400',
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  transactionAmountText: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  transactionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  loadMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E293B',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#334155',
    borderStyle: 'dashed',
    marginTop: 20,
  },
  loadMoreText: {
    fontSize: 14,
    color: '#06B6D4',
    fontWeight: '600',
    marginLeft: 8,
  },
});