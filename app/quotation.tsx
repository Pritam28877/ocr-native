import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Share } from 'react-native';
import Toast from 'react-native-toast-message';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Plus, Edit3 as Edit, User, Download, Share as ShareIcon } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as MediaLibrary from 'expo-media-library';
import { useEffect, useMemo, useState } from 'react';
import { useQuoteStore } from '@/stores/useQuoteStore';
import { OCR_API_URL, OCR_API_TOKEN } from '@/lib/env';
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

  const openEditForProduct = (product: any) => {
    // Check if this product has been edited before
    const editedItem = editedItems[product.itemName];
    
    // Attempt to extract a numeric quantity if present, fallback to 1
    const qtyMatch = String(product.itemQuantity ?? '').match(/\d+/);
    const qty = qtyMatch ? qtyMatch[0] : '1';
    
    console.log('Opening edit for product:', product.itemName);
    router.push({
      pathname: '/item-edit',
      params: {
        name: editedItem ? editedItem.name : product.itemName,
        quantity: editedItem ? String(editedItem.quantity) : qty,
        price: editedItem ? String(editedItem.price) : '0',
        gst: editedItem ? String(editedItem.gst) : '18'
      }
    });
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
    return Object.values(editedItems || {}).filter((it) => !knownOcrNames.has(it.name));
  }, [editedItems, knownOcrNames]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitToBackend = async () => {
    try {
      setIsSubmitting(true);

      // Build request body for /api/ocr/process-data from current products and edits
      const originalData = (displayProducts || []).map((product) => {
        const editedItem = editedItems[product.itemName];
        const fallbackQty = typeof product.itemQuantity === 'string'
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

      const processDataUrl = new URL('/api/ocr/process-data', OCR_API_URL).toString();
      const res = await fetch(processDataUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${OCR_API_TOKEN}` },
        body: JSON.stringify({ data: originalData }),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Process-data API error ${res.status}: ${text}`);
      }
      const matchResult = await res.json();
      console.log('Match result:', JSON.stringify(matchResult, null, 2));

      router.push({
        pathname: '/final-quotation',
        params: {
          matchData: JSON.stringify(matchResult),
          originalData: JSON.stringify(originalData),
        }
      });
    } catch (error) {
      console.error('Error preparing final quotation:', error);
      Alert.alert('Error', 'Failed to prepare final quotation');
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
          Alert.alert('Permission required', 'Media library permission is needed to save the image.');
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
      }
    });
  };

  const handleAddItem = () => {
    router.push('/item-edit');
  };

  // GST removed at quote level as well

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#8B5CF6', '#A855F7']}
        style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Product List</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerAction} onPress={() => router.push('/(tabs)')}>
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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.itemColumn]}>Item</Text>
            <Text style={[styles.tableHeaderText, styles.qtyColumn]}>Qty</Text>
            <View style={styles.editColumn} />
          </View>

          {displayProducts.length > 0 ? (
            displayProducts.map((product, index) => {
              // Check if this product has been edited
              const editedItem = editedItems[product.itemName];

              // No sub-items aggregation; rely on edited or flat total_quantity

              // No price or total display needed for Product List
              
              return (
                <View key={String(product.itemNumber)}>
                  <View style={[styles.tableRow, index === displayProducts.length - 1 && styles.lastRow]}>
                    <View style={styles.itemColumn}>
                      <Text style={styles.itemName}>
                        {product.itemId ? `${product.itemId} ${product.itemName}` : product.itemName}
                      </Text>
                      <Text style={styles.itemDescription}>Item #{product.itemNumber}</Text>
                      {(() => {
                        const desc = product.itemDescription || '';
                        return desc ? (<Text style={styles.itemDescription}>{desc}</Text>) : null;
                      })()}
                    </View>
                    <View style={styles.qtyColumn}>
                      <Text style={styles.tableText}>
                        {editedItem ? String(editedItem.quantity) : String(product.itemQuantity)}
                      </Text>
                    </View>
                    <TouchableOpacity style={styles.editColumn} onPress={() => openEditForProduct(product)}>
                      <Edit size={16} color="#8B5CF6" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No products found</Text>
              <Text style={styles.emptyStateSubtext}>Upload an image to extract hardware products</Text>
            </View>
          )}

          {/* Standalone user-added items */}
          {standaloneEditedItems.length > 0 && (
            standaloneEditedItems.map((it, idx) => (
              <View key={`manual-${idx}`} style={styles.tableRow}>
                <View style={styles.itemColumn}>
                  <Text style={styles.itemName}>{it.name}</Text>
                  <Text style={styles.itemDescription}>Custom Item</Text>
                </View>
                <View style={styles.qtyColumn}>
                  <Text style={styles.tableText}>{String(it.quantity)}</Text>
                </View>
                <TouchableOpacity
                  style={styles.editColumn}
                  onPress={() => handleEditItem({ id: '', name: it.name, description: '', quantity: it.quantity, price: 0, gst: 0, total: 0 })}
                >
                  <Edit size={16} color="#8B5CF6" />
                </TouchableOpacity>
              </View>
            ))
          )}
          <TouchableOpacity style={styles.addItemButton} onPress={handleAddItem}>
            <Plus size={20} color="#8B5CF6" />
            <Text style={styles.addItemText}>Add Item</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.reviewButton, isSubmitting && styles.submittingButton]} 
            onPress={handleSubmitToBackend}
            disabled={isSubmitting}
          >
            <Text style={styles.reviewButtonText}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Text>
          </TouchableOpacity>
          
          <View style={styles.bottomButtons}>
            <TouchableOpacity style={styles.pdfButton} onPress={handleSharePdf}>
              <ShareIcon size={18} color="#FFFFFF" />
              <Text style={styles.pdfButtonText}>Share PDF</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.whatsappButton} onPress={handleDownloadOcrImage}>
              <ShareIcon size={18} color="#FFFFFF" />
              <Text style={styles.whatsappButtonText}>Download Image</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <Toast />
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
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
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
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  itemColumn: {
    flex: 3,
    paddingRight: 8,
  },
  qtyColumn: {
    flex: 1,
    alignItems: 'center',
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
    width: 30,
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
});