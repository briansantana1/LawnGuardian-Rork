export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  dueDate: string;
  completed: boolean;
  recurring: boolean;
  recurringInterval?: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export type TaskCategory = 
  | 'mowing'
  | 'watering'
  | 'fertilizing'
  | 'weeding'
  | 'aerating'
  | 'seeding'
  | 'pest_control'
  | 'other';

export interface LawnHealth {
  overallScore: number;
  moisture: number;
  grassDensity: number;
  weedLevel: number;
  lastUpdated: string;
}

export interface WeatherData {
  temperature: number;
  highTemp: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'partly_cloudy' | 'clear';
  humidity: number;
  feelsLike: number;
  uvIndex: number;
  precipitation: string;
  chanceOfRain: number;
  pressure: number;
  location: string;
  forecast: WeatherForecast[];
}

export interface WeatherForecast {
  day: string;
  date: string;
  high: number;
  low: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'partly_cloudy' | 'clear';
}

export interface SoilTemperature {
  date: string;
  day: string;
  temp: number;
}

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  icon: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  location: string;
  grassType: GrassType;
  lawnSize: number;
  lawnSizeUnit: 'sqft' | 'sqm';
  notificationsEnabled: boolean;
  reminderTime: string;
  subscriptionStatus: 'free' | 'pro_weekly' | 'pro_annual';
  scansRemaining: number;
}

export interface SavedPlan {
  id: string;
  title: string;
  diagnosis: string;
  treatment: string;
  createdAt: string;
  imageUrl?: string;
}

export type GrassType = 
  | 'bermuda'
  | 'kentucky_bluegrass'
  | 'fescue'
  | 'zoysia'
  | 'st_augustine'
  | 'ryegrass'
  | 'buffalo'
  | 'centipede'
  | 'bahia'
  | 'other';

export const GRASS_TYPE_LABELS: Record<GrassType, string> = {
  bermuda: 'Bermuda',
  kentucky_bluegrass: 'Kentucky Bluegrass',
  fescue: 'Fescue',
  zoysia: 'Zoysia',
  st_augustine: 'St. Augustine',
  ryegrass: 'Ryegrass',
  buffalo: 'Buffalo',
  centipede: 'Centipede',
  bahia: 'Bahia',
  other: 'Other',
};

export const TASK_CATEGORY_LABELS: Record<TaskCategory, string> = {
  mowing: 'Mowing',
  watering: 'Watering',
  fertilizing: 'Fertilizing',
  weeding: 'Weeding',
  aerating: 'Aerating',
  seeding: 'Seeding',
  pest_control: 'Pest Control',
  other: 'Other',
};

export const TASK_CATEGORY_ICONS: Record<TaskCategory, string> = {
  mowing: 'Scissors',
  watering: 'Droplets',
  fertilizing: 'Leaf',
  weeding: 'Trash2',
  aerating: 'Wind',
  seeding: 'Sprout',
  pest_control: 'Bug',
  other: 'MoreHorizontal',
};
