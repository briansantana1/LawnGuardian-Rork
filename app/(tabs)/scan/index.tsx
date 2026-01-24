import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Platform, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Camera, Upload, Zap, Search, Leaf, Shield, Check, X, ChevronDown, AlertCircle, Sparkles } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import Colors from '@/constants/colors';
import { useLawn } from '@/providers/LawnProvider';
import { GrassType, GRASS_TYPE_LABELS } from '@/types/lawn';
import * as z from 'zod';
import { generateObject } from '@rork-ai/toolkit-sdk';

export default function ScanScreen() {
  const router = useRouter();
  const { profile, addSavedPlan } = useLawn();
  const [selectedGrassType, setSelectedGrassType] = useState<GrassType | null>(profile.grassType || null);
  const [showGrassDropdown, setShowGrassDropdown] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const grassTypes = Object.entries(GRASS_TYPE_LABELS) as [GrassType, string][];
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const hasAutoAnalyzed = useRef(false);

  const [analysisResult, setAnalysisResult] = useState<{
    diagnosis: string;
    severity: 'mild' | 'moderate' | 'severe';
    confidence: number;
    issues: { name: string; description: string; type: string }[];
    healthScore: number;
    treatment: {
      immediate: string[];
      shortTerm: string[];
      longTerm: string[];
      products: { name: string; purpose: string; applicationTiming: string }[];
    };
    preventionTips: string[];
  } | null>(null);

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
      hasAutoAnalyzed.current = false;
      setSelectedImage(result.assets[0].uri);
      setAnalysisResult(null);
      console.log('Image selected:', result.assets[0].uri);
    }
  };

  const analyzeImage = useCallback(async () => {
    if (!selectedImage) {
      Alert.alert('No Image', 'Please select or take a photo first.');
      return;
    }
    if (!selectedGrassType) {
      Alert.alert('Grass Type Required', 'Please select your grass type for accurate diagnosis.');
      return;
    }
    if (profile.scansRemaining <= 0 && profile.subscriptionStatus === 'free') {
      Alert.alert('No Scans Remaining', 'Upgrade to Pro for unlimited scans.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Upgrade', onPress: () => router.push('/plans') },
      ]);
      return;
    }

    try {
      let base64Image = '';
      if (Platform.OS === 'web') {
        const response = await fetch(selectedImage);
        const blob = await response.blob();
        base64Image = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
      } else {
        const base64 = await FileSystem.readAsStringAsync(selectedImage, {
          encoding: 'base64',
        });
        base64Image = `data:image/jpeg;base64,${base64}`;
      }

      console.log('Starting lawn analysis...');
      setIsAnalyzing(true);
      
      try {
        const LawnAnalysisSchema = z.object({
          diagnosis: z.string().describe("Primary diagnosis of the lawn problem"),
          severity: z.enum(["mild", "moderate", "severe"]).describe("Severity level"),
          confidence: z.number().min(0).max(100).describe("Confidence percentage"),
          issues: z.array(z.object({
            name: z.string(),
            description: z.string(),
            type: z.string(),
          })).describe("List of identified issues"),
          healthScore: z.number().min(0).max(100).describe("Overall lawn health score"),
          treatment: z.object({
            immediate: z.array(z.string()),
            shortTerm: z.array(z.string()),
            longTerm: z.array(z.string()),
            products: z.array(z.object({
              name: z.string(),
              purpose: z.string(),
              applicationTiming: z.string(),
            })),
          }),
          preventionTips: z.array(z.string()),
        });

        const systemPrompt = `You are an expert lawn care specialist. Analyze the lawn image and identify issues.

Context:
- Grass Type: ${GRASS_TYPE_LABELS[selectedGrassType]}
${profile.location ? `- Location: ${profile.location}` : ""}

Provide diagnosis, severity, treatment plan, and prevention tips.`;

        console.log('[Scan] Calling generateObject via SDK...');
        console.log('[Scan] Image data length:', base64Image.length);
        
        const analysis = await generateObject({
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: systemPrompt },
                { type: "image", image: base64Image },
              ],
            },
          ],
          schema: LawnAnalysisSchema,
        }) as z.infer<typeof LawnAnalysisSchema>;

        console.log('[Scan] Analysis successful:', analysis.diagnosis);
        setAnalysisResult(analysis);
        
        if (profile.scansRemaining > 0) {
          addSavedPlan({
            title: analysis.diagnosis,
            diagnosis: analysis.issues.map((i: { description: string }) => i.description).join('. '),
            treatment: analysis.treatment.immediate.join('. '),
            imageUrl: selectedImage || undefined,
          });
        }
      } catch (analysisError: unknown) {
        console.error('[Scan] Analysis error:', analysisError);
        let errorMessage = 'Failed to analyze image. Please try again.';
        if (analysisError instanceof Error) {
          errorMessage = analysisError.message;
          console.error('[Scan] Error name:', analysisError.name);
          console.error('[Scan] Error stack:', analysisError.stack);
        } else if (typeof analysisError === 'object' && analysisError !== null) {
          const errObj = analysisError as Record<string, unknown>;
          errorMessage = String(errObj.message || errObj.error || JSON.stringify(analysisError));
        }
        Alert.alert('Analysis Failed', errorMessage);
      } finally {
        setIsAnalyzing(false);
      }
    } catch (error) {
      console.error('Error preparing image:', error);
      Alert.alert('Error', 'Failed to process image. Please try again.');
    }
  }, [selectedImage, selectedGrassType, profile, router, addSavedPlan]);

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
      hasAutoAnalyzed.current = false;
      setSelectedImage(result.assets[0].uri);
      setAnalysisResult(null);
      console.log('Photo taken:', result.assets[0].uri);
    }
  };

  useEffect(() => {
    if (selectedImage && selectedGrassType && !analysisResult && !isAnalyzing && !hasAutoAnalyzed.current) {
      hasAutoAnalyzed.current = true;
      analyzeImage();
    }
  }, [selectedImage, selectedGrassType, analysisResult, isAnalyzing, analyzeImage]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.upgradeBar}>
          <View style={styles.upgradeLeft}>
            <View style={styles.upgradeIconCircle}>
              <Zap size={16} color={Colors.light.primary} fill={Colors.light.primary} />
            </View>
            <View style={styles.upgradeTextContainer}>
              <Text style={styles.upgradeCount}>{profile.scansRemaining} free scan remaining</Text>
              <Text style={styles.upgradeSubtext}>Upgrade to Pro for unlimited scans</Text>
            </View>
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
          <View style={[styles.featureBadge, styles.featureBadgeOrange]}>
            <Search size={12} color="#D97706" />
            <Text style={[styles.featureBadgeText, styles.featureBadgeTextOrange]}>Disease Detection</Text>
          </View>
        </View>
        <View style={styles.featureBadgesCentered}>
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
            <View style={styles.tipsColumn}>
              {tips.slice(0, 3).map((tip, index) => (
                <View key={index} style={styles.tipItem}>
                  <View style={[styles.tipIconCircle, !tip.good && styles.tipIconCircleBad]}>
                    {tip.good ? (
                      <Check size={12} color={Colors.light.primary} />
                    ) : (
                      <X size={12} color={Colors.light.error} />
                    )}
                  </View>
                  <Text style={[styles.tipText, !tip.good && styles.tipTextBad]}>{tip.text}</Text>
                </View>
              ))}
            </View>
            <View style={styles.tipsColumn}>
              {tips.slice(3, 6).map((tip, index) => (
                <View key={index} style={styles.tipItem}>
                  <View style={[styles.tipIconCircle, !tip.good && styles.tipIconCircleBad]}>
                    {tip.good ? (
                      <Check size={12} color={Colors.light.primary} />
                    ) : (
                      <X size={12} color={Colors.light.error} />
                    )}
                  </View>
                  <Text style={[styles.tipText, !tip.good && styles.tipTextBad]}>{tip.text}</Text>
                </View>
              ))}
            </View>
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

        {selectedImage && (
          <View style={styles.selectedImageContainer}>
            <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
            <Pressable 
              style={styles.removeImageButton}
              onPress={() => {
                setSelectedImage(null);
                setAnalysisResult(null);
              }}
            >
              <X size={16} color="#FFF" />
            </Pressable>
          </View>
        )}

        {selectedImage && !analysisResult && (
          <Pressable
            style={({ pressed }) => [
              styles.analyzeButton,
              pressed && styles.buttonPressed,
              isAnalyzing && styles.analyzeButtonDisabled,
            ]}
            onPress={analyzeImage}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <ActivityIndicator size="small" color="#FFF" />
                <Text style={styles.analyzeButtonText}>Analyzing...</Text>
              </>
            ) : (
              <>
                <Sparkles size={20} color="#FFF" />
                <Text style={styles.analyzeButtonText}>Analyze Lawn</Text>
              </>
            )}
          </Pressable>
        )}

        {analysisResult && (
          <View style={styles.resultsContainer}>
            <View style={styles.resultsHeader}>
              <Sparkles size={20} color={Colors.light.primary} />
              <Text style={styles.resultsTitle}>Analysis Results</Text>
            </View>

            <View style={styles.diagnosisCard}>
              <View style={styles.diagnosisHeader}>
                <Text style={styles.diagnosisLabel}>Diagnosis</Text>
                <View style={[styles.severityBadge, styles[`severity${analysisResult.severity.charAt(0).toUpperCase() + analysisResult.severity.slice(1)}` as keyof typeof styles]]}>
                  <Text style={styles.severityText}>{analysisResult.severity}</Text>
                </View>
              </View>
              <Text style={styles.diagnosisText}>{analysisResult.diagnosis}</Text>
              <View style={styles.confidenceRow}>
                <Text style={styles.confidenceLabel}>Confidence:</Text>
                <Text style={styles.confidenceValue}>{analysisResult.confidence}%</Text>
              </View>
            </View>

            <View style={styles.healthScoreCard}>
              <Text style={styles.healthScoreLabel}>Lawn Health Score</Text>
              <View style={styles.healthScoreCircle}>
                <Text style={styles.healthScoreValue}>{analysisResult.healthScore}</Text>
                <Text style={styles.healthScoreMax}>/100</Text>
              </View>
            </View>

            {analysisResult.issues.length > 0 && (
              <View style={styles.issuesCard}>
                <Text style={styles.sectionTitle}>Identified Issues</Text>
                {analysisResult.issues.map((issue, index) => (
                  <View key={index} style={styles.issueItem}>
                    <AlertCircle size={16} color={Colors.light.error} />
                    <View style={styles.issueContent}>
                      <Text style={styles.issueName}>{issue.name}</Text>
                      <Text style={styles.issueDescription}>{issue.description}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.treatmentCard}>
              <Text style={styles.sectionTitle}>Treatment Plan</Text>
              
              <Text style={styles.treatmentSubtitle}>Immediate Actions</Text>
              {analysisResult.treatment.immediate.map((action, index) => (
                <View key={index} style={styles.treatmentItem}>
                  <Check size={14} color={Colors.light.primary} />
                  <Text style={styles.treatmentText}>{action}</Text>
                </View>
              ))}

              <Text style={styles.treatmentSubtitle}>Short-Term (1-2 weeks)</Text>
              {analysisResult.treatment.shortTerm.map((action, index) => (
                <View key={index} style={styles.treatmentItem}>
                  <Check size={14} color={Colors.light.primary} />
                  <Text style={styles.treatmentText}>{action}</Text>
                </View>
              ))}

              <Text style={styles.treatmentSubtitle}>Long-Term Maintenance</Text>
              {analysisResult.treatment.longTerm.map((action, index) => (
                <View key={index} style={styles.treatmentItem}>
                  <Check size={14} color={Colors.light.primary} />
                  <Text style={styles.treatmentText}>{action}</Text>
                </View>
              ))}
            </View>

            {analysisResult.treatment.products.length > 0 && (
              <View style={styles.productsCard}>
                <Text style={styles.sectionTitle}>Recommended Products</Text>
                {analysisResult.treatment.products.map((product, index) => (
                  <View key={index} style={styles.productItem}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.productPurpose}>{product.purpose}</Text>
                    <Text style={styles.productTiming}>Apply: {product.applicationTiming}</Text>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.preventionCard}>
              <Text style={styles.sectionTitle}>Prevention Tips</Text>
              {analysisResult.preventionTips.map((tip, index) => (
                <View key={index} style={styles.preventionItem}>
                  <Shield size={14} color={Colors.light.primary} />
                  <Text style={styles.preventionText}>{tip}</Text>
                </View>
              ))}
            </View>

            <Pressable
              style={styles.newScanButton}
              onPress={() => {
                setSelectedImage(null);
                setAnalysisResult(null);
              }}
            >
              <Camera size={18} color={Colors.light.primary} />
              <Text style={styles.newScanButtonText}>Start New Scan</Text>
            </Pressable>
          </View>
        )}

        {!analysisResult && (
          <View style={styles.signInPrompt}>
            <Text style={styles.signInText}>
              Want to save your results? <Text style={styles.signInLink}>Sign in</Text> to save your photos, diagnoses, and treatment plans
            </Text>
          </View>
        )}

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
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  upgradeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  upgradeIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  upgradeTextContainer: {
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
    marginTop: 1,
  },
  upgradeButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  upgradeButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#FFF',
  },
  title: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  featureBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
    justifyContent: 'center',
  },
  featureBadgesCentered: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  featureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    gap: 6,
  },
  featureBadgeOrange: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  featureBadgeOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  featureBadgeText: {
    fontSize: 12,
    color: Colors.light.text,
    fontWeight: '500' as const,
  },
  featureBadgeTextOrange: {
    color: '#D97706',
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
    borderColor: '#E5E7EB',
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
    flexDirection: 'row',
    gap: 16,
  },
  tipsColumn: {
    flex: 1,
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  tipIconCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 1,
  },
  tipIconCircleBad: {
    backgroundColor: '#FEE2E2',
  },
  tipText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    flex: 1,
    lineHeight: 16,
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
  selectedImageContainer: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative' as const,
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute' as const,
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  analyzeButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 10,
    backgroundColor: Colors.light.primary,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  analyzeButtonDisabled: {
    opacity: 0.7,
  },
  analyzeButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFF',
  },
  resultsContainer: {
    marginBottom: 20,
  },
  resultsHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  diagnosisCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  diagnosisHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    marginBottom: 8,
  },
  diagnosisLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.light.textMuted,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  severityBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  severityMild: {
    backgroundColor: '#D1FAE5',
  },
  severityModerate: {
    backgroundColor: '#FEF3C7',
  },
  severitySevere: {
    backgroundColor: '#FEE2E2',
  },
  severityText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.light.text,
    textTransform: 'capitalize' as const,
  },
  diagnosisText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 12,
    lineHeight: 22,
  },
  confidenceRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 6,
  },
  confidenceLabel: {
    fontSize: 13,
    color: Colors.light.textMuted,
  },
  confidenceValue: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.light.primary,
  },
  healthScoreCard: {
    backgroundColor: '#D1FAE5',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    alignItems: 'center' as const,
  },
  healthScoreLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  healthScoreCircle: {
    flexDirection: 'row' as const,
    alignItems: 'baseline' as const,
  },
  healthScoreValue: {
    fontSize: 48,
    fontWeight: '700' as const,
    color: Colors.light.primary,
  },
  healthScoreMax: {
    fontSize: 18,
    fontWeight: '500' as const,
    color: Colors.light.textSecondary,
  },
  issuesCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 12,
  },
  issueItem: {
    flexDirection: 'row' as const,
    gap: 10,
    marginBottom: 12,
  },
  issueContent: {
    flex: 1,
  },
  issueName: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 2,
  },
  issueDescription: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    lineHeight: 18,
  },
  treatmentCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  treatmentSubtitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.primary,
    marginTop: 12,
    marginBottom: 8,
  },
  treatmentItem: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    gap: 8,
    marginBottom: 8,
  },
  treatmentText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
  productsCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  productItem: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  productPurpose: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  productTiming: {
    fontSize: 12,
    color: Colors.light.primary,
    fontStyle: 'italic' as const,
  },
  preventionCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  preventionItem: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    gap: 8,
    marginBottom: 8,
  },
  preventionText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
  newScanButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 8,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: Colors.light.primary,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 20,
  },
  newScanButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.primary,
  },
});
