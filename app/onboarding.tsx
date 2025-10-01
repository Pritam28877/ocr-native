import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useRef } from 'react';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { Camera, Upload, FileText, Sparkles, ArrowRight } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const onboardingData = [
  {
    id: 1,
    icon: Camera,
    title: 'Scan Quotations',
    subtitle: 'Capture handwritten quotations with your camera',
    description: 'Simply point your camera at any handwritten quotation or price list. Our AI will automatically detect and extract all the important hardware information.',
    gradient: ['#8B5CF6', '#A855F7'],
  },
  {
    id: 2,
    icon: Upload,
    title: 'Upload Images',
    subtitle: 'Support for image formats',
    description: 'Upload JPG or PNG images of handwritten quotations. Our system supports various image formats for maximum flexibility.',
    gradient: ['#3B82F6', '#06B6D4'],
  },
  {
    id: 3,
    icon: Sparkles,
    title: 'AI-Powered Extraction',
    subtitle: 'Smart hardware recognition',
    description: 'Our advanced AI automatically identifies hardware products, wire sizes, colors, and quantities, saving you hours of manual work.',
    gradient: ['#10B981', '#059669'],
  },
  {
    id: 4,
    icon: FileText,
    title: 'Generate Quotes',
    subtitle: 'Professional quotations instantly',
    description: 'Create professional hardware quotations in seconds. Edit, customize, and share them via WhatsApp or save as PDF.',
    gradient: ['#F59E0B', '#D97706'],
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      scrollViewRef.current?.scrollTo({ x: nextIndex * width, animated: true });
    } else {
      router.replace('/login');
    }
  };

  const handleSkip = () => {
    router.replace('/login');
  };

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const viewSize = event.nativeEvent.layoutMeasurement;
    const pageNum = Math.floor(contentOffset.x / viewSize.width);
    setCurrentIndex(pageNum);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}>
        {onboardingData.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <View key={item.id} style={styles.slide}>
              <LinearGradient
                colors={item.gradient}
                style={styles.iconContainer}>
                <IconComponent size={48} color="#FFFFFF" />
              </LinearGradient>

              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === currentIndex && styles.paginationDotActive
              ]}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <LinearGradient
            colors={['#8B5CF6', '#A855F7']}
            style={styles.nextButtonGradient}>
            <Text style={styles.nextButtonText}>
              {currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
            </Text>
            <ArrowRight size={20} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    marginBottom: 32,
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
  },
  paginationDotActive: {
    backgroundColor: '#8B5CF6',
    width: 24,
  },
  nextButton: {
    borderRadius: 12,
    overflow: 'hidden',
    width: '100%',
  },
  nextButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});