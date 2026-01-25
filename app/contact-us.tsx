import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Alert, Linking, ActivityIndicator } from 'react-native';
import { Stack, router } from 'expo-router';
import { Mail, User, MessageSquare, ChevronDown, Send, CheckCircle, ArrowLeft } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { trpc } from '@/lib/trpc';

const SUBJECTS = [
  'Select a subject',
  'App Issue / Bug Report',
  'Feature Request',
  'Subscription Help',
  'General Feedback',
  'Other',
];

const getApiBaseUrl = () => {
  return process.env.EXPO_PUBLIC_RORK_API_BASE_URL || '';
};

export default function ContactUsScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const baseUrl = getApiBaseUrl();
        console.log('[Contact] API Base URL:', baseUrl);
        const response = await fetch(`${baseUrl}/api`, { method: 'GET' });
        const data = await response.json();
        console.log('[Contact] Backend health check:', data);
      } catch (error) {
        console.error('[Contact] Backend health check failed:', error);
      }
    };
    checkBackend();
  }, []);

  const sendEmailMutation = trpc.contact.sendEmail.useMutation({
    onSuccess: () => {
      console.log('[Contact] Email sent successfully via tRPC');
      setIsSending(false);
      setShowConfirmation(true);
    },
    onError: (error) => {
      console.error('[Contact] tRPC error:', error);
      sendEmailDirectly();
    },
  });

  const sendEmailDirectly = async () => {
    console.log('[Contact] Attempting direct API call...');
    try {
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/api/trpc/contact.sendEmail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          json: {
            name: name.trim(),
            email: email.trim(),
            subject,
            message: message.trim(),
          },
        }),
      });
      
      console.log('[Contact] Direct API response status:', response.status);
      const data = await response.json();
      console.log('[Contact] Direct API response:', data);
      
      if (response.ok && data.result?.data?.json?.success) {
        setShowConfirmation(true);
      } else {
        throw new Error(data.error?.message || 'Failed to send email');
      }
    } catch (error) {
      console.error('[Contact] Direct API error:', error);
      Alert.alert(
        'Error', 
        'Failed to send your message. Please email us directly at info.lawnguardian@yahoo.com',
        [
          { text: 'Email Us', onPress: () => Linking.openURL('mailto:info.lawnguardian@yahoo.com') },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleSendEmail = () => {
    if (!name.trim() || !email.trim() || !subject || subject === 'Select a subject' || !message.trim()) {
      Alert.alert('Missing Information', 'Please fill in all fields before sending.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    setIsSending(true);
    console.log('[Contact] Starting email send...');
    
    sendEmailMutation.mutate({
      name: name.trim(),
      email: email.trim(),
      subject,
      message: message.trim(),
    });
  };

  const isLoading = isSending || sendEmailMutation.isPending;

  const handleEmailLink = () => {
    Linking.openURL('mailto:info.lawnguardian@yahoo.com');
  };

  const handleSendAnother = () => {
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setShowConfirmation(false);
  };

  const handleGoBack = () => {
    router.back();
  };

  if (showConfirmation) {
    return (
      <View style={styles.container}>
        <Stack.Screen 
          options={{ 
            title: 'Contact Us',
            headerShown: true,
            headerBackTitle: 'Back',
          }} 
        />
        <View style={styles.confirmationContainer}>
          <View style={styles.confirmationIconContainer}>
            <CheckCircle size={72} color={Colors.light.primary} />
          </View>
          <Text style={styles.confirmationTitle}>Message Sent!</Text>
          <Text style={styles.confirmationSubtitle}>
            Thank you for reaching out to us. We have received your message and will get back to you as soon as possible.
          </Text>
          <Text style={styles.confirmationEmail}>
            A copy has been sent to:{'\n'}
            <Text style={styles.confirmationEmailAddress}>{email}</Text>
          </Text>
          
          <View style={styles.confirmationButtons}>
            <Pressable 
              style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}
              onPress={handleGoBack}
            >
              <ArrowLeft size={18} color="#FFF" />
              <Text style={styles.primaryButtonText}>Back to Profile</Text>
            </Pressable>
            
            <Pressable 
              style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
              onPress={handleSendAnother}
            >
              <Send size={18} color={Colors.light.primary} />
              <Text style={styles.secondaryButtonText}>Send Another Message</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

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
            We are here to help! Reach out to us for app issues, feedback, or suggestions.
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
                editable={!isLoading}
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
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabelText}>Subject</Text>
              <Pressable 
                style={styles.dropdown}
                onPress={() => !isLoading && setShowSubjectDropdown(!showSubjectDropdown)}
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
                editable={!isLoading}
              />
            </View>

            <Pressable 
              style={({ pressed }) => [
                styles.sendButton, 
                pressed && styles.buttonPressed,
                isLoading && styles.sendButtonDisabled
              ]}
              onPress={handleSendEmail}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <ActivityIndicator size="small" color="#FFF" />
                  <Text style={styles.sendButtonText}>Sending...</Text>
                </>
              ) : (
                <>
                  <Send size={18} color="#FFF" />
                  <Text style={styles.sendButtonText}>Send E-mail</Text>
                </>
              )}
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
    paddingBottom: 40,
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
  sendButtonDisabled: {
    backgroundColor: Colors.light.textMuted,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFF',
  },
  confirmationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  confirmationIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  confirmationTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  confirmationSubtitle: {
    fontSize: 16,
    color: Colors.light.textMuted,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  confirmationEmail: {
    fontSize: 14,
    color: Colors.light.textMuted,
    textAlign: 'center',
    marginBottom: 32,
  },
  confirmationEmailAddress: {
    color: Colors.light.primary,
    fontWeight: '600' as const,
  },
  confirmationButtons: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.light.primary,
    paddingVertical: 16,
    borderRadius: 12,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFF',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFF',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.primary,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.primary,
  },
});
