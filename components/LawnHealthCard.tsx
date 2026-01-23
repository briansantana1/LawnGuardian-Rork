import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Droplets, Leaf, Bug } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { LawnHealth } from '@/types/lawn';

interface LawnHealthCardProps {
  health: LawnHealth;
}

export default function LawnHealthCard({ health }: LawnHealthCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return Colors.light.success;
    if (score >= 60) return Colors.light.warning;
    return Colors.light.error;
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Attention';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Lawn Health</Text>
        <Text style={styles.subtitle}>Last updated: {health.lastUpdated}</Text>
      </View>
      
      <View style={styles.scoreContainer}>
        <View style={[styles.scoreCircle, { borderColor: getScoreColor(health.overallScore) }]}>
          <Text style={[styles.scoreText, { color: getScoreColor(health.overallScore) }]}>
            {health.overallScore}
          </Text>
          <Text style={styles.scoreLabel}>{getScoreLabel(health.overallScore)}</Text>
        </View>
      </View>

      <View style={styles.metricsContainer}>
        <View style={styles.metric}>
          <View style={[styles.metricIcon, { backgroundColor: '#E3F2FD' }]}>
            <Droplets size={18} color="#2196F3" />
          </View>
          <View style={styles.metricInfo}>
            <Text style={styles.metricLabel}>Moisture</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${health.moisture}%`, backgroundColor: '#2196F3' }]} />
            </View>
          </View>
          <Text style={styles.metricValue}>{health.moisture}%</Text>
        </View>

        <View style={styles.metric}>
          <View style={[styles.metricIcon, { backgroundColor: '#E8F5E9' }]}>
            <Leaf size={18} color={Colors.light.primary} />
          </View>
          <View style={styles.metricInfo}>
            <Text style={styles.metricLabel}>Density</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${health.grassDensity}%`, backgroundColor: Colors.light.primary }]} />
            </View>
          </View>
          <Text style={styles.metricValue}>{health.grassDensity}%</Text>
        </View>

        <View style={styles.metric}>
          <View style={[styles.metricIcon, { backgroundColor: '#FFF3E0' }]}>
            <Bug size={18} color="#FF9800" />
          </View>
          <View style={styles.metricInfo}>
            <Text style={styles.metricLabel}>Weeds</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${health.weedLevel}%`, backgroundColor: '#FF9800' }]} />
            </View>
          </View>
          <Text style={styles.metricValue}>{health.weedLevel}%</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.surface,
    borderRadius: 20,
    padding: 20,
    shadowColor: Colors.light.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.light.textMuted,
    marginTop: 2,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.surfaceAlt,
  },
  scoreText: {
    fontSize: 32,
    fontWeight: '800' as const,
  },
  scoreLabel: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  metricsContainer: {
    gap: 12,
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metricIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricInfo: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.light.surfaceAlt,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
    width: 40,
    textAlign: 'right',
  },
});
