import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { Camera, MapPin, Shield, User, Lock } from 'lucide-react-native';
import Colors from '@/constants/colors';

type IconType = 'camera' | 'mapPin' | 'shield' | 'user';

const iconMap: Record<IconType, React.ComponentType<{ size: number; color: string }>> = {
  camera: Camera,
  mapPin: MapPin,
  shield: Shield,
  user: User,
};

const PRIVACY_POLICY = {
  lastUpdated: "January 18, 2026",
  effectiveDate: "January 18, 2026",
  sections: [
    {
      title: "1. Introduction",
      content: `Lawn Guardian™ ("we," "our," "us," or the "Company") operates the Lawn Guardian™ mobile application (the "App") available on Apple App Store and Google Play Store. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our App and related services (collectively, the "Service").

By downloading, installing, or using the App, you agree to the collection and use of information in accordance with this Privacy Policy. If you do not agree with this Privacy Policy, please do not use the App.`,
    },
    {
      title: "2. Information We Collect",
      subsections: [
        {
          title: "2.1 Information You Provide Directly",
          bullets: [
            { bold: "Account Information:", text: "When you create an account, we collect your email address. If you use Sign in with Apple or Google Sign-In, we receive the information you authorize those services to share." },
            { bold: "Profile Information:", text: "You may optionally provide your display name, location (city/state), and grass type preferences." },
            { bold: "Lawn Images:", text: "Photos you upload or capture using the App for AI-powered lawn analysis. These images are processed to identify lawn problems and generate treatment recommendations." },
            { bold: "Saved Treatment Plans:", text: "Diagnosis results, treatment recommendations, and any notes you add to saved plans." },
            { bold: "Customer Support:", text: "Information you provide when contacting us for support, including your email and description of issues." },
          ],
        },
        {
          title: "2.2 Information Collected Automatically",
          bullets: [
            { bold: "Precise Location Data:", text: "With your explicit permission, we collect your device's precise geolocation to provide localized weather forecasts, soil temperature data, and region-specific lawn care recommendations. You can disable location access at any time through your device settings." },
            { bold: "Device Information:", text: "Device type, model, operating system version, unique device identifiers (such as IDFA for iOS or Advertising ID for Android), and mobile network information." },
            { bold: "Usage Data:", text: "Information about how you interact with the App, including features used, screens viewed, actions taken, and time spent in the App." },
            { bold: "Crash and Performance Data:", text: "Technical information to help us identify and fix bugs, including crash logs and performance metrics." },
          ],
        },
        {
          title: "2.3 Information from Third-Party Services",
          bullets: [
            { bold: "Authentication Providers:", text: "If you sign in using Apple ID or Google, we receive your name (if provided) and email address as authorized by you." },
            { bold: "Weather API Providers:", text: "We receive weather data based on your location to provide lawn care recommendations." },
            { bold: "AI Services:", text: "Lawn images are processed through multiple AI services (Pl@ntNet, Plant.id, Claude) for comprehensive lawn analysis, disease, and weed identification." },
          ],
        },
      ],
    },
    {
      title: "3. How We Use Your Information",
      subsections: [
        {
          title: "3.1 To Provide and Improve the Service",
          bullets: [
            { text: "Analyze lawn images using AI to identify diseases, weeds, and other lawn problems" },
            { text: "Generate personalized treatment recommendations based on identified issues" },
            { text: "Provide location-based weather alerts and lawn care notifications" },
            { text: "Save and manage your treatment plans and lawn care history" },
            { text: "Improve our AI models and recommendation accuracy" },
          ],
        },
        {
          title: "3.2 To Communicate With You",
          bullets: [
            { text: "Send push notifications about weather alerts, treatment reminders, and lawn care tips (with your permission)" },
            { text: "Respond to your customer support inquiries" },
            { text: "Send important service-related announcements" },
          ],
        },
        {
          title: "3.3 For Analytics and Security",
          bullets: [
            { text: "Monitor and analyze usage trends to improve user experience" },
            { text: "Detect, prevent, and address technical issues and security threats" },
            { text: "Comply with legal obligations" },
          ],
        },
      ],
    },
    {
      title: "4. How We Share Your Information",
      content: "We may share your information in the following circumstances:",
      subsections: [
        {
          title: "4.1 Service Providers",
          content: "We share information with third-party vendors who perform services on our behalf:",
          bullets: [
            { bold: "Cloud Hosting:", text: "For database and file storage" },
            { bold: "AI Processing:", text: "Pl@ntNet, Plant.id, and Claude (lawn image analysis)" },
            { bold: "Weather Data:", text: "Weather API providers" },
            { bold: "Authentication:", text: "Apple and Google sign-in services" },
          ],
        },
        {
          title: "4.2 Legal Requirements",
          content: "We may disclose your information if required by law, court order, or government request, or if we believe disclosure is necessary to protect our rights, your safety, or the safety of others.",
        },
        {
          title: "4.3 Business Transfers",
          content: "If we are involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction. We will notify you of any such change.",
        },
      ],
      infoBox: "We do NOT sell, rent, or trade your personal information to third parties for marketing purposes.",
    },
    {
      title: "5. Data Retention",
      content: "We retain your personal information for as long as your account is active or as needed to provide you services:",
      bullets: [
        { bold: "Account Data:", text: "Retained until you delete your account" },
        { bold: "Lawn Images:", text: "Stored as long as you keep them in your saved plans; automatically deleted when you delete the plan or your account" },
        { bold: "Usage Analytics:", text: "Aggregated and anonymized data may be retained indefinitely for service improvement" },
        { bold: "Legal Requirements:", text: "We may retain certain data as required by law or for legitimate business purposes" },
      ],
    },
    {
      title: "6. Data Security",
      content: "We implement industry-standard security measures to protect your personal information:",
      bullets: [
        { bold: "Encryption:", text: "Data is encrypted in transit (TLS/SSL) and at rest" },
        { bold: "Secure Authentication:", text: "We use secure authentication methods including OAuth 2.0" },
        { bold: "Access Controls:", text: "Access to personal data is restricted to authorized personnel only" },
        { bold: "Regular Audits:", text: "We conduct regular security assessments" },
      ],
      footer: "While we strive to protect your information, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security.",
    },
    {
      title: "7. Your Rights and Choices",
      infoBox: {
        title: "How to Exercise Your Rights",
        text: "You can manage most privacy settings directly in the App. For account deletion or data export requests, contact us at info.lawnguardian@yahoo.com.",
      },
      subsections: [
        {
          title: "7.1 Access and Portability",
          content: "You can access your account information and saved plans directly in the App. You may request a copy of your personal data by contacting us.",
        },
        {
          title: "7.2 Correction",
          content: "You can update your profile information, grass type preferences, and saved plan notes directly in the App.",
        },
        {
          title: "7.3 Deletion (Right to be Forgotten)",
          content: "You can delete individual saved plans within the App. To delete your entire account and all associated data, contact us at info.lawnguardian@yahoo.com. We will process your request within 30 days.",
        },
        {
          title: "7.4 Location Data",
          content: "You can enable or disable location services at any time through your device settings (iOS: Settings → Privacy → Location Services; Android: Settings → Location). Disabling location may limit weather-based features.",
        },
        {
          title: "7.5 Push Notifications",
          content: "You can manage notification preferences in the App settings or through your device's notification settings.",
        },
        {
          title: "7.6 Camera and Photo Library Access",
          content: "The App requests access to your camera and photo library to enable lawn photo uploads. You can revoke this access at any time through your device settings.",
        },
      ],
    },
    {
      title: "8. Children's Privacy (COPPA Compliance)",
      content: "Our Service is not directed to children under the age of 13 (or 16 in the European Economic Area). We do not knowingly collect personal information from children under these ages. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately at info.lawnguardian@yahoo.com. If we discover that we have collected personal information from a child in violation of applicable law, we will delete that information promptly.",
    },
    {
      title: "9. International Data Transfers",
      content: "Your information may be transferred to and processed in countries other than your country of residence, including the United States. These countries may have different data protection laws. When we transfer your information, we ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy.",
    },
    {
      title: "10. California Privacy Rights (CCPA/CPRA)",
      content: "If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA):",
      bullets: [
        { bold: "Right to Know:", text: "You can request information about the categories and specific pieces of personal information we have collected about you" },
        { bold: "Right to Delete:", text: "You can request deletion of your personal information" },
        { bold: "Right to Correct:", text: "You can request correction of inaccurate personal information" },
        { bold: "Right to Opt-Out:", text: "We do not sell personal information, so this right does not apply" },
        { bold: "Non-Discrimination:", text: "We will not discriminate against you for exercising your privacy rights" },
      ],
      footer: "To exercise these rights, contact us at info.lawnguardian@yahoo.com. We will verify your identity before processing your request.",
    },
    {
      title: "11. European Privacy Rights (GDPR)",
      content: "If you are located in the European Economic Area (EEA), United Kingdom, or Switzerland, you have additional rights under the General Data Protection Regulation (GDPR):",
      bullets: [
        { bold: "Legal Basis:", text: "We process your data based on consent (for location and notifications), contract performance (to provide the Service), and legitimate interests (for analytics and security)" },
        { bold: "Right to Access:", text: "Request a copy of your personal data" },
        { bold: "Right to Rectification:", text: "Request correction of inaccurate data" },
        { bold: "Right to Erasure:", text: "Request deletion of your data" },
        { bold: "Right to Restrict Processing:", text: "Request limitation of data processing" },
        { bold: "Right to Data Portability:", text: "Request transfer of your data in a structured format" },
        { bold: "Right to Object:", text: "Object to processing based on legitimate interests" },
        { bold: "Right to Withdraw Consent:", text: "Withdraw consent at any time" },
      ],
      footer: "To exercise these rights or file a complaint, contact us at info.lawnguardian@yahoo.com. You also have the right to lodge a complaint with your local data protection authority.",
    },
    {
      title: "12. Third-Party Links and Services",
      content: "The App may contain links to third-party websites or services. This Privacy Policy does not apply to those third parties. We encourage you to review the privacy policies of any third-party services you access.",
    },
    {
      title: "13. Changes to This Privacy Policy",
      content: "We may update this Privacy Policy from time to time. We will notify you of any material changes by:",
      bullets: [
        { text: "Posting the new Privacy Policy in the App" },
        { text: "Updating the \"Last updated\" date at the top of this policy" },
        { text: "Sending you a push notification or email for significant changes (where appropriate)" },
      ],
      footer: "We encourage you to review this Privacy Policy periodically. Your continued use of the App after changes constitutes acceptance of the updated policy.",
    },
    {
      title: "14. Contact Us",
      content: "If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:",
      contact: {
        company: "Lawn Guardian™",
        email: "info.lawnguardian@yahoo.com",
        subject: "Privacy Policy Inquiry",
      },
      footer: "We will respond to your inquiry within 30 days.",
    },
    {
      title: "15. App Store Specific Disclosures",
      subsections: [
        {
          title: "Apple App Store",
          content: "In accordance with Apple's App Store Guidelines, we disclose that this App collects the following data types as shown in our App Store privacy nutrition labels:",
          bullets: [
            { bold: "Contact Info:", text: "Email address (for account creation)" },
            { bold: "User Content:", text: "Photos (lawn images for analysis)" },
            { bold: "Location:", text: "Precise location (for weather features, with permission)" },
            { bold: "Identifiers:", text: "Device ID (for analytics)" },
            { bold: "Usage Data:", text: "App interactions (for improving the Service)" },
            { bold: "Diagnostics:", text: "Crash data (for bug fixes)" },
          ],
        },
        {
          title: "Google Play Store",
          content: "In accordance with Google Play's Data Safety requirements, we confirm that:",
          bullets: [
            { text: "Data is encrypted in transit" },
            { text: "You can request data deletion" },
            { text: "We do not share data with third parties for advertising purposes" },
            { text: "This app follows Google Play's Families Policy (not directed to children)" },
          ],
        },
      ],
    },
  ],
  glanceItems: [
    { icon: "camera", title: "Data We Collect", text: "Photos, location, account info" },
    { icon: "mapPin", title: "How We Use It", text: "Lawn analysis & recommendations" },
    { icon: "shield", title: "Data Security", text: "Encrypted & securely stored" },
    { icon: "user", title: "Your Control", text: "Delete your data anytime" },
  ],
};

type Bullet = { bold?: string; text: string };
type Subsection = { title: string; content?: string; bullets?: Bullet[] };
type InfoBox = string | { title: string; text: string };
type Section = {
  title: string;
  content?: string;
  bullets?: Bullet[];
  subsections?: Subsection[];
  infoBox?: InfoBox;
  contact?: { company: string; email: string; subject: string };
  footer?: string;
};

export default function PrivacyPolicyScreen() {
  const renderIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as IconType];
    if (!IconComponent) return null;
    return <IconComponent size={20} color={Colors.light.primary} />;
  };

  const renderBullet = (bullet: Bullet, index: number) => (
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

  const renderSubsection = (subsection: Subsection, index: number) => (
    <View key={index}>
      <Text style={styles.subSectionTitle}>{subsection.title}</Text>
      {subsection.content && <Text style={styles.paragraph}>{subsection.content}</Text>}
      {subsection.bullets && (
        <View style={styles.bulletList}>
          {subsection.bullets.map((bullet, bIndex) => renderBullet(bullet, bIndex))}
        </View>
      )}
    </View>
  );

  const renderSection = (section: Section, index: number) => (
    <View key={index}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      {section.content && <Text style={styles.paragraph}>{section.content}</Text>}
      {section.bullets && (
        <View style={styles.bulletList}>
          {section.bullets.map((bullet, bIndex) => renderBullet(bullet, bIndex))}
        </View>
      )}
      {section.subsections?.map((sub, sIndex) => renderSubsection(sub, sIndex))}
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
          <Text style={styles.dateText}>Last updated: {PRIVACY_POLICY.lastUpdated}</Text>
          <Text style={styles.effectiveDate}>Effective date: {PRIVACY_POLICY.effectiveDate}</Text>

          <View style={styles.glanceCard}>
            <Text style={styles.glanceTitle}>Privacy at a Glance</Text>
            <View style={styles.glanceGrid}>
              {PRIVACY_POLICY.glanceItems.map((item, index) => (
                <View key={index} style={styles.glanceItem}>
                  {renderIcon(item.icon)}
                  <Text style={styles.glanceItemTitle}>{item.title}</Text>
                  <Text style={styles.glanceItemText}>{item.text}</Text>
                </View>
              ))}
            </View>
          </View>

          {PRIVACY_POLICY.sections.map((section, index) => renderSection(section as Section, index))}

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
