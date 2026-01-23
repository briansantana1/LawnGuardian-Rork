import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { X, Calendar, Flag, RefreshCw, Scissors, Droplets, Leaf, Trash2, Wind, Sprout, Bug, MoreHorizontal } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useLawn } from '@/providers/LawnProvider';
import { TaskCategory, TASK_CATEGORY_LABELS } from '@/types/lawn';

const CategoryIcon = ({ category, size = 20, color }: { category: TaskCategory; size?: number; color: string }) => {
  const iconProps = { size, color, strokeWidth: 2 };
  switch (category) {
    case 'mowing': return <Scissors {...iconProps} />;
    case 'watering': return <Droplets {...iconProps} />;
    case 'fertilizing': return <Leaf {...iconProps} />;
    case 'weeding': return <Trash2 {...iconProps} />;
    case 'aerating': return <Wind {...iconProps} />;
    case 'seeding': return <Sprout {...iconProps} />;
    case 'pest_control': return <Bug {...iconProps} />;
    default: return <MoreHorizontal {...iconProps} />;
  }
};

export default function AddTaskScreen() {
  const router = useRouter();
  const { addTask } = useLawn();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory>('mowing');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [recurring, setRecurring] = useState(false);
  const [recurringInterval, setRecurringInterval] = useState<'daily' | 'weekly' | 'biweekly' | 'monthly'>('weekly');
  const [dueDate, setDueDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });

  const categories = Object.entries(TASK_CATEGORY_LABELS) as [TaskCategory, string][];
  const priorities: { key: 'low' | 'medium' | 'high'; label: string; color: string }[] = [
    { key: 'low', label: 'Low', color: Colors.light.textMuted },
    { key: 'medium', label: 'Medium', color: Colors.light.warning },
    { key: 'high', label: 'High', color: Colors.light.error },
  ];
  const intervals: { key: 'daily' | 'weekly' | 'biweekly' | 'monthly'; label: string }[] = [
    { key: 'daily', label: 'Daily' },
    { key: 'weekly', label: 'Weekly' },
    { key: 'biweekly', label: 'Bi-weekly' },
    { key: 'monthly', label: 'Monthly' },
  ];

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    addTask({
      title: title.trim(),
      description: description.trim(),
      category,
      dueDate,
      completed: false,
      recurring,
      recurringInterval: recurring ? recurringInterval : undefined,
      priority,
    });

    router.back();
  };

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable style={styles.closeButton} onPress={() => router.back()}>
            <X size={24} color={Colors.light.text} />
          </Pressable>
          <Text style={styles.headerTitle}>New Task</Text>
          <Pressable
            style={({ pressed }) => [styles.saveButton, pressed && styles.buttonPressed, !title.trim() && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={!title.trim()}
          >
            <Text style={[styles.saveButtonText, !title.trim() && styles.saveButtonTextDisabled]}>Save</Text>
          </Pressable>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Task Title</Text>
            <TextInput
              style={styles.titleInput}
              value={title}
              onChangeText={setTitle}
              placeholder="What needs to be done?"
              placeholderTextColor={Colors.light.textMuted}
              autoFocus
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description (optional)</Text>
            <TextInput
              style={styles.descriptionInput}
              value={description}
              onChangeText={setDescription}
              placeholder="Add more details..."
              placeholderTextColor={Colors.light.textMuted}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.categoryContainer}>
                {categories.map(([key, label]) => (
                  <Pressable
                    key={key}
                    style={[styles.categoryChip, category === key && styles.categoryChipActive]}
                    onPress={() => setCategory(key)}
                  >
                    <CategoryIcon
                      category={key}
                      size={16}
                      color={category === key ? '#FFF' : Colors.light.textSecondary}
                    />
                    <Text style={[styles.categoryText, category === key && styles.categoryTextActive]}>
                      {label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Calendar size={18} color={Colors.light.textSecondary} />
              <Text style={styles.label}>Due Date</Text>
            </View>
            <TextInput
              style={styles.dateInput}
              value={dueDate}
              onChangeText={setDueDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={Colors.light.textMuted}
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Flag size={18} color={Colors.light.textSecondary} />
              <Text style={styles.label}>Priority</Text>
            </View>
            <View style={styles.priorityContainer}>
              {priorities.map((p) => (
                <Pressable
                  key={p.key}
                  style={[styles.priorityChip, priority === p.key && { backgroundColor: p.color + '20', borderColor: p.color }]}
                  onPress={() => setPriority(p.key)}
                >
                  <View style={[styles.priorityDot, { backgroundColor: p.color }]} />
                  <Text style={[styles.priorityText, priority === p.key && { color: p.color }]}>
                    {p.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Pressable
              style={styles.recurringToggle}
              onPress={() => setRecurring(!recurring)}
            >
              <View style={styles.labelRow}>
                <RefreshCw size={18} color={Colors.light.textSecondary} />
                <Text style={styles.label}>Recurring Task</Text>
              </View>
              <View style={[styles.toggleSwitch, recurring && styles.toggleSwitchActive]}>
                <View style={[styles.toggleKnob, recurring && styles.toggleKnobActive]} />
              </View>
            </Pressable>

            {recurring && (
              <View style={styles.intervalContainer}>
                {intervals.map((i) => (
                  <Pressable
                    key={i.key}
                    style={[styles.intervalChip, recurringInterval === i.key && styles.intervalChipActive]}
                    onPress={() => setRecurringInterval(i.key)}
                  >
                    <Text style={[styles.intervalText, recurringInterval === i.key && styles.intervalTextActive]}>
                      {i.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          <View style={styles.bottomPadding} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  saveButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  saveButtonDisabled: {
    backgroundColor: Colors.light.border,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600' as const,
  },
  saveButtonTextDisabled: {
    color: Colors.light.textMuted,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.textSecondary,
    marginBottom: 10,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  titleInput: {
    backgroundColor: Colors.light.surface,
    borderRadius: 14,
    padding: 16,
    fontSize: 16,
    color: Colors.light.text,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  descriptionInput: {
    backgroundColor: Colors.light.surface,
    borderRadius: 14,
    padding: 16,
    fontSize: 15,
    color: Colors.light.text,
    borderWidth: 1,
    borderColor: Colors.light.border,
    minHeight: 100,
  },
  categoryContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: Colors.light.surface,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  categoryChipActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.light.textSecondary,
  },
  categoryTextActive: {
    color: '#FFF',
  },
  dateInput: {
    backgroundColor: Colors.light.surface,
    borderRadius: 14,
    padding: 16,
    fontSize: 16,
    color: Colors.light.text,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  priorityChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.light.surface,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.textSecondary,
  },
  recurringToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleSwitch: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.light.border,
    justifyContent: 'center',
    padding: 2,
  },
  toggleSwitchActive: {
    backgroundColor: Colors.light.primary,
  },
  toggleKnob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFF',
  },
  toggleKnobActive: {
    transform: [{ translateX: 22 }],
  },
  intervalContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  intervalChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.light.surface,
    borderWidth: 1,
    borderColor: Colors.light.border,
    alignItems: 'center',
  },
  intervalChipActive: {
    backgroundColor: Colors.light.primaryLight,
    borderColor: Colors.light.primaryLight,
  },
  intervalText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.light.textSecondary,
  },
  intervalTextActive: {
    color: '#FFF',
  },
  bottomPadding: {
    height: 40,
  },
});
