import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { Mic, X, Check } from 'lucide-react-native';
import { Audio } from 'expo-av';
import { useTasks } from '../context/TaskContext';
import { SPACING, TYPOGRAPHY, SHADOWS, BORDER_RADIUS } from '../utils/constants';
import { getThemeColors } from '@/constants/themeColor';
import { splitTasksFromTranscription } from '@/utils/voice';

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
  const [errorMessage, setErrorMessage] = useState('');

  // Pulse animation
  useEffect(() => {
    if (isListening) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.2, duration: 600, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isListening]);

  const recordAudio = async (): Promise<string> => {
    try {
      // Request permissions
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        throw new Error('Microphone permission denied');
      }

      // Set audio mode for recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Create recording
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await recording.startAsync();

      // Record for 5 seconds (adjust as needed)
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      const uri = recording.getURI();
      if (!uri) throw new Error('Recording URI is undefined');

      return uri;
    } catch (error) {
      console.error('Recording error:', error);
      throw error;
    }
  };

  // Call OpenAI's audio transcription using URI directly
  const transcribeAudio = async (audioUri: string): Promise<string> => {
    try {
      // Create FormData and append the file using URI
      const formData = new FormData();
      
      // For React Native, we can pass the URI directly with file metadata
      formData.append('file', {
        uri: audioUri,
        type: 'audio/m4a',
        name: 'recording.m4a',
      } as any);
      
      formData.append('model', 'whisper-1');

      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`OpenAI error: ${response.status} - ${text}`);
      }

      const json = await response.json();
      return json.text ?? '';
    } catch (error) {
      console.error('Transcription failed:', error);
      throw new Error('Failed to transcribe audio.');
    }
  };

  // Handle voice input end-to-end
  const handleVoiceInput = async () => {
    setShowModal(true);
    setIsListening(true);
    setTranscription('');
    setExtractedTasks([]);
    setErrorMessage('');

    try {
      const audioUri = await recordAudio();
      setIsListening(false);
      setIsProcessing(true);

      const realTranscription = await transcribeAudio(audioUri);
      setTranscription(realTranscription);

      if (!realTranscription.trim()) {
        setErrorMessage('No speech detected. Please try again.');
        setIsProcessing(false);
        return;
      }

      const tasks = await splitTasksFromTranscription(realTranscription);
      setExtractedTasks(tasks);

      setIsProcessing(false);
    } catch (error: any) {
      console.error('Voice input error:', error);
      setErrorMessage(error.message || 'Something went wrong. Please try again.');
      setIsListening(false);
      setIsProcessing(false);
    }
  };

  const handleConfirmTasks = () => {
    extractedTasks.forEach(taskTitle => addTask({ title: taskTitle, completed: false }));
    setShowModal(false);
    setTranscription('');
    setExtractedTasks([]);
    setErrorMessage('');
    onTasksAdded?.();
  };

  const handleCancel = () => {
    setShowModal(false);
    setIsListening(false);
    setIsProcessing(false);
    setTranscription('');
    setExtractedTasks([]);
    setErrorMessage('');
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.secondary }]}
        onPress={handleVoiceInput}
        activeOpacity={0.8}
      >
        <Mic size={28} color={colors.surface} strokeWidth={2.5} />
      </TouchableOpacity>

      <Modal visible={showModal} transparent animationType="fade" onRequestClose={handleCancel}>
        <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            {/* Listening State */}
            {isListening && (
              <View style={styles.listeningContainer}>
                <Animated.View
                  style={[
                    styles.microphoneCircle,
                    { backgroundColor: colors.secondary + '20', transform: [{ scale: pulseAnim }] },
                  ]}
                >
                  <View style={[styles.microphoneInner, { backgroundColor: colors.secondary }]}>
                    <Mic size={40} color={colors.surface} strokeWidth={2} />
                  </View>
                </Animated.View>
                <Text style={[styles.statusText, { color: colors.textPrimary }]}>Listening...</Text>
                <Text style={[styles.instructionText, { color: colors.textSecondary }]}>
                  Speak your tasks naturally
                </Text>
              </View>
            )}

            {/* Processing State */}
            {isProcessing && (
              <View style={styles.processingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={[styles.statusText, { color: colors.textPrimary }]}>Processing...</Text>
                {transcription && (
                  <Text style={[styles.transcriptionText, { color: colors.textSecondary }]}>
                    "{transcription}"
                  </Text>
                )}
              </View>
            )}

            {/* Error State */}
            {!isListening && !isProcessing && errorMessage && (
              <View style={styles.errorContainer}>
                <View style={[styles.errorIcon, { backgroundColor: colors.error + '20' }]}>
                  <X size={32} color={colors.error} strokeWidth={2.5} />
                </View>
                <Text style={[styles.errorTitle, { color: colors.textPrimary }]}>
                  Oops!
                </Text>
                <Text style={[styles.errorText, { color: colors.textSecondary }]}>
                  {errorMessage}
                </Text>
                <TouchableOpacity
                  style={[styles.retryButton, { backgroundColor: colors.primary }]}
                  onPress={() => {
                    setErrorMessage('');
                    handleVoiceInput();
                  }}
                >
                  <Text style={[styles.retryButtonText, { color: colors.surface }]}>
                    Try Again
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Results State */}
            {!isListening && !isProcessing && !errorMessage && extractedTasks.length > 0 && (
              <View style={styles.resultsContainer}>
                <View style={[styles.successIcon, { backgroundColor: colors.success + '20' }]}>
                  <Check size={32} color={colors.success} strokeWidth={2.5} />
                </View>
                <Text style={[styles.resultsTitle, { color: colors.textPrimary }]}>
                  Found {extractedTasks.length} {extractedTasks.length === 1 ? 'task' : 'tasks'}
                </Text>
                <View style={styles.tasksList}>
                  {extractedTasks.map((task, index) => (
                    <View key={index} style={[styles.taskItem, { backgroundColor: colors.background }]}>
                      <View style={[styles.taskBullet, { backgroundColor: colors.primary }]} />
                      <Text style={[styles.taskText, { color: colors.textPrimary }]}>{task}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.button, styles.cancelButton, { borderColor: colors.border }]}
                    onPress={handleCancel}
                  >
                    <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.confirmButton, { backgroundColor: colors.primary }]}
                    onPress={handleConfirmTasks}
                  >
                    <Check size={20} color={colors.surface} strokeWidth={2.5} />
                    <Text style={[styles.confirmButtonText, { color: colors.surface }]}>Add Tasks</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Close Button */}
            {!isProcessing && !isListening && (
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
    zIndex: 100 
  },
  modalOverlay: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: SPACING.lg 
  },
  modalContent: { 
    width: '100%', 
    maxWidth: 400, 
    borderRadius: BORDER_RADIUS.xl, 
    padding: SPACING.xl, 
    ...SHADOWS.large 
  },
  closeButton: { 
    position: 'absolute', 
    top: SPACING.md, 
    right: SPACING.md, 
    width: 32, 
    height: 32, 
    borderRadius: 16, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  listeningContainer: { 
    alignItems: 'center', 
    paddingVertical: SPACING.xl 
  },
  microphoneCircle: { 
    width: 140, 
    height: 140, 
    borderRadius: 70, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: SPACING.lg 
  },
  microphoneInner: { 
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  statusText: { 
    ...TYPOGRAPHY.h2, 
    marginBottom: SPACING.sm 
  },
  instructionText: { 
    ...TYPOGRAPHY.body, 
    textAlign: 'center' 
  },
  processingContainer: { 
    alignItems: 'center', 
    paddingVertical: SPACING.xl 
  },
  transcriptionText: { 
    ...TYPOGRAPHY.body, 
    fontStyle: 'italic', 
    textAlign: 'center', 
    marginTop: SPACING.lg, 
    paddingHorizontal: SPACING.md 
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  errorIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  errorTitle: {
    ...TYPOGRAPHY.h2,
    marginBottom: SPACING.sm,
  },
  errorText: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  retryButton: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.small,
  },
  retryButtonText: {
    ...TYPOGRAPHY.bodyMedium,
    fontWeight: '600',
  },
  resultsContainer: { 
    paddingVertical: SPACING.lg 
  },
  successIcon: { 
    width: 64, 
    height: 64, 
    borderRadius: 32, 
    justifyContent: 'center', 
    alignItems: 'center', 
    alignSelf: 'center', 
    marginBottom: SPACING.lg 
  },
  resultsTitle: { 
    ...TYPOGRAPHY.h2, 
    textAlign: 'center', 
    marginBottom: SPACING.lg 
  },
  tasksList: { 
    marginBottom: SPACING.xl 
  },
  taskItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: SPACING.md, 
    borderRadius: BORDER_RADIUS.md, 
    marginBottom: SPACING.sm 
  },
  taskBullet: { 
    width: 8, 
    height: 8, 
    borderRadius: 4, 
    marginRight: SPACING.md 
  },
  taskText: { 
    ...TYPOGRAPHY.body, 
    flex: 1 
  },
  buttonContainer: { 
    flexDirection: 'row', 
    gap: SPACING.md 
  },
  button: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: SPACING.md, 
    borderRadius: BORDER_RADIUS.md, 
    gap: SPACING.sm 
  },
  cancelButton: { 
    borderWidth: 2 
  },
  cancelButtonText: { 
    ...TYPOGRAPHY.bodyMedium 
  },
  confirmButton: { 
    ...SHADOWS.small 
  },
  confirmButtonText: { 
    ...TYPOGRAPHY.bodyMedium, 
    fontWeight: '600' 
  },
});