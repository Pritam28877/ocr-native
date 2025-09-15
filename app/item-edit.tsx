import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Minus, Plus, Percent, DollarSign, ChartBar as BarChart3, Eye } from 'lucide-react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ItemEditScreen() {
  const [visible, setVisible] = useState(true);
  const [quantity, setQuantity] = useState(2);
  const [price, setPrice] = useState('0.00');
  const [gst, setGst] = useState(18);
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState('0');

  const itemTotal = quantity * parseFloat(price);
  const gstAmount = itemTotal * (gst / 100);
  const finalTotal = itemTotal + gstAmount;

  const handleClose = () => {
    setVisible(false);
    router.back();
  };

  const handlePreview = () => {
    handleClose();
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <X size={24} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Item Details</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
            <Text style={styles.quantityTotal}>${(quantity * parseFloat(price)).toFixed(2)}</Text>
            <Text style={styles.quantityGst}>+GST: ${((quantity * parseFloat(price)) * (gst / 100)).toFixed(2)}</Text>
          </View>

          {/* New Item Card */}
          <View style={styles.itemCard}>
            <LinearGradient
              colors={['#8B5CF6', '#A855F7']}
              style={styles.itemHeader}>
              <Text style={styles.itemTitle}>New Item</Text>
              <View style={styles.itemActions}>
                <TouchableOpacity style={styles.itemAction}>
                  <Percent size={16} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.itemAction}>
                  <X size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </LinearGradient>

            <View style={styles.itemContent}>
              <View style={styles.itemCode}>
                <Text style={styles.itemCodeText}>NEW-001 • General</Text>
              </View>

              <View style={styles.priceRow}>
                <View style={styles.priceInput}>
                  <Text style={styles.inputLabel}>Price:</Text>
                  <TextInput
                    style={styles.priceField}
                    value={`$${price}`}
                    onChangeText={(text) => setPrice(text.replace('$', ''))}
                    keyboardType="decimal-pad"
                  />
                </View>
                <View style={styles.gstInput}>
                  <Text style={styles.inputLabel}>GST:</Text>
                  <Text style={styles.gstValue}>{gst}%</Text>
                </View>
              </View>

              <View style={styles.quantityRow}>
                <Text style={styles.quantityLabel}>Quantity:</Text>
                <View style={styles.quantityMini}>
                  <TouchableOpacity
                    style={styles.quantityMiniButton}
                    onPress={() => setQuantity(Math.max(1, quantity - 1))}>
                    <Minus size={12} color="#6B7280" />
                  </TouchableOpacity>
                  <Text style={styles.quantityMiniValue}>{quantity}</Text>
                  <TouchableOpacity
                    style={styles.quantityMiniButton}
                    onPress={() => setQuantity(quantity + 1)}>
                    <Plus size={12} color="#6B7280" />
                  </TouchableOpacity>
                </View>
                <View style={styles.itemTotal}>
                  <Text style={styles.itemTotalValue}>${itemTotal.toFixed(2)}</Text>
                  <Text style={styles.itemTotalGst}>+GST: ${gstAmount.toFixed(2)}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Discount Section */}
          <View style={styles.discountCard}>
            <View style={styles.discountHeader}>
              <View style={styles.discountIcon}>
                <Percent size={16} color="#F59E0B" />
              </View>
              <Text style={styles.discountTitle}>Apply Discount</Text>
            </View>

            <View style={styles.discountTypes}>
              <TouchableOpacity
                style={[
                  styles.discountTypeButton,
                  discountType === 'percentage' && styles.discountTypeActive
                ]}
                onPress={() => setDiscountType('percentage')}>
                <Text style={[
                  styles.discountTypeText,
                  discountType === 'percentage' && styles.discountTypeTextActive
                ]}>Percentage</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.discountTypeButton,
                  discountType === 'fixed' && styles.discountTypeActive
                ]}
                onPress={() => setDiscountType('fixed')}>
                <Text style={[
                  styles.discountTypeText,
                  discountType === 'fixed' && styles.discountTypeTextActive
                ]}>Fixed Amount</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.discountInputRow}>
              <TextInput
                style={styles.discountInput}
                value={discountValue}
                onChangeText={setDiscountValue}
                keyboardType="decimal-pad"
                placeholder="0"
              />
              <TouchableOpacity style={styles.clearButton}>
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Tax Settings */}
          <View style={styles.taxCard}>
            <View style={styles.taxHeader}>
              <View style={styles.taxIcon}>
                <BarChart3 size={16} color="#10B981" />
              </View>
              <Text style={styles.taxTitle}>Tax Settings</Text>
            </View>
            <View style={styles.taxRow}>
              <Text style={styles.taxLabel}>Default GST Rate:</Text>
              <View style={styles.taxValue}>
                <Text style={styles.taxValueText}>{gst}</Text>
                <Text style={styles.taxValueUnit}>%</Text>
              </View>
            </View>
          </View>

          {/* Quote Summary */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <View style={styles.summaryIcon}>
                <DollarSign size={16} color="#06B6D4" />
              </View>
              <Text style={styles.summaryTitle}>Quote Summary</Text>
            </View>
            <View style={styles.summaryContent}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal:</Text>
                <Text style={styles.summaryValue}>${12977.20}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>GST:</Text>
                <Text style={styles.summaryValue}>${2335.90}</Text>
              </View>
              <View style={[styles.summaryRow, styles.summaryTotal]}>
                <Text style={styles.summaryTotalLabel}>Total:</Text>
                <Text style={styles.summaryTotalValue}>${15313.10}</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.bottomAction}>
          <TouchableOpacity style={styles.previewButton} onPress={handlePreview}>
            <Eye size={20} color="#FFFFFF" />
            <Text style={styles.previewButtonText}>Preview Quote</Text>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
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
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
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
  gstValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
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
  previewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  previewButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});