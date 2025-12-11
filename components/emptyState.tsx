// components/EmptyState.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ClipboardList, Plus, Sparkles } from 'lucide-react-native';
import { Button } from './common/Button';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../utils/constants';

interface EmptyStateProps {
  onAddTask: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onAddTask }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Icon with decoration */}
        <View style={styles.iconContainer}>
          
          <View style={styles.sparkle1}>
            <Sparkles size={20} color={COLORS.primaryLight} strokeWidth={2} />
          </View>
          <View style={styles.sparkle2}>
            <Sparkles size={16} color={COLORS.primary} strokeWidth={2} />
          </View>
        </View>

        {/* Text Content */}
        <Text style={styles.title}>No Tasks Yet</Text>
        <Text style={styles.description}>
          Start organizing your life by adding your first task. 
          Track what needs to be done and mark items as complete.
        </Text>

        {/* Feature List */}
        <View style={styles.featureList}>
          <View style={styles.featureItem}>
            <View style={styles.featureDot} />
            <Text style={styles.featureText}>Add tasks with titles and descriptions</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={styles.featureDot} />
            <Text style={styles.featureText}>Mark tasks as complete</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={styles.featureDot} />
            <Text style={styles.featureText}>Edit or delete anytime</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={styles.featureDot} />
            <Text style={styles.featureText}>Filter by status</Text>
          </View>
        </View>

        {/* CTA Button */}
        <View style={styles.buttonContainer}>
          <Button
            title="Add Your First Task"
            onPress={onAddTask}
            icon={<Plus size={20} color={COLORS.surface} strokeWidth={2.5} />}
            style={styles.addButton}
          />
        </View>

        {/* Decorative Elements */}
        <View style={styles.decorativeContainer}>
          <View style={styles.decorativeLine} />
          <View style={styles.decorativeDot} />
          <View style={styles.decorativeDot} />
          <View style={styles.decorativeDot} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xxl,
  },
  content: {
    alignItems: 'center',
    maxWidth: 400,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: SPACING.xl,
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: COLORS.primaryLight + '20',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.primaryLight + '40',
    ...SHADOWS.large,
  },
  sparkle1: {
    position: 'absolute',
    top: -10,
    right: 10,
    transform: [{ rotate: '15deg' }],
  },
  sparkle2: {
    position: 'absolute',
    bottom: 5,
    left: -5,
    transform: [{ rotate: '-15deg' }],
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  description: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SPACING.xl,
  },
  featureList: {
    alignSelf: 'stretch',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    ...SHADOWS.small,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginRight: SPACING.md,
  },
  featureText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    flex: 1,
  },
  buttonContainer: {
    alignSelf: 'stretch',
  },
  addButton: {
    paddingVertical: SPACING.lg,
    ...SHADOWS.medium,
  },
  decorativeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginTop: SPACING.xl,
  },
  decorativeLine: {
    height: 3,
    width: 40,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.full,
  },
  decorativeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primaryLight,
    opacity: 0.6,
  },
});