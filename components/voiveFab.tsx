// components/VoiceFAB.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { Mic, X, Check, Loader } from 'lucide-react-native';
import { useTasks } from '../context/TaskContext';
import { SPACING, TYPOGRAPHY, SHADOWS, BORDER_RADIUS } from '../utils/constants';
import { getThemeColors } from '@/constants/themeColor';
import { processVoiceInput } from '@/utils/voice';

interface VoiceFABProps {
  onTasksAdded?: () => void;
}

export const VoiceFAB: React.FC<VoiceFABProps> = ({ onTasksAdded }) => {
  const { addTask, theme } = useTasks();
  const colors = getThemeColors(theme);
  
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [extractedTasks, setExtractedTasks] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [pulseAnim] = useState(new Animated.Value(1));

  // Pulse animation for listening state
  React.useEffect(() => {
    if (isListening) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isListening]);

  const handleVoiceInput = async () => {
    setShowModal(true);
    setIsListening(true);
    setTranscription('');
    setExtractedTasks([]);

    try {
      // Simulate voice recording (3 seconds)
      // In production, use actual voice recording library
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setIsListening(false);
      setIsProcessing(true);

      // Simulate transcription
      // Replace with actual transcription in production
      const mockTranscription = "Buy provisions and call mom";
      setTranscription(mockTranscription);

      // Process with AI to split tasks
      const result = await processVoiceInput(mockTranscription);
      setExtractedTasks(result.tasks);
      
      setIsProcessing(false);
    } catch (error) {
      console.error('Voice input error:', error);
      setIsListening(false);
      setIsProcessing(false);
    }
  };

  const handleConfirmTasks = () => {
    extractedTasks.forEach(taskTitle => {
      addTask({
        title: taskTitle,
        completed: false,
      });
    });

    setShowModal(false);
    setTranscription('');
    setExtractedTasks([]);
    onTasksAdded?.();
  };

  const handleCancel = () => {
    setShowModal(false);
    setIsListening(false);
    setIsProcessing(false);
    setTranscription('');
    setExtractedTasks([]);
  };

  return (
    <>
      {/* Floating Action Button */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.secondary }]}
        onPress={handleVoiceInput}
        activeOpacity={0.8}
      >
        <Mic size={28} color={colors.surface} strokeWidth={2.5} />
      </TouchableOpacity>

      {/* Voice Input Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={handleCancel}
      >
        <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            {/* Listening State */}
            {isListening && (
              <View style={styles.listeningContainer}>
                <Animated.View
                  style={[
                    styles.microphoneCircle,
                    { 
                      backgroundColor: colors.secondary + '20',
                      transform: [{ scale: pulseAnim }],
                    },
                  ]}
                >
                  <View style={[styles.microphoneInner, { backgroundColor: colors.secondary }]}>
                    <Mic size={40} color={colors.surface} strokeWidth={2} />
                  </View>
                </Animated.View>
                <Text style={[styles.statusText, { color: colors.textPrimary }]}>
                  Listening...
                </Text>
                <Text style={[styles.instructionText, { color: colors.textSecondary }]}>
                  Speak your tasks naturally
                </Text>
              </View>
            )}

            {/* Processing State */}
            {isProcessing && (
              <View style={styles.processingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={[styles.statusText, { color: colors.textPrimary }]}>
                  Processing...
                </Text>
                <Text style={[styles.transcriptionText, { color: colors.textSecondary }]}>
                  "{transcription}"
                </Text>
              </View>
            )}

            {/* Results State */}
            {!isListening && !isProcessing && extractedTasks.length > 0 && (
              <View style={styles.resultsContainer}>
                <View style={[styles.successIcon, { backgroundColor: colors.success + '20' }]}>
                  <Check size={32} color={colors.success} strokeWidth={2.5} />
                </View>
                
                <Text style={[styles.resultsTitle, { color: colors.textPrimary }]}>
                  Found {extractedTasks.length} {extractedTasks.length === 1 ? 'task' : 'tasks'}
                </Text>

                <View style={styles.tasksList}>
                  {extractedTasks.map((task, index) => (
                    <View
                      key={index}
                      style={[styles.taskItem, { backgroundColor: colors.background }]}
                    >
                      <View style={[styles.taskBullet, { backgroundColor: colors.primary }]} />
                      <Text style={[styles.taskText, { color: colors.textPrimary }]}>
                        {task}
                      </Text>
                    </View>
                  ))}
                </View>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.button, styles.cancelButton, { borderColor: colors.border }]}
                    onPress={handleCancel}
                  >
                    <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>
                      Cancel
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.button, styles.confirmButton, { backgroundColor: colors.primary }]}
                    onPress={handleConfirmTasks}
                  >
                    <Check size={20} color={colors.surface} strokeWidth={2.5} />
                    <Text style={[styles.confirmButtonText, { color: colors.surface }]}>
                      Add Tasks
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Close Button */}
            {!isProcessing && (
              <TouchableOpacity
                style={[styles.closeButton, { backgroundColor: colors.border }]}
                onPress={handleCancel}
              >
                <X size={20} color={colors.textSecondary} strokeWidth={2} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.large,
    zIndex: 100,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    ...SHADOWS.large,
  },
  closeButton: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listeningContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  microphoneCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  microphoneInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    ...TYPOGRAPHY.h2,
    marginBottom: SPACING.sm,
  },
  instructionText: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
  },
  processingContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  transcriptionText: {
    ...TYPOGRAPHY.body,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },
  resultsContainer: {
    paddingVertical: SPACING.lg,
  },
  successIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: SPACING.lg,
  },
  resultsTitle: {
    ...TYPOGRAPHY.h2,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  tasksList: {
    marginBottom: SPACING.xl,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
  },
  taskBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.md,
  },
  taskText: {
    ...TYPOGRAPHY.body,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.sm,
  },
  cancelButton: {
    borderWidth: 2,
  },
  cancelButtonText: {
    ...TYPOGRAPHY.bodyMedium,
  },
  confirmButton: {
    ...SHADOWS.small,
  },
  confirmButtonText: {
    ...TYPOGRAPHY.bodyMedium,
    fontWeight: '600',
  },
});