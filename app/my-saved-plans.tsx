import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { FileText, FolderOpen, ArrowRight, Trash2 } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useLawn } from '@/providers/LawnProvider';
import { SavedPlan } from '@/types/lawn';

export default function MySavedPlansScreen() {
  const router = useRouter();
  const { savedPlans, deleteSavedPlan } = useLawn();
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getSeverityStyles = (severity?: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'high':
        return { bg: '#FEE2E2', text: '#DC2626' };
      case 'medium':
        return { bg: '#FEF3C7', text: '#D97706' };
      case 'low':
      default:
        return { bg: '#D1FAE5', text: '#059669' };
    }
  };

  const handleDeletePlan = (plan: SavedPlan) => {
    Alert.alert(
      'Delete Plan',
      `Are you sure you want to delete "${plan.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteSavedPlan(plan.id)
        },
      ]
    );
  };

  const handleViewPlan = (plan: SavedPlan) => {
    setSelectedPlanId(plan.id);
  };

  const selectedPlan = savedPlans.find(p => p.id === selectedPlanId);

  if (selectedPlan) {
    return (
      <View style={styles.container}>
        <Stack.Screen 
          options={{ 
            title: 'Treatment Plan',
            headerShown: true,
            headerBackTitle: 'Back',
          }} 
        />
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.detailContent}>
            <View style={styles.detailHeader}>
              <View style={styles.detailIconContainer}>
                <FolderOpen size={24} color="#D97706" />
              </View>
              <View style={styles.detailHeaderText}>
                <Text style={styles.detailTitle}>{selectedPlan.title}</Text>
                <Text style={styles.detailDate}>{formatDate(selectedPlan.createdAt)}</Text>
              </View>
              {selectedPlan.severity && (
                <View style={[
                  styles.severityBadgeLarge,
                  { backgroundColor: getSeverityStyles(selectedPlan.severity).bg }
                ]}>
                  <Text style={[
                    styles.severityBadgeTextLarge,
                    { color: getSeverityStyles(selectedPlan.severity).text }
                  ]}>
                    {selectedPlan.severity}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Diagnosis</Text>
              <Text style={styles.detailSectionText}>{selectedPlan.diagnosis}</Text>
            </View>

            {selectedPlan.treatment && (
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Treatment Plan</Text>
                <Text style={styles.detailSectionText}>{selectedPlan.treatment}</Text>
              </View>
            )}

            <View style={styles.detailActions}>
              <Pressable 
                style={styles.backToListButton}
                onPress={() => setSelectedPlanId(null)}
              >
                <Text style={styles.backToListButtonText}>Back to List</Text>
              </Pressable>
              <Pressable 
                style={styles.deleteButton}
                onPress={() => handleDeletePlan(selectedPlan)}
              >
                <Trash2 size={18} color="#DC2626" />
                <Text style={styles.deleteButtonText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'My Saved Plans',
          headerShown: true,
          headerBackTitle: 'Back',
        }} 
      />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
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
              {savedPlans.map((plan) => {
                const severityStyle = getSeverityStyles(plan.severity);
                return (
                  <Pressable 
                    key={plan.id} 
                    style={({ pressed }) => [
                      styles.planCard, 
                      pressed && styles.planCardPressed
                    ]}
                    onPress={() => handleViewPlan(plan)}
                  >
                    <View style={styles.planCardHeader}>
                      <View style={styles.planCardLeft}>
                        <View style={styles.planIconContainer}>
                          <FolderOpen size={20} color="#D97706" />
                        </View>
                        <View style={styles.planHeaderText}>
                          <Text style={styles.planTitle} numberOfLines={1}>
                            {plan.title}
                          </Text>
                          <Text style={styles.planDate}>
                            {formatDate(plan.createdAt)}
                          </Text>
                        </View>
                      </View>
                      {plan.severity && (
                        <View style={[
                          styles.severityBadge,
                          { backgroundColor: severityStyle.bg }
                        ]}>
                          <Text style={[
                            styles.severityBadgeText,
                            { color: severityStyle.text }
                          ]}>
                            {plan.severity}
                          </Text>
                        </View>
                      )}
                    </View>
                    
                    <Text style={styles.planDiagnosis} numberOfLines={2}>
                      {plan.diagnosis}
                    </Text>

                    <View style={styles.planCardFooter}>
                      <View style={styles.viewPlanLink}>
                        <ArrowRight size={14} color={Colors.light.primary} />
                        <Text style={styles.viewPlanText}>View Treatment Plan</Text>
                      </View>
                      <Pressable 
                        style={styles.deleteIconButton}
                        onPress={(e) => {
                          e.stopPropagation();
                          handleDeletePlan(plan);
                        }}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <Trash2 size={16} color={Colors.light.textMuted} />
                      </Pressable>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
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
    gap: 16,
  },
  planCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  planCardPressed: {
    backgroundColor: '#F9FAFB',
  },
  planCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  planCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  planIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  planHeaderText: {
    flex: 1,
    paddingRight: 8,
  },
  planTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 2,
  },
  planDate: {
    fontSize: 13,
    color: Colors.light.textMuted,
  },
  severityBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  severityBadgeText: {
    fontSize: 12,
    fontWeight: '600' as const,
    textTransform: 'capitalize' as const,
  },
  planDiagnosis: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
    marginBottom: 14,
  },
  planCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  viewPlanLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  viewPlanText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.light.primary,
  },
  deleteIconButton: {
    padding: 4,
  },
  detailContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  detailIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  detailHeaderText: {
    flex: 1,
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  detailDate: {
    fontSize: 14,
    color: Colors.light.textMuted,
  },
  severityBadgeLarge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 8,
  },
  severityBadgeTextLarge: {
    fontSize: 13,
    fontWeight: '600' as const,
    textTransform: 'capitalize' as const,
  },
  detailSection: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  detailSectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 10,
  },
  detailSectionText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 22,
  },
  detailActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  backToListButton: {
    flex: 1,
    backgroundColor: Colors.light.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  backToListButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#FFF',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FEE2E2',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  deleteButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#DC2626',
  },
});
