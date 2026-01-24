import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { RefreshCw, Check } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { usePurchases } from '@/providers/PurchasesProvider';

export default function RestoreMembershipScreen() {
  const router = useRouter();
  const { restore, isRestoring, isPro } = usePurchases();

  const handleRestorePurchases = async () => {
    console.log('Starting restore purchases...');
    const result = await restore();
    
    if (result.success) {
      if (result.hasActiveSubscription) {
        Alert.alert(
          'Restore Successful!',
          'Your Pro subscription has been restored. Enjoy all Pro features!',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      } else {
        Alert.alert(
          'No Active Subscription',
          'No active subscriptions were found linked to your account. Would you like to view our plans?',
          [
            { text: 'Not Now', style: 'cancel' },
            { text: 'View Plans', onPress: () => router.push('/plans') }
          ]
        );
      }
    } else {
      Alert.alert('Restore Failed', result.error || 'Unable to restore purchases. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Restore Membership',
          headerShown: true,
          headerBackTitle: 'Back',
        }} 
      />
      <View style={styles.content}>
        <Text style={styles.title}>Restore Membership</Text>

        {isPro && (
          <View style={styles.activeSubBanner}>
            <Check size={20} color="#FFF" />
            <Text style={styles.activeSubText}>You have an active Pro subscription!</Text>
          </View>
        )}

        <View style={styles.welcomeCard}>
          <View style={styles.welcomeIcon}>
            <RefreshCw size={28} color={Colors.light.primary} />
          </View>
          <Text style={styles.welcomeTitle}>Welcome Back!</Text>
          <Text style={styles.welcomeSubtitle}>Restore your previous subscription</Text>
          <Text style={styles.welcomeDesc}>
            If you have previously purchased a subscription on this device or with your Apple/Google account, you can restore it here.
          </Text>
          <Pressable 
            style={({ pressed }) => [
              styles.restoreButton, 
              pressed && styles.buttonPressed,
              isRestoring && styles.buttonDisabled
            ]}
            onPress={handleRestorePurchases}
            disabled={isRestoring}
          >
            {isRestoring ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <>
                <RefreshCw size={18} color="#FFF" />
                <Text style={styles.restoreButtonText}>Restore Purchases</Text>
              </>
            )}
          </Pressable>
          <Text style={styles.restoreNote}>
            This will check for any active subscriptions linked to your Apple or Google account
          </Text>
        </View>

        <View style={styles.noSubSection}>
          <Text style={styles.noSubTitle}>No subscription yet?</Text>
          <Text style={styles.noSubDesc}>
            View our available plans and get unlimited AI-powered lawn diagnostics.
          </Text>
          <Pressable 
            style={({ pressed }) => [styles.viewPlansButton, pressed && styles.buttonPressed]}
            onPress={() => router.push('/plans')}
          >
            <Text style={styles.viewPlansButtonText}>View All Plans</Text>
          </Pressable>
        </View>

        <View style={styles.supportSection}>
          <Text style={styles.supportText}>Having trouble restoring your purchase?</Text>
          <Pressable onPress={() => router.push('/contact-us')}>
            <Text style={styles.contactLink}>Contact Support</Text>
          </Pressable>
        </View>
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
    paddingTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 16,
  },
  activeSubBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    padding: 16,
    gap: 10,
    marginBottom: 20,
  },
  activeSubText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#FFF',
  },
  welcomeCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: Colors.light.textMuted,
    marginBottom: 12,
  },
  welcomeDesc: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  restoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.light.primary,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 25,
    minWidth: 200,
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  restoreButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#FFF',
  },
  restoreNote: {
    fontSize: 12,
    color: Colors.light.textMuted,
    textAlign: 'center',
    marginTop: 12,
  },
  noSubSection: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
  },
  noSubTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 6,
  },
  noSubDesc: {
    fontSize: 13,
    color: Colors.light.textMuted,
    textAlign: 'center',
    marginBottom: 16,
  },
  viewPlansButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: Colors.light.border,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  viewPlansButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.primary,
  },
  supportSection: {
    alignItems: 'center',
  },
  supportText: {
    fontSize: 13,
    color: Colors.light.textMuted,
    marginBottom: 4,
  },
  contactLink: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.error,
  },
});
