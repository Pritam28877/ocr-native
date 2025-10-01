import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  Alert,
  Image,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Camera, Upload, X, Image as ImageIcon } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '@/contexts/ThemeContext';

interface ImageUploadModalProps {
  visible: boolean;
  onClose: () => void;
  onImageSelected: (imageUri: string) => void;
}

const { width } = Dimensions.get('window');

export default function ImageUploadModal({ visible, onClose, onImageSelected }: ImageUploadModalProps) {
  const { colors } = useTheme();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant permission to access your photo library.');
      return false;
    }
    return true;
  };

  const pickImageFromGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image from gallery');
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant permission to access your camera.');
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const handleConfirm = () => {
    if (selectedImage) {
      onImageSelected(selectedImage);
      setSelectedImage(null);
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedImage(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <LinearGradient
          colors={['#8B5CF6', '#A855F7']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Upload Quotation</Text>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {selectedImage ? (
            <View style={styles.previewContainer}>
              <Image source={{ uri: selectedImage }} style={styles.previewImage} />
              <View style={styles.previewActions}>
                <TouchableOpacity 
                  style={[styles.actionButton, { backgroundColor: colors.surface }]}
                  onPress={() => setSelectedImage(null)}
                >
                  <Text style={[styles.actionButtonText, { color: colors.text }]}>Choose Different</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.confirmButton}
                  onPress={handleConfirm}
                >
                  <LinearGradient
                    colors={['#10B981', '#059669']}
                    style={styles.confirmButtonGradient}
                  >
                    <Text style={styles.confirmButtonText}>Process Image</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.uploadOptions}>
              <Text style={[styles.instructionText, { color: colors.text }]}>
                Choose how you'd like to upload your handwritten quotation
              </Text>
              
              <View style={styles.optionsContainer}>
                <TouchableOpacity 
                  style={[styles.optionCard, { backgroundColor: colors.surface }]}
                  onPress={takePhoto}
                >
                  <LinearGradient
                    colors={['#8B5CF6', '#A855F7']}
                    style={styles.optionIcon}
                  >
                    <Camera size={32} color="#FFFFFF" />
                  </LinearGradient>
                  <Text style={[styles.optionTitle, { color: colors.text }]}>Take Photo</Text>
                  <Text style={[styles.optionSubtitle, { color: colors.textSecondary }]}>
                    Use camera to capture quotation
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.optionCard, { backgroundColor: colors.surface }]}
                  onPress={pickImageFromGallery}
                >
                  <LinearGradient
                    colors={['#3B82F6', '#06B6D4']}
                    style={styles.optionIcon}
                  >
                    <ImageIcon size={32} color="#FFFFFF" />
                  </LinearGradient>
                  <Text style={[styles.optionTitle, { color: colors.text }]}>From Gallery</Text>
                  <Text style={[styles.optionSubtitle, { color: colors.textSecondary }]}>
                    Select from your photos
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.tipsContainer}>
                <Text style={[styles.tipsTitle, { color: colors.text }]}>Tips for best results:</Text>
                <Text style={[styles.tipText, { color: colors.textSecondary }]}>
                  • Ensure good lighting
                </Text>
                <Text style={[styles.tipText, { color: colors.textSecondary }]}>
                  • Keep the document flat
                </Text>
                <Text style={[styles.tipText, { color: colors.textSecondary }]}>
                  • Avoid shadows and glare
                </Text>
                <Text style={[styles.tipText, { color: colors.textSecondary }]}>
                  • Make sure text is clearly visible
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingTop: 50,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  previewContainer: {
    flex: 1,
    alignItems: 'center',
  },
  previewImage: {
    width: width - 48,
    height: (width - 48) * 0.75,
    borderRadius: 12,
    marginBottom: 24,
  },
  previewActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  confirmButton: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  confirmButtonGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  uploadOptions: {
    flex: 1,
  },
  instructionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  optionsContainer: {
    gap: 16,
    marginBottom: 32,
  },
  optionCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  optionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  optionSubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  tipsContainer: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    marginBottom: 4,
  },
});
