import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Shield, FileText, ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function LegalScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Legal</Text>
        <Text style={styles.subtitle}>Review our policies and terms</Text>

        <Pressable 
          style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
          onPress={() => router.push('/privacy-policy')}
        >
          <View style={styles.menuIcon}>
            <Shield size={20} color={Colors.light.primary} />
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>Privacy Policy</Text>
            <Text style={styles.menuSubtitle}>How we collect, use, and protect your data</Text>
          </View>
          <ChevronRight size={20} color={Colors.light.textMuted} />
        </Pressable>

        <Pressable 
          style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
          onPress={() => router.push('/terms-of-use')}
        >
          <View style={styles.menuIcon}>
            <FileText size={20} color={Colors.light.primary} />
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>Terms of Use</Text>
            <Text style={styles.menuSubtitle}>Rules and guidelines for using Lawn Guardian</Text>
          </View>
          <ChevronRight size={20} color={Colors.light.textMuted} />
        </Pressable>

        <Text style={styles.versionText}>Lawn Guardian v1.0.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.light.textMuted,
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  menuItemPressed: {
    opacity: 0.8,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 13,
    color: Colors.light.textMuted,
  },
  versionText: {
    fontSize: 13,
    color: Colors.light.textMuted,
    textAlign: 'center',
    marginTop: 32,
  },
});
