import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Plus, Bookmark, User, CreditCard as Edit, Download, Share } from 'lucide-react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

interface QuotationItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  gst: number;
  total: number;
}

const sampleItems: QuotationItem[] = [
  {
    id: '1',
    name: 'LED Bulb 9W',
    description: 'LED-9W-001',
    quantity: 97,
    price: 100.00,
    gst: 18,
    total: 11446.00,
  },
  {
    id: '2',
    name: 'MCB 16A Single Pole',
    description: 'MCB-16A-SP',
    quantity: 5,
    price: 125.50,
    gst: 18,
    total: 740.45,
  },
  {
    id: '3',
    name: 'FR PVC Cable',
    description: 'CABLE-001',
    quantity: 10,
    price: 85.00,
    gst: 18,
    total: 1003.00,
  },
];

export default function QuotationScreen() {
  const subtotal = sampleItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const gstAmount = sampleItems.reduce((sum, item) => sum + (item.quantity * item.price * item.gst / 100), 0);
  const grandTotal = subtotal + gstAmount;

  const handleEditItem = (item: QuotationItem) => {
    router.push(`/item-edit?id=${item.id}`);
  };

  const handleAddItem = () => {
    router.push('/item-edit');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#8B5CF6', '#A855F7']}
        style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Quotation Items</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerAction}>
              <Plus size={18} color="#FFFFFF" />
              <Text style={styles.headerActionText}>New Quote</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerAction}>
              <Bookmark size={18} color="#FFFFFF" />
              <Text style={styles.headerActionText}>Saved</Text>
            </TouchableOpacity>
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
            <Text style={[styles.tableHeaderText, styles.priceColumn]}>Price</Text>
            <Text style={[styles.tableHeaderText, styles.gstColumn]}>GST</Text>
            <Text style={[styles.tableHeaderText, styles.totalColumn]}>Total</Text>
            <View style={styles.editColumn} />
          </View>

          {sampleItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.tableRow, index === sampleItems.length - 1 && styles.lastRow]}
              onPress={() => handleEditItem(item)}>
              <View style={styles.itemColumn}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
              </View>
              <View style={styles.qtyColumn}>
                <Text style={styles.tableText}>{item.quantity}</Text>
              </View>
              <View style={styles.priceColumn}>
                <Text style={styles.tableText}>${item.price.toFixed(2)}</Text>
              </View>
              <View style={styles.gstColumn}>
                <Text style={styles.tableText}>{item.gst}%</Text>
              </View>
              <View style={styles.totalColumn}>
                <Text style={styles.totalText}>${item.total.toFixed(2)}</Text>
              </View>
              <TouchableOpacity style={styles.editColumn} onPress={() => handleEditItem(item)}>
                <Edit size={16} color="#8B5CF6" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.addItemButton} onPress={handleAddItem}>
            <Plus size={20} color="#8B5CF6" />
            <Text style={styles.addItemText}>Add Item</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal:</Text>
            <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>GST:</Text>
            <Text style={styles.summaryValue}>${gstAmount.toFixed(2)}</Text>
          </View>
          <View style={[styles.summaryRow, styles.grandTotalRow]}>
            <Text style={styles.grandTotalLabel}>Grand Total:</Text>
            <Text style={styles.grandTotalValue}>${grandTotal.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.reviewButton}>
            <Text style={styles.reviewButtonText}>Review & Edit Quote</Text>
          </TouchableOpacity>
          
          <View style={styles.bottomButtons}>
            <TouchableOpacity style={styles.pdfButton}>
              <Download size={18} color="#FFFFFF" />
              <Text style={styles.pdfButtonText}>Save PDF</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.whatsappButton}>
              <Share size={18} color="#FFFFFF" />
              <Text style={styles.whatsappButtonText}>WhatsApp</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
    paddingHorizontal: 24,
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
    flex: 1.5,
    alignItems: 'center',
  },
  gstColumn: {
    flex: 1,
    alignItems: 'center',
  },
  totalColumn: {
    flex: 1.5,
    alignItems: 'flex-end',
  },
  editColumn: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  itemDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  tableText: {
    fontSize: 14,
    color: '#374151',
  },
  totalText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
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
});