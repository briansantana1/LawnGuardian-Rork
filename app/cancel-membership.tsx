import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { AlertTriangle, X } from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function CancelMembershipScreen() {
  const router = useRouter();

  const handleConfirmCancel = () => {
    Alert.alert(
      'Membership Cancelled',
      'Your membership has been cancelled. You will retain access until the end of your current billing period.',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Cancel Membership',
          headerShown: true,
          headerBackTitle: 'Back',
        }} 
      />
      <View style={styles.content}>
        <Text style={styles.title}>Cancel Membership</Text>

        <View style={styles.warningCard}>
          <View style={styles.warningIcon}>
            <AlertTriangle size={28} color={Colors.light.warning} />
          </View>
          <Text style={styles.warningTitle}>Are you sure?</Text>
          <Text style={styles.warningSubtitle}>This action cannot be undone</Text>
        </View>

        <Text style={styles.consequencesTitle}>By cancelling your membership, you will:</Text>

        <View style={styles.consequenceItem}>
          <View style={styles.consequenceNumber}>
            <Text style={styles.consequenceNumberText}>1</Text>
          </View>
          <Text style={styles.consequenceText}>
            Lose access to your scans, diagnoses, and treatment plans
          </Text>
        </View>

        <View style={styles.consequenceItem}>
          <View style={styles.consequenceX}>
            <X size={14} color={Colors.light.error} />
          </View>
          <Text style={styles.consequenceText}>
            Be downgraded to the Free Plan
          </Text>
        </View>

        <Pressable 
          style={({ pressed }) => [styles.confirmButton, pressed && styles.buttonPressed]}
          onPress={handleConfirmCancel}
        >
          <Text style={styles.confirmButtonText}>Confirm Cancellation</Text>
        </Pressable>

        <Pressable 
          style={({ pressed }) => [styles.keepButton, pressed && styles.buttonPressed]}
          onPress={() => router.back()}
        >
          <Text style={styles.keepButtonText}>Keep My Membership</Text>
        </Pressable>
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
    marginBottom: 24,
  },
  warningCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  warningIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  warningSubtitle: {
    fontSize: 14,
    color: Colors.light.textMuted,
  },
  consequencesTitle: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.light.text,
    marginBottom: 16,
  },
  consequenceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  consequenceNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  consequenceNumberText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.light.textSecondary,
  },
  consequenceX: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  consequenceText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    flex: 1,
    lineHeight: 20,
  },
  confirmButton: {
    backgroundColor: Colors.light.error,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFF',
  },
  keepButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: Colors.light.border,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  keepButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.primary,
  },
});
