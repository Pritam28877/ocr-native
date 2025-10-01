import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Camera, Image, ArrowRight } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

export default function HomeScreen() {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);

  const requestPermissions = async () => {
    const { status: cameraStatus } =
      await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaStatus } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
      Alert.alert(
        'Permissions Required',
        'Camera and photo library access are required to upload images.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const handleCameraCapture = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      setLoading(true);
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false, // Don't crop image
        quality: 0.8,
        aspect: undefined,
      });

      if (!result.canceled && result.assets[0]) {
        router.push({
          pathname: '/processing',
          params: { imageUri: result.assets[0].uri },
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to capture image');
    } finally {
      setLoading(false);
    }
  };

  const handleGallerySelect = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      setLoading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false, // Don't crop image
        quality: 0.8,
        aspect: undefined,
      });

      if (!result.canceled && result.assets[0]) {
        router.push({
          pathname: '/processing',
          params: { imageUri: result.assets[0].uri },
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Simplified Header */}
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>Welcome!</Text>
          <Text style={styles.headerSubtitle}>
            Upload your handwritten quotation to get started
          </Text>
        </View>

        {/* Upload Options Section */}
        <View style={styles.uploadSection}>
          <Text style={styles.uploadSectionTitle}>Choose Upload Method</Text>

          {/* Camera Option */}
          <TouchableOpacity
            style={styles.uploadOption}
            onPress={handleCameraCapture}
            disabled={loading}
          >
            <LinearGradient
              colors={['#667EEA', '#764BA2']}
              style={styles.uploadOptionGradient}
            >
              <View style={styles.uploadIconContainer}>
                <Camera size={32} color="#FFFFFF" />
              </View>
              <View style={styles.uploadTextContainer}>
                <Text style={styles.uploadOptionTitle}>Take Photo</Text>
                <Text style={styles.uploadOptionSubtitle}>
                  Capture with camera
                </Text>
              </View>
              <ArrowRight size={20} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>

          {/* Gallery Option */}
          <TouchableOpacity
            style={styles.uploadOption}
            onPress={handleGallerySelect}
            disabled={loading}
          >
            <LinearGradient
              colors={['#8B5CF6', '#A855F7']}
              style={styles.uploadOptionGradient}
            >
              <View style={styles.uploadIconContainer}>
                <Image size={32} color="#FFFFFF" />
              </View>
              <View style={styles.uploadTextContainer}>
                <Text style={styles.uploadOptionTitle}>
                  Select from Gallery
                </Text>
                <Text style={styles.uploadOptionSubtitle}>
                  Choose existing photo
                </Text>
              </View>
              <ArrowRight size={20} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Simplified Stats */}
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>99%</Text>
            <Text style={styles.statLabel}>Accuracy</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>2min</Text>
            <Text style={styles.statLabel}>Processing</Text>
          </View>
        </View>

        {/* Bottom Spacer for Tab Navigation */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F2937',
  },
  content: {
    flex: 1,
    paddingBottom: 20,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },

  // Simplified Header
  headerSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#E5E7EB',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
  },

  // Upload Options Section
  uploadSection: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  uploadSectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  uploadOption: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  uploadOptionGradient: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 80,
  },
  uploadIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  uploadTextContainer: {
    flex: 1,
  },
  uploadOptionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  uploadOptionSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },

  // Simplified Stats
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: 32,
    gap: 40,
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: '#374151',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#8B5CF6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#D1D5DB',
    fontWeight: '600',
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 120,
  },
});
