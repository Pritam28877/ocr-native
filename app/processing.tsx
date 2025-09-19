import { View, Text, StyleSheet, Animated, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Bookmark, User, Sparkles, FileText } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProcessingScreen() {
  const { imageUri } = useLocalSearchParams<{ imageUri?: string }>();
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animate progress bar
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    }).start(() => {
      // Navigate to quotation after processing
      setTimeout(() => {
        router.push('/quotation');
      }, 1000);
    });

    // Animate pulse effect
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    return () => {
      pulseAnimation.stop();
    };
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#8B5CF6', '#A855F7']}
        style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Processing Document</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerAction}>
              <Bookmark size={18} color="#FFFFFF" />
              <Text style={styles.headerActionText}>Saved</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerAction}>
              <User size={18} color="#FFFFFF" />
              <Text style={styles.headerActionText}>Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.processingCard}>
          <Animated.View style={[styles.iconContainer, { transform: [{ scale: pulseAnim }] }]}>
            <LinearGradient
              colors={['#F59E0B', '#EF4444', '#EC4899']}
              style={styles.iconGradient}>
              <FileText size={32} color="#FFFFFF" />
            </LinearGradient>
          </Animated.View>

          <Text style={styles.processingTitle}>AI Extracting Data</Text>
          <Text style={styles.processingSubtitle}>Please wait while we process your document...</Text>

          {imageUri ? (
            <Image source={{ uri: String(imageUri) }} style={styles.preview} resizeMode="cover" />
          ) : null}

          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <Animated.View
                style={[
                  styles.progressBar,
                  { width: progressWidth }
                ]}
              />
            </View>
          </View>

          <View style={styles.statusList}>
            <View style={styles.statusItem}>
              <View style={[styles.statusDot, styles.statusCompleted]} />
              <Text style={styles.statusText}>Document uploaded successfully</Text>
            </View>
            <View style={styles.statusItem}>
              <View style={[styles.statusDot, styles.statusActive]} />
              <Text style={styles.statusText}>AI analyzing content...</Text>
            </View>
            <View style={styles.statusItem}>
              <View style={[styles.statusDot, styles.statusPending]} />
              <Text style={styles.statusText}>Extracting product data...</Text>
            </View>
          </View>
        </View>

        <View style={styles.aiInfo}>
          <View style={styles.aiHeader}>
            <Sparkles size={20} color="#8B5CF6" />
            <Text style={styles.aiTitle}>AI-Powered Extraction</Text>
          </View>
          <Text style={styles.aiDescription}>
            Our AI automatically identifies products, quantities, prices, and GST rates from your documents
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  headerActionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  processingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 24,
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  processingTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  processingSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  preview: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    marginBottom: 16,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 32,
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 4,
  },
  statusList: {
    width: '100%',
    gap: 16,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  statusCompleted: {
    backgroundColor: '#10B981',
  },
  statusActive: {
    backgroundColor: '#8B5CF6',
  },
  statusPending: {
    backgroundColor: '#EC4899',
  },
  statusText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  aiInfo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  aiTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  aiDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});