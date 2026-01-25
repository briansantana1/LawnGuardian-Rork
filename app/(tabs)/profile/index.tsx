import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, TextInput, Alert, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { User, MapPin, Leaf, Key, ChevronRight, CreditCard, XCircle, RefreshCw, Mail, FileText, LogOut, LogIn, Trash2, X, ChevronDown } from 'lucide-react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import Colors from '@/constants/colors';
import { useLawn } from '@/providers/LawnProvider';
import { usePurchases } from '@/providers/PurchasesProvider';
import { GrassType, GRASS_TYPE_LABELS } from '@/types/lawn';

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, updateProfile, signOut, signIn, signInWithApple, signInWithGoogle, isSignedIn, isAuthLoading } = useLawn();
  const { isPro } = usePurchases();
  const [isAppleAuthAvailable, setIsAppleAuthAvailable] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editEmail, setEditEmail] = useState(profile.email);
  const [editLocation, setEditLocation] = useState(profile.location);
  const [editGrassType, setEditGrassType] = useState<GrassType>(profile.grassType);
  const [showGrassDropdown, setShowGrassDropdown] = useState(false);

  const grassTypes = Object.entries(GRASS_TYPE_LABELS) as [GrassType, string][];

  useEffect(() => {
    if (Platform.OS !== 'web') {
      AppleAuthentication.isAvailableAsync().then(setIsAppleAuthAvailable);
    }
  }, []);

  const handleSaveChanges = () => {
    updateProfile({
      name: editName,
      email: editEmail,
      location: editLocation,
      grassType: editGrassType,
    });
    setShowEditModal(false);
    Alert.alert('Success', 'Profile updated successfully');
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Sign Out', 
        style: 'destructive', 
        onPress: async () => {
          await signOut();
          Alert.alert('Signed Out', 'You have been signed out successfully. Your data has been reset.');
          router.replace('/(tabs)/(home)');
        }
      },
    ]);
  };

  const handleAppleSignIn = async () => {
    const result = await signInWithApple();
    if (result.success) {
      Alert.alert('Success', 'Signed in with Apple successfully!');
    } else if (result.error && result.error !== 'Sign in was cancelled') {
      Alert.alert('Error', result.error);
    }
  };

  const handleGoogleSignIn = async () => {
    const result = await signInWithGoogle();
    if (result.success) {
      Alert.alert('Success', 'Signed in with Google successfully!');
    } else if (result.error && result.error !== 'Google Sign In was cancelled or failed') {
      Alert.alert('Error', result.error);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => console.log('Account deleted') },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>Profile</Text>

          <View style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View style={styles.avatar}>
                <User size={32} color={Colors.light.textMuted} />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{profile.name}</Text>
                <Text style={styles.profileEmail}>{profile.email}</Text>
              </View>
              <Pressable 
                style={styles.editButton}
                onPress={() => {
                  setEditName(profile.name);
                  setEditEmail(profile.email);
                  setEditLocation(profile.location);
                  setEditGrassType(profile.grassType);
                  setShowEditModal(true);
                }}
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </Pressable>
            </View>
            <View style={styles.profileDetails}>
              <View style={styles.profileDetail}>
                <Text style={styles.detailLabel}>Location</Text>
                <Text style={styles.detailValue}>{profile.location}</Text>
              </View>
              <View style={styles.profileDetail}>
                <Text style={styles.detailLabel}>Grass Type</Text>
                <Text style={styles.detailValue}>{GRASS_TYPE_LABELS[profile.grassType]}</Text>
              </View>
            </View>
          </View>

          <View style={styles.subscriptionCard}>
            <View style={[styles.subscriptionIcon, isPro && styles.subscriptionIconPro]}>
              <Key size={24} color={isPro ? '#FFF' : Colors.light.primary} />
            </View>
            <Text style={styles.subscriptionTitle}>{isPro ? 'Pro Member' : 'Subscription'}</Text>
            <Text style={styles.subscriptionDesc}>
              {isPro 
                ? 'You have unlimited access to AI-powered lawn scans and detailed treatment plans.'
                : 'Upgrade to Pro for unlimited AI-powered lawn scans and detailed treatment plans.'
              }
            </Text>
            {!isPro && (
              <Pressable 
                style={styles.upgradeButton}
                onPress={() => router.push('/plans')}
              >
                <Key size={16} color={Colors.light.primary} />
                <Text style={styles.upgradeButtonText}>Upgrade to Pro</Text>
              </Pressable>
            )}
          </View>

          <View style={styles.menuSection}>
            <Pressable 
              style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
              onPress={() => router.push('/plans')}
            >
              <View style={styles.menuIcon}>
                <CreditCard size={20} color={Colors.light.primary} />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>Plans</Text>
                <Text style={styles.menuSubtitle}>View and manage your subscription</Text>
              </View>
              <ChevronRight size={20} color={Colors.light.textMuted} />
            </Pressable>

            <Pressable 
              style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
              onPress={() => router.push('/cancel-membership')}
            >
              <View style={styles.menuIcon}>
                <XCircle size={20} color={Colors.light.primary} />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>Cancel Membership</Text>
                <Text style={styles.menuSubtitle}>Cancel your current subscription</Text>
              </View>
              <ChevronRight size={20} color={Colors.light.textMuted} />
            </Pressable>

            <Pressable 
              style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
              onPress={() => router.push('/restore-membership')}
            >
              <View style={styles.menuIcon}>
                <RefreshCw size={20} color={Colors.light.primary} />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>Restore Membership</Text>
                <Text style={styles.menuSubtitle}>Restore a previous subscription</Text>
              </View>
              <ChevronRight size={20} color={Colors.light.textMuted} />
            </Pressable>

            <Pressable 
              style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
              onPress={() => router.push('/contact-us')}
            >
              <View style={styles.menuIcon}>
                <Mail size={20} color={Colors.light.primary} />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>Contact Us</Text>
                <Text style={styles.menuSubtitle}>Get help or share feedback</Text>
              </View>
              <ChevronRight size={20} color={Colors.light.textMuted} />
            </Pressable>

            <Pressable 
              style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
              onPress={() => router.push('/my-saved-plans')}
            >
              <View style={styles.menuIcon}>
                <FileText size={20} color={Colors.light.primary} />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>My Saved Plans</Text>
                <Text style={styles.menuSubtitle}>View your saved diagnoses and treatments</Text>
              </View>
              <ChevronRight size={20} color={Colors.light.textMuted} />
            </Pressable>
          </View>

          {isSignedIn ? (
            <>
              <Pressable 
                style={({ pressed }) => [styles.signOutButton, pressed && styles.buttonPressed]}
                onPress={handleSignOut}
              >
                <LogOut size={18} color={Colors.light.primary} />
                <Text style={styles.signOutButtonText}>Sign Out</Text>
              </Pressable>

              <Pressable 
                style={({ pressed }) => [styles.deleteButton, pressed && styles.buttonPressed]}
                onPress={handleDeleteAccount}
              >
                <Trash2 size={18} color={Colors.light.error} />
                <Text style={styles.deleteButtonText}>Delete Account</Text>
              </Pressable>
            </>
          ) : (
            <View style={styles.signInSection}>
              <Text style={styles.signInTitle}>Sign In</Text>
              <Text style={styles.signInSubtitle}>Sign in to sync your lawn care data across devices</Text>
              
              {isAuthLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={Colors.light.primary} />
                  <Text style={styles.loadingText}>Signing in...</Text>
                </View>
              ) : (
                <>
                  {Platform.OS !== 'web' && isAppleAuthAvailable && (
                    <AppleAuthentication.AppleAuthenticationButton
                      buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                      buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                      cornerRadius={12}
                      style={styles.appleButton}
                      onPress={handleAppleSignIn}
                    />
                  )}
                  
                  <Pressable 
                    style={({ pressed }) => [styles.googleButton, pressed && styles.buttonPressed]}
                    onPress={handleGoogleSignIn}
                  >
                    <View style={styles.googleIconContainer}>
                      <Text style={styles.googleIcon}>G</Text>
                    </View>
                    <Text style={styles.googleButtonText}>Sign in with Google</Text>
                  </Pressable>

                  <View style={styles.divider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>or</Text>
                    <View style={styles.dividerLine} />
                  </View>

                  <Pressable 
                    style={({ pressed }) => [styles.signInButton, pressed && styles.buttonPressed]}
                    onPress={() => {
                      signIn();
                      Alert.alert('Signed In', 'You have been signed in successfully.');
                    }}
                  >
                    <LogIn size={18} color="#FFF" />
                    <Text style={styles.signInButtonText}>Continue as Guest</Text>
                  </Pressable>
                </>
              )}
            </View>
          )}

          <View style={styles.bottomPadding} />
        </View>
      </ScrollView>

      <Modal
        visible={showEditModal}
        animationType="fade"
        transparent
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <Pressable onPress={() => setShowEditModal(false)}>
                <X size={24} color={Colors.light.textMuted} />
              </Pressable>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.input}
                value={editName}
                onChangeText={setEditName}
                placeholder="Your name"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={[styles.input, styles.inputDisabled]}
                value={editEmail}
                editable={false}
                placeholder="Your email"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Location</Text>
              <TextInput
                style={styles.input}
                value={editLocation}
                onChangeText={setEditLocation}
                placeholder="City, State"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Grass Type</Text>
              <Pressable 
                style={styles.dropdown}
                onPress={() => setShowGrassDropdown(!showGrassDropdown)}
              >
                <Text style={styles.dropdownText}>
                  {GRASS_TYPE_LABELS[editGrassType]}
                </Text>
                <ChevronDown size={20} color={Colors.light.textMuted} />
              </Pressable>
              {showGrassDropdown && (
                <ScrollView style={styles.dropdownList} nestedScrollEnabled>
                  {grassTypes.map(([type, label]) => (
                    <Pressable
                      key={type}
                      style={[styles.dropdownItem, editGrassType === type && styles.dropdownItemActive]}
                      onPress={() => {
                        setEditGrassType(type);
                        setShowGrassDropdown(false);
                      }}
                    >
                      <Text style={[styles.dropdownItemText, editGrassType === type && styles.dropdownItemTextActive]}>
                        {label}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              )}
            </View>

            <View style={styles.modalButtons}>
              <Pressable 
                style={styles.cancelButton}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable 
                style={styles.saveButton}
                onPress={handleSaveChanges}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 20,
  },
  profileCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 13,
    color: Colors.light.textMuted,
  },
  editButton: {
    borderWidth: 1,
    borderColor: Colors.light.primary,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.light.primary,
  },
  profileDetails: {
    flexDirection: 'row',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  profileDetail: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: Colors.light.textMuted,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  subscriptionCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  subscriptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  subscriptionIconPro: {
    backgroundColor: Colors.light.primary,
  },
  subscriptionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 6,
  },
  subscriptionDesc: {
    fontSize: 13,
    color: Colors.light.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.light.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  upgradeButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.primary,
  },
  menuSection: {
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  menuItemPressed: {
    opacity: 0.8,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 12,
    color: Colors.light.textMuted,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: Colors.light.border,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  signOutButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.primary,
  },
  signInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.light.primary,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  signInButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#FFF',
  },
  signInSection: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  signInTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.light.text,
    textAlign: 'center' as const,
    marginBottom: 8,
  },
  signInSubtitle: {
    fontSize: 14,
    color: Colors.light.textMuted,
    textAlign: 'center' as const,
    marginBottom: 24,
    lineHeight: 20,
  },
  appleButton: {
    width: '100%',
    height: 50,
    marginBottom: 12,
  },
  googleButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DADCE0',
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  googleIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFF',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: 12,
  },
  googleIcon: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#4285F4',
  },
  googleButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#1F1F1F',
  },
  divider: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.light.border,
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 13,
    color: Colors.light.textMuted,
  },
  loadingContainer: {
    alignItems: 'center' as const,
    paddingVertical: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.light.textMuted,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  deleteButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.error,
  },
  bottomPadding: {
    height: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
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
  inputDisabled: {
    backgroundColor: '#F3F4F6',
    color: Colors.light.textMuted,
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
  dropdownList: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 150,
  },
  dropdownItem: {
    paddingVertical: 10,
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
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  saveButton: {
    flex: 1,
    backgroundColor: Colors.light.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#FFF',
  },
});
