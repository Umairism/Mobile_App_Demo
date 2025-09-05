import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  StatusBar,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Shield, Moon, Sun, Lock, Fingerprint, Bell, Download, Upload, CreditCard, Trash2, ChevronRight, Settings as SettingsIcon, CircleHelp as HelpCircle, LogOut } from 'lucide-react-native';
import Animated, { 
  FadeInUp,
  FadeInDown,
  FadeInLeft 
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoLock, setAutoLock] = useState(true);

  const handleExportWallet = () => {
    Alert.alert(
      'Export Wallet',
      'This will create an encrypted backup of your wallet data.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export', onPress: () => console.log('Exporting wallet...') }
      ]
    );
  };

  const handleImportWallet = () => {
    Alert.alert(
      'Import Wallet',
      'Select an encrypted backup file to restore your wallet.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Select File', onPress: () => console.log('Importing wallet...') }
      ]
    );
  };

  const handleDeleteAllData = () => {
    Alert.alert(
      'Delete All Data',
      'This action cannot be undone. All your cards and transaction history will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => console.log('Deleting all data...') 
        }
      ]
    );
  };

  const SettingsSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );

  const SettingsItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    rightElement,
    danger = false,
    index = 0 
  }: {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
    danger?: boolean;
    index?: number;
  }) => (
    <Animated.View entering={FadeInLeft.delay(index * 50)}>
      <TouchableOpacity 
        style={styles.settingsItem}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={[styles.settingsIcon, danger && styles.settingsIconDanger]}>
          {icon}
        </View>
        <View style={styles.settingsContent}>
          <Text style={[styles.settingsTitle, danger && styles.settingsTitleDanger]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.settingsSubtitle}>{subtitle}</Text>
          )}
        </View>
        {rightElement || <ChevronRight color="#64748B" size={20} />}
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <Animated.View entering={FadeInDown} style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </Animated.View>

        {/* Profile Section */}
        <Animated.View entering={FadeInDown.delay(200)}>
          <LinearGradient
            colors={['#1E293B', '#334155']}
            style={styles.profileCard}
          >
            <View style={styles.profileContent}>
              <View style={styles.profileAvatar}>
                <User color="#FFFFFF" size={32} strokeWidth={1.5} />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>Alex Johnson</Text>
                <Text style={styles.profileEmail}>alex.johnson@email.com</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.profileEditButton}>
              <Text style={styles.profileEditText}>Edit</Text>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>

        <ScrollView 
          style={styles.settingsList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.settingsContainer}
        >
          {/* Security Settings */}
          <Animated.View entering={FadeInUp.delay(400)}>
            <SettingsSection title="Security">
              <SettingsItem
                index={0}
                icon={<Lock color="#06B6D4" size={20} />}
                title="Change PIN"
                subtitle="Update your 6-digit PIN"
                onPress={() => console.log('Change PIN')}
              />
              <SettingsItem
                index={1}
                icon={<Fingerprint color="#10B981" size={20} />}
                title="Biometric Authentication"
                subtitle="Use fingerprint or Face ID"
                rightElement={
                  <Switch
                    value={biometricEnabled}
                    onValueChange={setBiometricEnabled}
                    trackColor={{ false: '#334155', true: '#06B6D4' }}
                    thumbColor={biometricEnabled ? '#FFFFFF' : '#64748B'}
                  />
                }
              />
              <SettingsItem
                index={2}
                icon={<Shield color="#8B5CF6" size={20} />}
                title="Auto-Lock"
                subtitle="Lock app after 5 minutes of inactivity"
                rightElement={
                  <Switch
                    value={autoLock}
                    onValueChange={setAutoLock}
                    trackColor={{ false: '#334155', true: '#06B6D4' }}
                    thumbColor={autoLock ? '#FFFFFF' : '#64748B'}
                  />
                }
              />
            </SettingsSection>
          </Animated.View>

          {/* Appearance Settings */}
          <Animated.View entering={FadeInUp.delay(600)}>
            <SettingsSection title="Appearance">
              <SettingsItem
                index={3}
                icon={darkMode ? <Moon color="#F59E0B" size={20} /> : <Sun color="#F59E0B" size={20} />}
                title="Dark Mode"
                subtitle={`Currently using ${darkMode ? 'dark' : 'light'} theme`}
                rightElement={
                  <Switch
                    value={darkMode}
                    onValueChange={setDarkMode}
                    trackColor={{ false: '#334155', true: '#06B6D4' }}
                    thumbColor={darkMode ? '#FFFFFF' : '#64748B'}
                  />
                }
              />
              <SettingsItem
                index={4}
                icon={<Bell color="#06B6D4" size={20} />}
                title="Notifications"
                subtitle="Payment confirmations and alerts"
                rightElement={
                  <Switch
                    value={notificationsEnabled}
                    onValueChange={setNotificationsEnabled}
                    trackColor={{ false: '#334155', true: '#06B6D4' }}
                    thumbColor={notificationsEnabled ? '#FFFFFF' : '#64748B'}
                  />
                }
              />
            </SettingsSection>
          </Animated.View>

          {/* Wallet Management */}
          <Animated.View entering={FadeInUp.delay(800)}>
            <SettingsSection title="Wallet Management">
              <SettingsItem
                index={5}
                icon={<CreditCard color="#10B981" size={20} />}
                title="Manage Cards"
                subtitle="Add, edit, or remove payment cards"
                onPress={() => console.log('Manage Cards')}
              />
              <SettingsItem
                index={6}
                icon={<Upload color="#06B6D4" size={20} />}
                title="Export Wallet"
                subtitle="Create encrypted backup"
                onPress={handleExportWallet}
              />
              <SettingsItem
                index={7}
                icon={<Download color="#8B5CF6" size={20} />}
                title="Import Wallet"
                subtitle="Restore from backup"
                onPress={handleImportWallet}
              />
            </SettingsSection>
          </Animated.View>

          {/* Support & About */}
          <Animated.View entering={FadeInUp.delay(1000)}>
            <SettingsSection title="Support & About">
              <SettingsItem
                index={8}
                icon={<HelpCircle color="#06B6D4" size={20} />}
                title="Help & Support"
                subtitle="FAQs, contact support"
                onPress={() => console.log('Help & Support')}
              />
              <SettingsItem
                index={9}
                icon={<SettingsIcon color="#64748B" size={20} />}
                title="About"
                subtitle="Version 1.0.0"
                onPress={() => console.log('About')}
              />
            </SettingsSection>
          </Animated.View>

          {/* Danger Zone */}
          <Animated.View entering={FadeInUp.delay(1200)}>
            <SettingsSection title="Danger Zone">
              <SettingsItem
                index={10}
                icon={<Trash2 color="#EF4444" size={20} />}
                title="Delete All Data"
                subtitle="Permanently delete all wallet data"
                onPress={handleDeleteAllData}
                danger
              />
              <SettingsItem
                index={11}
                icon={<LogOut color="#EF4444" size={20} />}
                title="Sign Out"
                subtitle="Sign out and clear local data"
                onPress={() => console.log('Sign Out')}
                danger
              />
            </SettingsSection>
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  profileCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#06B6D4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '400',
  },
  profileEditButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#334155',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  profileEditText: {
    fontSize: 14,
    color: '#06B6D4',
    fontWeight: '600',
  },
  settingsList: {
    flex: 1,
  },
  settingsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionContent: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    overflow: 'hidden',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  settingsIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingsIconDanger: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  settingsContent: {
    flex: 1,
  },
  settingsTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 2,
  },
  settingsTitleDanger: {
    color: '#EF4444',
  },
  settingsSubtitle: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '400',
  },
});