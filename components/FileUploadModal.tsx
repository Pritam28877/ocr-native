import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Upload, FileText, X, CheckCircle } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useTheme } from '@/contexts/ThemeContext';
import { getOcrApiToken } from '@/lib/env';

interface FileUploadModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function FileUploadModal({
  visible,
  onClose,
  onSuccess,
}: FileUploadModalProps) {
  const { colors } = useTheme();
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);

  const handleFileSelect = async () => {
    try {
      console.log('📁 Opening file picker...');

      // First try with specific MIME types
      let result = await DocumentPicker.getDocumentAsync({
        type: [
          'text/csv',
          'application/csv',
          'text/plain', // CSV files often have this MIME type
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'text/comma-separated-values', // Alternative CSV MIME type
        ],
        copyToCacheDirectory: true,
        multiple: false,
      });

      console.log('📁 DocumentPicker result:', result);

      // If no files found, try with all file types as fallback
      if (result.canceled || !result.assets || result.assets.length === 0) {
        console.log(
          '📁 No files found with specific types, trying all file types...'
        );
        result = await DocumentPicker.getDocumentAsync({
          type: '*/*', // Allow all file types
          copyToCacheDirectory: true,
          multiple: false,
        });
        console.log('📁 DocumentPicker fallback result:', result);
      }

      if (!result.canceled && result.assets[0]) {
        const file = result.assets[0];

        // Validate file type - More comprehensive validation
        const allowedTypes = [
          'text/csv',
          'application/csv',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ];

        // Also check file extension as fallback
        const fileName = file.name.toLowerCase();
        const hasValidExtension =
          fileName.endsWith('.csv') ||
          fileName.endsWith('.xls') ||
          fileName.endsWith('.xlsx');

        if (!allowedTypes.includes(file.mimeType || '') && !hasValidExtension) {
          console.log('❌ Invalid file type:', {
            mimeType: file.mimeType,
            fileName: file.name,
            allowedTypes,
          });
          Alert.alert(
            'Invalid File Type',
            'Please select a CSV or Excel file (.csv, .xls, .xlsx)'
          );
          return;
        }

        console.log('✅ File validation passed:', {
          name: file.name,
          mimeType: file.mimeType,
          size: file.size,
        });

        setSelectedFile(file);
      } else {
        console.log('📁 File selection canceled by user');
      }
    } catch (error) {
      console.error('❌ Error selecting file:', error);

      // Check if it's a cancellation error
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'DOCUMENT_PICKER_CANCELED'
      ) {
        console.log('📁 User canceled file selection');
        return;
      }

      // Show more specific error message
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      Alert.alert(
        'File Selection Error',
        `Failed to select file: ${errorMessage}`,
        [
          {
            text: 'Try Again',
            onPress: () => handleFileSelect(),
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      Alert.alert('No File Selected', 'Please select a file to upload');
      return;
    }

    try {
      setUploading(true);

      console.log('📁 Selected file:', {
        name: selectedFile.name,
        size: selectedFile.size,
        mimeType: selectedFile.mimeType,
        uri: selectedFile.uri,
      });

      // Get Firebase token
      const token = await getOcrApiToken();
      console.log('🔑 Got Firebase token:', token ? 'Yes' : 'No');

      // Create FormData - Fixed structure for React Native
      const formData = new FormData();
      formData.append('importFile', {
        uri: selectedFile.uri,
        name: selectedFile.name,
        type: selectedFile.mimeType || 'text/csv',
      } as any);

      console.log(
        '📤 Uploading to:',
        'https://ocr-329174454207.asia-south1.run.app/api/products/import'
      );

      // Upload to API - Removed Content-Type header to let fetch set it automatically
      const response = await fetch(
        'https://ocr-329174454207.asia-south1.run.app/api/products/import',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            // Don't set Content-Type - let fetch handle multipart/form-data automatically
          },
          body: formData,
        }
      );

      console.log('📡 Response status:', response.status);
      console.log(
        '📡 Response headers:',
        Object.fromEntries(response.headers.entries())
      );

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        console.error('❌ Upload failed:', {
          status: response.status,
          statusText: response.statusText,
          errorText,
        });
        throw new Error(
          `Upload failed: ${response.status} ${response.statusText} - ${errorText}`
        );
      }

      const result = await response.json();
      console.log('✅ Upload successful:', result);

      Alert.alert(
        'Upload Successful',
        `Successfully imported ${result.importedCount || 'products'} from ${
          selectedFile.name
        }`,
        [
          {
            text: 'OK',
            onPress: () => {
              setSelectedFile(null);
              onClose();
              onSuccess?.();
            },
          },
        ]
      );
    } catch (error) {
      console.error('❌ Upload error:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to upload file';
      Alert.alert('Upload Failed', errorMessage, [
        {
          text: 'Retry',
          onPress: () => handleUpload(),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]);
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[styles.modalContent, { backgroundColor: colors.surface }]}
        >
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Upload Price List
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <X size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.modalBody}>
            <Text
              style={[styles.modalDescription, { color: colors.textSecondary }]}
            >
              Upload a CSV or Excel file containing your product price list
            </Text>

            {/* File Selection */}
            <TouchableOpacity
              style={[
                styles.fileSelectButton,
                {
                  backgroundColor: colors.background,
                  borderColor: selectedFile ? colors.primary : colors.border,
                },
              ]}
              onPress={handleFileSelect}
              disabled={uploading}
            >
              <View style={styles.fileSelectContent}>
                <FileText
                  size={24}
                  color={selectedFile ? colors.primary : colors.textSecondary}
                />
                <View style={styles.fileSelectText}>
                  {selectedFile ? (
                    <>
                      <Text style={[styles.fileName, { color: colors.text }]}>
                        {selectedFile.name}
                      </Text>
                      <Text
                        style={[
                          styles.fileSize,
                          { color: colors.textSecondary },
                        ]}
                      >
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </Text>
                    </>
                  ) : (
                    <Text
                      style={[
                        styles.fileSelectPlaceholder,
                        { color: colors.textSecondary },
                      ]}
                    >
                      Select CSV or Excel file
                    </Text>
                  )}
                </View>
                <CheckCircle
                  size={20}
                  color={selectedFile ? colors.primary : colors.textSecondary}
                />
              </View>
            </TouchableOpacity>

            {/* Supported Formats */}
            <View style={styles.supportedFormats}>
              <Text
                style={[styles.supportedFormatsTitle, { color: colors.text }]}
              >
                Supported Formats:
              </Text>
              <Text
                style={[
                  styles.supportedFormatsList,
                  { color: colors.textSecondary },
                ]}
              >
                • CSV (.csv)
              </Text>
              <Text
                style={[
                  styles.supportedFormatsList,
                  { color: colors.textSecondary },
                ]}
              >
                • Excel (.xls, .xlsx)
              </Text>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleClose}
              disabled={uploading}
            >
              <Text
                style={[
                  styles.cancelButtonText,
                  { color: colors.textSecondary },
                ]}
              >
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.uploadButton,
                (!selectedFile || uploading) && styles.uploadButtonDisabled,
              ]}
              onPress={handleUpload}
              disabled={!selectedFile || uploading}
            >
              <LinearGradient
                colors={
                  selectedFile && !uploading
                    ? ['#10B981', '#059669']
                    : ['#9CA3AF', '#6B7280']
                }
                style={styles.uploadButtonGradient}
              >
                <Upload size={16} color="#FFFFFF" />
                <Text style={styles.uploadButtonText}>
                  {uploading ? 'Uploading...' : 'Upload'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBody: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    gap: 20,
  },
  modalDescription: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  fileSelectButton: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 20,
  },
  fileSelectContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  fileSelectText: {
    flex: 1,
    gap: 4,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
  },
  fileSize: {
    fontSize: 12,
  },
  fileSelectPlaceholder: {
    fontSize: 16,
    fontWeight: '500',
  },
  supportedFormats: {
    gap: 8,
  },
  supportedFormatsTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  supportedFormatsList: {
    fontSize: 14,
    marginLeft: 8,
  },
  modalActions: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  uploadButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  uploadButtonDisabled: {
    opacity: 0.5,
  },
  uploadButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
