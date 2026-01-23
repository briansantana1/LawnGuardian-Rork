import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Eye, Leaf, FileText, Star, Check, X, Lock, Key } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useLawn } from '@/providers/LawnProvider';

export default function PlansScreen() {
  const router = useRouter();
  const { profile } = useLawn();

  const freeFeatures = [
    { text: '1 photo scan per month', available: true },
    { text: 'Basic problem identification', available: true },
    { text: 'Confidence scores', available: false },
    { text: 'Detailed diagnosis', available: false },
    { text: 'Treatment recommendations', available: false },
    { text: 'Organic & chemical options', available: false },
    { text: 'Prevention strategies', available: false },
    { text: 'History & tracking', available: false },
  ];

  const proFeatures = [
    'Unlimited photo scans',
    'AI-powered identification',
    'High-accuracy AI diagnosis',
    'Detailed diagnosis reports',
    'Treatment recommendations',
    'Organic & chemical options',
  ];

  const annualFeatures = [
    'Everything in Pro Weekly',
    'Unlimited photo scans',
    'AI-powered identification',
    'High-accuracy AI diagnosis',
    'Detailed diagnosis reports',
    'Treatment recommendations',
  ];

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Plans',
          headerShown: true,
          headerBackTitle: 'Back',
        }} 
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>Choose Your Plan</Text>
          <Text style={styles.subtitle}>Unlock the full power of AI lawn diagnostics</Text>

          <View style={styles.technologySection}>
            <Text style={styles.technologyLabel}>POWERED BY INDUSTRY-LEADING TECHNOLOGY</Text>
            <View style={styles.technologyIcons}>
              <View style={styles.techItem}>
                <View style={styles.techIcon}>
                  <Eye size={24} color={Colors.light.primary} />
                </View>
                <Text style={styles.techTitle}>Advanced AI{'\n'}Vision</Text>
                <Text style={styles.techDesc}>Expert lawn disease & weed identification</Text>
              </View>
              <View style={styles.techItem}>
                <View style={styles.techIcon}>
                  <Leaf size={24} color={Colors.light.primary} />
                </View>
                <Text style={styles.techTitle}>Weed{'\n'}Detection</Text>
                <Text style={styles.techDesc}>Identifies weeds & lawn problems</Text>
              </View>
              <View style={styles.techItem}>
                <View style={styles.techIcon}>
                  <FileText size={24} color={Colors.light.primary} />
                </View>
                <Text style={styles.techTitle}>Treatment{'\n'}Database</Text>
                <Text style={styles.techDesc}>Expert-curated organic & chemical solutions</Text>
              </View>
            </View>
          </View>

          <View style={styles.planCard}>
            <View style={styles.planHeader}>
              <Star size={20} color={Colors.light.textMuted} />
              <Text style={styles.planLabel}>Free</Text>
            </View>
            <Text style={styles.planName}>Free</Text>
            {freeFeatures.map((feature, index) => (
              <View key={index} style={styles.featureRow}>
                {feature.available ? (
                  <Check size={16} color={Colors.light.primary} />
                ) : (
                  <X size={16} color={Colors.light.textMuted} />
                )}
                <Text style={[styles.featureText, !feature.available && styles.featureTextDisabled]}>
                  {feature.text}
                </Text>
              </View>
            ))}
            <Pressable style={styles.currentPlanButton}>
              <Text style={styles.currentPlanButtonText}>Current Plan</Text>
            </Pressable>
          </View>

          <View style={[styles.planCard, styles.proCard]}>
            <View style={styles.recommendedBadge}>
              <Text style={styles.recommendedBadgeText}>RECOMMENDED</Text>
            </View>
            <View style={styles.planHeader}>
              <Key size={20} color={Colors.light.warning} />
              <Text style={styles.planLabel}>Pro Weekly</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.price}>$5.99</Text>
              <Text style={styles.pricePeriod}>/week</Text>
            </View>
            {proFeatures.map((feature, index) => (
              <View key={index} style={styles.featureRow}>
                <Check size={16} color={Colors.light.primary} />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
            <Pressable style={styles.startProButton}>
              <Text style={styles.startProButtonText}>Start Pro Weekly</Text>
            </Pressable>
            <Text style={styles.cancelText}>Cancel anytime. Keep access until period ends.</Text>
          </View>

          <View style={[styles.planCard, styles.annualCard]}>
            <View style={styles.saveBadge}>
              <Text style={styles.saveBadgeText}>Save 74%</Text>
            </View>
            <View style={styles.planHeader}>
              <Key size={20} color={Colors.light.primary} />
              <Text style={styles.planLabel}>Pro Annual</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.price}>$79.99</Text>
              <Text style={styles.pricePeriod}>/year</Text>
            </View>
            <Text style={styles.monthlyBreakdown}>$6.67/month, billed annually</Text>
            {annualFeatures.map((feature, index) => (
              <View key={index} style={styles.featureRow}>
                <Check size={16} color={Colors.light.primary} />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
            <Pressable style={styles.startAnnualButton}>
              <Text style={styles.startAnnualButtonText}>Start Pro Annual</Text>
            </Pressable>
            <Text style={styles.billingNote}>12 payments of $6.67/month billed as one payment of $79.99/year.</Text>
            <Text style={styles.cancelText}>Cancel anytime. Keep access until period ends.</Text>
          </View>

          <View style={styles.trustBadges}>
            <View style={styles.trustBadge}>
              <Lock size={14} color={Colors.light.textMuted} />
              <Text style={styles.trustBadgeText}>Secure Payment</Text>
            </View>
            <View style={styles.trustBadge}>
              <Check size={14} color={Colors.light.textMuted} />
              <Text style={styles.trustBadgeText}>Cancel Anytime</Text>
            </View>
          </View>

          <View style={styles.bottomPadding} />
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
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.light.textMuted,
    marginBottom: 24,
  },
  technologySection: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  technologyLabel: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: Colors.light.textMuted,
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  technologyIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  techItem: {
    flex: 1,
    alignItems: 'center',
  },
  techIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  techTitle: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  techDesc: {
    fontSize: 10,
    color: Colors.light.textMuted,
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  planCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  proCard: {
    borderColor: Colors.light.warning,
    borderWidth: 2,
  },
  annualCard: {
    borderColor: Colors.light.primary,
    borderWidth: 2,
  },
  recommendedBadge: {
    backgroundColor: Colors.light.warning,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  recommendedBadgeText: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: '#FFF',
  },
  saveBadge: {
    backgroundColor: '#D1FAE5',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  saveBadgeText: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: Colors.light.primary,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  planLabel: {
    fontSize: 12,
    color: Colors.light.textMuted,
  },
  planName: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  price: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  pricePeriod: {
    fontSize: 14,
    color: Colors.light.textMuted,
  },
  monthlyBreakdown: {
    fontSize: 12,
    color: Colors.light.textMuted,
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  featureText: {
    fontSize: 13,
    color: Colors.light.text,
    flex: 1,
  },
  featureTextDisabled: {
    color: Colors.light.textMuted,
    textDecorationLine: 'line-through',
  },
  currentPlanButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  currentPlanButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.textMuted,
  },
  startProButton: {
    backgroundColor: Colors.light.text,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  startProButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#FFF',
  },
  startAnnualButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  startAnnualButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#FFF',
  },
  billingNote: {
    fontSize: 11,
    color: Colors.light.textMuted,
    textAlign: 'center',
    marginTop: 12,
  },
  cancelText: {
    fontSize: 11,
    color: Colors.light.textMuted,
    textAlign: 'center',
    marginTop: 8,
  },
  trustBadges: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginTop: 8,
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trustBadgeText: {
    fontSize: 12,
    color: Colors.light.textMuted,
  },
  bottomPadding: {
    height: 40,
  },
});
