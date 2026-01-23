import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Check, Scissors, Droplets, Leaf, Trash2, Wind, Sprout, Bug, MoreHorizontal, ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Task, TaskCategory, TASK_CATEGORY_LABELS } from '@/types/lawn';

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onPress: () => void;
  compact?: boolean;
}

const CategoryIcon = ({ category, size = 18, color }: { category: TaskCategory; size?: number; color: string }) => {
  const iconProps = { size, color, strokeWidth: 2 };
  switch (category) {
    case 'mowing':
      return <Scissors {...iconProps} />;
    case 'watering':
      return <Droplets {...iconProps} />;
    case 'fertilizing':
      return <Leaf {...iconProps} />;
    case 'weeding':
      return <Trash2 {...iconProps} />;
    case 'aerating':
      return <Wind {...iconProps} />;
    case 'seeding':
      return <Sprout {...iconProps} />;
    case 'pest_control':
      return <Bug {...iconProps} />;
    default:
      return <MoreHorizontal {...iconProps} />;
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

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return Colors.light.error;
    case 'medium':
      return Colors.light.warning;
    default:
      return Colors.light.textMuted;
  }
};

export default function TaskItem({ task, onToggle, onPress, compact = false }: TaskItemProps) {
  const categoryColor = getCategoryColor(task.category);
  const isOverdue = !task.completed && new Date(task.dueDate) < new Date();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (compact) {
    return (
      <Pressable 
        style={({ pressed }) => [styles.compactContainer, pressed && styles.pressed]}
        onPress={onPress}
      >
        <View style={[styles.categoryDot, { backgroundColor: categoryColor }]} />
        <View style={styles.compactContent}>
          <Text style={[styles.compactTitle, task.completed && styles.completedText]} numberOfLines={1}>
            {task.title}
          </Text>
          <Text style={[styles.compactDate, isOverdue && styles.overdueText]}>
            {formatDate(task.dueDate)}
          </Text>
        </View>
        <ChevronRight size={16} color={Colors.light.textMuted} />
      </Pressable>
    );
  }

  return (
    <Pressable 
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={onPress}
    >
      <Pressable 
        style={[styles.checkbox, task.completed && styles.checkboxCompleted]}
        onPress={onToggle}
        hitSlop={10}
      >
        {task.completed && <Check size={14} color="#FFF" strokeWidth={3} />}
      </Pressable>

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, task.completed && styles.completedText]} numberOfLines={1}>
            {task.title}
          </Text>
          {task.priority === 'high' && (
            <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) + '20' }]}>
              <Text style={[styles.priorityText, { color: getPriorityColor(task.priority) }]}>High</Text>
            </View>
          )}
        </View>

        <View style={styles.metaRow}>
          <View style={[styles.categoryBadge, { backgroundColor: categoryColor + '15' }]}>
            <CategoryIcon category={task.category} size={12} color={categoryColor} />
            <Text style={[styles.categoryText, { color: categoryColor }]}>
              {TASK_CATEGORY_LABELS[task.category]}
            </Text>
          </View>
          <Text style={[styles.dateText, isOverdue && styles.overdueText]}>
            {formatDate(task.dueDate)}
          </Text>
          {task.recurring && (
            <View style={styles.recurringBadge}>
              <Text style={styles.recurringText}>↻</Text>
            </View>
          )}
        </View>
      </View>

      <ChevronRight size={18} color={Colors.light.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    padding: 16,
    borderRadius: 16,
    gap: 12,
    shadowColor: Colors.light.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  pressed: {
    opacity: 0.7,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.light.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCompleted: {
    backgroundColor: Colors.light.success,
    borderColor: Colors.light.success,
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  title: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.text,
    flex: 1,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: Colors.light.textMuted,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '700' as const,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  dateText: {
    fontSize: 12,
    color: Colors.light.textMuted,
  },
  overdueText: {
    color: Colors.light.error,
  },
  recurringBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.light.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recurringText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  compactContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  compactTitle: {
    fontSize: 14,
    color: Colors.light.text,
    flex: 1,
  },
  compactDate: {
    fontSize: 12,
    color: Colors.light.textMuted,
    marginLeft: 8,
  },
});
