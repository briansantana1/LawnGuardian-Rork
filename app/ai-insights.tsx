import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, AlertTriangle, Check, Droplet, Scissors, Bug, Leaf, Sun, Shield } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useLawn } from '@/providers/LawnProvider';

export default function AIInsightsScreen() {
  const router = useRouter();
  const { aiInsights, weather, lawnHealth, profile } = useLawn();

  const getRiskLevel = () => {
    const score = lawnHealth.overallScore;
    if (score >= 80) return { level: 'low', label: 'LOW RISK', color: '#059669', bg: '#D1FAE5' };
    if (score >= 60) return { level: 'medium', label: 'MEDIUM RISK', color: '#D97706', bg: '#FEF3C7' };
    return { level: 'high', label: 'HIGH RISK', color: '#DC2626', bg: '#FEE2E2' };
  };

  const risk = getRiskLevel();
  const issueCount = aiInsights.filter(i => i.priority === 'medium' || i.priority === 'high').length;

  const getActionIcon = (icon: string) => {
    switch (icon) {
      case 'droplet': return <Droplet size={20} color="#D97706" />;
      case 'scissors': return <Scissors size={20} color="#DC2626" />;
      case 'alert-triangle': return <AlertTriangle size={20} color="#D97706" />;
      case 'bug': return <Bug size={20} color="#DC2626" />;
      case 'leaf': return <Leaf size={20} color={Colors.light.primary} />;
      default: return <AlertTriangle size={20} color="#D97706" />;
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'high': return { color: '#DC2626', bg: '#FEE2E2', label: 'HIGH' };
      case 'medium': return { color: '#D97706', bg: '#FEF3C7', label: 'MEDIUM' };
      default: return { color: '#059669', bg: '#D1FAE5', label: 'LOW' };
    }
  };

  const recommendedActions = [
    {
      id: '1',
      title: 'Treat Dandelion Weed Infestation',
      description: 'Remove the seed head immediately by cutting or pulling it off to prevent seed dispersal',
      priority: 'medium',
      icon: 'leaf',
    },
    {
      id: '2',
      title: 'Adjust Watering Schedule',
      description: 'Reduce watering frequency due to cool temperatures and high humidity levels',
      priority: 'medium',
      icon: 'droplet',
    },
    {
      id: '3',
      title: 'Monitor for Brown Patch Disease',
      description: 'High humidity creates favorable conditions for fungal diseases - inspect regularly',
      priority: 'high',
      icon: 'alert-triangle',
    },
    {
      id: '4',
      title: 'Raise Mowing Height',
      description: 'Keep grass at 3-4 inches to promote deeper roots and shade out weeds',
      priority: 'low',
      icon: 'scissors',
    },
    {
      id: '5',
      title: 'Apply Pre-Emergent Herbicide',
      description: 'Soil temperature indicates it\'s time for pre-emergent application to prevent crabgrass',
      priority: 'medium',
      icon: 'shield',
    },
  ];

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color={Colors.light.text} />
          </Pressable>
          <Text style={styles.headerTitle}>AI Insights</Text>
          <View style={styles.headerPlaceholder} />
        </View>
      </SafeAreaView>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.titleSection}>
            <Text style={styles.mainTitle}>AI Lawn Insights</Text>
            <Text style={styles.subtitle}>Personalized recommendations based on your lawn analysis</Text>
          </View>

          <View style={[styles.riskBadge, { backgroundColor: risk.bg }]}>
            <AlertTriangle size={14} color={risk.color} />
            <Text style={[styles.riskBadgeText, { color: risk.color }]}>{risk.label}</Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryText}>
              Your lawn has some concerns. We found {issueCount} moderate issue(s) to monitor and treat.
            </Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{lawnHealth.overallScore}%</Text>
              <Text style={styles.statLabel}>Health Score</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{weather.humidity}%</Text>
              <Text style={styles.statLabel}>Humidity</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{weather.temperature}°F</Text>
              <Text style={styles.statLabel}>Temperature</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Recommended Actions</Text>

          {recommendedActions.map((action) => {
            const priorityStyle = getPriorityStyle(action.priority);
            return (
              <View key={action.id} style={styles.actionCard}>
                <View style={[styles.actionIconContainer, { backgroundColor: priorityStyle.bg }]}>
                  {action.icon === 'shield' ? (
                    <Shield size={20} color={priorityStyle.color} />
                  ) : (
                    getActionIcon(action.icon)
                  )}
                </View>
                <View style={styles.actionContent}>
                  <View style={styles.actionHeader}>
                    <Text style={styles.actionTitle}>{action.title}</Text>
                    <View style={[styles.priorityBadge, { backgroundColor: priorityStyle.bg }]}>
                      <Text style={[styles.priorityText, { color: priorityStyle.color }]}>
                        {priorityStyle.label}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.actionDescription}>{action.description}</Text>
                </View>
              </View>
            );
          })}

          <View style={styles.tipsSection}>
            <Text style={styles.sectionTitle}>Quick Tips</Text>
            <View style={styles.tipCard}>
              <View style={styles.tipIconContainer}>
                <Sun size={18} color="#F59E0B" />
              </View>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Best Time to Water</Text>
                <Text style={styles.tipDescription}>
                  Water early morning (6-10 AM) to reduce evaporation and fungal growth
                </Text>
              </View>
            </View>
            <View style={styles.tipCard}>
              <View style={styles.tipIconContainer}>
                <Scissors size={18} color={Colors.light.primary} />
              </View>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Mowing Best Practice</Text>
                <Text style={styles.tipDescription}>
                  Never remove more than 1/3 of grass blade height in a single mowing
                </Text>
              </View>
            </View>
          </View>

          <Pressable 
            style={styles.scanButton}
            onPress={() => router.push('/(tabs)/scan')}
          >
            <Text style={styles.scanButtonText}>Scan for New Issues</Text>
          </Pressable>

          <View style={styles.bottomPadding} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7F5',
  },
  safeArea: {
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.light.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  headerPlaceholder: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  titleSection: {
    marginBottom: 16,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },
  riskBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 6,
    marginBottom: 16,
  },
  riskBadgeText: {
    fontSize: 12,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
  },
  summaryCard: {
    backgroundColor: '#FEF9E7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  summaryText: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 22,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.light.textMuted,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: Colors.light.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 16,
  },
  actionCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  actionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  actionContent: {
    flex: 1,
  },
  actionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.text,
    flex: 1,
    paddingRight: 8,
  },
  priorityBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '700' as const,
    letterSpacing: 0.3,
  },
  actionDescription: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    lineHeight: 19,
  },
  tipsSection: {
    marginTop: 12,
    marginBottom: 24,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  tipIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    lineHeight: 18,
  },
  scanButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  scanButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFF',
  },
  bottomPadding: {
    height: 40,
  },
});
