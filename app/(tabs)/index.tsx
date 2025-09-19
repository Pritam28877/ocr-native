import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Camera, Upload, Bookmark, Settings as SettingsIcon, Sparkles } from 'lucide-react-native';
import { router } from 'expo-router';
import Navbar from '@/components/Navbar';
import { useTheme } from '@/contexts/ThemeContext';

export default function HomeScreen() {
  const { colors } = useTheme();

  const handleScanDocument = () => {
    router.push('/camera');
  };

  const handleUploadFile = () => {
    // Handle file upload
    console.log('Upload file pressed');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
     
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <LinearGradient
          colors={['#8B5CF6', '#A855F7']}
          style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Welcome Back!</Text>
            <Text style={styles.headerSubtitle}>Upload or scan your price list to get started</Text>
          </View>
        </LinearGradient>

        {/* Action Cards */}
        <View style={styles.actionCards}>
          <TouchableOpacity style={styles.scanCard} onPress={handleScanDocument}>
            <LinearGradient
              colors={['#8B5CF6', '#A855F7']}
              style={styles.cardGradient}>
              <Camera size={24} color="#FFFFFF" />
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>Scan Document</Text>
                <Text style={styles.cardSubtitle}>Use camera to capture price list</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.uploadCard} onPress={handleUploadFile}>
            <LinearGradient
              colors={['#3B82F6', '#06B6D4']}
              style={styles.cardGradient}>
              <Upload size={24} color="#FFFFFF" />
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>Upload File</Text>
                <Text style={styles.cardSubtitle}>PDF, JPG, PNG, DOC, XLSX</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* AI Features Section */}
        <View style={[styles.aiFeatures, { backgroundColor: colors.surface }]}>
          <View style={styles.aiHeader}>
            <View style={styles.aiIconContainer}>
              <Sparkles size={20} color="#10B981" />
            </View>
            <Text style={[styles.aiTitle, { color: colors.text }]}>AI-Powered Extraction</Text>
          </View>
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <View style={styles.featureDot} />
              <Text style={[styles.featureText, { color: colors.textSecondary }]}>Automatic product identification</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureDot} />
              <Text style={[styles.featureText, { color: colors.textSecondary }]}>Smart price and quantity detection</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureDot} />
              <Text style={[styles.featureText, { color: colors.textSecondary }]}>Instant quote generation</Text>
            </View>
          </View>
        </View>

        {/* Quick Access Section */}
        <View style={styles.quickAccess}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Access</Text>
          <View style={styles.quickAccessGrid}>
            <TouchableOpacity style={[styles.quickAccessCard, { backgroundColor: colors.surface }]}>
              <View style={[styles.quickAccessIcon, { backgroundColor: colors.background }]}>
                <Bookmark size={20} color="#EF4444" />
              </View>
              <Text style={[styles.quickAccessTitle, { color: colors.textSecondary }]}>Saved Quotes</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.quickAccessCard, { backgroundColor: colors.surface }]}>
              <View style={[styles.quickAccessIcon, { backgroundColor: colors.background }]}>
                <SettingsIcon size={20} color="#06B6D4" />
              </View>
              <Text style={[styles.quickAccessTitle, { color: colors.textSecondary }]}>Settings</Text>
            </TouchableOpacity>
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
  },
  content: {
    flex: 1,
  },
  header: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#E9D5FF',
    textAlign: 'center',
  },
  actionCards: {
    paddingHorizontal: 16,
    marginTop: 24,
    gap: 16,
  },
  scanCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  uploadCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  cardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  cardText: {
    marginLeft: 16,
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  aiFeatures: {
    marginHorizontal: 16,
    marginTop: 24,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  aiIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  aiTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  featureList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 12,
  },
  featureText: {
    fontSize: 14,
    flex: 1,
  },
  quickAccess: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  quickAccessGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  quickAccessCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  quickAccessIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quickAccessTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  bottomSpacer: {
    height: 120,
  },
});