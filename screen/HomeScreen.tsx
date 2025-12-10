// screens/HomeScreen.tsx - Enhanced with Search, Sort, Theme, Voice

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Animated,
} from 'react-native';
import { 
  Plus, 
  ClipboardList, 
  CheckCircle2, 
  Filter, 
  Search,
  Moon,
  Sun,
  ArrowUpDown,
  X,
} from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Task } from '../types';
import { useTasks } from '../context/TaskContext';
import { Button } from '../components/common/Button';
import { SPACING, TYPOGRAPHY, SHADOWS, BORDER_RADIUS } from '../utils/constants';
import { getThemeColors } from '@/constants/themeColor';
import { TaskCard } from '@/components/taskCard';
import { EmptyState } from '@/components/emptyState';
import { VoiceFAB } from '@/components/voiveFab';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

type FilterType = 'all' | 'incomplete' | 'completed' | 'overdue';

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { 
    tasks, 
    deleteTask, 
    toggleTaskCompletion, 
    isMaxReached, 
    MAX_TASKS,
    completedTasks,
    incompleteTasks,
    overdueTasks,
    theme,
    toggleTheme,
    sortBy,
    setSortBy,
  } = useTasks();
  
  const colors = getThemeColors(theme);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  const handleAddTask = () => {
    navigation.navigate('AddTask');
  };

  const handleEditTask = (task: Task) => {
    navigation.navigate('AddTask', { taskId: task.id });
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    setSearchQuery('');
    Animated.timing(fadeAnim, {
      toValue: showSearch ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const getFilteredTasks = (): Task[] => {
    let filtered: Task[] = [];
    
    switch (filter) {
      case 'completed':
        filtered = completedTasks;
        break;
      case 'incomplete':
        filtered = incompleteTasks;
        break;
      case 'overdue':
        filtered = overdueTasks;
        break;
      default:
        filtered = tasks;
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  const filteredTasks = getFilteredTasks();

  const renderTaskItem = ({ item }: { item: Task }) => (
    <Animated.View style={[styles.cardWrapper, { opacity: fadeAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0.7],
    })}]}>
     <TaskCard
  task={item}
  onDelete={deleteTask}
  onEdit={handleEditTask}
  onToggleComplete={toggleTaskCompletion}
  theme={theme}
/>

    </Animated.View>
  );

  const renderFilterButton = (
    filterType: FilterType, 
    label: string, 
    count: number
  ) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        { 
          backgroundColor: filter === filterType ? colors.primary : colors.surface,
          borderColor: filter === filterType ? colors.primary : colors.border,
        },
      ]}
      onPress={() => setFilter(filterType)}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.filterButtonText,
          { color: filter === filterType ? colors.surface : colors.textSecondary },
        ]}
      >
        {label}
      </Text>
      <View
        style={[
          styles.filterBadge,
          { 
            backgroundColor: filter === filterType 
              ? 'rgba(255, 255, 255, 0.3)' 
              : colors.borderLight,
          },
        ]}
      >
        <Text
          style={[
            styles.filterBadgeText,
            { color: filter === filterType ? colors.surface : colors.textPrimary },
          ]}
        >
          {count}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const sortOptions = [
    { key: 'date', label: 'Date Created' },
    { key: 'dueDate', label: 'Due Date' },
    { key: 'alphabetical', label: 'Alphabetical' },
    { key: 'completed', label: 'Completion Status' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar 
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} 
        backgroundColor={colors.background} 
      />

      {/* Fixed Header */}
      <View style={[styles.fixedHeader, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          {/* Title Row */}
          <View style={styles.titleRow}>
            <View style={styles.titleContainer}>
              <ClipboardList size={32} color={colors.primary} strokeWidth={2.5} />
              <Text style={[styles.title, { color: colors.textPrimary }]}>My Tasks</Text>
            </View>
            <View style={styles.headerActions}>
              {/* Theme Toggle */}
              <TouchableOpacity
                style={[styles.iconButton, { backgroundColor: colors.surface }]}
                onPress={toggleTheme}
                activeOpacity={0.7}
              >
                {theme === 'dark' ? (
                  <Sun size={20} color={colors.textPrimary} strokeWidth={2} />
                ) : (
                  <Moon size={20} color={colors.textPrimary} strokeWidth={2} />
                )}
              </TouchableOpacity>

              {/* Search Toggle */}
              <TouchableOpacity
                style={[styles.iconButton, { backgroundColor: colors.surface }]}
                onPress={toggleSearch}
                activeOpacity={0.7}
              >
                <Search size={20} color={colors.textPrimary} strokeWidth={2} />
              </TouchableOpacity>

              {/* Count Badge */}
              <View style={[styles.countBadge, { backgroundColor: colors.primaryLight }]}>
                <Text style={[styles.countText, { color: colors.surface }]}>
                  {tasks.length}/{MAX_TASKS}
                </Text>
              </View>
            </View>
          </View>

          {/* Search Bar */}
          {showSearch && (
            <Animated.View style={[styles.searchContainer, { opacity: fadeAnim }]}>
              <View style={[styles.searchBar, { backgroundColor: colors.surface }]}>
                <Search size={20} color={colors.textSecondary} strokeWidth={2} />
                <TextInput
                  style={[styles.searchInput, { color: colors.textPrimary }]}
                  placeholder="Search tasks..."
                  placeholderTextColor={colors.textLight}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoFocus
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <X size={20} color={colors.textSecondary} strokeWidth={2} />
                  </TouchableOpacity>
                )}
              </View>
            </Animated.View>
          )}

          {/* Stats */}
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {completedTasks.length} completed · {incompleteTasks.length} remaining
            {overdueTasks.length > 0 && ` · ${overdueTasks.length} overdue`}
          </Text>

          {/* Sort Button */}
          <TouchableOpacity
            style={[styles.sortButton, { backgroundColor: colors.surface }]}
            onPress={() => setShowSortMenu(!showSortMenu)}
            activeOpacity={0.7}
          >
            <ArrowUpDown size={16} color={colors.textPrimary} strokeWidth={2} />
            <Text style={[styles.sortButtonText, { color: colors.textPrimary }]}>
              Sort: {sortOptions.find(o => o.key === sortBy)?.label}
            </Text>
          </TouchableOpacity>

          {/* Sort Menu */}
          {showSortMenu && (
            <View style={[styles.sortMenu, { backgroundColor: colors.surface }]}>
              {sortOptions.map(option => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.sortMenuItem,
                    sortBy === option.key && { backgroundColor: colors.background },
                  ]}
                  onPress={() => {
                    setSortBy(option.key as any);
                    setShowSortMenu(false);
                  }}
                >
                  <Text style={[
                    styles.sortMenuText,
                    { color: sortBy === option.key ? colors.primary : colors.textPrimary },
                  ]}>
                    {option.label}
                  </Text>
                  {sortBy === option.key && (
                    <CheckCircle2 size={16} color={colors.primary} strokeWidth={2.5} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Filter Buttons */}
          <View style={styles.filterContainer}>
            {renderFilterButton('all', 'All', tasks.length)}
            {renderFilterButton('incomplete', 'Active', incompleteTasks.length)}
            {renderFilterButton('completed', 'Done', completedTasks.length)}
            {overdueTasks.length > 0 && renderFilterButton('overdue', 'Overdue', overdueTasks.length)}
          </View>

          {!isMaxReached && tasks.length > 0 && (
            <TouchableOpacity
              style={[styles.floatingAddButton, { backgroundColor: colors.primary }]}
              onPress={handleAddTask}
              activeOpacity={0.8}
            >
              <Plus size={28} color={colors.surface} strokeWidth={3} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Task List */}
      {tasks.length === 0 ? (
        <EmptyState onAddTask={handleAddTask}  />
      ) : filteredTasks.length === 0 ? (
        <View style={styles.emptyFilterState}>
          {searchQuery ? (
            <>
              <Search size={48} color={colors.textSecondary} strokeWidth={1.5} />
              <Text style={[styles.emptyFilterTitle, { color: colors.textPrimary }]}>
                No results found
              </Text>
              <Text style={[styles.emptyFilterText, { color: colors.textSecondary }]}>
                Try adjusting your search query
              </Text>
            </>
          ) : (
            <>
              <Filter size={48} color={colors.textSecondary} strokeWidth={1.5} />
              <Text style={[styles.emptyFilterTitle, { color: colors.textPrimary }]}>
                No {filter} tasks
              </Text>
              <Text style={[styles.emptyFilterText, { color: colors.textSecondary }]}>
                {filter === 'completed' 
                  ? 'Complete some tasks to see them here' 
                  : filter === 'overdue'
                  ? 'Great! No overdue tasks'
                  : 'All tasks are completed! Great job!'}
              </Text>
            </>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredTasks}
          renderItem={renderTaskItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContentWithHeader}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Footer */}
      {!isMaxReached && tasks.length > 0 && (
        <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.borderLight }]}>
          <Button
            title="Add New Task"
            onPress={handleAddTask}
            fullWidth
            icon={<Plus size={20} color={colors.surface} strokeWidth={2.5} />}
          />
        </View>
      )}

      {/* Max Reached Banner */}
      {isMaxReached && (
        <View style={[styles.maxReachedBanner, { backgroundColor: colors.success }]}>
          <View style={styles.maxReachedContent}>
            <View style={styles.maxReachedIconContainer}>
              <CheckCircle2 size={28} color={colors.surface} strokeWidth={2.5} />
            </View>
            <View style={styles.maxReachedTextContainer}>
              <Text style={[styles.maxReachedTitle, { color: colors.surface }]}>
                Task Limit Reached!
              </Text>
              <Text style={[styles.maxReachedText, { color: colors.surface }]}>
                Delete tasks to add more.
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Voice FAB */}
      <VoiceFAB onTasksAdded={() => setFilter('all')} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContentWithHeader: {
    paddingTop: 260,
    paddingHorizontal: SPACING.lg,
    paddingBottom: 140,
  },
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xxl,
  },
  header: {
    marginBottom: SPACING.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  title: {
    ...TYPOGRAPHY.h1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  countBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    minWidth: 60,
    alignItems: 'center',
  },
  countText: {
    ...TYPOGRAPHY.bodyMedium,
    fontSize: 14,
    fontWeight: '700',
  },
  searchContainer: {
    marginBottom: SPACING.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.sm,
    ...SHADOWS.small,
  },
  searchInput: {
    flex: 1,
    ...TYPOGRAPHY.body,
    padding: 0,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    marginLeft: 40,
    marginBottom: SPACING.md,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    marginLeft: 40,
    marginBottom: SPACING.md,
    alignSelf: 'flex-start',
    ...SHADOWS.small,
  },
  sortButtonText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
  },
  sortMenu: {
    marginLeft: 40,
    marginBottom: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.medium,
    overflow: 'hidden',
  },
  sortMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  sortMenuText: {
    ...TYPOGRAPHY.body,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginLeft: 40,
    flexWrap: 'wrap',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 2,
  },
  filterButtonText: {
    ...TYPOGRAPHY.small,
    fontWeight: '600',
  },
  filterBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.full,
    minWidth: 24,
    alignItems: 'center',
  },
  filterBadgeText: {
    ...TYPOGRAPHY.small,
    fontSize: 11,
    fontWeight: '700',
  },
  floatingAddButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.large,
  },
  cardWrapper: {
    marginBottom: SPACING.md,
  },
  emptyFilterState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyFilterTitle: {
    ...TYPOGRAPHY.h3,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  emptyFilterText: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.lg,
    paddingBottom: SPACING.xl,
    borderTopWidth: 1,
    ...SHADOWS.medium,
  },
  maxReachedBanner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    ...SHADOWS.large,
  },
  maxReachedContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  maxReachedIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  maxReachedTextContainer: {
    flex: 1,
  },
  maxReachedTitle: {
    ...TYPOGRAPHY.bodyMedium,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  maxReachedText: {
    ...TYPOGRAPHY.caption,
    opacity: 0.95,
  },
});