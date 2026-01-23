import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { Camera, MapPin, Shield, User, Lock } from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function PrivacyPolicyScreen() {
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
          <Text style={styles.dateText}>Last updated: January 18, 2026</Text>
          <Text style={styles.effectiveDate}>Effective date: January 18, 2026</Text>

          <View style={styles.glanceCard}>
            <Text style={styles.glanceTitle}>Privacy at a Glance</Text>
            <View style={styles.glanceGrid}>
              <View style={styles.glanceItem}>
                <Camera size={20} color={Colors.light.primary} />
                <Text style={styles.glanceItemTitle}>Data We Collect</Text>
                <Text style={styles.glanceItemText}>Photos, location, account info</Text>
              </View>
              <View style={styles.glanceItem}>
                <MapPin size={20} color={Colors.light.primary} />
                <Text style={styles.glanceItemTitle}>How We Use It</Text>
                <Text style={styles.glanceItemText}>Lawn analysis & recommendations</Text>
              </View>
              <View style={styles.glanceItem}>
                <Shield size={20} color={Colors.light.primary} />
                <Text style={styles.glanceItemTitle}>Data Security</Text>
                <Text style={styles.glanceItemText}>Encrypted & securely stored</Text>
              </View>
              <View style={styles.glanceItem}>
                <User size={20} color={Colors.light.primary} />
                <Text style={styles.glanceItemTitle}>Your Control</Text>
                <Text style={styles.glanceItemText}>Delete your data anytime</Text>
              </View>
            </View>
          </View>

          <Text style={styles.sectionTitle}>1. Introduction</Text>
          <Text style={styles.paragraph}>
            Lawn Guardian™ ("we," "our," "us," or the "Company") operates the Lawn Guardian™ mobile application (the "App") available on Apple App Store and Google Play Store. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our App and related services (collectively, the "Service").
          </Text>
          <Text style={styles.paragraph}>
            By downloading, installing, or using the App, you agree to the collection and use of information in accordance with this Privacy Policy. If you do not agree with this Privacy Policy, please do not use the App.
          </Text>

          <Text style={styles.sectionTitle}>2. Information We Collect</Text>
          
          <Text style={styles.subSectionTitle}>2.1 Information You Provide Directly</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>
              <Text style={styles.bulletBold}>Account Information:</Text> When you create an account, we collect your email address. If you use Sign in with Apple or Google Sign-In, we receive the information you authorize those services to share.
            </Text>
            <Text style={styles.bulletItem}>
              <Text style={styles.bulletBold}>Profile Information:</Text> You may optionally provide your display name, location (city/state), and grass type preferences.
            </Text>
            <Text style={styles.bulletItem}>
              <Text style={styles.bulletBold}>Lawn Images:</Text> Photos you upload or capture using the App for AI-powered lawn analysis. These images are processed to identify lawn problems and generate treatment recommendations.
            </Text>
            <Text style={styles.bulletItem}>
              <Text style={styles.bulletBold}>Saved Treatment Plans:</Text> Diagnosis results, treatment recommendations, and any notes you add to saved plans.
            </Text>
            <Text style={styles.bulletItem}>
              <Text style={styles.bulletBold}>Customer Support:</Text> Information you provide when contacting us for support, including your email and description of issues.
            </Text>
          </View>

          <Text style={styles.subSectionTitle}>2.2 Information Collected Automatically</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>
              <Text style={styles.bulletBold}>Precise Location Data:</Text> With your explicit permission, we collect your device's precise geolocation to provide localized weather forecasts, soil temperature data, and region-specific lawn care recommendations. You can disable location access at any time through your device settings.
            </Text>
            <Text style={styles.bulletItem}>
              <Text style={styles.bulletBold}>Device Information:</Text> Device type, model, operating system version, unique device identifiers (such as IDFA for iOS or Advertising ID for Android), and mobile network information.
            </Text>
            <Text style={styles.bulletItem}>
              <Text style={styles.bulletBold}>Usage Data:</Text> Information about how you interact with the App, including features used, screens viewed, actions taken, and time spent in the App.
            </Text>
            <Text style={styles.bulletItem}>
              <Text style={styles.bulletBold}>Crash and Performance Data:</Text> Technical information to help us identify and fix bugs, including crash logs and performance metrics.
            </Text>
          </View>

          <Text style={styles.subSectionTitle}>2.3 Information from Third-Party Services</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>
              <Text style={styles.bulletBold}>Authentication Providers:</Text> If you sign in using Apple ID or Google, we receive your name (if provided) and email address as authorized by you.
            </Text>
            <Text style={styles.bulletItem}>
              <Text style={styles.bulletBold}>Weather API Providers:</Text> We receive weather data based on your location to provide lawn care recommendations.
            </Text>
            <Text style={styles.bulletItem}>
              <Text style={styles.bulletBold}>AI Services:</Text> Lawn images are processed through multiple AI services (Pl@ntNet, Plant.id, Claude) for comprehensive lawn analysis, disease, and weed identification.
            </Text>
          </View>

          <Text style={styles.sectionTitle}>3. How We Use Your Information</Text>
          
          <Text style={styles.subSectionTitle}>3.1 To Provide and Improve the Service</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Analyze lawn images using AI to identify diseases, weeds, and other lawn problems</Text>
            <Text style={styles.bulletItem}>• Generate personalized treatment recommendations based on identified issues</Text>
            <Text style={styles.bulletItem}>• Provide location-based weather alerts and lawn care notifications</Text>
            <Text style={styles.bulletItem}>• Save and manage your treatment plans and lawn care history</Text>
            <Text style={styles.bulletItem}>• Improve our AI models and recommendation accuracy</Text>
          </View>

          <Text style={styles.subSectionTitle}>3.2 To Communicate With You</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Send push notifications about weather alerts, treatment reminders, and lawn care tips (with your permission)</Text>
            <Text style={styles.bulletItem}>• Respond to your customer support inquiries</Text>
            <Text style={styles.bulletItem}>• Send important service-related announcements</Text>
          </View>

          <Text style={styles.subSectionTitle}>3.3 For Analytics and Security</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Monitor and analyze usage trends to improve user experience</Text>
            <Text style={styles.bulletItem}>• Detect, prevent, and address technical issues and security threats</Text>
            <Text style={styles.bulletItem}>• Comply with legal obligations</Text>
          </View>

          <Text style={styles.sectionTitle}>4. How We Share Your Information</Text>
          <Text style={styles.paragraph}>We may share your information in the following circumstances:</Text>

          <Text style={styles.subSectionTitle}>4.1 Service Providers</Text>
          <Text style={styles.paragraph}>We share information with third-party vendors who perform services on our behalf:</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• <Text style={styles.bulletBold}>Cloud Hosting:</Text> For database and file storage</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bulletBold}>AI Processing:</Text> Pl@ntNet, Plant.id, and Claude (lawn image analysis)</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bulletBold}>Weather Data:</Text> Weather API providers</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bulletBold}>Authentication:</Text> Apple and Google sign-in services</Text>
          </View>

          <Text style={styles.subSectionTitle}>4.2 Legal Requirements</Text>
          <Text style={styles.paragraph}>
            We may disclose your information if required by law, court order, or government request, or if we believe disclosure is necessary to protect our rights, your safety, or the safety of others.
          </Text>

          <Text style={styles.subSectionTitle}>4.3 Business Transfers</Text>
          <Text style={styles.paragraph}>
            If we are involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction. We will notify you of any such change.
          </Text>

          <View style={styles.infoBox}>
            <Lock size={16} color={Colors.light.primary} />
            <Text style={styles.infoBoxText}>
              We do NOT sell, rent, or trade your personal information to third parties for marketing purposes.
            </Text>
          </View>

          <Text style={styles.sectionTitle}>5. Data Retention</Text>
          <Text style={styles.paragraph}>We retain your personal information for as long as your account is active or as needed to provide you services:</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• <Text style={styles.bulletBold}>Account Data:</Text> Retained until you delete your account</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bulletBold}>Lawn Images:</Text> Stored as long as you keep them in your saved plans; automatically deleted when you delete the plan or your account</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bulletBold}>Usage Analytics:</Text> Aggregated and anonymized data may be retained indefinitely for service improvement</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bulletBold}>Legal Requirements:</Text> We may retain certain data as required by law or for legitimate business purposes</Text>
          </View>

          <Text style={styles.sectionTitle}>6. Data Security</Text>
          <Text style={styles.paragraph}>We implement industry-standard security measures to protect your personal information:</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• <Text style={styles.bulletBold}>Encryption:</Text> Data is encrypted in transit (TLS/SSL) and at rest</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bulletBold}>Secure Authentication:</Text> We use secure authentication methods including OAuth 2.0</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bulletBold}>Access Controls:</Text> Access to personal data is restricted to authorized personnel only</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bulletBold}>Regular Audits:</Text> We conduct regular security assessments</Text>
          </View>
          <Text style={styles.paragraph}>
            While we strive to protect your information, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security.
          </Text>

          <Text style={styles.sectionTitle}>7. Your Rights and Choices</Text>
          
          <View style={styles.infoBox}>
            <Text style={styles.infoBoxTitle}>How to Exercise Your Rights</Text>
            <Text style={styles.infoBoxText}>
              You can manage most privacy settings directly in the App. For account deletion or data export requests, contact us at info.lawnguardian@yahoo.com.
            </Text>
          </View>

          <Text style={styles.subSectionTitle}>7.1 Access and Portability</Text>
          <Text style={styles.paragraph}>
            You can access your account information and saved plans directly in the App. You may request a copy of your personal data by contacting us.
          </Text>

          <Text style={styles.subSectionTitle}>7.2 Correction</Text>
          <Text style={styles.paragraph}>
            You can update your profile information, grass type preferences, and saved plan notes directly in the App.
          </Text>

          <Text style={styles.subSectionTitle}>7.3 Deletion (Right to be Forgotten)</Text>
          <Text style={styles.paragraph}>
            You can delete individual saved plans within the App. To delete your entire account and all associated data, contact us at info.lawnguardian@yahoo.com. We will process your request within 30 days.
          </Text>

          <Text style={styles.subSectionTitle}>7.4 Location Data</Text>
          <Text style={styles.paragraph}>
            You can enable or disable location services at any time through your device settings (iOS: Settings → Privacy → Location Services; Android: Settings → Location). Disabling location may limit weather-based features.
          </Text>

          <Text style={styles.subSectionTitle}>7.5 Push Notifications</Text>
          <Text style={styles.paragraph}>
            You can manage notification preferences in the App settings or through your device's notification settings.
          </Text>

          <Text style={styles.subSectionTitle}>7.6 Camera and Photo Library Access</Text>
          <Text style={styles.paragraph}>
            The App requests access to your camera and photo library to enable lawn photo uploads. You can revoke this access at any time through your device settings.
          </Text>

          <Text style={styles.sectionTitle}>8. Children's Privacy (COPPA Compliance)</Text>
          <Text style={styles.paragraph}>
            Our Service is not directed to children under the age of 13 (or 16 in the European Economic Area). We do not knowingly collect personal information from children under these ages. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately at info.lawnguardian@yahoo.com. If we discover that we have collected personal information from a child in violation of applicable law, we will delete that information promptly.
          </Text>

          <Text style={styles.sectionTitle}>9. International Data Transfers</Text>
          <Text style={styles.paragraph}>
            Your information may be transferred to and processed in countries other than your country of residence, including the United States. These countries may have different data protection laws. When we transfer your information, we ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy.
          </Text>

          <Text style={styles.sectionTitle}>10. California Privacy Rights (CCPA/CPRA)</Text>
          <Text style={styles.paragraph}>
            If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA):
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• <Text style={styles.bulletBold}>Right to Know:</Text> You can request information about the categories and specific pieces of personal information we have collected about you</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bulletBold}>Right to Delete:</Text> You can request deletion of your personal information</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bulletBold}>Right to Correct:</Text> You can request correction of inaccurate personal information</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bulletBold}>Right to Opt-Out:</Text> We do not sell personal information, so this right does not apply</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bulletBold}>Non-Discrimination:</Text> We will not discriminate against you for exercising your privacy rights</Text>
          </View>
          <Text style={styles.paragraph}>
            To exercise these rights, contact us at info.lawnguardian@yahoo.com. We will verify your identity before processing your request.
          </Text>

          <Text style={styles.sectionTitle}>11. European Privacy Rights (GDPR)</Text>
          <Text style={styles.paragraph}>
            If you are located in the European Economic Area (EEA), United Kingdom, or Switzerland, you have additional rights under the General Data Protection Regulation (GDPR):
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• <Text style={styles.bulletBold}>Legal Basis:</Text> We process your data based on consent (for location and notifications), contract performance (to provide the Service), and legitimate interests (for analytics and security)</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bulletBold}>Right to Access:</Text> Request a copy of your personal data</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bulletBold}>Right to Rectification:</Text> Request correction of inaccurate data</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bulletBold}>Right to Erasure:</Text> Request deletion of your data</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bulletBold}>Right to Restrict Processing:</Text> Request limitation of data processing</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bulletBold}>Right to Data Portability:</Text> Request transfer of your data in a structured format</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bulletBold}>Right to Object:</Text> Object to processing based on legitimate interests</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bulletBold}>Right to Withdraw Consent:</Text> Withdraw consent at any time</Text>
          </View>
          <Text style={styles.paragraph}>
            To exercise these rights or file a complaint, contact us at info.lawnguardian@yahoo.com. You also have the right to lodge a complaint with your local data protection authority.
          </Text>

          <Text style={styles.sectionTitle}>12. Third-Party Links and Services</Text>
          <Text style={styles.paragraph}>
            The App may contain links to third-party websites or services. This Privacy Policy does not apply to those third parties. We encourage you to review the privacy policies of any third-party services you access.
          </Text>

          <Text style={styles.sectionTitle}>13. Changes to This Privacy Policy</Text>
          <Text style={styles.paragraph}>We may update this Privacy Policy from time to time. We will notify you of any material changes by:</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Posting the new Privacy Policy in the App</Text>
            <Text style={styles.bulletItem}>• Updating the "Last updated" date at the top of this policy</Text>
            <Text style={styles.bulletItem}>• Sending you a push notification or email for significant changes (where appropriate)</Text>
          </View>
          <Text style={styles.paragraph}>
            We encourage you to review this Privacy Policy periodically. Your continued use of the App after changes constitutes acceptance of the updated policy.
          </Text>

          <Text style={styles.sectionTitle}>14. Contact Us</Text>
          <Text style={styles.paragraph}>
            If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
          </Text>
          <Text style={styles.contactInfo}>Lawn Guardian™</Text>
          <Text style={styles.contactInfo}>Email: info.lawnguardian@yahoo.com</Text>
          <Text style={styles.contactInfo}>Subject Line: Privacy Policy Inquiry</Text>
          <Text style={styles.paragraph}>We will respond to your inquiry within 30 days.</Text>

          <Text style={styles.sectionTitle}>15. App Store Specific Disclosures</Text>
          
          <Text style={styles.subSectionTitle}>Apple App Store</Text>
          <Text style={styles.paragraph}>
            In accordance with Apple's App Store Guidelines, we disclose that this App collects the following data types as shown in our App Store privacy nutrition labels:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• <Text style={styles.bulletBold}>Contact Info:</Text> Email address (for account creation)</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bulletBold}>User Content:</Text> Photos (lawn images for analysis)</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bulletBold}>Location:</Text> Precise location (for weather features, with permission)</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bulletBold}>Identifiers:</Text> Device ID (for analytics)</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bulletBold}>Usage Data:</Text> App interactions (for improving the Service)</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bulletBold}>Diagnostics:</Text> Crash data (for bug fixes)</Text>
          </View>

          <Text style={styles.subSectionTitle}>Google Play Store</Text>
          <Text style={styles.paragraph}>
            In accordance with Google Play's Data Safety requirements, we confirm that:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Data is encrypted in transit</Text>
            <Text style={styles.bulletItem}>• You can request data deletion</Text>
            <Text style={styles.bulletItem}>• We do not share data with third parties for advertising purposes</Text>
            <Text style={styles.bulletItem}>• This app follows Google Play's Families Policy (not directed to children)</Text>
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
