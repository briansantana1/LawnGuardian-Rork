import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Platform } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as AuthSession from 'expo-auth-session';
import * as Crypto from 'expo-crypto';
import { Task, LawnHealth, WeatherData, UserProfile, SoilTemperature, AIInsight, SavedPlan } from '@/types/lawn';
import { mockTasks, mockLawnHealth, mockWeather, mockUserProfile, mockSoilTemperatures, mockAIInsights, mockSavedPlans, generalTips } from '@/mocks/lawnData';

const TASKS_KEY = 'lawn_tasks';
const PROFILE_KEY = 'lawn_profile';
const SAVED_PLANS_KEY = 'saved_plans';
const IS_SIGNED_IN_KEY = 'is_signed_in';
const AUTH_PROVIDER_KEY = 'auth_provider';
const AUTH_USER_KEY = 'auth_user';

const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID';
const GOOGLE_DISCOVERY = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

export type AuthProvider = 'apple' | 'google' | 'email' | null;

export const [LawnProvider, useLawn] = createContextHook(() => {
  const queryClient = useQueryClient();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [profile, setProfile] = useState<UserProfile>(mockUserProfile);
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>(mockAIInsights);
  const [isRefreshingInsights, setIsRefreshingInsights] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(true);
  const [authProvider, setAuthProvider] = useState<AuthProvider>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const signedInQuery = useQuery({
    queryKey: ['isSignedIn'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(IS_SIGNED_IN_KEY);
      return stored !== 'false';
    },
  });

  useEffect(() => {
    if (signedInQuery.data !== undefined) {
      setIsSignedIn(signedInQuery.data);
    }
  }, [signedInQuery.data]);

  const tasksQuery = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(TASKS_KEY);
      if (stored) {
        return JSON.parse(stored) as Task[];
      }
      await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(mockTasks));
      return mockTasks;
    },
  });

  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(PROFILE_KEY);
      if (stored) {
        return JSON.parse(stored) as UserProfile;
      }
      await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(mockUserProfile));
      return mockUserProfile;
    },
  });

  const savedPlansQuery = useQuery({
    queryKey: ['savedPlans'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(SAVED_PLANS_KEY);
      if (stored) {
        return JSON.parse(stored) as SavedPlan[];
      }
      await AsyncStorage.setItem(SAVED_PLANS_KEY, JSON.stringify(mockSavedPlans));
      return mockSavedPlans;
    },
  });

  useEffect(() => {
    if (tasksQuery.data) {
      setTasks(tasksQuery.data);
    }
  }, [tasksQuery.data]);

  useEffect(() => {
    if (profileQuery.data) {
      setProfile(profileQuery.data);
    }
  }, [profileQuery.data]);

  useEffect(() => {
    if (savedPlansQuery.data) {
      setSavedPlans(savedPlansQuery.data);
    }
  }, [savedPlansQuery.data]);

  const syncTasksMutation = useMutation({
    mutationFn: async (newTasks: Task[]) => {
      await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(newTasks));
      return newTasks;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const syncProfileMutation = useMutation({
    mutationFn: async (newProfile: UserProfile) => {
      await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(newProfile));
      return newProfile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  const syncSavedPlansMutation = useMutation({
    mutationFn: async (newPlans: SavedPlan[]) => {
      await AsyncStorage.setItem(SAVED_PLANS_KEY, JSON.stringify(newPlans));
      return newPlans;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedPlans'] });
    },
  });

  const addTask = useCallback((task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    const updated = [...tasks, newTask];
    setTasks(updated);
    syncTasksMutation.mutate(updated);
  }, [tasks, syncTasksMutation]);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    const updated = tasks.map(t => t.id === id ? { ...t, ...updates } : t);
    setTasks(updated);
    syncTasksMutation.mutate(updated);
  }, [tasks, syncTasksMutation]);

  const deleteTask = useCallback((id: string) => {
    const updated = tasks.filter(t => t.id !== id);
    setTasks(updated);
    syncTasksMutation.mutate(updated);
  }, [tasks, syncTasksMutation]);

  const toggleTaskComplete = useCallback((id: string) => {
    const updated = tasks.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    setTasks(updated);
    syncTasksMutation.mutate(updated);
  }, [tasks, syncTasksMutation]);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    const updated = { ...profile, ...updates };
    setProfile(updated);
    syncProfileMutation.mutate(updated);
  }, [profile, syncProfileMutation]);

  const addSavedPlan = useCallback((plan: Omit<SavedPlan, 'id' | 'createdAt'>) => {
    const newPlan: SavedPlan = {
      ...plan,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const updated = [...savedPlans, newPlan];
    setSavedPlans(updated);
    syncSavedPlansMutation.mutate(updated);
  }, [savedPlans, syncSavedPlansMutation]);

  const deleteSavedPlan = useCallback((id: string) => {
    const updated = savedPlans.filter(p => p.id !== id);
    setSavedPlans(updated);
    syncSavedPlansMutation.mutate(updated);
  }, [savedPlans, syncSavedPlansMutation]);

  const lawnHealth: LawnHealth = mockLawnHealth;
  const weather: WeatherData = mockWeather;
  const soilTemperatures: SoilTemperature[] = mockSoilTemperatures;
  const tips = generalTips;

  const signOut = useCallback(async () => {
    console.log('Signing out...');
    try {
      const freshProfile: UserProfile = {
        id: 'guest',
        name: 'Guest User',
        email: 'Not signed in',
        location: 'Unknown',
        grassType: 'bermuda',
        lawnSize: 0,
        lawnSizeUnit: 'sqft',
        notificationsEnabled: false,
        reminderTime: '09:00',
        subscriptionStatus: 'free',
        scansRemaining: 0,
      };
      
      // Persist to storage first
      await AsyncStorage.setItem(IS_SIGNED_IN_KEY, 'false');
      await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(freshProfile));
      await AsyncStorage.setItem(TASKS_KEY, JSON.stringify([]));
      await AsyncStorage.setItem(SAVED_PLANS_KEY, JSON.stringify([]));
      
      // Update all local state in a single batch
      setIsSignedIn(false);
      setTasks([]);
      setProfile(freshProfile);
      setSavedPlans([]);
      setAiInsights([]);
      
      console.log('Sign out successful - data cleared and reset');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }, []);

  const signIn = useCallback(async () => {
    console.log('Signing in...');
    try {
      await AsyncStorage.setItem(IS_SIGNED_IN_KEY, 'true');
      await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(mockUserProfile));
      await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(mockTasks));
      await AsyncStorage.setItem(SAVED_PLANS_KEY, JSON.stringify(mockSavedPlans));
      
      setIsSignedIn(true);
      setProfile(mockUserProfile);
      setTasks(mockTasks);
      setSavedPlans(mockSavedPlans);
      setAiInsights(mockAIInsights);
      
      console.log('Sign in successful');
    } catch (error) {
      console.error('Error signing in:', error);
    }
  }, []);

  const signInWithApple = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    if (Platform.OS === 'web') {
      return { success: false, error: 'Apple Sign In is not available on web' };
    }
    
    setIsAuthLoading(true);
    console.log('Starting Apple Sign In...');
    
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      
      console.log('Apple Sign In successful:', credential.user);
      
      const fullName = credential.fullName;
      const displayName = fullName 
        ? `${fullName.givenName || ''} ${fullName.familyName || ''}`.trim() || 'Apple User'
        : 'Apple User';
      
      const newProfile: UserProfile = {
        ...mockUserProfile,
        id: credential.user,
        name: displayName,
        email: credential.email || 'Hidden (Apple Privacy)',
      };
      
      await AsyncStorage.setItem(IS_SIGNED_IN_KEY, 'true');
      await AsyncStorage.setItem(AUTH_PROVIDER_KEY, 'apple');
      await AsyncStorage.setItem(AUTH_USER_KEY, credential.user);
      await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(newProfile));
      await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(mockTasks));
      await AsyncStorage.setItem(SAVED_PLANS_KEY, JSON.stringify(mockSavedPlans));
      
      setIsSignedIn(true);
      setAuthProvider('apple');
      setProfile(newProfile);
      setTasks(mockTasks);
      setSavedPlans(mockSavedPlans);
      setAiInsights(mockAIInsights);
      setIsAuthLoading(false);
      
      return { success: true };
    } catch (error: any) {
      console.log('Apple Sign In error:', error);
      setIsAuthLoading(false);
      
      if (error.code === 'ERR_REQUEST_CANCELED') {
        return { success: false, error: 'Sign in was cancelled' };
      }
      return { success: false, error: error.message || 'Apple Sign In failed' };
    }
  }, []);

  const signInWithGoogle = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    setIsAuthLoading(true);
    console.log('Starting Google Sign In...');
    
    try {
      const redirectUri = AuthSession.makeRedirectUri({
        scheme: 'lawncare',
      });
      
      const state = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        Math.random().toString()
      );
      
      const authUrl = `${GOOGLE_DISCOVERY.authorizationEndpoint}?` +
        `client_id=${GOOGLE_CLIENT_ID}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `response_type=token&` +
        `scope=${encodeURIComponent('openid profile email')}&` +
        `state=${state}`;
      
      const result = await AuthSession.startAsync({
        authUrl,
      } as any);
      
      if (result.type === 'success' && result.params?.access_token) {
        const userInfoResponse = await fetch(
          'https://www.googleapis.com/oauth2/v2/userinfo',
          {
            headers: { Authorization: `Bearer ${result.params.access_token}` },
          }
        );
        
        const userInfo = await userInfoResponse.json();
        console.log('Google Sign In successful:', userInfo);
        
        const newProfile: UserProfile = {
          ...mockUserProfile,
          id: userInfo.id,
          name: userInfo.name || 'Google User',
          email: userInfo.email || 'No email',
        };
        
        await AsyncStorage.setItem(IS_SIGNED_IN_KEY, 'true');
        await AsyncStorage.setItem(AUTH_PROVIDER_KEY, 'google');
        await AsyncStorage.setItem(AUTH_USER_KEY, userInfo.id);
        await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(newProfile));
        await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(mockTasks));
        await AsyncStorage.setItem(SAVED_PLANS_KEY, JSON.stringify(mockSavedPlans));
        
        setIsSignedIn(true);
        setAuthProvider('google');
        setProfile(newProfile);
        setTasks(mockTasks);
        setSavedPlans(mockSavedPlans);
        setAiInsights(mockAIInsights);
        setIsAuthLoading(false);
        
        return { success: true };
      } else {
        setIsAuthLoading(false);
        return { success: false, error: 'Google Sign In was cancelled or failed' };
      }
    } catch (error: any) {
      console.log('Google Sign In error:', error);
      setIsAuthLoading(false);
      return { success: false, error: error.message || 'Google Sign In failed' };
    }
  }, []);

  const refreshAiInsights = useCallback(async () => {
    setIsRefreshingInsights(true);
    console.log('Refreshing AI insights...');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate refreshed insights with slight variations
    const refreshedInsights: AIInsight[] = [
      {
        id: '1',
        title: 'Watering Recommendation',
        description: `Based on current ${weather.temperature}°F temperature and ${weather.humidity}% humidity, water deeply 2-3 times per week in early morning.`,
        priority: weather.humidity < 40 ? 'high' : 'medium',
        icon: 'droplet',
      },
      {
        id: '2',
        title: 'Mowing Schedule',
        description: weather.temperature > 60 
          ? 'Grass is actively growing. Maintain 3-3.5 inch height and mow every 5-7 days.'
          : 'Cool temperatures slowing growth. Reduce mowing frequency to every 10-14 days.',
        priority: weather.temperature > 75 ? 'high' : 'medium',
        icon: 'scissors',
      },
      {
        id: '3',
        title: 'Disease Watch',
        description: weather.humidity > 70 
          ? 'High humidity increases fungal disease risk. Monitor for brown patches and dollar spots.'
          : 'Current conditions are favorable. Continue regular lawn care routine.',
        priority: weather.humidity > 70 ? 'high' : 'low',
        icon: 'alert-triangle',
      },
    ];
    
    setAiInsights(refreshedInsights);
    setIsRefreshingInsights(false);
    console.log('AI insights refreshed successfully');
  }, [weather]);

  const upcomingTasks = useMemo(() => {
    return tasks
      .filter(t => !t.completed)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 5);
  }, [tasks]);

  const completedTasks = useMemo(() => {
    return tasks.filter(t => t.completed);
  }, [tasks]);

  const pendingTasks = useMemo(() => {
    return tasks.filter(t => !t.completed);
  }, [tasks]);

  return {
    tasks,
    profile,
    lawnHealth,
    weather,
    soilTemperatures,
    aiInsights,
    tips,
    savedPlans,
    upcomingTasks,
    completedTasks,
    pendingTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    updateProfile,
    addSavedPlan,
    deleteSavedPlan,
    refreshAiInsights,
    isRefreshingInsights,
    signOut,
    signIn,
    signInWithApple,
    signInWithGoogle,
    isSignedIn,
    authProvider,
    isAuthLoading,
    isLoading: tasksQuery.isLoading || profileQuery.isLoading,
  };
});

export function useTaskById(id: string) {
  const { tasks } = useLawn();
  return useMemo(() => tasks.find(t => t.id === id), [tasks, id]);
}
