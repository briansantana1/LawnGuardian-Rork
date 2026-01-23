import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Alert, Linking } from 'react-native';
import { Stack } from 'expo-router';
import { Mail, User, MessageSquare, ChevronDown, Send } from 'lucide-react-native';
import Colors from '@/constants/colors';

const SUBJECTS = [
  'Select a subject',
  'App Issue / Bug Report',
  'Feature Request',
  'Subscription Help',
  'General Feedback',
  'Other',
];

export default function ContactUsScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);

  const handleSendEmail = () => {
    if (!name.trim() || !email.trim() || !subject || subject === 'Select a subject' || !message.trim()) {
      Alert.alert('Missing Information', 'Please fill in all fields before sending.');
      return;
    }

    const mailtoUrl = `mailto:info.lawnguardian@yahoo.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
    
    Linking.openURL(mailtoUrl).catch(() => {
      Alert.alert('Error', 'Could not open email client. Please email us directly at info.lawnguardian@yahoo.com');
    });
  };

  const handleEmailLink = () => {
    Linking.openURL('mailto:info.lawnguardian@yahoo.com');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Contact Us',
          headerShown: true,
          headerBackTitle: 'Back',
        }} 
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>Contact Us</Text>
          <Text style={styles.subtitle}>
            We're here to help! Reach out to us for app issues, feedback, or suggestions.
          </Text>

          <Pressable onPress={handleEmailLink}>
            <View style={styles.emailLink}>
              <Mail size={16} color={Colors.light.primary} />
              <Text style={styles.emailLinkText}>info.lawnguardian@yahoo.com</Text>
            </View>
          </Pressable>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <View style={styles.inputLabel}>
                <User size={16} color={Colors.light.textMuted} />
                <Text style={styles.inputLabelText}>Your Name</Text>
              </View>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="John Doe"
                placeholderTextColor={Colors.light.textMuted}
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputLabel}>
                <Mail size={16} color={Colors.light.textMuted} />
                <Text style={styles.inputLabelText}>Email Address</Text>
              </View>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="john@example.com"
                placeholderTextColor={Colors.light.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabelText}>Subject</Text>
              <Pressable 
                style={styles.dropdown}
                onPress={() => setShowSubjectDropdown(!showSubjectDropdown)}
              >
                <Text style={[styles.dropdownText, !subject && styles.dropdownPlaceholder]}>
                  {subject || 'Select a subject'}
                </Text>
                <ChevronDown size={20} color={Colors.light.textMuted} />
              </Pressable>
              {showSubjectDropdown && (
                <View style={styles.dropdownList}>
                  {SUBJECTS.slice(1).map((item) => (
                    <Pressable
                      key={item}
                      style={[styles.dropdownItem, subject === item && styles.dropdownItemActive]}
                      onPress={() => {
                        setSubject(item);
                        setShowSubjectDropdown(false);
                      }}
                    >
                      <Text style={[styles.dropdownItemText, subject === item && styles.dropdownItemTextActive]}>
                        {item}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputLabel}>
                <MessageSquare size={16} color={Colors.light.textMuted} />
                <Text style={styles.inputLabelText}>Message</Text>
              </View>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={message}
                onChangeText={setMessage}
                placeholder="Tell us how we can help..."
                placeholderTextColor={Colors.light.textMuted}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
              />
            </View>

            <Pressable 
              style={({ pressed }) => [styles.sendButton, pressed && styles.buttonPressed]}
              onPress={handleSendEmail}
            >
              <Send size={18} color="#FFF" />
              <Text style={styles.sendButtonText}>Send E-mail</Text>
            </Pressable>
          </View>
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
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.light.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  emailLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 24,
  },
  emailLinkText: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: '500' as const,
  },
  form: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  inputLabelText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    color: Colors.light.text,
  },
  textArea: {
    minHeight: 120,
    paddingTop: 12,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  dropdownText: {
    fontSize: 14,
    color: Colors.light.text,
  },
  dropdownPlaceholder: {
    color: Colors.light.textMuted,
  },
  dropdownList: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    marginTop: 4,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  dropdownItemActive: {
    backgroundColor: '#D1FAE5',
  },
  dropdownItemText: {
    fontSize: 14,
    color: Colors.light.text,
  },
  dropdownItemTextActive: {
    color: Colors.light.primary,
    fontWeight: '600' as const,
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.light.primary,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 4,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFF',
  },
});
