// screens/AddTaskScreen.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { ArrowLeft, Lightbulb, Edit3, ClipboardList, FileText } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { useTasks } from '../context/TaskContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS, BORDER_RADIUS } from '../utils/constants';

type AddTaskScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AddTask'>;
  route: RouteProp<RootStackParamList, 'AddTask'>;
};

interface FormErrors {
  title?: string;
}

export const AddTaskScreen: React.FC<AddTaskScreenProps> = ({ navigation, route }) => {
  const { addTask, updateTask, isMaxReached, tasks, MAX_TASKS } = useTasks();
  const { taskId } = route.params || {};
  
  const isEditMode = !!taskId;
  const existingTask = tasks.find(t => t.id === taskId);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode && existingTask) {
      setTitle(existingTask.title);
      setDescription(existingTask.description || '');
    }
  }, [isEditMode, existingTask]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Task title is required';
    } else if (title.trim().length < 2) {
      newErrors.title = 'Task title must be at least 2 characters';
    } else if (title.trim().length > 100) {
      newErrors.title = 'Task title must be less than 100 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (!isEditMode && isMaxReached) {
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      if (isEditMode && taskId) {
        updateTask(taskId, {
          title: title.trim(),
          description: description.trim() || undefined,
        });
      } else {
        addTask({
          title: title.trim(),
          description: description.trim() || undefined,
          completed: false,
        });
      }

      setLoading(false);
      navigation.goBack();
    }, 500);
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const remainingSlots = MAX_TASKS - tasks.length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />
      
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Enhanced Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
            <View style={styles.backIconContainer}>
              <ArrowLeft 
                size={22} 
                color={COLORS.textPrimary} 
                strokeWidth={2.5}
              />
            </View>
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <View style={styles.headerTitleRow}>
              {isEditMode ? (
                <Edit3 size={20} color={COLORS.secondary} strokeWidth={2.5} />
              ) : (
                <ClipboardList size={20} color={COLORS.primary} strokeWidth={2.5} />
              )}
              <Text style={styles.title}>
                {isEditMode ? 'Edit Task' : 'Add New Task'}
              </Text>
            </View>
            
            {!isEditMode && (
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${(tasks.length / MAX_TASKS) * 100}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.progressText}>
                  {tasks.length}/{MAX_TASKS}
                </Text>
              </View>
            )}
          </View>
          
          <View style={styles.backButton} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Task Details Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ClipboardList size={20} color={COLORS.textPrimary} strokeWidth={2} />
              <Text style={styles.sectionLabel}>Task Details</Text>
            </View>
            
            <View style={styles.inputCard}>
              {/* Task Title Input */}
              <View style={styles.inputWrapper}>
                <Input
                  label="Task Title"
                  placeholder="e.g., Buy groceries, Finish report..."
                  value={title}
                  onChangeText={(text) => {
                    setTitle(text);
                    if (errors.title) setErrors({ ...errors, title: undefined });
                  }}
                  error={errors.title}
                  maxLength={100}
                  helperText={`${title.length}/100 characters`}
                />
              </View>

              {/* Task Description Input */}
              <View style={styles.inputWrapper}>
                <Input
                  label="Description (Optional)"
                  placeholder="Add more details about this task..."
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={4}
                  maxLength={500}
                  helperText={`${description.length}/500 characters`}
                  leftIcon={
                    <View style={styles.descIconContainer}>
                      <FileText 
                        size={20} 
                        color={COLORS.primary} 
                        strokeWidth={2}
                      />
                    </View>
                  }
                />
              </View>
            </View>
          </View>

          {/* Enhanced Info Card - Add Mode */}
          {!isEditMode && remainingSlots > 0 && (
            <View style={styles.infoCard}>
              <View style={styles.infoIconContainer}>
                <Lightbulb 
                  size={22} 
                  color={COLORS.primary} 
                  strokeWidth={2}
                />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>
                  {remainingSlots} {remainingSlots === 1 ? 'Slot' : 'Slots'} Remaining
                </Text>
                <Text style={styles.infoText}>
                  You can add {remainingSlots} more {remainingSlots === 1 ? 'task' : 'tasks'} to your list.
                </Text>
              </View>
            </View>
          )}

          {/* Enhanced Edit Mode Info */}
          {isEditMode && (
            <View style={[styles.infoCard, styles.editInfoCard]}>
              <View style={[styles.infoIconContainer, styles.editIconContainer]}>
                <Edit3 
                  size={22} 
                  color={COLORS.secondary} 
                  strokeWidth={2}
                />
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.infoTitle, styles.editInfoTitle]}>
                  Editing Task
                </Text>
                <Text style={[styles.infoText, styles.editInfoText]}>
                  Update the details below to modify this task.
                </Text>
              </View>
            </View>
          )}

          {/* Tips Card */}
          <View style={styles.tipsCard}>
            <Text style={styles.tipsTitle}>💡 Tips for Better Tasks</Text>
            <View style={styles.tipsList}>
              <Text style={styles.tipItem}>• Keep titles clear and concise</Text>
              <Text style={styles.tipItem}>• Add descriptions for complex tasks</Text>
              <Text style={styles.tipItem}>• Break large tasks into smaller ones</Text>
            </View>
          </View>
        </ScrollView>

        {/* Enhanced Action Buttons */}
        <View style={styles.footer}>
          <View style={styles.footerButtons}>
            <Button
              title="Cancel"
              onPress={handleCancel}
              variant="outline"
              style={styles.cancelButton}
            />
            <Button
              title={loading ? (isEditMode ? 'Updating...' : 'Adding...') : (isEditMode ? 'Update Task' : 'Add Task')}
              onPress={handleSubmit}
              loading={loading}
              disabled={!isEditMode && isMaxReached}
              style={styles.submitButton}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg + 4,
    backgroundColor: COLORS.surface,
    ...SHADOWS.small,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIconContainer: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  title: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    fontSize: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  progressBar: {
    width: 100,
    height: 8,
    backgroundColor: COLORS.borderLight,
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.full,
  },
  progressText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: 140,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  sectionLabel: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '600',
  },
  inputCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.medium,
  },
  inputWrapper: {
    marginBottom: SPACING.lg,
  },
  descIconContainer: {
    marginRight: SPACING.xs,
  },
  infoCard: {
    flexDirection: 'row',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
    borderColor: COLORS.primaryLight + '50',
    backgroundColor: COLORS.primaryLight + '10',
    marginBottom: SPACING.lg,
  },
  editInfoCard: {
    borderColor: COLORS.secondary + '50',
    backgroundColor: COLORS.secondary + '10',
  },
  infoIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primaryLight + '30',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  editIconContainer: {
    backgroundColor: COLORS.secondary + '30',
  },
  infoContent: {
    flex: 1,
    justifyContent: 'center',
  },
  infoTitle: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
    fontWeight: '600',
    fontSize: 16,
  },
  editInfoTitle: {
    color: COLORS.secondary,
  },
  infoText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  editInfoText: {
    color: COLORS.textSecondary,
  },
  tipsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  tipsTitle: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    fontWeight: '600',
  },
  tipsList: {
    gap: SPACING.sm,
  },
  tipItem: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    paddingTop: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    ...SHADOWS.large,
  },
  footerButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 2,
  },
});