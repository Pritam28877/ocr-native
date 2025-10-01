import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Share } from 'react-native';
import Toast from 'react-native-toast-message';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Share as ShareIcon, Download, Printer } from 'lucide-react-native';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';

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

  useEffect(() => {
    try {
      if (matchData && originalData) {
        const matchRes = JSON.parse(matchData as string) as { success: boolean; data: MatchItem[] };
        const original = JSON.parse(originalData as string) as Array<{ itemNumber: number; itemId: string | null; itemName: string; itemDescription: string | null; itemQuantity: number }>;

        // Build items list: when matchedProducts present, use matched; otherwise use original item
        const items = (matchRes?.data || []).map((mi) => {
          const originalItem = original.find((o) => o.itemNumber === mi.itemNumber);
          const topMatch = (mi.matchedProducts || [])[0];
          if (topMatch) {
            const combinedName = topMatch.itemId ? `${topMatch.itemId} ${topMatch.itemName}` : topMatch.itemName;
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
          const combined = originalItem?.itemId ? `${originalItem.itemId} ${name}` : name;
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

        const subtotal = items.reduce((sum, it: any) => sum + (Number(it.total_price) || 0), 0);
        const built: FinalQuotationData = {
          items: items as any,
          subtotal,
          gst_amount: 0,
          total_amount: subtotal,
          date: new Date().toLocaleDateString(),
        };
        setQuotation(built);
      } else if (quotationData) {
        const parsedData = JSON.parse(quotationData as string);
        console.log('FinalQuotation received data:', JSON.stringify(parsedData, null, 2));
        setQuotation(parsedData);
      }
    } catch (error) {
      console.error('Error parsing quotation data:', error);
      Alert.alert('Error', 'Failed to load quotation data');
    } finally {
      setLoading(false);
    }
  }, [quotationData, matchData, originalData]);

  const handleShare = async () => {
    try {
      const shareText = generateQuotationText();
      await Share.share({
        message: shareText,
        title: 'Quotation',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to share quotation',
        position: 'top',
        visibilityTime: 3000,
      });
    }
  };

  const handleDownloadPDF = async () => {
    try {
      // TODO: Implement PDF generation
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'PDF download will be implemented',
        position: 'top',
        visibilityTime: 3000,
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to download PDF',
        position: 'top',
        visibilityTime: 3000,
      });
    }
  };

  const handlePrint = async () => {
    try {
      // TODO: Implement print functionality
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Print functionality will be implemented',
        position: 'top',
        visibilityTime: 3000,
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to print',
        position: 'top',
        visibilityTime: 3000,
      });
    }
  };

  const generateQuotationText = () => {
    if (!quotation) return '';
    
    let text = `QUOTATION\n\n`;
    if (quotation.company_name) text += `Company: ${quotation.company_name}\n`;
    if (quotation.customer_name) text += `Customer: ${quotation.customer_name}\n`;
    if (quotation.quotation_number) text += `Quotation #: ${quotation.quotation_number}\n`;
    if (quotation.date) text += `Date: ${quotation.date}\n\n`;
    
    text += `ITEMS:\n`;
    text += `----------------------------------------\n`;
    
    quotation.items.forEach((item, index) => {
      const combined = item.itemId ? `${item.itemId} ${item.itemName}` : item.itemName;
      text += `${index + 1}. ${combined}\n`;
      text += `   Qty: ${item.quantity} | Price: ₹${item.unit_price} | Total: ₹${item.total_price}\n`;
      if (item.gst_rate) text += `   GST (${item.gst_rate}%): ₹${item.gst_amount}\n`;
      text += `\n`;
    });
    
    text += `----------------------------------------\n`;
    text += `Subtotal: ₹${quotation.subtotal}\n`;
    text += `GST: ₹${quotation.gst_amount}\n`;
    text += `TOTAL: ₹${quotation.total_amount}\n`;
    
    return text;
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toFixed(2)}`;
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
          <TouchableOpacity style={styles.errorBackButton} onPress={() => router.back()}>
            <Text style={styles.errorBackButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#8B5CF6', '#A855F7']}
        style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Final Quotation</Text>
            {quotation.quotation_number && (
              <Text style={styles.headerSubtitle}>#{quotation.quotation_number}</Text>
            )}
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Company & Customer Info */}
        {(quotation.company_name || quotation.customer_name || quotation.date) && (
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Quotation Details</Text>
            {quotation.company_name && (
              <Text style={styles.infoText}>Company: {quotation.company_name}</Text>
            )}
            {quotation.customer_name && (
              <Text style={styles.infoText}>Customer: {quotation.customer_name}</Text>
            )}
            {quotation.date && (
              <Text style={styles.infoText}>Date: {quotation.date}</Text>
            )}
          </View>
        )}

        {/* Items Table: itemName, itemQuantity, brand, price, defaultDiscount */}
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.itemColumn]}>Item</Text>
            <Text style={[styles.tableHeaderText, styles.qtyColumn]}>Qty</Text>
            <Text style={[styles.tableHeaderText, styles.brandColumn]}>Brand</Text>
            <Text style={[styles.tableHeaderText, styles.priceColumn]}>Price</Text>
            <Text style={[styles.tableHeaderText, styles.discountColumn]} numberOfLines={1} ellipsizeMode="clip">Discount</Text>
          </View>

          {quotation.items.map((item, index) => (
            <View key={item.itemNumber} style={[styles.tableRow, index === quotation.items.length - 1 && styles.lastRow]}>
              <View style={styles.itemColumn}>
                <Text style={styles.itemName} numberOfLines={2}>
                  {item.itemId ? `${item.itemId} ${item.itemName}` : item.itemName}
                </Text>
                <Text style={styles.itemNumber}>Item #{item.itemNumber}</Text>
              </View>
              <View style={styles.qtyColumn}>
                <Text style={styles.tableText}>{item.quantity}</Text>
              </View>
              <View style={styles.brandColumn}>
                <Text style={styles.tableText}>{item.brand ?? ''}</Text>
              </View>
              <View style={styles.priceColumn}>
                <Text style={styles.tableText}>{item.unit_price ? formatCurrency(item.unit_price) : ''}</Text>
              </View>
              <View style={styles.discountColumn}>
                <Text style={styles.tableText}>{
                  typeof item.defaultDiscount === 'number' ? `${item.defaultDiscount}%` : ''
                }</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Summary */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal:</Text>
            <Text style={styles.summaryValue}>{formatCurrency(quotation.subtotal)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>GST:</Text>
            <Text style={styles.summaryValue}>{formatCurrency(quotation.gst_amount)}</Text>
          </View>
          <View style={[styles.summaryRow, styles.grandTotalRow]}>
            <Text style={styles.grandTotalLabel}>Total:</Text>
            <Text style={styles.grandTotalValue}>{formatCurrency(quotation.total_amount)}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <ShareIcon size={20} color="#8B5CF6" />
            <Text style={styles.actionButtonText}>Share</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleDownloadPDF}>
            <Download size={20} color="#8B5CF6" />
            <Text style={styles.actionButtonText}>Download PDF</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handlePrint}>
            <Printer size={20} color="#8B5CF6" />
            <Text style={styles.actionButtonText}>Print</Text>
          </TouchableOpacity>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  itemColumn: {
    flex: 2.4,
  },
  qtyColumn: {
    flex: 0.8,
    alignItems: 'center',
  },
  brandColumn: {
    flex: 1.1,
    alignItems: 'flex-start',
    paddingLeft: 8,
  },
  priceColumn: {
    flex: 1.0,
    alignItems: 'flex-end',
    paddingRight: 12,
  },
  discountColumn: {
    flex: 1.2,
    alignItems: 'flex-end',
    paddingRight: 12,
  },
  itemName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  itemNumber: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  tableText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
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
