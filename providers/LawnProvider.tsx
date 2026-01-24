import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Task, LawnHealth, WeatherData, UserProfile, SoilTemperature, AIInsight, SavedPlan } from '@/types/lawn';
import { mockTasks, mockLawnHealth, mockWeather, mockUserProfile, mockSoilTemperatures, mockAIInsights, mockSavedPlans, generalTips } from '@/mocks/lawnData';

const TASKS_KEY = 'lawn_tasks';
const PROFILE_KEY = 'lawn_profile';
const SAVED_PLANS_KEY = 'saved_plans';

export const [LawnProvider, useLawn] = createContextHook(() => {
  const queryClient = useQueryClient();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [profile, setProfile] = useState<UserProfile>(mockUserProfile);
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>(mockAIInsights);
  const [isRefreshingInsights, setIsRefreshingInsights] = useState(false);

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
    isLoading: tasksQuery.isLoading || profileQuery.isLoading,
  };
});

export function useTaskById(id: string) {
  const { tasks } = useLawn();
  return useMemo(() => tasks.find(t => t.id === id), [tasks, id]);
}
