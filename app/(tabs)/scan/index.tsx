import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Platform, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Camera, Upload, Zap, Search, Leaf, Shield, Check, X, ChevronDown, AlertCircle, Sparkles, Eye, AlertTriangle, Beaker, FlaskConical, Settings, Clock, CalendarPlus, BookOpen, ArrowLeft } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import Colors from '@/constants/colors';
import { useLawn } from '@/providers/LawnProvider';
import { usePurchases } from '@/providers/PurchasesProvider';
import { GrassType, GRASS_TYPE_LABELS } from '@/types/lawn';
import * as z from 'zod';
import { generateObject } from '@rork-ai/toolkit-sdk';

export default function ScanScreen() {
  const router = useRouter();
  const { profile, addSavedPlan } = useLawn();
  const { isPro, refreshCustomerInfo, customerInfo, isLoadingCustomerInfo } = usePurchases();
  
  // Refresh customer info when scan screen mounts
  useEffect(() => {
    console.log('[Scan] Screen mounted, refreshing customer info...');
    console.log('[Scan] Current isPro:', isPro);
    console.log('[Scan] Active entitlements:', customerInfo?.entitlements?.active);
    console.log('[Scan] Active subscriptions:', customerInfo?.activeSubscriptions);
    refreshCustomerInfo();
  }, []);
  
  const [selectedGrassType, setSelectedGrassType] = useState<GrassType | null>(null);
  const [showGrassDropdown, setShowGrassDropdown] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    diagnosis: string;
    diagnosisTitle: string;
    riskLevel: 'low' | 'medium' | 'high';
    issueType: 'weed' | 'disease' | 'pest' | 'nutrient' | 'environmental';
    confidence: number;
    detailedDescription: string;
    symptoms: string[];
    causes: string[];
    identificationSources: {
      primaryId: string;
      issuesDetected: { name: string; confidence: number }[];
    };
    treatmentOptions: {
      organic: string[];
      chemical: string[];
      cultural: string[];
    };
    expectedRecovery: string;
    preventionTips: string[];
    healthScore: number;
  } | null>(null);
  
  const hasAutoAnalyzed = useRef(false);
  const hasInitializedGrassType = useRef(false);
  
  const grassTypes = Object.entries(GRASS_TYPE_LABELS) as [GrassType, string][];

  useEffect(() => {
    if (!hasInitializedGrassType.current && profile.grassType) {
      hasInitializedGrassType.current = true;
      setSelectedGrassType(profile.grassType);
    }
  }, [profile.grassType]);

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
    // Always get fresh customer info before checking
    let currentIsPro = isPro;
    
    // If we have customer info, double-check the subscription status directly
    if (customerInfo) {
      const hasAnyActiveEntitlement = customerInfo.entitlements?.active 
        ? Object.keys(customerInfo.entitlements.active).length > 0 
        : false;
      const hasActiveSubscription = (customerInfo.activeSubscriptions || []).length > 0;
      currentIsPro = hasAnyActiveEntitlement || hasActiveSubscription;
    }
    
    console.log('[Scan] Checking scan permission - scansRemaining:', profile.scansRemaining, 'isPro:', isPro, 'currentIsPro:', currentIsPro);
    console.log('[Scan] Customer info at scan time:', {
      activeSubscriptions: customerInfo?.activeSubscriptions,
      activeEntitlements: customerInfo?.entitlements?.active ? Object.keys(customerInfo.entitlements.active) : [],
    });
    
    if (profile.scansRemaining <= 0 && !currentIsPro) {
      Alert.alert('No Scans Remaining', 'Upgrade to Pro for unlimited scans.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Upgrade', onPress: () => router.push('/plans') },
      ]);
      return;
    }

    try {
      let base64Image = '';
      console.log('[Scan] Processing image URI:', selectedImage);
      
      if (Platform.OS === 'web') {
        const response = await fetch(selectedImage);
        const blob = await response.blob();
        base64Image = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
      } else {
        try {
          // First check if file exists and get info
          const fileInfo = await FileSystem.getInfoAsync(selectedImage);
          console.log('[Scan] File info:', fileInfo);
          
          if (!fileInfo.exists) {
            throw new Error('Image file does not exist');
          }
          
          const base64 = await FileSystem.readAsStringAsync(selectedImage, {
            encoding: 'base64',
          });
          base64Image = `data:image/jpeg;base64,${base64}`;
        } catch (fileError) {
          console.error('[Scan] FileSystem error, trying fetch fallback:', fileError);
          // Fallback: try using fetch for iOS camera images
          const response = await fetch(selectedImage);
          const blob = await response.blob();
          base64Image = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = () => reject(new Error('Failed to read image blob'));
            reader.readAsDataURL(blob);
          });
        }
      }

      console.log('Starting lawn analysis...');
      setIsAnalyzing(true);
      
      try {
        const LawnAnalysisSchema = z.object({
          diagnosis: z.string().describe("Brief diagnosis summary"),
          diagnosisTitle: z.string().describe("Short title like 'Dandelion Weed Infestation' or 'Brown Patch Disease'"),
          riskLevel: z.enum(["low", "medium", "high"]).describe("Risk level assessment"),
          issueType: z.enum(["weed", "disease", "pest", "nutrient", "environmental"]).describe("Primary type of issue"),
          confidence: z.number().min(0).max(100).describe("Confidence percentage of identification"),
          detailedDescription: z.string().describe("Detailed 3-4 sentence description explaining what you see, why it happens, and the impact on the lawn. Be specific about visual indicators and grass type considerations."),
          symptoms: z.array(z.string()).min(3).max(5).describe("Observable symptoms like 'Dandelion seeds blown in by wind from neighboring areas' or 'Thin or stressed grass allowing weeds to establish'. Each should be a complete observation."),
          causes: z.array(z.string()).min(2).max(4).describe("Root causes like 'Cool weather conditions that favor dandelion growth over warm-season grass' or 'Compacted soil that favors deep-rooted weeds'. Be specific to the grass type."),
          identificationSources: z.object({
            primaryId: z.string().describe("Primary identification method used like 'Plant ID' or 'Disease Pattern Analysis'"),
            issuesDetected: z.array(z.object({
              name: z.string().describe("Scientific or common name of detected issue like 'Cladosporium' or 'Rhizoctonia solani'"),
              confidence: z.number().min(0).max(100).describe("Confidence percentage for this specific detection"),
            })).min(1).max(3),
          }),
          treatmentOptions: z.object({
            organic: z.array(z.string()).min(2).max(6).describe("Organic treatment methods with specific actionable steps. Be detailed like 'Remove the seed head immediately by cutting or pulling it off to prevent seed dispersal' or 'Apply a selective broadleaf herbicide labeled safe for St. Augustine grass'"),
            chemical: z.array(z.string()).min(2).max(6).describe("Chemical treatment options with specific products or active ingredients. Include timing advice like 'For organic control, pour boiling water directly on each dandelion plant or use a dandelion weeding tool to remove the entire taproot'"),
            cultural: z.array(z.string()).min(2).max(6).describe("Cultural practices and lawn care adjustments like 'Fill any bare spots left behind with St. Augustine grass plugs or seed to prevent new weed establishment'"),
          }),
          expectedRecovery: z.string().describe("Detailed recovery timeline like 'Week 1-2: Stop disease progression with treatment applications; existing damage remains visible. Week 3-4: New growth emerges healthy as treatment continues. Week 5-8: Significant recovery with new growth filling in thin areas. Full visual recovery expected in 8-12 weeks with proper treatment and favorable conditions.'"),
          preventionTips: z.array(z.string()).min(4).max(6).describe("Future prevention tips specific to the grass type. Be specific like 'Maintain thick, healthy St. Augustine grass through proper fertilization and watering' or 'Apply pre-emergent herbicide in early spring before dandelion seeds germinate'"),
          healthScore: z.number().min(0).max(100).describe("Overall lawn health score"),
        });

        const systemPrompt = `You are an expert lawn care specialist and plant pathologist providing premium professional analysis. Analyze the lawn image and provide an extremely detailed, comprehensive diagnosis.

Context:
- Grass Type: ${GRASS_TYPE_LABELS[selectedGrassType]}
${profile.location ? `- Location: ${profile.location}` : ""}

Provide a thorough professional analysis that would justify a premium service. Include:
1. A clear, specific diagnosis title
2. Detailed visual observations that confirm the diagnosis
3. Multiple observable symptoms with specific details
4. Root causes specific to this grass type and conditions
5. Comprehensive treatment options (organic, chemical, and cultural)
6. Realistic recovery timeline with week-by-week expectations
7. Prevention tips tailored to this specific grass type

Be very specific and detailed - this is a premium paid service. Avoid generic advice.`;

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

        console.log('[Scan] Analysis successful:', analysis.diagnosisTitle);
        setAnalysisResult(analysis);
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
  }, [selectedImage, selectedGrassType, profile, router, addSavedPlan, isPro, customerInfo]);

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
      const timer = setTimeout(() => {
        analyzeImage();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [selectedImage, selectedGrassType, analysisResult, isAnalyzing, analyzeImage]);

  return (
    <View style={styles.container}>
      {analysisResult && (
        <View style={styles.diagnosisNavHeader}>
          <Pressable
            style={styles.backButton}
            onPress={() => {
              hasAutoAnalyzed.current = false;
              setSelectedImage(null);
              setAnalysisResult(null);
            }}
          >
            <ArrowLeft size={24} color={Colors.light.text} />
          </Pressable>
          <Text style={styles.diagnosisNavTitle}>Diagnosis</Text>
          <View style={styles.backButtonPlaceholder} />
        </View>
      )}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
        {!isPro && (
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
        )}

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
            <View style={styles.diagnosisHeaderCard}>
              <View style={styles.diagnosisTitleRow}>
                <View style={styles.diagnosisTitleLeft}>
                  <Text style={styles.diagnosisTitleIcon}>🌿</Text>
                  <Text style={styles.diagnosisTitleText}>{analysisResult.diagnosisTitle}</Text>
                </View>
                <View style={[styles.riskBadge, styles[`risk${analysisResult.riskLevel.charAt(0).toUpperCase() + analysisResult.riskLevel.slice(1)}` as keyof typeof styles]]}>
                  <Text style={[styles.riskBadgeText, styles[`riskText${analysisResult.riskLevel.charAt(0).toUpperCase() + analysisResult.riskLevel.slice(1)}` as keyof typeof styles]]}>
                    {analysisResult.riskLevel.toUpperCase()} RISK
                  </Text>
                </View>
              </View>
              
              <View style={styles.issueTypeRow}>
                <View style={styles.issueTypeBadge}>
                  <Leaf size={12} color={Colors.light.primary} />
                  <Text style={styles.issueTypeBadgeText}>
                    {analysisResult.issueType.charAt(0).toUpperCase() + analysisResult.issueType.slice(1)}
                  </Text>
                </View>
                <Text style={styles.confidenceText}>{analysisResult.confidence}% confidence</Text>
              </View>
              
              <Text style={styles.detailedDescription}>{analysisResult.detailedDescription}</Text>
            </View>

            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Eye size={18} color={Colors.light.text} />
                <Text style={styles.sectionTitle}>Symptoms</Text>
              </View>
              {analysisResult.symptoms.map((symptom, index) => (
                <View key={index} style={styles.checklistItem}>
                  <View style={styles.checkCircle}>
                    <Check size={12} color={Colors.light.primary} />
                  </View>
                  <Text style={styles.checklistText}>{symptom}</Text>
                </View>
              ))}
            </View>

            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <AlertCircle size={18} color={Colors.light.text} />
                <Text style={styles.sectionTitle}>Causes</Text>
              </View>
              {analysisResult.causes.map((cause, index) => (
                <View key={index} style={styles.causeItem}>
                  <View style={styles.warningCircle}>
                    <AlertTriangle size={12} color="#D97706" />
                  </View>
                  <Text style={styles.causeText}>{cause}</Text>
                </View>
              ))}
            </View>

            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <BookOpen size={18} color={Colors.light.text} />
                <Text style={styles.sectionTitle}>Identification Sources</Text>
              </View>
              <View style={styles.identificationBadges}>
                <View style={styles.plantIdBadge}>
                  <Text style={styles.plantIdText}>{analysisResult.identificationSources.primaryId}</Text>
                </View>
                <View style={styles.issuesDetectedBadge}>
                  <Text style={styles.issuesDetectedText}>Issues detected</Text>
                </View>
              </View>
              {analysisResult.identificationSources.issuesDetected.map((issue, index) => (
                <View key={index} style={styles.detectedIssueItem}>
                  <Text style={styles.detectedIssueName}>{issue.name}</Text>
                  <Text style={styles.detectedIssueConfidence}>({issue.confidence}% confidence)</Text>
                </View>
              ))}
            </View>

            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Beaker size={18} color={Colors.light.text} />
                <Text style={styles.sectionTitle}>Treatment Options</Text>
              </View>
              
              <View style={styles.treatmentSection}>
                <View style={styles.treatmentSectionHeader}>
                  <Leaf size={14} color={Colors.light.primary} />
                  <Text style={styles.treatmentSectionTitle}>Organic Treatments</Text>
                </View>
                {analysisResult.treatmentOptions.organic.map((treatment, index) => (
                  <View key={index} style={styles.treatmentBullet}>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Text style={styles.treatmentText}>{treatment}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.treatmentSection}>
                <View style={styles.treatmentSectionHeader}>
                  <FlaskConical size={14} color="#6366F1" />
                  <Text style={[styles.treatmentSectionTitle, { color: '#6366F1' }]}>Chemical Treatments</Text>
                </View>
                {analysisResult.treatmentOptions.chemical.map((treatment, index) => (
                  <View key={index} style={styles.treatmentBullet}>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Text style={styles.treatmentText}>{treatment}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.treatmentSection}>
                <View style={styles.treatmentSectionHeader}>
                  <Settings size={14} color="#8B5CF6" />
                  <Text style={[styles.treatmentSectionTitle, { color: '#8B5CF6' }]}>Cultural Practices</Text>
                </View>
                {analysisResult.treatmentOptions.cultural.map((treatment, index) => (
                  <View key={index} style={styles.treatmentBullet}>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Text style={styles.treatmentText}>{treatment}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Clock size={18} color={Colors.light.text} />
                <Text style={styles.sectionTitle}>Expected Recovery</Text>
              </View>
              <Text style={styles.recoveryText}>{analysisResult.expectedRecovery}</Text>
            </View>

            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Shield size={18} color={Colors.light.text} />
                <Text style={styles.sectionTitle}>Prevention Tips</Text>
              </View>
              {analysisResult.preventionTips.map((tip, index) => (
                <View key={index} style={styles.checklistItem}>
                  <View style={styles.checkCircle}>
                    <Check size={12} color={Colors.light.primary} />
                  </View>
                  <Text style={styles.checklistText}>{tip}</Text>
                </View>
              ))}
            </View>

            <View style={styles.bottomButtons}>
              <Pressable
                style={styles.newScanButton}
                onPress={() => {
                  hasAutoAnalyzed.current = false;
                  setSelectedImage(null);
                  setAnalysisResult(null);
                }}
              >
                <Camera size={18} color={Colors.light.primary} />
                <Text style={styles.newScanButtonText}>New Scan</Text>
              </Pressable>
              
              <Pressable
                style={styles.saveCalendarButton}
                onPress={() => {
                  if (!profile.email || profile.email === 'guest@example.com') {
                    Alert.alert(
                      'Login Required',
                      'Please sign in to save treatment plans to your calendar.',
                      [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Sign In', onPress: () => router.push('/(tabs)/profile') },
                      ]
                    );
                  } else {
                    addSavedPlan({
                      title: analysisResult.diagnosisTitle,
                      diagnosis: analysisResult.detailedDescription,
                      treatment: analysisResult.treatmentOptions.organic.join('. '),
                      imageUrl: selectedImage || undefined,
                    });
                    Alert.alert('Saved!', 'Treatment plan has been saved to your calendar.');
                  }
                }}
              >
                <CalendarPlus size={18} color="#FFF" />
                <Text style={styles.saveCalendarButtonText}>Save to Calendar</Text>
              </Pressable>
            </View>
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
  diagnosisNavHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: Colors.light.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  backButton: {
    padding: 4,
  },
  backButtonPlaceholder: {
    width: 32,
  },
  diagnosisNavTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },

  diagnosisHeaderCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  diagnosisTitleRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-start' as const,
    marginBottom: 12,
  },
  diagnosisTitleLeft: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    flex: 1,
    paddingRight: 12,
  },
  diagnosisTitleIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  diagnosisTitleText: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.light.text,
    flex: 1,
    lineHeight: 28,
  },
  riskBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  riskLow: {
    backgroundColor: '#D1FAE5',
  },
  riskMedium: {
    backgroundColor: '#FEF3C7',
  },
  riskHigh: {
    backgroundColor: '#FEE2E2',
  },
  riskBadgeText: {
    fontSize: 11,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
  },
  riskTextLow: {
    color: '#059669',
  },
  riskTextMedium: {
    color: '#D97706',
  },
  riskTextHigh: {
    color: '#DC2626',
  },
  issueTypeRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 12,
    marginBottom: 16,
  },
  issueTypeBadge: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 4,
    backgroundColor: '#D1FAE5',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  issueTypeBadgeText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.light.primary,
  },
  confidenceText: {
    fontSize: 13,
    color: Colors.light.textMuted,
  },
  detailedDescription: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 22,
  },
  sectionCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  sectionHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  checklistItem: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    gap: 10,
    marginBottom: 12,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginTop: 1,
  },
  checklistText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    flex: 1,
    lineHeight: 20,
  },
  causeItem: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    gap: 10,
    marginBottom: 12,
  },
  warningCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginTop: 1,
  },
  causeText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    flex: 1,
    lineHeight: 20,
  },
  identificationBadges: {
    flexDirection: 'row' as const,
    gap: 8,
    marginBottom: 12,
  },
  plantIdBadge: {
    backgroundColor: '#1E3A5F',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  plantIdText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: '#FFF',
  },
  issuesDetectedBadge: {
    backgroundColor: '#FEE2E2',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  issuesDetectedText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: '#DC2626',
  },
  detectedIssueItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 6,
  },
  detectedIssueName: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '500' as const,
  },
  detectedIssueConfidence: {
    fontSize: 13,
    color: Colors.light.textMuted,
    marginLeft: 6,
  },
  treatmentSection: {
    marginBottom: 16,
  },
  treatmentSectionHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 6,
    marginBottom: 10,
  },
  treatmentSectionTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.primary,
  },
  treatmentBullet: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    marginBottom: 8,
    paddingLeft: 4,
  },
  bulletPoint: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginRight: 8,
    lineHeight: 20,
  },
  treatmentText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    flex: 1,
    lineHeight: 20,
  },
  recoveryText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 22,
  },
  bottomButtons: {
    flexDirection: 'row' as const,
    gap: 12,
    marginTop: 8,
    marginBottom: 20,
  },
  newScanButton: {
    flex: 1,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 8,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: Colors.light.border,
    paddingVertical: 14,
    borderRadius: 10,
  },
  newScanButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  saveCalendarButton: {
    flex: 1,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 8,
    backgroundColor: Colors.light.primary,
    paddingVertical: 14,
    borderRadius: 10,
  },
  saveCalendarButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#FFF',
  },
});
