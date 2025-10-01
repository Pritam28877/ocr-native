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
  Share as ShareIcon,
  Download,
  Edit3 as Edit,
  Check,
  X,
} from 'lucide-react-native';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';

interface QuotationItem {
  itemNumber: number;
  itemId?: string | null;
  itemName: string;
  itemDescription?: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  gst_rate?: number;
  gst_amount?: number;
  brand?: string | null;
  defaultDiscount?: number | null;
}

interface FinalQuotationData {
  items: QuotationItem[];
  subtotal: number;
  discount_amount: number;
  gst_amount: number;
  total_amount: number;
  quotation_number?: string;
  date?: string;
  customer_name?: string;
  company_name?: string;
}

type MatchProduct = {
  itemId: string | null;
  itemName: string;
  itemDescription: string | null;
  brand: string | null;
  price: number | null;
  defaultDiscount: number | null;
};

type MatchItem = {
  itemNumber: number;
  itemName: string | null;
  itemQuantity: number;
  matchedProducts: MatchProduct[];
};

export default function FinalQuotationScreen() {
  const { quotationData } = useLocalSearchParams();
  const [quotation, setQuotation] = useState<FinalQuotationData | null>(null);
  const [loading, setLoading] = useState(true);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <FinalQuotationContent />
    </>
  );
}

function FinalQuotationContent() {
  const { quotationData, matchData, originalData } = useLocalSearchParams();
  const [quotation, setQuotation] = useState<FinalQuotationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [gstRate, setGstRate] = useState(18);
  const [globalDiscount, setGlobalDiscount] = useState(0);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingQuantity, setEditingQuantity] = useState('');
  const [editingPrice, setEditingPrice] = useState('');
  const [editingDiscount, setEditingDiscount] = useState('');
  const [items, setItems] = useState<QuotationItem[]>([]);
  const [hasMediaPerm, setHasMediaPerm] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setHasMediaPerm(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    try {
      if (matchData && originalData) {
        const matchRes = JSON.parse(matchData as string) as {
          success: boolean;
          data: MatchItem[];
        };
        const original = JSON.parse(originalData as string) as Array<{
          itemNumber: number;
          itemId: string | null;
          itemName: string;
          itemDescription: string | null;
          itemQuantity: number;
        }>;

        // Build items list: when matchedProducts present, use matched; otherwise use original item
        const items = (matchRes?.data || []).map((mi) => {
          const originalItem = original.find(
            (o) => o.itemNumber === mi.itemNumber
          );
          const topMatch = (mi.matchedProducts || [])[0];
          if (topMatch) {
            const combinedName = topMatch.itemId
              ? `${topMatch.itemId} ${topMatch.itemName}`
              : topMatch.itemName;
            return {
              itemNumber: mi.itemNumber,
              itemId: topMatch.itemId,
              itemName: combinedName,
              itemDescription: topMatch.itemDescription ?? null,
              quantity: mi.itemQuantity,
              unit_price: topMatch.price ?? 0,
              total_price: (topMatch.price ?? 0) * (mi.itemQuantity ?? 0),
              gst_rate: undefined,
              gst_amount: undefined,
              brand: topMatch.brand ?? null,
              defaultDiscount: topMatch.defaultDiscount ?? null,
            } as any;
          }
          // No matches: show original item info
          const name = originalItem?.itemName ?? '';
          const combined = originalItem?.itemId
            ? `${originalItem.itemId} ${name}`
            : name;
          return {
            itemNumber: mi.itemNumber,
            itemId: originalItem?.itemId ?? null,
            itemName: combined,
            itemDescription: originalItem?.itemDescription ?? null,
            quantity: mi.itemQuantity,
            unit_price: 0,
            total_price: 0,
          } as any;
        });

        setItems(items as any);
      } else if (quotationData) {
        const parsedData = JSON.parse(quotationData as string);
        console.log(
          'FinalQuotation received data:',
          JSON.stringify(parsedData, null, 2)
        );
        setItems(parsedData.items || []);
      }
    } catch (error) {
      console.error('Error parsing quotation data:', error);
      Alert.alert('Error', 'Failed to load quotation data');
    } finally {
      setLoading(false);
    }
  }, [quotationData, matchData, originalData]);

  // Recalculate totals whenever items, gstRate, or globalDiscount changes
  useEffect(() => {
    if (items.length > 0) {
      const subtotal = items.reduce((sum, item) => {
        const itemTotal =
          item.unit_price * item.quantity -
          (item.unit_price * item.quantity * (item.defaultDiscount || 0)) / 100;
        return sum + itemTotal;
      }, 0);

      const discountAmount = (subtotal * (globalDiscount || 0)) / 100;
      const afterDiscount = subtotal - discountAmount;
      const gstAmount = (afterDiscount * gstRate) / 100;
      const totalAmount = afterDiscount + gstAmount;

      setQuotation({
        items,
        subtotal,
        discount_amount: discountAmount,
        gst_amount: gstAmount,
        total_amount: totalAmount,
        date: new Date().toLocaleDateString(),
      });
    }
  }, [items, gstRate, globalDiscount]);

  const startEditingRow = (item: QuotationItem, index: number) => {
    setEditingIndex(index);
    setEditingQuantity(String(item.quantity || ''));
    setEditingPrice(String(item.unit_price || ''));
    setEditingDiscount(String(item.defaultDiscount || '0'));
  };

  const saveEditingRow = () => {
    if (editingIndex === null) return;

    const updatedItems = [...items];
    const item = updatedItems[editingIndex];

    item.quantity = Number(editingQuantity) || 0;
    item.unit_price = Number(editingPrice) || 0;
    item.defaultDiscount = Number(editingDiscount) || 0;

    // Calculate total_price with discount
    const priceAfterDiscount =
      item.unit_price - item.unit_price * (item.defaultDiscount / 100);
    item.total_price = priceAfterDiscount * item.quantity;

    setItems(updatedItems);
    cancelEditingRow();

    Toast.show({
      type: 'success',
      text1: 'Item Updated',
      text2: 'Changes saved successfully',
      position: 'bottom',
    });
  };

  const cancelEditingRow = () => {
    setEditingIndex(null);
    setEditingQuantity('');
    setEditingPrice('');
    setEditingDiscount('');
  };

  const generatePdfHtml = (data: FinalQuotationData) => {
    const itemsHtml = data.items
      .map(
        (item) => `
      <tr>
        <td>${item.itemNumber}</td>
        <td>${item.itemName} ${item.itemDescription || ''}</td>
        <td>${item.quantity}</td>
        <td>${formatCurrency(item.unit_price)}</td>
        <td>${item.defaultDiscount || 0}%</td>
        <td>${formatCurrency(item.total_price)}</td>
      </tr>
    `
      )
      .join('');

    return `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
            h1 { text-align: center; color: #8B5CF6; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .summary { float: right; width: 40%; margin-top: 20px; }
            .summary td { border: 0; }
          </style>
        </head>
        <body>
          <h1>Quotation</h1>
          <p><strong>Date:</strong> ${data.date}</p>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Discount</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          <table class="summary">
            <tr>
              <td>Subtotal:</td>
              <td>${formatCurrency(data.subtotal)}</td>
            </tr>
            <tr>
              <td>Discount:</td>
              <td>${formatCurrency(data.discount_amount)}</td>
            </tr>
            <tr>
              <td>GST:</td>
              <td>${formatCurrency(data.gst_amount)}</td>
            </tr>
            <tr>
              <td><strong>Total:</strong></td>
              <td><strong>${formatCurrency(data.total_amount)}</strong></td>
            </tr>
          </table>
        </body>
      </html>
    `;
  };

  const createPdf = async () => {
    if (!quotation) return;
    try {
      const html = generatePdfHtml(quotation);
      const { uri } = await Print.printToFileAsync({ html });
      return uri;
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to generate PDF.');
    }
  };

  const handleShare = async () => {
    const uri = await createPdf();
    if (uri) {
      await Sharing.shareAsync(uri);
    }
  };

  const handleDownloadPDF = async () => {
    const uri = await createPdf();
    if (!uri) return;

    if (!hasMediaPerm) {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission required',
          'Media library permission is needed to save the PDF.'
        );
        return;
      }
      setHasMediaPerm(true);
    }

    try {
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync('Quotations', asset, false);
      Toast.show({
        type: 'success',
        text1: 'Saved!',
        text2: 'PDF saved to your gallery in "Quotations" album.',
        position: 'top',
        visibilityTime: 3000,
      });
    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to save PDF.',
        position: 'top',
        visibilityTime: 3000,
      });
    }
  };

  const generateQuotationText = () => {
    if (!quotation) return '';

    let text = `QUOTATION\n\n`;
    if (quotation.company_name) text += `Company: ${quotation.company_name}\n`;
    if (quotation.customer_name)
      text += `Customer: ${quotation.customer_name}\n`;
    if (quotation.quotation_number)
      text += `Quotation #: ${quotation.quotation_number}\n`;
    if (quotation.date) text += `Date: ${quotation.date}\n\n`;

    text += `ITEMS:\n`;
    text += `----------------------------------------\n`;

    quotation.items.forEach((item, index) => {
      const combined = item.itemId
        ? `${item.itemId} ${item.itemName}`
        : item.itemName;
      text += `${index + 1}. ${combined}\n`;
      text += `   Qty: ${item.quantity} | Price: ₹${item.unit_price} | Total: ₹${item.total_price}\n`;
      if (item.gst_rate)
        text += `   GST (${item.gst_rate}%): ₹${item.gst_amount}\n`;
      text += `\n`;
    });

    text += `----------------------------------------\n`;
    text += `Subtotal: ₹${quotation.subtotal}\n`;
    text += `GST: ₹${quotation.gst_amount}\n`;
    text += `TOTAL: ₹${quotation.total_amount}\n`;

    return text;
  };

  const formatCurrency = (amount: number) => {
    try {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2,
      }).format(Number.isFinite(amount) ? amount : 0);
    } catch {
      // Fallback
      return `₹${(Number.isFinite(amount) ? amount : 0).toFixed(2)}`;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading quotation...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!quotation) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No quotation data available</Text>
          <TouchableOpacity
            style={styles.errorBackButton}
            onPress={() => router.back()}
          >
            <Text style={styles.errorBackButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#8B5CF6', '#A855F7']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Final Quotation</Text>
            {quotation.quotation_number && (
              <Text style={styles.headerSubtitle}>
                #{quotation.quotation_number}
              </Text>
            )}
          </View>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Company & Customer Info */}
          {(quotation.company_name ||
            quotation.customer_name ||
            quotation.date) && (
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>Quotation Details</Text>
              {quotation.company_name && (
                <Text style={styles.infoText}>
                  Company: {quotation.company_name}
                </Text>
              )}
              {quotation.customer_name && (
                <Text style={styles.infoText}>
                  Customer: {quotation.customer_name}
                </Text>
              )}
              {quotation.date && (
                <Text style={styles.infoText}>Date: {quotation.date}</Text>
              )}
            </View>
          )}

          {/* Items Table: itemName, itemQuantity, price, discount, total */}
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, styles.itemColumn]}>
                Item
              </Text>
              <Text style={[styles.tableHeaderText, styles.qtyColumn]}>
                Qty
              </Text>
              <Text style={[styles.tableHeaderText, styles.priceColumn]}>
                Price
              </Text>
              <Text style={[styles.tableHeaderText, styles.discountColumn]}>
                Disc%
              </Text>
              <Text style={[styles.tableHeaderText, styles.totalColumn]}>
                Total
              </Text>
              <View style={styles.editColumn} />
            </View>

            {items.map((item, index) => {
              const isEditing = editingIndex === index;
              const itemTotal =
                item.unit_price * item.quantity -
                (item.unit_price *
                  item.quantity *
                  (item.defaultDiscount || 0)) /
                  100;

              return (
                <View
                  key={`item-${index}-${item.itemNumber}`}
                  style={[
                    styles.tableRow,
                    index === items.length - 1 && styles.lastRow,
                    isEditing && styles.editingRow,
                  ]}
                >
                  <View style={styles.itemColumn}>
                    <Text style={styles.itemName} numberOfLines={2}>
                      {item.itemId
                        ? `${item.itemId} ${item.itemName}`
                        : item.itemName}
                    </Text>
                    <Text style={styles.itemNumber}>
                      Item #{item.itemNumber}
                    </Text>
                  </View>

                  <View style={styles.qtyColumn}>
                    {isEditing ? (
                      <TextInput
                        style={styles.editInput}
                        value={editingQuantity}
                        onChangeText={setEditingQuantity}
                        keyboardType="numeric"
                        placeholder="Qty"
                      />
                    ) : (
                      <Text style={styles.tableText}>{item.quantity || 0}</Text>
                    )}
                  </View>

                  <View style={styles.priceColumn}>
                    {isEditing ? (
                      <TextInput
                        style={styles.editInput}
                        value={editingPrice}
                        onChangeText={setEditingPrice}
                        keyboardType="numeric"
                        placeholder="Price"
                      />
                    ) : (
                      <Text style={styles.tableText}>
                        {item.unit_price
                          ? formatCurrency(item.unit_price)
                          : '₹0'}
                      </Text>
                    )}
                  </View>

                  <View style={styles.discountColumn}>
                    {isEditing ? (
                      <TextInput
                        style={styles.editInput}
                        value={editingDiscount}
                        onChangeText={setEditingDiscount}
                        keyboardType="numeric"
                        placeholder="0"
                      />
                    ) : (
                      <Text style={styles.tableText}>
                        {typeof item.defaultDiscount === 'number'
                          ? `${item.defaultDiscount}%`
                          : '0%'}
                      </Text>
                    )}
                  </View>

                  <View style={styles.totalColumn}>
                    <Text style={styles.totalText}>
                      {formatCurrency(itemTotal)}
                    </Text>
                  </View>

                  {isEditing ? (
                    <View style={styles.editActionsColumn}>
                      <TouchableOpacity
                        style={styles.saveButton}
                        onPress={saveEditingRow}
                      >
                        <Check size={14} color="#10B981" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={cancelEditingRow}
                      >
                        <X size={14} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.editColumn}
                      onPress={() => startEditingRow(item, index)}
                    >
                      <Edit size={14} color="#8B5CF6" />
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View>

          {/* Summary */}
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal:</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(quotation.subtotal)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <View style={styles.gstRow}>
                <Text style={styles.summaryLabel}>Global Discount (</Text>
                <TextInput
                  style={styles.gstInput}
                  value={String(globalDiscount)}
                  onChangeText={(text) => setGlobalDiscount(Number(text) || 0)}
                  keyboardType="numeric"
                />
                <Text style={styles.summaryLabel}>%):</Text>
              </View>
              <Text style={styles.summaryValue}>
                {formatCurrency(
                  (quotation.subtotal * (globalDiscount || 0)) / 100
                )}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <View style={styles.gstRow}>
                <Text style={styles.summaryLabel}>GST (</Text>
                <TextInput
                  style={styles.gstInput}
                  value={String(gstRate)}
                  onChangeText={(text) => setGstRate(Number(text) || 0)}
                  keyboardType="numeric"
                />
                <Text style={styles.summaryLabel}>%):</Text>
              </View>
              <Text style={styles.summaryValue}>
                {formatCurrency(quotation.gst_amount)}
              </Text>
            </View>
            <View style={[styles.summaryRow, styles.grandTotalRow]}>
              <Text style={styles.grandTotalLabel}>Total:</Text>
              <Text style={styles.grandTotalValue}>
                {formatCurrency(quotation.total_amount)}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <ShareIcon size={20} color="#8B5CF6" />
              <Text style={styles.actionButtonText}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleDownloadPDF}
            >
              <Download size={20} color="#8B5CF6" />
              <Text style={styles.actionButtonText}>Download PDF</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 20,
    textAlign: 'center',
  },
  errorBackButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  errorBackButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#E5E7EB',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  tableContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginTop: 20,
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
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    gap: 6,
  },
  tableHeaderText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 6,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  itemColumn: {
    flex: 2.8,
  },
  qtyColumn: {
    width: 55,
    alignItems: 'center',
  },
  priceColumn: {
    width: 70,
    alignItems: 'center',
  },
  discountColumn: {
    width: 55,
    alignItems: 'center',
  },
  totalColumn: {
    width: 80,
    alignItems: 'flex-end',
  },
  editColumn: {
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 1,
    lineHeight: 14,
  },
  itemNumber: {
    fontSize: 9,
    color: '#9CA3AF',
  },
  tableText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#374151',
  },
  totalText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#111827',
  },
  editingRow: {
    backgroundColor: '#F3F4F6',
  },
  editInput: {
    fontSize: 10,
    color: '#374151',
    borderWidth: 1,
    borderColor: '#8B5CF6',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 3,
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
    minWidth: 45,
    height: 28,
  },
  editActionsColumn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    width: 60,
    justifyContent: 'center',
  },
  saveButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginTop: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  grandTotalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginTop: 8,
    paddingTop: 10,
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
  },
  grandTotalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#8B5CF6',
  },
  gstRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gstInput: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
    borderBottomWidth: 1,
    borderBottomColor: '#8B5CF6',
    paddingHorizontal: 4,
    paddingVertical: 2,
    minWidth: 30,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B5CF6',
    marginLeft: 8,
  },
});
