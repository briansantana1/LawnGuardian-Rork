import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight, Plus, Sparkles, CalendarDays } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface TreatmentEntry {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'fertilizer' | 'weed' | 'pest' | 'water' | 'mow' | 'other';
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function CalendarScreen() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 23));
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2026, 0, 23));
  const [entries, setEntries] = useState<TreatmentEntry[]>([]);

  const getDaysInMonth = useCallback((date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days: (number | null)[] = [];
    
    for (let i = 0; i < startingDay; i++) {
      const prevMonthLastDay = new Date(year, month, 0).getDate();
      days.push(null);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  }, []);

  const goToPrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const selectDate = (day: number) => {
    setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
  };

  const hasEntries = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return entries.some(e => e.date === dateStr);
  };

  const isUpcoming = (day: number) => {
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const today = new Date(2026, 0, 23);
    return checkDate > today;
  };

  const isSelected = (day: number) => {
    return selectedDate.getDate() === day && 
           selectedDate.getMonth() === currentDate.getMonth() && 
           selectedDate.getFullYear() === currentDate.getFullYear();
  };

  const isToday = (day: number) => {
    const today = new Date(2026, 0, 23);
    return today.getDate() === day && 
           today.getMonth() === currentDate.getMonth() && 
           today.getFullYear() === currentDate.getFullYear();
  };

  const getSelectedDateEntries = () => {
    const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
    return entries.filter(e => e.date === dateStr);
  };

  const addEntry = () => {
    const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
    const newEntry: TreatmentEntry = {
      id: Date.now().toString(),
      date: dateStr,
      title: 'New Treatment',
      description: 'Treatment description',
      type: 'fertilizer',
    };
    setEntries([...entries, newEntry]);
  };

  const formatSelectedDate = () => {
    return `${MONTHS[selectedDate.getMonth()]} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`;
  };

  const days = getDaysInMonth(currentDate);
  const selectedDateEntries = getSelectedDateEntries();
  const upcomingTreatments = entries.filter(e => {
    const entryDate = new Date(e.date);
    const today = new Date(2026, 0, 23);
    return entryDate >= today;
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.light.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Calendar</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.trackerBadge}>
          <CalendarDays size={14} color={Colors.light.primary} />
          <Text style={styles.trackerBadgeText}>Treatment Tracker</Text>
        </View>

        <Text style={styles.mainTitle}>Lawn Care Calendar</Text>
        <Text style={styles.subtitle}>
          Track products applied to your lawn, record when treatments were made, and schedule upcoming applications.
        </Text>

        <View style={styles.calendarCard}>
          <View style={styles.calendarHeader}>
            <CalendarDays size={18} color={Colors.light.primary} />
            <Text style={styles.selectDateText}>Select a Date</Text>
          </View>

          <View style={styles.monthSelector}>
            <Pressable onPress={goToPrevMonth} style={styles.monthArrow}>
              <ChevronLeft size={20} color={Colors.light.textSecondary} />
            </Pressable>
            <Text style={styles.monthText}>
              {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
            </Text>
            <Pressable onPress={goToNextMonth} style={styles.monthArrow}>
              <ChevronRight size={20} color={Colors.light.textSecondary} />
            </Pressable>
          </View>

          <View style={styles.daysHeader}>
            {DAYS.map((day, index) => (
              <Text key={index} style={styles.dayHeaderText}>{day}</Text>
            ))}
          </View>

          <View style={styles.daysGrid}>
            {days.map((day, index) => (
              <View key={index} style={styles.dayCell}>
                {day !== null ? (
                  <Pressable
                    onPress={() => selectDate(day)}
                    style={[
                      styles.dayButton,
                      isSelected(day) && styles.selectedDay,
                      isToday(day) && !isSelected(day) && styles.todayDay,
                    ]}
                  >
                    <Text style={[
                      styles.dayText,
                      isSelected(day) && styles.selectedDayText,
                      isToday(day) && !isSelected(day) && styles.todayDayText,
                      day < 28 && currentDate.getMonth() === 0 && styles.pastDayText,
                    ]}>
                      {day}
                    </Text>
                  </Pressable>
                ) : (
                  <View style={styles.emptyDay} />
                )}
              </View>
            ))}
          </View>

          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.light.primary }]} />
              <Text style={styles.legendText}>Has entries</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.light.primary, opacity: 0.5 }]} />
              <Text style={styles.legendText}>Upcoming treatment</Text>
            </View>
          </View>
        </View>

        <View style={styles.upcomingSection}>
          <View style={styles.upcomingSectionHeader}>
            <Sparkles size={18} color={Colors.light.primary} />
            <Text style={styles.upcomingSectionTitle}>Upcoming Treatments</Text>
          </View>
          {upcomingTreatments.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No treatments scheduled</Text>
              <Text style={styles.emptyStateSubtext}>Add entries to see them here</Text>
            </View>
          ) : (
            upcomingTreatments.map((treatment) => (
              <View key={treatment.id} style={styles.treatmentItem}>
                <Text style={styles.treatmentTitle}>{treatment.title}</Text>
                <Text style={styles.treatmentDate}>{treatment.date}</Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.selectedDateSection}>
          <View style={styles.selectedDateHeader}>
            <View style={styles.selectedDateInfo}>
              <Calendar size={18} color={Colors.light.primary} />
              <Text style={styles.selectedDateTitle}>{formatSelectedDate()}</Text>
            </View>
            <Pressable style={styles.addEntryButton} onPress={addEntry}>
              <Plus size={16} color="#FFF" />
              <Text style={styles.addEntryButtonText}>Add Entry</Text>
            </Pressable>
          </View>

          {selectedDateEntries.length === 0 ? (
            <View style={styles.noEntriesState}>
              <CalendarDays size={40} color={Colors.light.textMuted} />
              <Text style={styles.noEntriesTitle}>No entries for this date</Text>
              <Text style={styles.noEntriesSubtext}>Click "Add Entry" to log a treatment</Text>
            </View>
          ) : (
            selectedDateEntries.map((entry) => (
              <View key={entry.id} style={styles.entryCard}>
                <Text style={styles.entryTitle}>{entry.title}</Text>
                <Text style={styles.entryDescription}>{entry.description}</Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.footer}>
          <Pressable onPress={() => router.push('/privacy-policy')}>
            <Text style={styles.footerLink}>Privacy Policy</Text>
          </Pressable>
          <Text style={styles.footerDot}>·</Text>
          <Pressable onPress={() => router.push('/terms-of-use')}>
            <Text style={styles.footerLink}>Terms of Use</Text>
          </Pressable>
        </View>
        <Text style={styles.copyright}>2026 Lawn Guardian™. All rights reserved.</Text>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  headerRight: {
    width: 32,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  trackerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#D1FAE5',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    gap: 6,
    marginTop: 20,
  },
  trackerBadgeText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.light.primary,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.light.text,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  calendarCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  selectDateText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  monthArrow: {
    padding: 8,
  },
  monthText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginHorizontal: 16,
  },
  daysHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dayHeaderText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.light.textMuted,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  dayButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDay: {
    backgroundColor: Colors.light.primary,
  },
  todayDay: {
    borderWidth: 2,
    borderColor: Colors.light.primary,
  },
  emptyDay: {
    width: 36,
    height: 36,
  },
  dayText: {
    fontSize: 14,
    color: Colors.light.text,
  },
  selectedDayText: {
    color: '#FFF',
    fontWeight: '600' as const,
  },
  todayDayText: {
    color: Colors.light.primary,
    fontWeight: '600' as const,
  },
  pastDayText: {
    color: Colors.light.textMuted,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  upcomingSection: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  upcomingSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  upcomingSectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.light.textMuted,
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 13,
    color: Colors.light.textMuted,
  },
  treatmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  treatmentTitle: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.light.text,
  },
  treatmentDate: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  selectedDateSection: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  selectedDateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  selectedDateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  selectedDateTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  addEntryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.primary,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    gap: 6,
  },
  addEntryButtonText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#FFF',
  },
  noEntriesState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  noEntriesTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginTop: 12,
    marginBottom: 4,
  },
  noEntriesSubtext: {
    fontSize: 13,
    color: Colors.light.textMuted,
  },
  entryCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  entryTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  entryDescription: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  footerLink: {
    fontSize: 13,
    color: Colors.light.textMuted,
  },
  footerDot: {
    fontSize: 13,
    color: Colors.light.textMuted,
    marginHorizontal: 8,
  },
  copyright: {
    fontSize: 12,
    color: Colors.light.textMuted,
    textAlign: 'center',
    marginTop: 8,
  },
  bottomPadding: {
    height: 40,
  },
});
