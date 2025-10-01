import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  Plus,
  Edit3 as Edit,
  User,
  Download,
  Share as ShareIcon,
  Check,
  X,
} from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as MediaLibrary from 'expo-media-library';
import { useEffect, useMemo, useState } from 'react';
import { useQuoteStore } from '@/stores/useQuoteStore';
import { OCR_API_URL, getOcrApiToken } from '@/lib/env';
// Display products using the fixed API format

interface QuotationItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  gst: number;
  total: number;
}

export default function ProductListScreen() {
  const { imageUri, processingData, updatedItem } = useLocalSearchParams<{
    imageUri?: string;
    processingData?: string;
    updatedItem?: string;
  }>();
  const [hasMediaPerm, setHasMediaPerm] = useState<boolean>(false);
  const [parsedData, setParsedData] = useState<any | null>(null);
  const ocrProducts = useQuoteStore((s) => s.products);
  const editedItems = useQuoteStore((s) => s.editedItems);
  const setProducts = useQuoteStore((s) => s.setProducts);

  // Inline editing state
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingName, setEditingName] = useState<string>('');
  const [editingQuantity, setEditingQuantity] = useState<string>('');

  const startEditingRow = (product: any, index: number) => {
    const editedItem = editedItems[product.itemName];

    // Get current name
    const currentName =
      product.itemName && product.itemId
        ? `${product.itemName}-${product.itemId}`
        : product.itemName || product.itemId || 'Empty Row';

    // Get current quantity
    const currentQty = editedItem
      ? String(editedItem.quantity || '')
      : product.itemQuantity
      ? String(product.itemQuantity)
      : '';

    setEditingIndex(index);
    setEditingName(currentName);
    setEditingQuantity(currentQty);
  };

  const saveEditingRow = (product: any) => {
    // Update the product in the store
    const updatedProducts = [...ocrProducts];
    const productToUpdate = updatedProducts[editingIndex!];

    if (productToUpdate) {
      // Parse the name - if it contains '-', split it
      const nameParts = editingName.split('-');
      if (nameParts.length > 1) {
        productToUpdate.itemName = nameParts[0].trim();
        productToUpdate.itemId = nameParts[1].trim();
      } else {
        productToUpdate.itemName = editingName.trim();
      }

      productToUpdate.itemQuantity = editingQuantity || '0';

      setProducts(updatedProducts);
    }

    // Clear editing state
    setEditingIndex(null);
    setEditingName('');
    setEditingQuantity('');

    Toast.show({
      type: 'success',
      text1: 'Item Updated',
      text2: 'Changes saved successfully',
      position: 'bottom',
    });
  };

  const cancelEditingRow = () => {
    setEditingIndex(null);
    setEditingName('');
    setEditingQuantity('');
  };

  // Using flat items from fixed API format

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setHasMediaPerm(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    if (processingData) {
      try {
        const data = JSON.parse(processingData) as any;
        console.log('Quotation received data:', JSON.stringify(data, null, 2));
        setParsedData(data);
        const products = data?.parsed_data?.products || [];
        setProducts(products);
      } catch (error) {
        console.error('Error parsing processing data:', error);
        setProducts([]);
      }
    }
  }, [processingData, setProducts]);

  // Memo list of products to display from store
  const displayProducts = useMemo(() => ocrProducts as any[], [ocrProducts]);
  // Names present from OCR (parents and subs) for fast lookup
  const knownOcrNames = useMemo(() => {
    const names = new Set<string>();
    (displayProducts || []).forEach((p) => names.add(p.itemName));
    return names;
  }, [displayProducts]);
  // Edited items that are not part of OCR products (user-added standalone items)
  const standaloneEditedItems = useMemo(() => {
    return Object.values(editedItems || {}).filter(
      (it) => !knownOcrNames.has(it.name)
    );
  }, [editedItems, knownOcrNames]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitToBackend = async () => {
    try {
      setIsSubmitting(true);

      Toast.show({
        type: 'info',
        text1: 'Processing...',
        text2: 'Submitting product list to backend',
        position: 'bottom',
      });

      // Build request body for /api/ocr/process-data from current products and edits
      const originalData = (displayProducts || []).map((product) => {
        const editedItem = editedItems[product.itemName];
        const fallbackQty =
          typeof product.itemQuantity === 'string'
            ? Number((String(product.itemQuantity).match(/\d+/) || ['0'])[0])
            : Number(product.itemQuantity || 0);
        const quantity = editedItem ? Number(editedItem.quantity) : fallbackQty;
        return {
          itemNumber: product.itemNumber,
          itemId: product.itemId ?? null,
          itemName: product.itemName,
          itemDescription: product.itemDescription ?? null,
          itemQuantity: Number.isFinite(quantity) ? quantity : 0,
        };
      });

      const processDataUrl = new URL(
        '/api/ocr/process-data',
        OCR_API_URL
      ).toString();

      console.log(
        '📦 Current Display Products:',
        JSON.stringify(displayProducts, null, 2)
      );
      console.log(
        '📝 Edited Items from Store:',
        JSON.stringify(editedItems, null, 2)
      );
      console.log(
        '🚀 Sending data to API:',
        JSON.stringify(originalData, null, 2)
      );
      console.log('🔗 API URL:', processDataUrl);
      const requestBody = { data: originalData };
      console.log('📤 Request Body:', JSON.stringify(requestBody, null, 2));

      // Get fresh Firebase ID token
      const token = await getOcrApiToken();

      const res = await fetch(processDataUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      console.log('📡 API Response Status:', res.status, res.statusText);

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        console.error('❌ API Error Response:', text);
        throw new Error(`Process-data API error ${res.status}: ${text}`);
      }
      const matchResult = await res.json();
      console.log('✅ API Match Result:', JSON.stringify(matchResult, null, 2));

      Toast.show({
        type: 'success',
        text1: 'Success!',
        text2: 'Product list processed successfully',
        position: 'bottom',
      });

      router.push({
        pathname: '/final-quotation',
        params: {
          matchData: JSON.stringify(matchResult),
          originalData: JSON.stringify(originalData),
        },
      });
    } catch (error) {
      console.error('❌ Error preparing final quotation:', error);
      Toast.show({
        type: 'error',
        text1: 'Submission Failed',
        text2:
          error instanceof Error
            ? error.message
            : 'Failed to prepare final quotation',
        position: 'bottom',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSharePdf = async () => {
    try {
      // Generate PDF content (placeholder - you'll need to implement actual PDF generation)
      const pdfContent = generateQuotationPdf();

      await Share.share({
        message: 'Quotation PDF',
        title: 'Quotation',
        url: pdfContent, // This would be the actual PDF file path
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share PDF.');
    }
  };

  const generateQuotationPdf = () => {
    // Placeholder for PDF generation
    // In a real implementation, you'd use a library like react-native-pdf-lib
    // or expo-print to generate the actual PDF
    return 'PDF content placeholder';
  };

  const handleDownloadOcrImage = async () => {
    try {
      if (!imageUri) {
        Alert.alert('No Image', 'There is no OCR image to download.');
        return;
      }
      if (!hasMediaPerm) {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permission required',
            'Media library permission is needed to save the image.'
          );
          return;
        }
        setHasMediaPerm(true);
      }
      await MediaLibrary.saveToLibraryAsync(String(imageUri));
      {
        Alert.alert('Saved', 'OCR image saved to your gallery.');
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to save image.');
    }
  };
  // No pricing calculations needed for Product List

  const handleEditItem = (item: QuotationItem) => {
    router.push({
      pathname: '/item-edit',
      params: {
        name: item.name,
        quantity: String(item.quantity),
        price: '0',
        gst: String(item.gst),
      },
    });
  };

  const handleAddItem = () => {
    router.push('/item-edit');
  };

  // GST removed at quote level as well

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#8B5CF6', '#A855F7']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Product List</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerAction}
              onPress={() => router.push('/(tabs)')}
            >
              <Plus size={18} color="#FFFFFF" />
              <Text style={styles.headerActionText}>New Quote</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.headerAction}>
              <Bookmark size={18} color="#FFFFFF" />
              <Text style={styles.headerActionText}>Saved</Text>
            </TouchableOpacity> */}
            <TouchableOpacity style={styles.headerAction}>
              <User size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, styles.noColumn]}>No</Text>
              <Text style={[styles.tableHeaderText, styles.itemColumn]}>
                Item
              </Text>
              <Text style={[styles.tableHeaderText, styles.qtyColumn]}>
                Qty
              </Text>
              <View style={styles.editColumn} />
            </View>

            <ScrollView
              style={styles.tableScrollView}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
            >
              {displayProducts.length > 0 ? (
                displayProducts.map((product, index) => {
                  // Check if this product has been edited
                  const editedItem = editedItems[product.itemName];
                  const isEditing = editingIndex === index;

                  // No sub-items aggregation; rely on edited or flat total_quantity

                  // No price or total display needed for Product List

                  return (
                    <View
                      key={`product-${index}-${product.itemNumber || 'empty'}`}
                    >
                      <View
                        style={[
                          styles.tableRow,
                          index === displayProducts.length - 1 &&
                            styles.lastRow,
                          isEditing && styles.editingRow,
                        ]}
                      >
                        <View style={styles.noColumn}>
                          <Text style={styles.itemName}>{index + 1}</Text>
                        </View>
                        <View style={styles.itemColumn}>
                          {isEditing ? (
                            <TextInput
                              style={styles.editInput}
                              value={editingName}
                              onChangeText={setEditingName}
                              placeholder="Item name"
                              autoFocus
                            />
                          ) : (
                            <>
                              <Text style={styles.itemName}>
                                {product.itemName && product.itemId
                                  ? `${product.itemName}-${product.itemId}`
                                  : product.itemName
                                  ? product.itemName
                                  : product.itemId
                                  ? product.itemId
                                  : 'Empty Row'}
                              </Text>
                              {product.itemNumber && (
                                <Text style={styles.itemDescription}>
                                  Item #{product.itemNumber}
                                </Text>
                              )}
                              {(() => {
                                const desc = product.itemDescription || '';
                                return desc ? (
                                  <Text style={styles.itemDescription}>
                                    {desc}
                                  </Text>
                                ) : null;
                              })()}
                            </>
                          )}
                        </View>
                        <View style={styles.qtyColumn}>
                          {isEditing ? (
                            <TextInput
                              style={styles.editInputQty}
                              value={editingQuantity}
                              onChangeText={setEditingQuantity}
                              placeholder="Qty"
                              keyboardType="numeric"
                            />
                          ) : (
                            <Text style={styles.tableText}>
                              {editedItem
                                ? String(editedItem.quantity || '')
                                : product.itemQuantity
                                ? String(product.itemQuantity)
                                : ''}
                            </Text>
                          )}
                        </View>
                        {isEditing ? (
                          <View style={styles.editActionsColumn}>
                            <TouchableOpacity
                              style={styles.saveButton}
                              onPress={() => saveEditingRow(product)}
                            >
                              <Check size={16} color="#10B981" />
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.cancelButton}
                              onPress={cancelEditingRow}
                            >
                              <X size={16} color="#EF4444" />
                            </TouchableOpacity>
                          </View>
                        ) : (
                          <TouchableOpacity
                            style={styles.editColumn}
                            onPress={() => startEditingRow(product, index)}
                          >
                            <Edit size={16} color="#8B5CF6" />
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  );
                })
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>No products found</Text>
                  <Text style={styles.emptyStateSubtext}>
                    Upload an image to extract hardware products
                  </Text>
                </View>
              )}

              {/* Standalone user-added items */}
              {standaloneEditedItems.length > 0 &&
                standaloneEditedItems.map((it, idx) => (
                  <View
                    key={`manual-${idx}-${it.name}`}
                    style={styles.tableRow}
                  >
                    <View style={styles.itemColumn}>
                      <Text style={styles.itemName}>{it.name}</Text>
                      <Text style={styles.itemDescription}>Custom Item</Text>
                    </View>
                    <View style={styles.qtyColumn}>
                      <Text style={styles.tableText}>
                        {String(it.quantity)}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.editColumn}
                      onPress={() =>
                        handleEditItem({
                          id: '',
                          name: it.name,
                          description: '',
                          quantity: it.quantity,
                          price: 0,
                          gst: 0,
                          total: 0,
                        })
                      }
                    >
                      <Edit size={16} color="#8B5CF6" />
                    </TouchableOpacity>
                  </View>
                ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.addItemButton}
              onPress={handleAddItem}
            >
              <Plus size={20} color="#8B5CF6" />
              <Text style={styles.addItemText}>Add Item</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[
                styles.reviewButton,
                isSubmitting && styles.submittingButton,
              ]}
              onPress={handleSubmitToBackend}
              disabled={isSubmitting}
            >
              <Text style={styles.reviewButtonText}>
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Toast />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  keyboardView: {
    flex: 1,
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
    gap: 8,
  },
  headerAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  headerActionText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  tableContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginTop: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    maxHeight: 500, // Max height for the table container
  },
  tableScrollView: {
    maxHeight: 400, // Max scrollable height for the table rows
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    gap: 8,
  },
  tableHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    textAlign: 'left',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 8,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  noColumn: {
    width: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  itemColumn: {
    flex: 2,
    paddingRight: 8,
  },
  qtyColumn: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceColumn: {
    flex: 1.2,
    alignItems: 'center',
  },
  gstColumn: {
    flex: 1,
    alignItems: 'center',
  },
  totalColumn: {
    flex: 1.8,
    alignItems: 'flex-end',
  },
  editColumn: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  itemDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  tableText: {
    fontSize: 10,
    color: '#374151',
    includeFontPadding: false,
  },
  totalText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
    includeFontPadding: false,
  },
  addItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    borderStyle: 'dashed',
    gap: 8,
  },
  addItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#8B5CF6',
  },
  summaryContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  grandTotalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginTop: 8,
    paddingTop: 16,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#374151',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  grandTotalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  grandTotalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#10B981',
  },
  actionButtons: {
    marginTop: 24,
    marginBottom: 32,
    gap: 16,
  },
  reviewButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submittingButton: {
    backgroundColor: '#9CA3AF',
    opacity: 0.7,
  },
  reviewButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  bottomButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  pdfButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
  },
  pdfButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  whatsappButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#25D366',
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
  },
  whatsappButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  subQuantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  subQuantityText: {
    fontSize: 12,
    color: '#6B7280',
    includeFontPadding: false,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  editingRow: {
    backgroundColor: '#F3F4F6',
  },
  editInput: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
    borderWidth: 1,
    borderColor: '#8B5CF6',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: '#FFFFFF',
  },
  editInputQty: {
    fontSize: 10,
    color: '#374151',
    borderWidth: 1,
    borderColor: '#8B5CF6',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
    minWidth: 50,
  },
  editActionsColumn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    width: 68,
    justifyContent: 'center',
  },
  saveButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
