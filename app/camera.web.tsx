import { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Camera as CameraIcon, Sparkles } from 'lucide-react-native';
import { router } from 'expo-router';
import ViewShot from 'react-native-view-shot';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [processingPreview, setProcessingPreview] = useState(false);
  const viewShotRef = useRef<ViewShot | null>(null);

  const API_URL = (process as any)?.env?.EXPO_PUBLIC_API_URL || (process as any)?.env?.EXPO_PUBLIC_API_BASE_URL || '';

  const uploadOcrImage = useCallback(async (uri: string) => {
    if (!API_URL) return null;
    const form = new FormData();
    form.append('file', {
      uri,
      name: 'document.jpg',
      type: 'image/jpeg',
    } as any);
    form.append('ocr_preprocess', 'bw');
    try {
      const res = await fetch(`${API_URL.replace(/\/$/, '')}/ocr/upload`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: form as any,
      });
      if (!res.ok) return null;
      const data = await res.json().catch(() => null);
      const processedUri = data?.processedImageUri || data?.imageUrl || data?.fileUrl || null;
      return { processedUri, raw: data };
    } catch (_e) {
      return null;
    }
  }, [API_URL]);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  const onTakePicture = useCallback(async () => {
    if (!cameraRef.current || isCapturing) return;
    try {
      setIsCapturing(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
        base64: false,
        skipProcessing: false,
      });
      setPreviewUri(photo.uri);
      setProcessingPreview(true);
    } catch (_e) {
      setIsCapturing(false);
    }
  }, [isCapturing]);

  if (!permission) {
    return null;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <Text style={styles.permissionText}>We need your permission to show the camera</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#8B5CF6", "#A855F7"]} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Scan Document</Text>
          <View style={{ width: 32 }} />
        </View>
      </LinearGradient>

      <View style={styles.cameraWrapper}>
        {previewUri ? (
          <Image source={{ uri: previewUri }} style={styles.preview} resizeMode="contain" />
        ) : (
          <CameraView ref={cameraRef} style={styles.camera} facing="back" />
        )}
        <View style={styles.controls}>
          <TouchableOpacity style={styles.captureButton} onPress={onTakePicture} disabled={isCapturing}>
            <CameraIcon size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {previewUri ? (
        <View style={styles.hiddenContainer}>
          <ViewShot
            ref={viewShotRef}
            style={styles.hiddenShot}
            options={{ format: 'jpg', quality: 1, result: 'tmpfile' }}
            onCapture={async (uri: string) => {
              const result = await uploadOcrImage(uri);
              const processed = result?.processedUri || uri;
              router.push({ pathname: '/processing', params: { imageUri: processed } });
              setIsCapturing(false);
              setProcessingPreview(false);
            }}
          >
            <Image
              source={{ uri: previewUri }}
              style={styles.hiddenImage}
              resizeMode="contain"
              onLoadEnd={async () => {
                setTimeout(async () => {
                  try {
                    await viewShotRef.current?.capture?.();
                  } catch (_e) {
                    await uploadOcrImage(previewUri);
                    router.push({ pathname: '/processing', params: { imageUri: previewUri } });
                  }
                }, 50);
              }}
            />
          </ViewShot>
        </View>
      ) : null}

      {(isCapturing || processingPreview) && (
        <View style={styles.processingOverlay}>
          <View style={styles.processingCard}>
            <ActivityIndicator size="large" color="#FFFFFF" />
            <View style={styles.processingRow}>
              <Sparkles size={18} color="#FFFFFF" />
              <Text style={styles.processingText}>Processing…</Text>
            </View>
            <Text style={styles.processingSubText}>Enhancing for OCR</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
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
  },
  cameraWrapper: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    bottom: 32,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(139, 92, 246, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  processingCard: {
    backgroundColor: 'rgba(17, 24, 39, 0.85)',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    gap: 8,
  },
  processingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  processingText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  processingSubText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  permissionButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  preview: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  hiddenContainer: {
    position: 'absolute',
    top: -10000,
    left: -10000,
  },
  hiddenShot: {
    width: 1200,
    height: 1600,
    backgroundColor: '#FFFFFF',
  },
  hiddenImage: {
    width: '100%',
    height: '100%',
  },
});


