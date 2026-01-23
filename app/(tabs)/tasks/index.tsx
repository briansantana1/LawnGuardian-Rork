import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Plus, Filter, CheckCircle2, Circle, ListTodo } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useLawn } from '@/providers/LawnProvider';
import TaskItem from '@/components/TaskItem';

type FilterType = 'all' | 'pending' | 'completed';

export default function TasksScreen() {
  const router = useRouter();
  const { tasks, toggleTaskComplete } = useLawn();
  const [filter, setFilter] = useState<FilterType>('all');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];
    
    if (filter === 'pending') {
      filtered = filtered.filter(t => !t.completed);
    } else if (filter === 'completed') {
      filtered = filtered.filter(t => t.completed);
    }
    
    return filtered.sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  }, [tasks, filter]);

  const stats = useMemo(() => ({
    total: tasks.length,
    pending: tasks.filter(t => !t.completed).length,
    completed: tasks.filter(t => t.completed).length,
  }), [tasks]);

  const filterButtons: { key: FilterType; label: string; Icon: typeof ListTodo }[] = [
    { key: 'all', label: 'All', Icon: ListTodo },
    { key: 'pending', label: 'Pending', Icon: Circle },
    { key: 'completed', label: 'Done', Icon: CheckCircle2 },
  ];

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>My Tasks</Text>
            <Text style={styles.subtitle}>{stats.pending} pending, {stats.completed} completed</Text>
          </View>
          <Pressable
            style={({ pressed }) => [styles.addButton, pressed && styles.buttonPressed]}
            onPress={() => router.push('/add-task')}
          >
            <Plus size={20} color="#FFF" strokeWidth={2.5} />
          </Pressable>
        </View>

        <View style={styles.filterContainer}>
          {filterButtons.map((btn) => (
            <Pressable
              key={btn.key}
              style={[styles.filterButton, filter === btn.key && styles.filterButtonActive]}
              onPress={() => setFilter(btn.key)}
            >
              <btn.Icon size={16} color={filter === btn.key ? '#FFF' : Colors.light.textSecondary} />
              <Text style={[styles.filterText, filter === btn.key && styles.filterTextActive]}>
                {btn.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.light.primary} />
          }
        >
          {filteredTasks.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <ListTodo size={48} color={Colors.light.textMuted} />
              </View>
              <Text style={styles.emptyText}>No tasks found</Text>
              <Text style={styles.emptySubtext}>
                {filter === 'completed' 
                  ? "You haven't completed any tasks yet"
                  : filter === 'pending'
                  ? "All caught up! No pending tasks"
                  : "Add your first task to get started"}
              </Text>
              {filter === 'all' && (
                <Pressable
                  style={({ pressed }) => [styles.emptyButton, pressed && styles.buttonPressed]}
                  onPress={() => router.push('/add-task')}
                >
                  <Plus size={18} color="#FFF" />
                  <Text style={styles.emptyButtonText}>Add Task</Text>
                </Pressable>
              )}
            </View>
          ) : (
            <View style={styles.tasksList}>
              {filteredTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={() => toggleTaskComplete(task.id)}
                  onPress={() => router.push(`/task/${task.id}`)}
                />
              ))}
            </View>
          )}
          
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: Colors.light.text,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.light.textMuted,
    marginTop: 2,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: Colors.light.surface,
  },
  filterButtonActive: {
    backgroundColor: Colors.light.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.textSecondary,
  },
  filterTextActive: {
    color: '#FFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  tasksList: {
    gap: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.light.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.textSecondary,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.light.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
  },
  emptyButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  bottomPadding: {
    height: 40,
  },
});
