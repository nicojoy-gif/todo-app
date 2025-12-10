// components/TaskCard.tsx

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

import { Pencil, Trash2, CheckCircle2, Circle, Calendar } from 'lucide-react-native';
import { Card } from './common/Card';
import { Task, Theme } from '../types';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../utils/constants';
import { getThemeColors } from '@/constants/themeColor';

interface TaskCardProps {
  task: Task;
  theme: Theme;             // <-- NEW
  onDelete: (id: string) => void;
  onEdit?: (task: Task) => void;
  onToggleComplete: (id: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  theme,
  onDelete,
  onEdit,
  onToggleComplete
}) => {

  const colors = getThemeColors(theme);

  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      `Are you sure you want to delete "${task.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete(task.id),
        },
      ]
    );
  };

  const handleEdit = () => {
    if (onEdit) onEdit(task);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  return (
    <Card
      style={[
        styles.card,
        { backgroundColor: task.completed ? colors.background : colors.surface },
        task.completed && { opacity: 0.85 }
      ]}
      padding="none"
    >
      <View style={[styles.content, { backgroundColor: colors.surface }]}>
        
        {/* Checkbox + task info */}
        <TouchableOpacity
          style={styles.checkboxSection}
          onPress={() => onToggleComplete(task.id)}
          activeOpacity={0.7}
        >
          <View style={styles.checkboxContainer}>
            {task.completed ? (
              <CheckCircle2
                size={28}
                color={colors.success}
                fill={colors.success}
                strokeWidth={2}
              />
            ) : (
              <Circle
                size={28}
                color={colors.border}
                strokeWidth={2.5}
              />
            )}
          </View>

          {/* Text content */}
          <View style={styles.taskInfo}>
            <Text
              style={[
                styles.title,
                { color: task.completed ? colors.textSecondary : colors.textPrimary },
                task.completed && { textDecorationLine: 'line-through', opacity: 0.7 }
              ]}
              numberOfLines={2}
            >
              {task.title}
            </Text>

            {task.description && (
              <Text
                style={[
                  styles.description,
                  { color: colors.textSecondary },
                  task.completed && { opacity: 0.6 }
                ]}
                numberOfLines={2}
              >
                {task.description}
              </Text>
            )}

            {/* Date */}
            <View style={styles.dateContainer}>
              <Calendar size={12} color={colors.textSecondary} strokeWidth={2} />
              <Text style={[styles.dateText, { color: colors.textSecondary }]}>
                {task.completed && task.completedAt
                  ? `Completed ${formatDate(task.completedAt)}`
                  : `Created ${formatDate(task.createdAt)}`
                }
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Edit + Delete buttons */}
        <View style={styles.actions}>
          {onEdit && (
            <TouchableOpacity
              style={[
                styles.actionButton,
                {
                  backgroundColor: colors.primaryLight + '18',
                  borderColor: colors.primaryLight + '60'
                }
              ]}
              onPress={handleEdit}
            >
              <Pencil size={18} color={colors.primary} strokeWidth={2.5} />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              styles.actionButton,
              {
                backgroundColor: colors.error + '12',
                borderColor: colors.error + '50'
              }
            ]}
            onPress={handleDelete}
          >
            <Trash2 size={18} color={colors.error} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Completed Badge */}
      {task.completed && (
        <View style={[
          styles.completedBadge,
          { backgroundColor: colors.success }
        ]}>
          <View style={styles.completedBadgeInner}>
            <CheckCircle2 size={14} color={colors.surface} strokeWidth={2.5} />
            <Text style={[
              styles.completedBadgeText,
              { color: colors.surface }
            ]}>
              Completed
            </Text>
          </View>
        </View>
      )}

      {/* Decorative footer */}
      <View style={[styles.cardFooter, { backgroundColor: colors.surface }]}>
        <View style={styles.decorativeBar}>
          <View
            style={[
              styles.footerDivider,
              { backgroundColor: task.completed ? colors.success : colors.primary }
            ]}
          />
          <View
            style={[
              styles.footerDot,
              { backgroundColor: task.completed ? colors.success + '80' : colors.primaryLight }
            ]}
          />
          <View
            style={[
              styles.footerDot,
              { backgroundColor: task.completed ? colors.success + '80' : colors.primaryLight }
            ]}
          />
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    ...SHADOWS.large,
    borderRadius: BORDER_RADIUS.xl,
    position: 'relative',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  checkboxSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginRight: SPACING.md,
  },
  checkboxContainer: {
    marginRight: SPACING.md,
    marginTop: 2,
  },
  taskInfo: {
    flex: 1,
  },
  title: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.sm,
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '600',
  },
  description: {
    ...TYPOGRAPHY.body,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: SPACING.sm,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginTop: SPACING.xs,
  },
  dateText: {
    ...TYPOGRAPHY.caption,
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  completedBadge: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    ...SHADOWS.small,
  },
  completedBadgeInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  completedBadgeText: {
    ...TYPOGRAPHY.small,
    fontWeight: '700',
    fontSize: 11,
  },
  cardFooter: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  decorativeBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  footerDivider: {
    height: 4,
    borderRadius: BORDER_RADIUS.full,
    width: 48,
  },
  footerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
