import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../../utils/constants';

interface ImagePickerButtonProps {
  onImageSelect: (uri: string) => void;
  imageUri?: string;
  label?: string;
  error?: string;
}

export const ImagePickerButton: React.FC<ImagePickerButtonProps> = ({
  onImageSelect,
  imageUri,
  label = 'Product Photo',
  error,
}) => {
  const [loading, setLoading] = useState(false);

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please grant permission to access your photos to upload product images.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    setLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onImageSelect(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
      console.error('Image picker error:', error);
    } finally {
      setLoading(false);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please grant permission to access your camera.',
        [{ text: 'OK' }]
      );
      return;
    }

    setLoading(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onImageSelect(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo. Please try again.');
      console.error('Camera error:', error);
    } finally {
      setLoading(false);
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Select Image',
      'Choose how you want to add a product photo',
      [
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Library', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      
      
      <TouchableOpacity
        style={[
          styles.imageContainer,
          error && styles.imageContainerError,
          imageUri && styles.imageContainerWithImage,
        ]}
        onPress={showImageOptions}
        activeOpacity={0.7}
      >
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : imageUri ? (
          <>
            <Image source={{ uri: imageUri }} style={styles.image} />
            <View style={styles.overlay}>
              <Text style={styles.changeText}>Tap to change</Text>
            </View>
          </>
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderIcon}>📷</Text>
            <Text style={styles.placeholderText}>Tap to add photo</Text>
            <Text style={styles.placeholderSubtext}>Camera or Gallery</Text>
          </View>
        )}
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  imageContainer: {
    height: 200,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: COLORS.border,
    backgroundColor: COLORS.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  imageContainerError: {
    borderColor: COLORS.error,
  },
  imageContainerWithImage: {
    borderStyle: 'solid',
    borderWidth: 0,
    ...SHADOWS.medium,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.overlayLight,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
  },
  changeText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.surface,
  },
  placeholder: {
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 48,
    marginBottom: SPACING.sm,
  },
  placeholderText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  placeholderSubtext: {
    ...TYPOGRAPHY.small,
    color: COLORS.textLight,
  },
  errorText: {
    ...TYPOGRAPHY.small,
    color: COLORS.error,
    marginTop: SPACING.xs,
    marginLeft: SPACING.xs,
  },
});