import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Camera, Upload, Zap, Search, Leaf, Shield, Check, X, ChevronDown } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import Colors from '@/constants/colors';
import { useLawn } from '@/providers/LawnProvider';
import { GrassType, GRASS_TYPE_LABELS } from '@/types/lawn';

export default function ScanScreen() {
  const router = useRouter();
  const { profile } = useLawn();
  const [selectedGrassType, setSelectedGrassType] = useState<GrassType | null>(profile.grassType || null);
  const [showGrassDropdown, setShowGrassDropdown] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const grassTypes = Object.entries(GRASS_TYPE_LABELS) as [GrassType, string][];

  const tips = [
    { text: 'Get close to the problem area (2-3 feet away)', good: true },
    { text: 'Hold your phone steady and focus clearly', good: true },
    { text: 'Avoid shadows falling across the problem area', good: true },
    { text: 'Use natural daylight for best results', good: true },
    { text: 'Include both affected and healthy grass if possible', good: true },
    { text: "Don't use flash - it washes out colors", good: false },
  ];

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant photo library access to upload images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      console.log('Image selected:', result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera access to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      console.log('Photo taken:', result.assets[0].uri);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.upgradeBar}>
          <View style={styles.upgradeLeft}>
            <Zap size={16} color={Colors.light.primary} />
            <Text style={styles.upgradeText}>
              <Text style={styles.upgradeCount}>{profile.scansRemaining} free scan remaining</Text>
              {'\n'}
              <Text style={styles.upgradeSubtext}>Upgrade to Pro for unlimited scans</Text>
            </Text>
          </View>
          <Pressable 
            style={styles.upgradeButton}
            onPress={() => router.push('/plans')}
          >
            <Text style={styles.upgradeButtonText}>Upgrade</Text>
          </Pressable>
        </View>

        <Text style={styles.title}>Scan Your Lawn Problem</Text>
        <Text style={styles.subtitle}>
          Upload a clear, well-lit photo of the affected area for accurate AI diagnosis
        </Text>

        <View style={styles.featureBadges}>
          <View style={styles.featureBadge}>
            <Zap size={12} color={Colors.light.primary} />
            <Text style={styles.featureBadgeText}>AI-Powered</Text>
          </View>
          <View style={[styles.featureBadge, styles.featureBadgeOutline]}>
            <Search size={12} color={Colors.light.primary} />
            <Text style={[styles.featureBadgeText, styles.featureBadgeTextOutline]}>Disease Detection</Text>
          </View>
          <View style={[styles.featureBadge, styles.featureBadgeOutline]}>
            <Leaf size={12} color={Colors.light.primary} />
            <Text style={[styles.featureBadgeText, styles.featureBadgeTextOutline]}>Weed Detection</Text>
          </View>
          <View style={[styles.featureBadge, styles.featureBadgeOutline]}>
            <Shield size={12} color={Colors.light.primary} />
            <Text style={[styles.featureBadgeText, styles.featureBadgeTextOutline]}>Expert Treatments</Text>
          </View>
        </View>

        <View style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <Camera size={20} color={Colors.light.primary} />
            <Text style={styles.tipsTitle}>Tips for the Best Photo</Text>
          </View>
          <View style={styles.tipsGrid}>
            {tips.map((tip, index) => (
              <View key={index} style={styles.tipItem}>
                {tip.good ? (
                  <Check size={14} color={Colors.light.primary} />
                ) : (
                  <X size={14} color={Colors.light.error} />
                )}
                <Text style={[styles.tipText, !tip.good && styles.tipTextBad]}>{tip.text}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.grassTypeSection}>
          <Text style={styles.grassTypeLabel}>Select Your Grass Type *</Text>
          <Pressable 
            style={styles.grassTypeDropdown}
            onPress={() => setShowGrassDropdown(!showGrassDropdown)}
          >
            <Text style={[styles.grassTypeValue, !selectedGrassType && styles.grassTypePlaceholder]}>
              {selectedGrassType ? GRASS_TYPE_LABELS[selectedGrassType] : '-- Select Your Grass Type --'}
            </Text>
            <ChevronDown size={20} color={Colors.light.textMuted} />
          </Pressable>
          {!selectedGrassType && (
            <Text style={styles.grassTypeHint}>Please select your grass type for accurate diagnosis</Text>
          )}
          
          {showGrassDropdown && (
            <View style={styles.dropdownList}>
              {grassTypes.map(([type, label]) => (
                <Pressable
                  key={type}
                  style={[styles.dropdownItem, selectedGrassType === type && styles.dropdownItemActive]}
                  onPress={() => {
                    setSelectedGrassType(type);
                    setShowGrassDropdown(false);
                  }}
                >
                  <Text style={[styles.dropdownItemText, selectedGrassType === type && styles.dropdownItemTextActive]}>
                    {label}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        <View style={styles.uploadSection}>
          <View style={styles.uploadBox}>
            <View style={styles.uploadIconContainer}>
              <Camera size={32} color={Colors.light.primary} />
            </View>
            <Text style={styles.uploadTitle}>Upload a photo of your lawn problem</Text>
            <Text style={styles.uploadSubtitle}>A clear, focused photo helps our AI provide an accurate diagnosis</Text>
            
            <View style={styles.uploadButtons}>
              <Pressable 
                style={({ pressed }) => [styles.uploadPhotoButton, pressed && styles.buttonPressed]}
                onPress={pickImage}
              >
                <Upload size={18} color={Colors.light.primary} />
                <Text style={styles.uploadPhotoButtonText}>Upload Photo</Text>
              </Pressable>
              <Pressable 
                style={({ pressed }) => [styles.useCameraButton, pressed && styles.buttonPressed]}
                onPress={takePhoto}
              >
                <Camera size={18} color="#FFF" />
                <Text style={styles.useCameraButtonText}>Use Camera</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.signInPrompt}>
          <Text style={styles.signInText}>
            Want to save your results? <Text style={styles.signInLink}>Sign in</Text> to save your photos, diagnoses, and treatment plans to
          </Text>
        </View>

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
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  upgradeBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#D1FAE5',
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
  },
  upgradeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  upgradeText: {
    marginLeft: 10,
    flex: 1,
  },
  upgradeCount: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  upgradeSubtext: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  upgradeButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  upgradeButtonText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#FFF',
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
    marginBottom: 20,
  },
  featureBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  featureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 4,
  },
  featureBadgeOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  featureBadgeText: {
    fontSize: 12,
    color: Colors.light.text,
    fontWeight: '500' as const,
  },
  featureBadgeTextOutline: {
    color: Colors.light.textSecondary,
  },
  tipsCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  tipsTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  tipsGrid: {
    gap: 10,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  tipText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
  tipTextBad: {
    color: Colors.light.error,
  },
  grassTypeSection: {
    marginBottom: 24,
  },
  grassTypeLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  grassTypeDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  grassTypeValue: {
    fontSize: 14,
    color: Colors.light.text,
  },
  grassTypePlaceholder: {
    color: Colors.light.textMuted,
  },
  grassTypeHint: {
    fontSize: 12,
    color: Colors.light.primary,
    marginTop: 6,
    fontStyle: 'italic',
  },
  dropdownList: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 200,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
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
  uploadSection: {
    marginBottom: 20,
  },
  uploadBox: {
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: Colors.light.border,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  uploadIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: 6,
  },
  uploadSubtitle: {
    fontSize: 13,
    color: Colors.light.textMuted,
    textAlign: 'center',
    marginBottom: 20,
  },
  uploadButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  uploadPhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: Colors.light.border,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  uploadPhotoButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  useCameraButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.light.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  useCameraButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#FFF',
  },
  signInPrompt: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 12,
  },
  signInText: {
    fontSize: 13,
    color: '#92400E',
    lineHeight: 18,
  },
  signInLink: {
    color: Colors.light.primary,
    fontWeight: '600' as const,
  },
  bottomPadding: {
    height: 40,
  },
});
