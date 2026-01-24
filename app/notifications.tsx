import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Clock, Droplets, CheckCircle, Lightbulb, Leaf, Info } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  icon: 'clock' | 'droplets' | 'check' | 'lightbulb' | 'leaf';
}

export default function NotificationsScreen() {
  const router = useRouter();
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: 'treatment',
      title: 'Treatment Reminders',
      description: 'Get notified when it\'s time for scheduled treatments',
      enabled: true,
      icon: 'clock',
    },
    {
      id: 'watering',
      title: 'Watering Schedule',
      description: 'Reminders based on weather and lawn needs',
      enabled: true,
      icon: 'droplets',
    },
    {
      id: 'diagnosis',
      title: 'Diagnosis Follow-ups',
      description: 'Check-in reminders after diagnosing a problem',
      enabled: false,
      icon: 'check',
    },
    {
      id: 'tips',
      title: 'Lawn Care Tips',
      description: 'Weekly tips for maintaining a healthy lawn',
      enabled: false,
      icon: 'lightbulb',
    },
    {
      id: 'seasonal',
      title: 'Seasonal Reminders',
      description: 'Important seasonal lawn care tasks',
      enabled: true,
      icon: 'leaf',
    },
  ]);

  const toggleSetting = (id: string) => {
    setSettings(prev => prev.map(setting => 
      setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
    ));
  };

  const getIcon = (iconName: string, enabled: boolean) => {
    const color = enabled ? Colors.light.primary : Colors.light.textMuted;
    switch (iconName) {
      case 'clock':
        return <Clock size={22} color={color} />;
      case 'droplets':
        return <Droplets size={22} color={color} />;
      case 'check':
        return <CheckCircle size={22} color={color} />;
      case 'lightbulb':
        return <Lightbulb size={22} color={color} />;
      case 'leaf':
        return <Leaf size={22} color={color} />;
      default:
        return <Clock size={22} color={color} />;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.light.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.introText}>
          Choose which notifications you'd like to receive to stay on top of your lawn care.
        </Text>

        <View style={styles.settingsContainer}>
          {settings.map((setting) => (
            <View key={setting.id} style={styles.settingCard}>
              <View style={[
                styles.iconContainer,
                { backgroundColor: setting.enabled ? '#D1FAE5' : '#F3F4F6' }
              ]}>
                {getIcon(setting.icon, setting.enabled)}
              </View>
              <View style={styles.settingContent}>
                <Text style={[
                  styles.settingTitle,
                  !setting.enabled && styles.settingTitleDisabled
                ]}>
                  {setting.title}
                </Text>
                <Text style={styles.settingDescription}>{setting.description}</Text>
              </View>
              <Switch
                value={setting.enabled}
                onValueChange={() => toggleSetting(setting.id)}
                trackColor={{ false: '#E5E7EB', true: Colors.light.primary }}
                thumbColor="#FFF"
              />
            </View>
          ))}
        </View>

        <View style={styles.infoBox}>
          <Info size={18} color={Colors.light.textSecondary} />
          <Text style={styles.infoText}>
            You can change these settings at any time. Notifications require permission from your device settings.
          </Text>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  headerRight: {
    width: 32,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  introText: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    lineHeight: 22,
    marginTop: 24,
    marginBottom: 24,
  },
  settingsContainer: {
    gap: 12,
  },
  settingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  settingContent: {
    flex: 1,
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 2,
  },
  settingTitleDisabled: {
    color: Colors.light.textMuted,
  },
  settingDescription: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    lineHeight: 18,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: Colors.light.textSecondary,
    lineHeight: 18,
  },
  bottomPadding: {
    height: 40,
  },
});
