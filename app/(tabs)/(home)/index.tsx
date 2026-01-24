import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ImageBackground, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Camera, Zap, Search, Leaf, Shield, Sun, Scissors, Bell, ChevronRight, RefreshCw, AlertCircle, Droplet, AlertTriangle, Calendar, Cloud } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useLawn } from '@/providers/LawnProvider';

const { width } = Dimensions.get('window');

const GRASS_IMAGE = 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/66icr37rc219wnzeky2o6';

export default function HomeScreen() {
  const router = useRouter();
  const { profile, weather, soilTemperatures, aiInsights, tips, refreshAiInsights, isRefreshingInsights } = useLawn();

  const getSoilTempColor = (temp: number) => {
    if (temp >= 70) return '#F87171';
    if (temp >= 55) return '#FBBF24';
    return '#A3E635';
  };

  const getSoilTempLabel = (temp: number) => {
    if (temp >= 70) return 'Grub Active';
    if (temp >= 55) return 'Pre-emergent';
    return 'Dormant';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return Colors.light.error;
      case 'medium': return Colors.light.warning;
      default: return Colors.light.primary;
    }
  };

  const getInsightIcon = (iconName: string) => {
    switch (iconName) {
      case 'droplet': return <Droplet size={20} color={Colors.light.warning} />;
      case 'scissors': return <Scissors size={20} color={Colors.light.error} />;
      case 'alert-triangle': return <AlertTriangle size={20} color={Colors.light.warning} />;
      default: return <AlertCircle size={20} color={Colors.light.primary} />;
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ImageBackground source={{ uri: GRASS_IMAGE }} style={styles.heroSection} resizeMode="cover">
        <View style={styles.heroOverlay}>
          <SafeAreaView edges={['top']}>
            <View style={styles.headerRow}>
              <Image 
                source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/ccbx1jhd1l7c22g03kime' }} 
                style={styles.logoIcon} 
                resizeMode="contain"
              />
              <Text style={styles.brandName}>Lawn Guardian</Text>
            </View>

            <View style={styles.badgeRow}>
              <Zap size={14} color={Colors.light.primary} />
              <Text style={styles.badgeText}>AI-Powered</Text>
              <Text style={styles.badgeDot}>•</Text>
              <Text style={styles.badgeText}>Expert Diagnosis</Text>
            </View>

            <Text style={styles.heroTitle}>Get Outside and Touch Grass Again</Text>
            <Text style={styles.heroSubtitle}>
              Scan, diagnose, and fix lawn problems in seconds. Our AI identifies diseases and weeds — then gives you the perfect treatment plan.
            </Text>

            <Pressable 
              style={({ pressed }) => [styles.scanButton, pressed && styles.buttonPressed]}
              onPress={() => router.push('/(tabs)/scan')}
            >
              <Camera size={20} color="#FFF" />
              <Text style={styles.scanButtonText}>Scan Your Lawn</Text>
            </Pressable>

            <View style={styles.featureBadges}>
              <View style={styles.featureBadge}>
                <Zap size={12} color={Colors.light.primary} />
                <Text style={styles.featureBadgeText}>AI-Powered</Text>
              </View>
              <View style={styles.featureBadge}>
                <Search size={12} color={Colors.light.error} />
                <Text style={styles.featureBadgeText}>Disease Detection</Text>
              </View>
              <View style={styles.featureBadge}>
                <Leaf size={12} color={Colors.light.primary} />
                <Text style={styles.featureBadgeText}>Weed Detection</Text>
              </View>
              <View style={styles.featureBadge}>
                <Shield size={12} color={Colors.light.primary} />
                <Text style={styles.featureBadgeText}>Expert Treatments</Text>
              </View>
            </View>

            <Text style={styles.worksWithText}>Works with all grass types</Text>
          </SafeAreaView>
        </View>
      </ImageBackground>

      <View style={styles.contentSection}>
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeIcon}>
            <View style={styles.userIconCircle}>
              <Text style={styles.userIconText}>👤</Text>
            </View>
          </View>
          <Text style={styles.welcomeTitle}>Welcome back!</Text>
          <Text style={styles.welcomeSubtitle}>Ready to check on your lawn?</Text>
          <Pressable 
            style={({ pressed }) => [styles.startScanButton, pressed && styles.buttonPressed]}
            onPress={() => router.push('/(tabs)/scan')}
          >
            <Camera size={18} color="#FFF" />
            <Text style={styles.startScanButtonText}>Start Lawn Scan</Text>
          </Pressable>
        </View>

        {tips.map((tip, index) => (
          <View key={tip.id} style={styles.tipCard}>
            <View style={[styles.tipIcon, { backgroundColor: index === 0 ? '#FEF3C7' : '#DBEAFE' }]}>
              {index === 0 ? <Sun size={20} color="#F59E0B" /> : <Scissors size={20} color="#3B82F6" />}
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>{tip.title}</Text>
              <Text style={styles.tipDescription}>{tip.description}</Text>
            </View>
          </View>
        ))}

        <Pressable 
          style={({ pressed }) => [styles.aiInsightsLink, pressed && styles.buttonPressed]}
          onPress={() => router.push('/ai-insights')}
        >
          <Zap size={16} color={Colors.light.primary} />
          <Text style={styles.aiInsightsLinkText}>Get AI Insights</Text>
        </Pressable>

        <View style={styles.weatherCard}>
          <Text style={styles.weatherLocation}>{weather.location}</Text>
          <View style={styles.weatherMain}>
            <Text style={styles.weatherTemp}>{weather.temperature}°F</Text>
            <Cloud size={40} color="#9CA3AF" />
          </View>
          <Text style={styles.weatherHigh}>High: {weather.highTemp}°F</Text>
          <Text style={styles.weatherCondition}>Clear Sky</Text>
          <View style={styles.weatherFeelsLike}>
            <Text style={styles.feelsLikeIcon}>🌡</Text>
            <Text style={styles.feelsLikeText}>Feels like {weather.feelsLike}°F</Text>
          </View>

          <View style={styles.weatherStats}>
            <View style={styles.weatherStat}>
              <Sun size={20} color="#F59E0B" />
              <Text style={styles.weatherStatLabel}>UV Index</Text>
              <Text style={styles.weatherStatValue}>{weather.uvIndex}</Text>
            </View>
            <View style={styles.weatherStat}>
              <Droplet size={20} color="#3B82F6" />
              <Text style={styles.weatherStatLabel}>Precip</Text>
              <Text style={styles.weatherStatValue}>{weather.precipitation}</Text>
            </View>
            <View style={styles.weatherStat}>
              <View style={styles.pressureIcon}>
                <Text style={styles.pressureIconText}>≡</Text>
              </View>
              <Text style={styles.weatherStatLabel}>Pressure</Text>
              <Text style={styles.weatherStatValue}>{weather.pressure}</Text>
            </View>
          </View>
        </View>

        <View style={styles.soilTempSection}>
          <View style={styles.soilTempHeader}>
            <Text style={styles.soilTempTitle}>Soil Temperature Trend (7 Days)</Text>
            <View style={styles.soilTempTrend}>
              <Text style={styles.trendArrow}>↗</Text>
              <Text style={styles.trendText}>Rising</Text>
            </View>
          </View>

          <View style={styles.soilTempLegend}>
            <View style={[styles.legendBadge, { backgroundColor: '#FEE2E2' }]}>
              <Text style={[styles.legendText, { color: '#DC2626' }]}>70°+ Grub Active</Text>
            </View>
            <View style={[styles.legendBadge, { backgroundColor: '#FEF3C7' }]}>
              <Text style={[styles.legendText, { color: '#B45309' }]}>55-70° Pre-emergent</Text>
            </View>
            <View style={[styles.legendBadge, { backgroundColor: '#F3F4F6' }]}>
              <Text style={[styles.legendText, { color: '#4B5563' }]}>&lt;55° Dormant</Text>
            </View>
          </View>

          <View style={styles.soilTempChart}>
            {soilTemperatures.map((item, index) => (
              <View key={index} style={styles.soilTempBar}>
                <Text style={styles.soilTempValue}>{item.temp}°</Text>
                <View style={[styles.tempBar, { backgroundColor: getSoilTempColor(item.temp), height: Math.max(20, (item.temp - 40) * 2) }]} />
                <Text style={styles.soilTempDay}>{item.day}</Text>
                <Text style={styles.soilTempDate}>{item.date}</Text>
              </View>
            ))}
          </View>

          <View style={styles.soilInsightBox}>
            <Text style={styles.soilInsightLabel}>Insight:</Text>
            <Text style={styles.soilInsightText}> Soil is cool - grass is dormant or slow growing. Avoid fertilizing until temperatures rise.</Text>
          </View>
        </View>

        <View style={styles.aiInsightsSection}>
          <View style={styles.aiInsightsHeader}>
            <View>
              <Text style={styles.aiInsightsTitle}>AI Lawn{'\n'}Insights</Text>
              <View style={styles.riskBadge}>
                <Text style={styles.riskBadgeText}>MEDIUM RISK</Text>
              </View>
              <Text style={styles.aiPoweredLabel}>AI-powered analysis</Text>
            </View>
            <Pressable 
              style={({ pressed }) => [styles.refreshButton, pressed && styles.buttonPressed]}
              onPress={refreshAiInsights}
              disabled={isRefreshingInsights}
            >
              <RefreshCw 
                size={16} 
                color={isRefreshingInsights ? Colors.light.textMuted : Colors.light.primary} 
                style={isRefreshingInsights ? { opacity: 0.6 } : undefined}
              />
              <Text style={[styles.refreshText, isRefreshingInsights && { color: Colors.light.textMuted }]}>
                {isRefreshingInsights ? 'Refreshing...' : 'Refresh'}
              </Text>
            </Pressable>
          </View>

          <Text style={styles.aiInsightsSummary}>
            Current cool temperatures and high humidity present moderate risks for lawn health.
          </Text>

          <View style={styles.aiWarningBox}>
            <AlertCircle size={16} color={Colors.light.warning} />
            <Text style={styles.aiWarningText}>
              Cool temperatures may slow grass growth; ensure other lawn care activities are adjusted accordingly.
            </Text>
          </View>

          {aiInsights.map((insight) => (
            <View key={insight.id} style={styles.insightCard}>
              <View style={[styles.insightIconContainer, { backgroundColor: insight.priority === 'high' ? '#FEE2E2' : '#FEF3C7' }]}>
                {getInsightIcon(insight.icon)}
              </View>
              <View style={styles.insightContent}>
                <View style={styles.insightHeader}>
                  <Text style={styles.insightTitle}>{insight.title}</Text>
                  <Text style={[styles.insightPriority, { color: getPriorityColor(insight.priority) }]}>
                    {insight.priority}
                  </Text>
                </View>
                <Text style={styles.insightDescription}>{insight.description}</Text>
              </View>
            </View>
          ))}
        </View>

        <Text style={styles.everythingTitle}>Everything You Need</Text>

        <View style={styles.featureCard}>
          <View style={styles.featureCardIcon}>
            <Camera size={24} color={Colors.light.primary} />
          </View>
          <Text style={styles.featureCardTitle}>AI Photo Scan</Text>
          <Text style={styles.featureCardDesc}>Upload a photo and get instant diagnosis of lawn problems</Text>
        </View>

        <View style={styles.featureCard}>
          <View style={styles.featureCardIcon}>
            <Sun size={24} color={Colors.light.warning} />
          </View>
          <Text style={styles.featureCardTitle}>Weather Insights</Text>
          <Text style={styles.featureCardDesc}>Track soil temperature and get treatment timing recommendations</Text>
        </View>

        <View style={styles.featureCard}>
          <View style={styles.featureCardIcon}>
            <Calendar size={24} color={Colors.light.primary} />
          </View>
          <Text style={styles.featureCardTitle}>Treatment Tracker</Text>
          <Text style={styles.featureCardDesc}>Log treatments and schedule upcoming lawn care tasks</Text>
        </View>

        <View style={styles.notificationCard}>
          <View style={styles.notificationIcon}>
            <Bell size={24} color="#FFF" />
          </View>
          <View style={styles.notificationContent}>
            <Text style={styles.notificationTitle}>Enable Smart Notifications</Text>
            <Text style={styles.notificationDesc}>Get alerts when conditions favor disease or weeds</Text>
          </View>
          <Pressable style={styles.enableButton}>
            <Text style={styles.enableButtonText}>Enable</Text>
          </Pressable>
        </View>

        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>Ready to restore your lawn?</Text>
          <Text style={styles.ctaSubtitle}>Join thousands of homeowners using AI to keep their lawns healthy.</Text>
          <Pressable 
            style={({ pressed }) => [styles.ctaButton, pressed && styles.buttonPressed]}
            onPress={() => router.push('/(tabs)/scan')}
          >
            <Text style={styles.ctaButtonText}>Get Started Free</Text>
            <ChevronRight size={18} color="#FFF" />
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Pressable onPress={() => router.push('/privacy-policy')}>
            <Text style={styles.footerLink}>Privacy Policy</Text>
          </Pressable>
          <Text style={styles.footerDot}>·</Text>
          <Pressable onPress={() => router.push('/terms-of-use')}>
            <Text style={styles.footerLink}>Terms of Use</Text>
          </Pressable>
        </View>
        <Text style={styles.copyright}>© 2026 Lawn Guardian™. All rights reserved.</Text>

        <View style={styles.bottomPadding} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  heroSection: {
    width: '100%',
    minHeight: 520,
  },
  heroOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  logoContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  logoIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    marginRight: 10,
  },
  brandName: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  badgeText: {
    fontSize: 12,
    color: '#FFFFFF',
    marginLeft: 4,
  },
  badgeDot: {
    fontSize: 12,
    color: Colors.light.textMuted,
    marginHorizontal: 8,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800' as const,
    color: '#FFFFFF',
    marginBottom: 12,
    lineHeight: 38,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 15,
    color: '#FFFFFF',
    lineHeight: 22,
    marginBottom: 24,
    textAlign: 'center',
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignSelf: 'center',
    gap: 10,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  scanButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFF',
  },
  featureBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 24,
    justifyContent: 'center',
  },
  featureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 20,
    gap: 4,
  },
  featureBadgeText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500' as const,
  },
  worksWithText: {
    fontSize: 12,
    color: '#FFFFFF',
    marginTop: 16,
    textAlign: 'center',
  },
  contentSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
    backgroundColor: Colors.light.background,
  },
  welcomeCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  welcomeIcon: {
    marginBottom: 12,
  },
  userIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userIconText: {
    fontSize: 24,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: Colors.light.textMuted,
    marginBottom: 16,
  },
  startScanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    gap: 8,
  },
  startScanButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#FFF',
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  tipIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    lineHeight: 18,
  },
  aiInsightsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    marginBottom: 16,
  },
  aiInsightsLinkText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.primary,
  },
  weatherCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  weatherLocation: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.primary,
    marginBottom: 8,
  },
  weatherMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  weatherTemp: {
    fontSize: 48,
    fontWeight: '300' as const,
    color: Colors.light.text,
  },
  weatherHigh: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: 4,
  },
  weatherCondition: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: Colors.light.text,
    marginTop: 4,
  },
  weatherFeelsLike: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  feelsLikeIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  feelsLikeText: {
    fontSize: 13,
    color: Colors.light.textMuted,
  },
  weatherStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  weatherStat: {
    alignItems: 'center',
  },
  weatherStatLabel: {
    fontSize: 12,
    color: Colors.light.textMuted,
    marginTop: 6,
  },
  weatherStatValue: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginTop: 2,
  },
  pressureIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressureIconText: {
    fontSize: 20,
    color: '#6B7280',
  },
  soilTempSection: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  soilTempHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  soilTempTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  soilTempTrend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendArrow: {
    fontSize: 14,
    color: Colors.light.primary,
    marginRight: 4,
  },
  trendText: {
    fontSize: 13,
    color: Colors.light.primary,
    fontWeight: '500' as const,
  },
  soilTempLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  legendBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  legendText: {
    fontSize: 11,
    fontWeight: '500' as const,
  },
  soilTempChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 100,
    marginBottom: 16,
  },
  soilTempBar: {
    alignItems: 'center',
    flex: 1,
  },
  soilTempValue: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  tempBar: {
    width: 28,
    borderRadius: 4,
    marginBottom: 8,
  },
  soilTempDay: {
    fontSize: 11,
    color: Colors.light.textSecondary,
  },
  soilTempDate: {
    fontSize: 10,
    color: Colors.light.textMuted,
  },
  soilInsightBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  soilInsightLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#92400E',
  },
  soilInsightText: {
    fontSize: 13,
    color: '#92400E',
    flex: 1,
  },
  aiInsightsSection: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  aiInsightsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  aiInsightsTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.light.primary,
    lineHeight: 28,
  },
  riskBadge: {
    backgroundColor: '#FEF3C7',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  riskBadgeText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: '#B45309',
  },
  aiPoweredLabel: {
    fontSize: 12,
    color: Colors.light.textMuted,
    marginTop: 6,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  refreshText: {
    fontSize: 13,
    color: Colors.light.primary,
    fontWeight: '500' as const,
  },
  aiInsightsSummary: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  aiWarningBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 16,
  },
  aiWarningText: {
    fontSize: 13,
    color: '#92400E',
    flex: 1,
    lineHeight: 18,
  },
  insightCard: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  insightIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  insightPriority: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
  insightDescription: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    lineHeight: 18,
  },
  everythingTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.light.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  featureCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  featureCardIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureCardTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  featureCardDesc: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    lineHeight: 18,
  },
  notificationCard: {
    backgroundColor: Colors.light.primary,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  notificationIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#FFF',
    marginBottom: 2,
  },
  notificationDesc: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  enableButton: {
    backgroundColor: '#FFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  enableButtonText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.light.primary,
  },
  ctaSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  ctaTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  ctaSubtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.primary,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 25,
    gap: 6,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFF',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  footerLink: {
    fontSize: 13,
    color: Colors.light.textMuted,
  },
  footerDot: {
    fontSize: 13,
    color: Colors.light.textMuted,
    marginHorizontal: 8,
  },
  copyright: {
    fontSize: 12,
    color: Colors.light.textMuted,
    textAlign: 'center',
    marginTop: 8,
  },
  bottomPadding: {
    height: 40,
  },
});
