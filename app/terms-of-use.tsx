import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { AlertTriangle, FileText, Info } from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function TermsOfUseScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Terms of Use',
          headerShown: true,
          headerBackTitle: 'Back',
        }} 
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>Terms of Use</Text>
          <Text style={styles.dateText}>Last updated: January 18, 2026</Text>
          <Text style={styles.effectiveDate}>Effective date: January 18, 2026</Text>

          <View style={styles.warningBox}>
            <AlertTriangle size={20} color="#B45309" />
            <View style={styles.warningContent}>
              <Text style={styles.warningTitle}>Important Legal Notice</Text>
              <Text style={styles.warningText}>
                Please read these Terms of Use carefully before using the Lawn Guardian app. By downloading, installing, or using this app, you agree to be bound by these terms. If you disagree with any part of these terms, you may not use the app.
              </Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
          <Text style={styles.paragraph}>
            Welcome to Lawn Guardian™. These Terms of Use ("Terms," "Agreement") constitute a legally binding agreement between you ("User," "you," "your") and Lawn Guardian™ ("Company," "we," "us," "our") governing your access to and use of the Lawn Guardian™ mobile application (the "App") and related services (collectively, the "Service").
          </Text>
          <Text style={styles.paragraph}>
            By creating an account, downloading, installing, accessing, or using the Service, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you must immediately stop using the Service and uninstall the App.
          </Text>

          <Text style={styles.sectionTitle}>2. Eligibility</Text>
          <Text style={styles.paragraph}>
            You must be at least 13 years old (or 16 in the European Economic Area) to use the Service. If you are under 18, you represent that you have your parent or guardian's permission to use the Service. By using the Service, you represent and warrant that you meet these eligibility requirements.
          </Text>

          <Text style={styles.sectionTitle}>3. Description of Service</Text>
          <Text style={styles.paragraph}>
            Lawn Guardian is an AI-powered lawn care application that provides:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Image-based lawn disease and weed identification using artificial intelligence</Text>
            <Text style={styles.bulletItem}>• Personalized treatment recommendations using Integrated Pest Management (IPM) protocols</Text>
            <Text style={styles.bulletItem}>• Location-based weather forecasts and soil temperature monitoring</Text>
            <Text style={styles.bulletItem}>• Push notifications and alerts based on environmental conditions</Text>
            <Text style={styles.bulletItem}>• A database of common lawn issues with regional applicability</Text>
            <Text style={styles.bulletItem}>• Treatment plan storage, management, and history tracking</Text>
          </View>

          <Text style={styles.sectionTitle}>4. User Accounts</Text>
          
          <Text style={styles.subSectionTitle}>4.1 Account Creation</Text>
          <Text style={styles.paragraph}>
            To access certain features of the Service, you must create an account. You may register using your email address or through third-party authentication services (Apple ID, Google). You agree to:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Provide accurate, current, and complete information during registration</Text>
            <Text style={styles.bulletItem}>• Maintain and promptly update your account information</Text>
            <Text style={styles.bulletItem}>• Maintain the security and confidentiality of your login credentials</Text>
            <Text style={styles.bulletItem}>• Accept responsibility for all activities under your account</Text>
            <Text style={styles.bulletItem}>• Notify us immediately of any unauthorized use of your account</Text>
          </View>

          <Text style={styles.subSectionTitle}>4.2 Account Termination</Text>
          <Text style={styles.paragraph}>
            You may delete your account at any time by contacting us at info.lawnguardian@yahoo.com. Upon account deletion, your personal data will be deleted in accordance with our Privacy Policy. We may terminate or suspend your account for violations of these Terms.
          </Text>

          <Text style={styles.sectionTitle}>5. Subscriptions and Payments</Text>

          <Text style={styles.subSectionTitle}>5.1 Free and Paid Features</Text>
          <Text style={styles.paragraph}>
            The App offers both free features with limited functionality and premium subscription plans ("Pro") with enhanced features. Free users receive a limited number of lawn scans per month.
          </Text>

          <Text style={styles.subSectionTitle}>5.2 Subscription Plans</Text>
          <Text style={styles.paragraph}>We offer the following subscription options:</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• <Text style={styles.bulletBold}>Pro Weekly:</Text> $5.99 per week</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bulletBold}>Pro Annual:</Text> $79.99 per year ($6.67/month, billed annually as one payment of $79.99) - Best value, save 74%</Text>
          </View>
          <Text style={styles.paragraph}>
            Prices are in US dollars and may vary by region. Prices are subject to change with notice.
          </Text>

          <View style={styles.infoBox}>
            <FileText size={16} color="#B45309" />
            <View style={styles.infoBoxContent}>
              <Text style={styles.infoBoxTitle}>Auto-Renewal Notice</Text>
              <Text style={styles.infoBoxText}>
                Subscriptions automatically renew unless cancelled at least 24 hours before the end of the current period. Your account will be charged for renewal within 24 hours prior to the end of the current period.
              </Text>
            </View>
          </View>

          <Text style={styles.subSectionTitle}>5.3 Billing and Auto-Renewal</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Payment will be charged to your Apple ID or Google Play account at confirmation of purchase</Text>
            <Text style={styles.bulletItem}>• Subscriptions automatically renew at the same price unless cancelled</Text>
            <Text style={styles.bulletItem}>• You can manage and cancel subscriptions in your device's account settings</Text>
            <Text style={styles.bulletItem}>• No refunds for partial subscription periods</Text>
          </View>

          <Text style={styles.subSectionTitle}>5.4 How to Cancel</Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bulletBold}>For iOS (Apple):</Text> Go to Settings → [Your Name] → Subscriptions → Lawn Guardian → Cancel Subscription
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bulletBold}>For Android (Google Play):</Text> Go to Google Play Store → Menu → Subscriptions → Lawn Guardian → Cancel
          </Text>

          <View style={styles.infoBox}>
            <Info size={16} color={Colors.light.primary} />
            <View style={styles.infoBoxContent}>
              <Text style={styles.infoBoxTitle}>What happens when you cancel:</Text>
              <View style={styles.bulletList}>
                <Text style={styles.bulletItem}>• You will retain full access to Pro features until the end of your current billing period</Text>
                <Text style={styles.bulletItem}>• Your subscription will not renew after the current period ends</Text>
                <Text style={styles.bulletItem}>• After your subscription expires, you will be downgraded to the Free plan</Text>
              </View>
            </View>
          </View>

          <Text style={styles.subSectionTitle}>5.5 Refund Policy</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• <Text style={styles.bulletBold}>No prorated refunds:</Text> We do not provide refunds or credits for partial subscription periods. When you cancel, you keep access until the end of your current billing period.</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bulletBold}>Apple App Store:</Text> All refund requests for iOS purchases must be submitted directly to Apple through their refund process. We do not have the ability to issue refunds for App Store purchases.</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bulletBold}>Google Play Store:</Text> All refund requests for Android purchases must be submitted directly to Google through their refund process. We do not have the ability to issue refunds for Google Play purchases.</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bulletBold}>Annual subscriptions:</Text> If you purchased an annual subscription, the same policy applies - no prorated refunds for unused months.</Text>
          </View>

          <Text style={styles.sectionTitle}>6. Use of Service</Text>

          <Text style={styles.subSectionTitle}>6.1 License Grant</Text>
          <Text style={styles.paragraph}>
            Subject to your compliance with these Terms, we grant you a limited, non-exclusive, non-transferable, revocable license to download, install, and use the App on a device you own or control for personal, non-commercial purposes.
          </Text>

          <Text style={styles.subSectionTitle}>6.2 Prohibited Uses</Text>
          <Text style={styles.paragraph}>You agree not to:</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Use the Service for any unlawful purpose or in violation of any applicable laws</Text>
            <Text style={styles.bulletItem}>• Attempt to gain unauthorized access to any portion of the Service or its systems</Text>
            <Text style={styles.bulletItem}>• Interfere with or disrupt the Service, servers, or networks</Text>
            <Text style={styles.bulletItem}>• Reverse engineer, decompile, disassemble, or attempt to derive source code</Text>
            <Text style={styles.bulletItem}>• Copy, modify, distribute, sell, or lease any part of the Service</Text>
            <Text style={styles.bulletItem}>• Use automated systems (bots, scrapers) to access the Service</Text>
            <Text style={styles.bulletItem}>• Upload malicious code, viruses, or harmful content</Text>
            <Text style={styles.bulletItem}>• Impersonate any person or entity or misrepresent your affiliation</Text>
            <Text style={styles.bulletItem}>• Harvest or collect information about other users</Text>
            <Text style={styles.bulletItem}>• Use the Service to send spam or unsolicited communications</Text>
            <Text style={styles.bulletItem}>• Circumvent any access restrictions or usage limits</Text>
          </View>

          <Text style={styles.sectionTitle}>7. User Content</Text>
          <Text style={styles.paragraph}>
            You retain ownership of any content you submit, upload, or display through the Service, including lawn images and notes ("User Content"). By submitting User Content, you grant us a worldwide, non-exclusive, royalty-free, sublicensable license to use, reproduce, modify, adapt, process, and display such content solely for the purpose of providing, improving, and developing the Service.
          </Text>
          <Text style={styles.paragraph}>You represent and warrant that:</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• You own or have the necessary rights to submit the User Content</Text>
            <Text style={styles.bulletItem}>• Your User Content does not violate any third-party rights</Text>
            <Text style={styles.bulletItem}>• Your User Content does not contain illegal or harmful content</Text>
          </View>

          <Text style={styles.sectionTitle}>8. AI-Generated Recommendations Disclaimer</Text>

          <View style={styles.dangerBox}>
            <AlertTriangle size={20} color={Colors.light.error} />
            <View style={styles.dangerContent}>
              <Text style={styles.dangerTitle}>Important Medical and Safety Disclaimer</Text>
              <Text style={styles.dangerText}>
                The lawn care diagnoses, treatment recommendations, and other information provided by Lawn Guardian are generated by artificial intelligence and are for educational and informational purposes only. While we strive for accuracy using industry-leading AI technology, we cannot guarantee that AI-generated diagnoses will be 100% correct.
              </Text>
            </View>
          </View>

          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• <Text style={styles.bulletBold}>Not Professional Advice:</Text> Recommendations should not be considered as professional lawn care, agricultural, or pest control advice</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bulletBold}>Consult Experts:</Text> For serious lawn issues, always consult with a qualified lawn care professional or your local agricultural extension office</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bulletBold}>Verify Recommendations:</Text> Cross-reference AI recommendations with authoritative sources</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bulletBold}>Weather Accuracy:</Text> Weather data is provided by third-party services and may not be completely accurate</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bulletBold}>Your Responsibility:</Text> You are solely responsible for any actions you take based on the Service's recommendations</Text>
          </View>

          <Text style={styles.sectionTitle}>9. Chemical Treatment Responsibility</Text>
          <Text style={styles.paragraph}>
            The Service may provide recommendations for chemical treatments including pesticides, herbicides, fungicides, and fertilizers. You acknowledge and agree that:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• <Text style={styles.bulletBold}>Legal Compliance:</Text> You are solely responsible for following all applicable local, state, federal, and international laws and regulations regarding the purchase, storage, handling, and application of lawn care chemicals</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bulletBold}>Product Labels:</Text> You must always read and follow all product labels, instructions, and safety data sheets (SDS)</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bulletBold}>Safety Equipment:</Text> You should wear appropriate personal protective equipment (PPE) when handling and applying chemicals</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bulletBold}>Professional Application:</Text> Some products may require professional application or licensing in your jurisdiction</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bulletBold}>Environmental Protection:</Text> You must comply with all environmental protection regulations</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bulletBold}>No Liability:</Text> We are not responsible for any harm, injury, damage, or legal issues resulting from your use of recommended products</Text>
          </View>

          <Text style={styles.sectionTitle}>10. Intellectual Property</Text>
          <Text style={styles.paragraph}>
            The Service and its original content (excluding User Content), features, functionality, design, graphics, and trademarks are and will remain the exclusive property of Lawn Guardian™ and its licensors. The Service is protected by copyright, trademark, and other intellectual property laws of the United States and foreign countries.
          </Text>
          <Text style={styles.paragraph}>
            You may not use our trademarks, logos, or brand elements without our prior written consent.
          </Text>

          <Text style={styles.sectionTitle}>11. Third-Party Services</Text>
          <Text style={styles.paragraph}>The Service integrates with and relies upon third-party services including:</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• <Text style={styles.bulletBold}>Apple App Store / Google Play Store:</Text> For app distribution and in-app purchases</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bulletBold}>Authentication Providers:</Text> Apple ID, Google Sign-In</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bulletBold}>AI Services:</Text> Pl@ntNet, Plant.id, and Claude for lawn analysis and diagnosis</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bulletBold}>Weather Services:</Text> Third-party weather data providers</Text>
          </View>
          <Text style={styles.paragraph}>
            Your use of these third-party services is subject to their respective terms of service and privacy policies. We are not responsible for the availability, accuracy, or content of third-party services.
          </Text>

          <Text style={styles.sectionTitle}>12. Disclaimer of Warranties</Text>
          <Text style={styles.paragraph}>
            THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, AND ACCURACY OF INFORMATION.
          </Text>
          <Text style={styles.paragraph}>
            WE DO NOT WARRANT THAT: (A) THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE; (B) DEFECTS WILL BE CORRECTED; (C) THE SERVICE OR SERVERS ARE FREE OF VIRUSES OR HARMFUL COMPONENTS; (D) THE RESULTS OF USING THE SERVICE WILL MEET YOUR REQUIREMENTS; OR (E) AI-GENERATED DIAGNOSES AND RECOMMENDATIONS WILL BE ACCURATE.
          </Text>

          <Text style={styles.sectionTitle}>13. Limitation of Liability</Text>
          <Text style={styles.paragraph}>
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL LAWN GUARDIAN, ITS AFFILIATES, DIRECTORS, EMPLOYEES, AGENTS, OR LICENSORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES, INCLUDING WITHOUT LIMITATION DAMAGES FOR LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICE</Text>
            <Text style={styles.bulletItem}>• ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE SERVICE</Text>
            <Text style={styles.bulletItem}>• ANY CONTENT OBTAINED FROM THE SERVICE</Text>
            <Text style={styles.bulletItem}>• UNAUTHORIZED ACCESS, USE, OR ALTERATION OF YOUR TRANSMISSIONS OR CONTENT</Text>
            <Text style={styles.bulletItem}>• ANY RELIANCE ON AI-GENERATED RECOMMENDATIONS OR DIAGNOSES</Text>
            <Text style={styles.bulletItem}>• ANY DAMAGE TO YOUR LAWN, PROPERTY, PLANTS, OR HEALTH RESULTING FROM FOLLOWING RECOMMENDATIONS</Text>
            <Text style={styles.bulletItem}>• CHEMICAL TREATMENTS APPLIED BASED ON SERVICE RECOMMENDATIONS</Text>
          </View>
          <Text style={styles.paragraph}>
            IN NO EVENT SHALL OUR TOTAL LIABILITY TO YOU EXCEED THE AMOUNT YOU PAID TO US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM, OR $100 USD, WHICHEVER IS GREATER.
          </Text>

          <Text style={styles.sectionTitle}>14. Indemnification</Text>
          <Text style={styles.paragraph}>
            You agree to defend, indemnify, and hold harmless Lawn Guardian and its affiliates, officers, directors, employees, contractors, agents, licensors, and suppliers from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Your violation of these Terms</Text>
            <Text style={styles.bulletItem}>• Your violation of any third-party rights</Text>
            <Text style={styles.bulletItem}>• Your User Content</Text>
            <Text style={styles.bulletItem}>• Your use or misuse of the Service</Text>
            <Text style={styles.bulletItem}>• Your application of lawn care treatments based on Service recommendations</Text>
          </View>

          <Text style={styles.sectionTitle}>15. Dispute Resolution</Text>

          <Text style={styles.subSectionTitle}>15.1 Informal Resolution</Text>
          <Text style={styles.paragraph}>
            Before filing any legal claim, you agree to try to resolve the dispute informally by contacting us at info.lawnguardian@yahoo.com. We will attempt to resolve the dispute within 60 days.
          </Text>

          <Text style={styles.subSectionTitle}>15.2 Governing Law</Text>
          <Text style={styles.paragraph}>
            These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law provisions.
          </Text>

          <Text style={styles.subSectionTitle}>15.3 Jurisdiction</Text>
          <Text style={styles.paragraph}>
            Any legal action or proceeding arising under these Terms shall be brought exclusively in the federal or state courts located in Delaware, and you consent to the personal jurisdiction of those courts.
          </Text>

          <Text style={styles.sectionTitle}>16. Termination</Text>
          <Text style={styles.paragraph}>
            We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including if you breach these Terms. Upon termination:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Your right to use the Service will immediately cease</Text>
            <Text style={styles.bulletItem}>• You must uninstall and delete the App from your devices</Text>
            <Text style={styles.bulletItem}>• All provisions of these Terms that should survive termination will survive</Text>
            <Text style={styles.bulletItem}>• We are not obligated to refund any fees paid</Text>
          </View>

          <Text style={styles.sectionTitle}>17. Changes to Terms</Text>
          <Text style={styles.paragraph}>We reserve the right to modify these Terms at any time. We will provide notice of material changes by:</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Posting the updated Terms in the App</Text>
            <Text style={styles.bulletItem}>• Updating the "Last updated" date at the top</Text>
            <Text style={styles.bulletItem}>• Sending a notification through the App for significant changes</Text>
          </View>
          <Text style={styles.paragraph}>
            Your continued use of the Service after the effective date of changes constitutes acceptance of the modified Terms. If you do not agree to the changes, you must stop using the Service.
          </Text>

          <Text style={styles.sectionTitle}>18. General Provisions</Text>

          <Text style={styles.subSectionTitle}>18.1 Entire Agreement</Text>
          <Text style={styles.paragraph}>
            These Terms, together with our Privacy Policy, constitute the entire agreement between you and Lawn Guardian™ regarding the Service and supersede all prior agreements.
          </Text>

          <Text style={styles.subSectionTitle}>18.2 Severability</Text>
          <Text style={styles.paragraph}>
            If any provision of these Terms is held to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary, and the remaining provisions will remain in full force and effect.
          </Text>

          <Text style={styles.subSectionTitle}>18.3 Waiver</Text>
          <Text style={styles.paragraph}>
            Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
          </Text>

          <Text style={styles.subSectionTitle}>18.4 Assignment</Text>
          <Text style={styles.paragraph}>
            You may not assign or transfer these Terms without our prior written consent. We may assign our rights and obligations without restriction.
          </Text>

          <Text style={styles.sectionTitle}>19. App Store Terms</Text>

          <Text style={styles.subSectionTitle}>19.1 Apple App Store</Text>
          <Text style={styles.paragraph}>If you downloaded the App from the Apple App Store, you acknowledge and agree that:</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• These Terms are between you and Lawn Guardian, not Apple</Text>
            <Text style={styles.bulletItem}>• Apple has no obligation to provide maintenance or support for the App</Text>
            <Text style={styles.bulletItem}>• Apple is not responsible for any product warranties or claims</Text>
            <Text style={styles.bulletItem}>• Apple is not responsible for addressing any claims relating to the App</Text>
            <Text style={styles.bulletItem}>• Apple is a third-party beneficiary of these Terms</Text>
            <Text style={styles.bulletItem}>• You must comply with the App Store Terms of Service</Text>
          </View>

          <Text style={styles.subSectionTitle}>19.2 Google Play Store</Text>
          <Text style={styles.paragraph}>If you downloaded the App from Google Play, you acknowledge and agree that:</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• These Terms are between you and Lawn Guardian, not Google</Text>
            <Text style={styles.bulletItem}>• Google has no obligation to provide maintenance or support for the App</Text>
            <Text style={styles.bulletItem}>• Google is not responsible for any product warranties or claims</Text>
            <Text style={styles.bulletItem}>• You must comply with the Google Play Terms of Service</Text>
          </View>

          <Text style={styles.sectionTitle}>20. Contact Us</Text>
          <Text style={styles.paragraph}>
            If you have any questions about these Terms of Use, please contact us:
          </Text>
          <Text style={styles.contactInfo}>Lawn Guardian</Text>
          <Text style={styles.contactInfo}>Email: info.lawnguardian@yahoo.com</Text>
          <Text style={styles.contactInfo}>Subject Line: Terms of Use Inquiry</Text>

          <Text style={styles.finalNote}>
            By using Lawn Guardian, you acknowledge that you have read, understood, and agree to be bound by these Terms of Use.
          </Text>

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
  warningBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 24,
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#B45309',
    marginBottom: 6,
  },
  warningText: {
    fontSize: 13,
    color: '#92400E',
    lineHeight: 18,
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
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginVertical: 16,
  },
  infoBoxContent: {
    flex: 1,
  },
  infoBoxTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#B45309',
    marginBottom: 6,
  },
  infoBoxText: {
    fontSize: 13,
    color: '#92400E',
    lineHeight: 18,
  },
  dangerBox: {
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginVertical: 16,
  },
  dangerContent: {
    flex: 1,
  },
  dangerTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.error,
    marginBottom: 6,
  },
  dangerText: {
    fontSize: 13,
    color: '#991B1B',
    lineHeight: 18,
  },
  contactInfo: {
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 4,
  },
  finalNote: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: 24,
    fontStyle: 'italic',
  },
  bottomPadding: {
    height: 40,
  },
});
