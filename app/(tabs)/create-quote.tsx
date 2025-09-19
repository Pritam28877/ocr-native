import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Camera, Upload, CircleCheck as CheckCircle } from 'lucide-react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';

export default function CreateQuoteScreen() {
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
      
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Create Quote</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>Choose how you want to add items</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.actionCards}>
          <TouchableOpacity style={styles.scanCard} onPress={handleScanDocument}>
            <LinearGradient
              colors={['#8B5CF6', '#A855F7']}
              style={styles.cardGradient}>
              <Camera size={32} color="#FFFFFF" />
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
              <Upload size={32} color="#FFFFFF" />
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>Upload File</Text>
                <Text style={styles.cardSubtitle}>PDF, JPG, PNG, DOC, XLSX</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={[styles.instructionsContainer, { backgroundColor: colors.surface }]}>
          <Text style={[styles.instructionsTitle, { color: colors.text }]}>How it works</Text>
          
          <View style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={[styles.stepTitle, { color: colors.text }]}>Choose Your Method</Text>
            </View>
            <Text style={[styles.stepDescription, { color: colors.textSecondary }]}>
              Select either "Scan Document" to use your camera or "Upload File" to choose from your device storage.
            </Text>
          </View>

          <View style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={[styles.stepTitle, { color: colors.text }]}>AI Processing</Text>
            </View>
            <Text style={[styles.stepDescription, { color: colors.textSecondary }]}>
              Our AI will automatically extract product names, quantities, prices, and GST rates from your document.
            </Text>
          </View>

          <View style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={[styles.stepTitle, { color: colors.text }]}>Review & Edit</Text>
            </View>
            <Text style={[styles.stepDescription, { color: colors.textSecondary }]}>
              Review the extracted data, make any necessary edits, and add or remove items as needed.
            </Text>
          </View>

          <View style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                <Text style={styles.stepNumberText}>4</Text>
              </View>
              <Text style={[styles.stepTitle, { color: colors.text }]}>Generate Quote</Text>
            </View>
            <Text style={[styles.stepDescription, { color: colors.textSecondary }]}>
              Create a professional quotation and share it via WhatsApp or save as PDF for your records.
            </Text>
          </View>
        </View>

        <View style={styles.tipsContainer}>
          <Text style={[styles.tipsTitle, { color: colors.success }]}>💡 Tips for best results</Text>
          <View style={styles.tipsList}>
            <View style={styles.tipItem}>
              <CheckCircle size={16} color={colors.success} />
              <Text style={[styles.tipText, { color: colors.success }]}>Ensure good lighting when scanning</Text>
            </View>
            <View style={styles.tipItem}>
              <CheckCircle size={16} color={colors.success} />
              <Text style={[styles.tipText, { color: colors.success }]}>Keep documents flat and straight</Text>
            </View>
            <View style={styles.tipItem}>
              <CheckCircle size={16} color={colors.success} />
              <Text style={[styles.tipText, { color: colors.success }]}>Use high-quality images for uploads</Text>
            </View>
            <View style={styles.tipItem}>
              <CheckCircle size={16} color={colors.success} />
              <Text style={[styles.tipText, { color: colors.success }]}>Supported formats: PDF, JPG, PNG, DOC, XLSX</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation Spacer */}
      <View style={styles.bottomSpacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  actionCards: {
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
    padding: 24,
  },
  cardText: {
    marginLeft: 20,
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  instructionsContainer: {
    marginTop: 32,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  instructionsTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  stepContainer: {
    marginBottom: 20,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  stepDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 40,
  },
  tipsContainer: {
    marginTop: 24,
    marginBottom: 16,
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  tipsList: {
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tipText: {
    fontSize: 14,
    flex: 1,
  },
  bottomSpacer: {
    height: 100,
  },
});