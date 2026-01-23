import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Sun, Cloud, CloudRain, CloudSun, Droplets } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { WeatherData, WeatherForecast } from '@/types/lawn';

interface WeatherCardProps {
  weather: WeatherData;
}

const WeatherIcon = ({ condition, size = 24 }: { condition: string; size?: number }) => {
  const iconProps = { size, strokeWidth: 1.5 };
  switch (condition) {
    case 'sunny':
      return <Sun {...iconProps} color="#FFB347" />;
    case 'cloudy':
      return <Cloud {...iconProps} color="#90A4AE" />;
    case 'rainy':
      return <CloudRain {...iconProps} color="#64B5F6" />;
    case 'partly_cloudy':
      return <CloudSun {...iconProps} color="#FFB347" />;
    default:
      return <Sun {...iconProps} color="#FFB347" />;
  }
};

export default function WeatherCard({ weather }: WeatherCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.currentWeather}>
        <View style={styles.weatherMain}>
          <WeatherIcon condition={weather.condition} size={48} />
          <View style={styles.tempContainer}>
            <Text style={styles.temperature}>{weather.temperature}°</Text>
            <Text style={styles.conditionText}>
              {weather.condition.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Text>
          </View>
        </View>
        
        <View style={styles.weatherDetails}>
          <View style={styles.detailItem}>
            <Droplets size={16} color={Colors.light.textMuted} />
            <Text style={styles.detailText}>{weather.humidity}% Humidity</Text>
          </View>
          <View style={styles.detailItem}>
            <CloudRain size={16} color={Colors.light.textMuted} />
            <Text style={styles.detailText}>{weather.chanceOfRain}% Rain</Text>
          </View>
        </View>
      </View>

      <View style={styles.forecastContainer}>
        {weather.forecast.map((day, index) => (
          <View key={index} style={styles.forecastDay}>
            <Text style={styles.forecastDayText}>{day.day}</Text>
            <WeatherIcon condition={day.condition} size={20} />
            <Text style={styles.forecastTemp}>{day.high}°</Text>
            <Text style={styles.forecastTempLow}>{day.low}°</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.surface,
    borderRadius: 20,
    padding: 20,
    shadowColor: Colors.light.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  currentWeather: {
    marginBottom: 16,
  },
  weatherMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
  },
  tempContainer: {
    flex: 1,
  },
  temperature: {
    fontSize: 42,
    fontWeight: '300' as const,
    color: Colors.light.text,
  },
  conditionText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  weatherDetails: {
    flexDirection: 'row',
    gap: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: Colors.light.textMuted,
  },
  forecastContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  forecastDay: {
    alignItems: 'center',
    gap: 4,
  },
  forecastDayText: {
    fontSize: 12,
    color: Colors.light.textMuted,
    marginBottom: 4,
  },
  forecastTemp: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  forecastTempLow: {
    fontSize: 12,
    color: Colors.light.textMuted,
  },
});
