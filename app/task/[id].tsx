import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { ArrowLeft, Trash2, Check, Calendar, Flag, RefreshCw, Scissors, Droplets, Leaf, Wind, Sprout, Bug, MoreHorizontal } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useLawn, useTaskById } from '@/providers/LawnProvider';
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

const getCategoryColor = (category: TaskCategory) => {
  const colors: Record<TaskCategory, string> = {
    mowing: '#4CAF50',
    watering: '#2196F3',
    fertilizing: '#8BC34A',
    weeding: '#FF9800',
    aerating: '#00BCD4',
    seeding: '#9C27B0',
    pest_control: '#F44336',
    other: '#607D8B',
  };
  return colors[category];
};

export default function TaskDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const task = useTaskById(id);
  const { updateTask, deleteTask, toggleTaskComplete } = useLawn();

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
    }
  }, [task]);

  if (!task) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.notFound}>
            <Text style={styles.notFoundText}>Task not found</Text>
            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <Text style={styles.backButtonText}>Go Back</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Task title cannot be empty');
      return;
    }
    updateTask(task.id, { title: title.trim(), description: description.trim() });
    setEditing(false);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteTask(task.id);
            router.back();
          },
        },
      ]
    );
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const categoryColor = getCategoryColor(task.category);
  const isOverdue = !task.completed && new Date(task.dueDate) < new Date();

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return { label: 'High Priority', color: Colors.light.error };
      case 'medium': return { label: 'Medium Priority', color: Colors.light.warning };
      default: return { label: 'Low Priority', color: Colors.light.textMuted };
    }
  };

  const priorityInfo = getPriorityLabel(task.priority);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable style={styles.headerButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color={Colors.light.text} />
          </Pressable>
          <View style={styles.headerActions}>
            {editing ? (
              <Pressable style={[styles.saveBtn]} onPress={handleSave}>
                <Text style={styles.saveBtnText}>Save</Text>
              </Pressable>
            ) : (
              <>
                <Pressable style={styles.headerButton} onPress={() => setEditing(true)}>
                  <Text style={styles.editText}>Edit</Text>
                </Pressable>
                <Pressable style={styles.headerButton} onPress={handleDelete}>
                  <Trash2 size={20} color={Colors.light.error} />
                </Pressable>
              </>
            )}
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.statusBar}>
            <View style={[styles.categoryBadge, { backgroundColor: categoryColor + '15' }]}>
              <CategoryIcon category={task.category} size={16} color={categoryColor} />
              <Text style={[styles.categoryText, { color: categoryColor }]}>
                {TASK_CATEGORY_LABELS[task.category]}
              </Text>
            </View>
            <View style={[styles.priorityBadge, { backgroundColor: priorityInfo.color + '15' }]}>
              <Flag size={14} color={priorityInfo.color} />
              <Text style={[styles.priorityText, { color: priorityInfo.color }]}>
                {priorityInfo.label}
              </Text>
            </View>
          </View>

          {editing ? (
            <TextInput
              style={styles.titleInput}
              value={title}
              onChangeText={setTitle}
              placeholder="Task title"
              autoFocus
            />
          ) : (
            <Text style={[styles.title, task.completed && styles.completedText]}>
              {task.title}
            </Text>
          )}

          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Calendar size={18} color={isOverdue ? Colors.light.error : Colors.light.textMuted} />
              <Text style={[styles.metaText, isOverdue && styles.overdueText]}>
                {formatDate(task.dueDate)}
                {isOverdue && ' (Overdue)'}
              </Text>
            </View>
            {task.recurring && (
              <View style={styles.metaItem}>
                <RefreshCw size={18} color={Colors.light.textMuted} />
                <Text style={styles.metaText}>
                  Repeats {task.recurringInterval}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            {editing ? (
              <TextInput
                style={styles.descriptionInput}
                value={description}
                onChangeText={setDescription}
                placeholder="Add a description..."
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            ) : (
              <Text style={styles.description}>
                {task.description || 'No description provided'}
              </Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Status</Text>
            <Pressable
              style={[styles.statusButton, task.completed && styles.statusButtonCompleted]}
              onPress={() => toggleTaskComplete(task.id)}
            >
              <View style={[styles.checkbox, task.completed && styles.checkboxCompleted]}>
                {task.completed && <Check size={16} color="#FFF" strokeWidth={3} />}
              </View>
              <Text style={[styles.statusText, task.completed && styles.statusTextCompleted]}>
                {task.completed ? 'Completed' : 'Mark as Complete'}
              </Text>
            </Pressable>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Created</Text>
            <Text style={styles.createdDate}>{formatDate(task.createdAt)}</Text>
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
  },
  headerButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editText: {
    fontSize: 16,
    color: Colors.light.primary,
    fontWeight: '600' as const,
  },
  saveBtn: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  saveBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600' as const,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  statusBar: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  priorityText: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  title: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: Colors.light.text,
    marginBottom: 16,
  },
  titleInput: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: Colors.light.text,
    marginBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: Colors.light.primary,
    paddingBottom: 8,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: Colors.light.textMuted,
  },
  metaContainer: {
    gap: 12,
    marginBottom: 24,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  metaText: {
    fontSize: 15,
    color: Colors.light.textSecondary,
  },
  overdueText: {
    color: Colors.light.error,
    fontWeight: '600' as const,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.light.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    lineHeight: 24,
  },
  descriptionInput: {
    backgroundColor: Colors.light.surface,
    borderRadius: 14,
    padding: 16,
    fontSize: 16,
    color: Colors.light.text,
    borderWidth: 1,
    borderColor: Colors.light.border,
    minHeight: 120,
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.light.surface,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  statusButtonCompleted: {
    backgroundColor: Colors.light.success + '10',
    borderColor: Colors.light.success,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.light.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCompleted: {
    backgroundColor: Colors.light.success,
    borderColor: Colors.light.success,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.textSecondary,
  },
  statusTextCompleted: {
    color: Colors.light.success,
  },
  createdDate: {
    fontSize: 15,
    color: Colors.light.textMuted,
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    fontSize: 18,
    color: Colors.light.textMuted,
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  bottomPadding: {
    height: 40,
  },
});
