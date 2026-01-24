import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { Camera, MapPin, Shield, User, Lock } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { trpc } from '@/lib/trpc';

type IconType = 'camera' | 'mapPin' | 'shield' | 'user';

const iconMap: Record<IconType, React.ComponentType<{ size: number; color: string }>> = {
  camera: Camera,
  mapPin: MapPin,
  shield: Shield,
  user: User,
};

export default function PrivacyPolicyScreen() {
  const { data: policy, isLoading, error } = trpc.legal.getPrivacyPolicy.useQuery();

  const renderIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as IconType];
    if (!IconComponent) return null;
    return <IconComponent size={20} color={Colors.light.primary} />;
  };

  const renderBullet = (bullet: { bold?: string; text: string }, index: number) => (
    <Text key={index} style={styles.bulletItem}>
      {bullet.bold ? (
        <>
          <Text style={styles.bulletBold}>{bullet.bold}</Text> {bullet.text}
        </>
      ) : (
        `• ${bullet.text}`
      )}
    </Text>
  );

  const renderSubsection = (subsection: any, index: number) => (
    <View key={index}>
      <Text style={styles.subSectionTitle}>{subsection.title}</Text>
      {subsection.content && <Text style={styles.paragraph}>{subsection.content}</Text>}
      {subsection.bullets && (
        <View style={styles.bulletList}>
          {subsection.bullets.map((bullet: any, bIndex: number) => renderBullet(bullet, bIndex))}
        </View>
      )}
    </View>
  );

  const renderSection = (section: any, index: number) => (
    <View key={index}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      {section.content && <Text style={styles.paragraph}>{section.content}</Text>}
      {section.bullets && (
        <View style={styles.bulletList}>
          {section.bullets.map((bullet: any, bIndex: number) => renderBullet(bullet, bIndex))}
        </View>
      )}
      {section.subsections?.map((sub: any, sIndex: number) => renderSubsection(sub, sIndex))}
      {section.infoBox && typeof section.infoBox === 'string' && (
        <View style={styles.infoBox}>
          <Lock size={16} color={Colors.light.primary} />
          <Text style={styles.infoBoxText}>{section.infoBox}</Text>
        </View>
      )}
      {section.infoBox && typeof section.infoBox === 'object' && (
        <View style={styles.infoBox}>
          <View>
            <Text style={styles.infoBoxTitle}>{section.infoBox.title}</Text>
            <Text style={styles.infoBoxText}>{section.infoBox.text}</Text>
          </View>
        </View>
      )}
      {section.contact && (
        <>
          <Text style={styles.contactInfo}>{section.contact.company}</Text>
          <Text style={styles.contactInfo}>Email: {section.contact.email}</Text>
          <Text style={styles.contactInfo}>Subject Line: {section.contact.subject}</Text>
        </>
      )}
      {section.footer && <Text style={styles.paragraph}>{section.footer}</Text>}
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Stack.Screen 
          options={{ 
            title: 'Privacy Policy',
            headerShown: true,
            headerBackTitle: 'Back',
          }} 
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
          <Text style={styles.loadingText}>Loading Privacy Policy...</Text>
        </View>
      </View>
    );
  }

  if (error || !policy) {
    return (
      <View style={styles.container}>
        <Stack.Screen 
          options={{ 
            title: 'Privacy Policy',
            headerShown: true,
            headerBackTitle: 'Back',
          }} 
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Unable to load Privacy Policy. Please try again later.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Privacy Policy',
          headerShown: true,
          headerBackTitle: 'Back',
        }} 
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>Privacy Policy</Text>
          <Text style={styles.dateText}>Last updated: {policy.lastUpdated}</Text>
          <Text style={styles.effectiveDate}>Effective date: {policy.effectiveDate}</Text>

          <View style={styles.glanceCard}>
            <Text style={styles.glanceTitle}>Privacy at a Glance</Text>
            <View style={styles.glanceGrid}>
              {policy.glanceItems.map((item, index) => (
                <View key={index} style={styles.glanceItem}>
                  {renderIcon(item.icon)}
                  <Text style={styles.glanceItemTitle}>{item.title}</Text>
                  <Text style={styles.glanceItemText}>{item.text}</Text>
                </View>
              ))}
            </View>
          </View>

          {policy.sections.map((section, index) => renderSection(section, index))}

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  dateText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  effectiveDate: {
    fontSize: 13,
    color: Colors.light.primary,
    marginBottom: 20,
  },
  glanceCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  glanceTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 16,
  },
  glanceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  glanceItem: {
    width: '50%',
    marginBottom: 16,
    paddingRight: 8,
  },
  glanceItemTitle: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginTop: 6,
  },
  glanceItemText: {
    fontSize: 11,
    color: Colors.light.textMuted,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginTop: 24,
    marginBottom: 12,
  },
  subSectionTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginTop: 16,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 22,
    marginBottom: 12,
  },
  bulletList: {
    marginBottom: 12,
  },
  bulletItem: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 22,
    marginBottom: 8,
    paddingLeft: 4,
  },
  bulletBold: {
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  infoBox: {
    backgroundColor: '#D1FAE5',
    borderRadius: 8,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginVertical: 16,
  },
  infoBoxTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.primary,
    marginBottom: 4,
  },
  infoBoxText: {
    fontSize: 13,
    color: Colors.light.primaryDark,
    flex: 1,
    lineHeight: 18,
  },
  contactInfo: {
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 4,
  },
  bottomPadding: {
    height: 40,
  },
});
