import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Minus, Plus, Percent, IndianRupee } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { useQuoteStore } from '@/stores/useQuoteStore';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ItemEditScreen() {
  const params = useLocalSearchParams<{ name?: string; quantity?: string; price?: string; gst?: string }>();
  const [visible, setVisible] = useState(true);
  const initialQuantity = useMemo(() => {
    const q = Number(params.quantity);
    return Number.isFinite(q) && q > 0 ? q : 1;
  }, [params.quantity]);
  const initialPrice = useMemo(() => {
    const p = Number(params.price);
    return Number.isFinite(p) && p >= 0 ? p.toFixed(2) : '0.00';
  }, [params.price]);
  const initialGst = useMemo(() => {
    const g = Number(params.gst);
    return Number.isFinite(g) && g >= 0 ? g : 18;
  }, [params.gst]);

  const [itemName, setItemName] = useState(params.name || 'New Item');
  const [quantity, setQuantity] = useState(initialQuantity);
  const [price, setPrice] = useState('0');
  const [gst, setGst] = useState(initialGst);
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState('0');

  // Calculate discount amount
  const discountAmount = useMemo(() => {
    const discount = parseFloat(discountValue) || 0;
    if (discountType === 'percentage') {
      return (quantity * parseFloat(price) * discount) / 100;
    } else {
      return discount;
    }
  }, [discountValue, discountType, quantity, price]);

  const itemTotal = quantity * parseFloat(price) - discountAmount;

  const handleClose = () => {
    setVisible(false);
    router.back();
  };

  const handleSave = () => {
    // Save the updated item data with discount applied
    const updatedItem = {
      name: itemName,
      quantity,
      price: parseFloat(price),
      gst,
      total: itemTotal // This now includes the discount
    };
    // Persist in global quote store so quotation screen reflects immediately
    const upsertEditedItem = useQuoteStore.getState().upsertEditedItem;
    upsertEditedItem(updatedItem);
    
    // Navigate back to quotation
    router.back();
  };


  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.placeholder} />
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <X size={24} color="#374151" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* New Item Card */}
          <View style={styles.itemCard}>
            <LinearGradient
              colors={['#8B5CF6', '#A855F7']}
              style={styles.itemHeader}>
              <View style={styles.itemTitleContainer}>
                <Text style={styles.itemTitle}>{itemName}</Text>
                <Text style={styles.itemSubtitle}>Hardware Product</Text>
              </View>
               {/* Action buttons removed */}
            </LinearGradient>

            <View style={styles.itemContent}>
              <View style={styles.itemNameSection}>
                <Text style={styles.inputLabel}>Product Name:</Text>
                <TextInput
                  style={styles.itemNameInput}
                  value={itemName}
                  onChangeText={setItemName}
                  placeholder="Enter product name"
                  multiline
                />
              </View>
              
              <View style={styles.itemCode}>
                <Text style={styles.itemCodeText}>{itemName}</Text>
              </View>

               {/* Price input removed for Product List */}

              {/* Quantity Controls */}
              <View style={styles.quantitySection}>
                <Text style={styles.sectionLabel}>Quantity:</Text>
                <View style={styles.quantityControls}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => setQuantity(Math.max(1, quantity - 1))}>
                    <Minus size={16} color="#6B7280" />
                  </TouchableOpacity>
                  <Text style={styles.quantityValue}>{quantity}</Text>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => setQuantity(quantity + 1)}>
                    <Plus size={16} color="#6B7280" />
                  </TouchableOpacity>
                </View>
                 <Text style={styles.quantityTotal}>Quantity: {quantity}</Text>
              </View>
            </View>
          </View>

          {/* Discount section removed for Product List */}

          {/* Tax settings removed; GST applied at quote level */}

          {/* Summary removed for Product List */}
        </ScrollView>

        <View style={styles.bottomAction}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    lineHeight: 24,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  quantitySection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 16,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 12,
  },
  quantityButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginHorizontal: 24,
    minWidth: 32,
    textAlign: 'center',
  },
  quantityTotal: {
    fontSize: 24,
    fontWeight: '700',
    color: '#10B981',
    marginBottom: 4,
  },
  quantityGst: {
    fontSize: 14,
    color: '#6B7280',
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  itemTitleContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  itemSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  itemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  itemAction: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContent: {
    padding: 16,
  },
  itemNameSection: {
    marginBottom: 16,
  },
  itemNameInput: {
    height: 50,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  itemCode: {
    marginBottom: 16,
  },
  itemCodeText: {
    fontSize: 12,
    color: '#6B7280',
  },
  priceRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 16,
  },
  priceInput: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  priceField: {
    height: 40,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '600',
  },
  gstInput: {
    alignItems: 'flex-end',
  },
  gstInputField: {
    height: 40,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#EF4444',
    fontWeight: '600',
    textAlign: 'center',
    minWidth: 60,
  },
  gstUnit: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  quantityMini: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 2,
  },
  quantityMiniButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityMiniValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginHorizontal: 12,
    minWidth: 16,
    textAlign: 'center',
  },
  itemTotal: {
    alignItems: 'flex-end',
  },
  itemTotalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
  },
  itemTotalGst: {
    fontSize: 12,
    color: '#6B7280',
  },
  discountCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  discountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  discountIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  discountTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  discountTypes: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 2,
  },
  discountTypeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  discountTypeActive: {
    backgroundColor: '#8B5CF6',
  },
  discountTypeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  discountTypeTextActive: {
    color: '#FFFFFF',
  },
  discountInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  discountInput: {
    flex: 1,
    height: 44,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#111827',
  },
  clearButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  taxCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  taxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  taxIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  taxTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  taxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  taxLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  taxValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  taxValueText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  taxValueUnit: {
    fontSize: 14,
    color: '#6B7280',
  },
  summaryCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  summaryContent: {
    gap: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryTotal: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#D1FAE5',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  summaryTotalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  summaryTotalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10B981',
  },
  bottomAction: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  saveButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});