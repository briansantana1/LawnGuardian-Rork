import { Task, LawnHealth, WeatherData, UserProfile, SoilTemperature, AIInsight, SavedPlan } from '@/types/lawn';

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Mow the lawn',
    description: 'Cut grass to 3 inches height for optimal health',
    category: 'mowing',
    dueDate: '2026-01-24',
    completed: false,
    recurring: true,
    recurringInterval: 'weekly',
    priority: 'high',
    createdAt: '2026-01-15',
  },
  {
    id: '2',
    title: 'Water front yard',
    description: 'Deep water for 30 minutes in the early morning',
    category: 'watering',
    dueDate: '2026-01-23',
    completed: false,
    recurring: true,
    recurringInterval: 'biweekly',
    priority: 'medium',
    createdAt: '2026-01-15',
  },
  {
    id: '3',
    title: 'Apply spring fertilizer',
    description: 'Use slow-release nitrogen fertilizer for best results',
    category: 'fertilizing',
    dueDate: '2026-01-28',
    completed: false,
    recurring: false,
    priority: 'medium',
    createdAt: '2026-01-18',
  },
  {
    id: '4',
    title: 'Pull weeds near flower bed',
    description: 'Check for dandelions and crabgrass around the edges',
    category: 'weeding',
    dueDate: '2026-01-25',
    completed: false,
    recurring: false,
    priority: 'low',
    createdAt: '2026-01-20',
  },
  {
    id: '5',
    title: 'Check sprinkler heads',
    description: 'Ensure all sprinkler heads are working properly',
    category: 'watering',
    dueDate: '2026-01-22',
    completed: true,
    recurring: false,
    priority: 'medium',
    createdAt: '2026-01-10',
  },
];

export const mockLawnHealth: LawnHealth = {
  overallScore: 78,
  moisture: 73,
  grassDensity: 85,
  weedLevel: 15,
  lastUpdated: '2026-01-23',
};

export const mockWeather: WeatherData = {
  temperature: 49,
  highTemp: 56,
  condition: 'clear',
  humidity: 73,
  feelsLike: 34,
  uvIndex: 0,
  precipitation: '0"',
  chanceOfRain: 0,
  pressure: 1018,
  location: 'Winter Garden, FL',
  forecast: [
    { day: 'Today', date: '1/18', high: 56, low: 49, condition: 'clear' },
    { day: 'Fri', date: '1/19', high: 58, low: 45, condition: 'sunny' },
    { day: 'Sat', date: '1/20', high: 62, low: 48, condition: 'partly_cloudy' },
    { day: 'Sun', date: '1/21', high: 65, low: 50, condition: 'sunny' },
    { day: 'Mon', date: '1/22', high: 60, low: 47, condition: 'cloudy' },
  ],
};

export const mockSoilTemperatures: SoilTemperature[] = [
  { date: '1/12', day: 'Mon', temp: 60 },
  { date: '1/13', day: 'Tue', temp: 63 },
  { date: '1/14', day: 'Wed', temp: 63 },
  { date: '1/15', day: 'Thu', temp: 57 },
  { date: '1/16', day: 'Fri', temp: 47 },
  { date: '1/17', day: 'Sat', temp: 53 },
  { date: '1/18', day: 'Today', temp: 56 },
];

export const mockAIInsights: AIInsight[] = [
  {
    id: '1',
    title: 'Monitor Soil Moisture',
    description: 'With the current humidity at 73%, the soil may retain moisture well; check moisture levels before watering to avoid over-saturation.',
    priority: 'medium',
    icon: 'droplet',
  },
  {
    id: '2',
    title: 'Delay Mowing',
    description: 'Due to the low temperatures and the grass being in a dormant state, it is advisable to delay mowing until warmer conditions resume.',
    priority: 'high',
    icon: 'scissors',
  },
  {
    id: '3',
    title: 'Watch for Disease Development',
    description: 'High humidity levels can promote fungal diseases; keep an eye on any signs of lawn stress or disease symptoms.',
    priority: 'medium',
    icon: 'alert-triangle',
  },
];

export const mockUserProfile: UserProfile = {
  id: '1',
  name: 'Brian Santana',
  email: 'brianjsantana3@gmail.com',
  location: 'Winter Garden, FL',
  grassType: 'st_augustine',
  lawnSize: 5000,
  lawnSizeUnit: 'sqft',
  notificationsEnabled: true,
  reminderTime: '08:00',
  subscriptionStatus: 'free',
  scansRemaining: 1,
};

export const mockSavedPlans: SavedPlan[] = [];

export const generalTips = [
  {
    id: '1',
    title: 'General Tip',
    description: 'Water deeply but infrequently to encourage deep root growth.',
    icon: 'sun',
  },
  {
    id: '2',
    title: 'Mowing',
    description: 'Never remove more than 1/3 of the grass blade at once.',
    icon: 'scissors',
  },
];
