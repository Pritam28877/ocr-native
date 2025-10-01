import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Upload, ArrowRight } from 'lucide-react-native';
import { router } from 'expo-router';
import Navbar from '@/components/Navbar';
import { useTheme } from '@/contexts/ThemeContext';
import ImageUploadModal from '@/components/ImageUploadModal';
import { useState } from 'react';

export default function HomeScreen() {
  const { colors } = useTheme();
  const [showUploadModal, setShowUploadModal] = useState(false);

  const handleUploadFile = () => {
    setShowUploadModal(true);
  };

  const handleImageSelected = (imageUri: string) => {
    // Navigate to processing screen with the selected image
    router.push({ 
      pathname: '/processing', 
      params: { imageUri } 
    });
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
          <Text style={styles.headerSubtitle}>Upload your handwritten quotation to get started</Text>
        </View>

        {/* Main Upload Section - More Prominent */}
        <View style={styles.mainUploadSection}>
          <TouchableOpacity style={styles.mainUploadCard} onPress={handleUploadFile}>
            <LinearGradient
              colors={['#667EEA', '#764BA2']}
              style={styles.mainUploadGradient}>
              <View style={styles.uploadIconLarge}>
                <Upload size={48} color="#FFFFFF" />
              </View>
              <Text style={styles.mainUploadTitle}>Upload Image Here</Text>
              <Text style={styles.mainUploadSubtitle}>Take a photo or select from gallery</Text>
              <View style={styles.uploadButton}>
                <Text style={styles.uploadButtonText}>Select Image</Text>
                <ArrowRight size={20} color="#667EEA" />
              </View>
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

      <ImageUploadModal
        visible={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onImageSelected={handleImageSelected}
      />
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

  // Main Upload Section - More Prominent
  mainUploadSection: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  mainUploadCard: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#667EEA',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
  },
  mainUploadGradient: {
    padding: 40,
    alignItems: 'center',
    minHeight: 200,
  },
  uploadIconLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  mainUploadTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  mainUploadSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  uploadButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#8B5CF6',
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