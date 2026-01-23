import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { FileText, Camera } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useLawn } from '@/providers/LawnProvider';

export default function MySavedPlansScreen() {
  const router = useRouter();
  const { savedPlans } = useLawn();

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'My Saved Plans',
          headerShown: true,
          headerBackTitle: 'Back',
        }} 
      />
      <View style={styles.content}>
        <Text style={styles.title}>My Saved Plans</Text>

        {savedPlans.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <FileText size={32} color={Colors.light.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>No Saved Plans</Text>
            <Text style={styles.emptySubtitle}>
              Your saved diagnoses and treatment plans will appear here.
            </Text>
            <Pressable 
              style={({ pressed }) => [styles.startScanButton, pressed && styles.buttonPressed]}
              onPress={() => router.push('/(tabs)/scan')}
            >
              <Text style={styles.startScanButtonText}>Start Your First Scan</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.plansList}>
            {savedPlans.map((plan) => (
              <View key={plan.id} style={styles.planCard}>
                <Text style={styles.planTitle}>{plan.title}</Text>
                <Text style={styles.planDiagnosis}>{plan.diagnosis}</Text>
                <Text style={styles.planDate}>
                  Saved on {new Date(plan.createdAt).toLocaleDateString()}
                </Text>
              </View>
            ))}
          </View>
        )}
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
    marginBottom: 20,
  },
  emptyCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.light.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  startScanButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  startScanButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#FFF',
  },
  plansList: {
    gap: 12,
  },
  planCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
  },
  planTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  planDiagnosis: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 8,
  },
  planDate: {
    fontSize: 12,
    color: Colors.light.textMuted,
  },
});
