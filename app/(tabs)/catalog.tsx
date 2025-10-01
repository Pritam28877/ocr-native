import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Package,
  Search,
  Filter,
  Star,
  Camera,
  Upload,
  Plus,
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { router } from 'expo-router';
import ImageUploadModal from '@/components/ImageUploadModal';
import { useState, useMemo } from 'react';

export default function CatalogScreen() {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Real product data from API
  const products = [
    {
      _id: '68d7b8da5737ade6c73dd166',
      catalogueId: 'DCSNCSPA321MMR',
      __v: 0,
      brand: 'HAVELLS Crabtree',
      classification: [],
      createdAt: '2025-09-27T10:13:45.968Z',
      createdBy: '68d6e1d6730cbdc361f72bdf',
      defaultDiscount: 0,
      description: 'Magnus (White)',
      gstPercentage: 18,
      hsnCode: '85362030',
      isActive: true,
      name: '32 ASPC MINI MCE',
      price: 0,
      subQuantities: [],
      units: '12/240N',
      updatedAt: '2025-09-27T10:13:45.968Z',
      updatedBy: '68d6e1d6730cbdc361f72bdf',
      // Additional fields for display
      category: 'Safety',
      rating: 4.8,
      image: '⚡',
    },
    {
      _id: '68d7b8da5737ade6c73dd167',
      catalogueId: 'WIRE001',
      brand: 'Finolex',
      name: '2.5mm Copper Wire',
      description: 'Multi-strand copper electrical wire',
      price: 2.5,
      units: 'per meter',
      gstPercentage: 18,
      hsnCode: '85444290',
      isActive: true,
      category: 'Wiring',
      rating: 4.7,
      image: '🔌',
    },
    {
      _id: '68d7b8da5737ade6c73dd168',
      catalogueId: 'LED001',
      brand: 'Philips',
      name: '9W LED Bulb',
      description: 'Energy efficient LED bulb',
      price: 8.99,
      units: 'per piece',
      gstPercentage: 18,
      hsnCode: '85395000',
      isActive: true,
      category: 'Lighting',
      rating: 4.6,
      image: '💡',
    },
    {
      _id: '68d7b8da5737ade6c73dd169',
      catalogueId: 'SWITCH001',
      brand: 'Legrand',
      name: 'Modular Switch 1-Gang',
      description: 'White modular switch with rocker  mechanism',
      price: 12.5,
      units: 'per piece',
      gstPercentage: 18,
      hsnCode: '85365000',
      isActive: true,
      category: 'Controls',
      rating: 4.5,
      image: '🔘',
    },
    {
      _id: '68d7b8da5737ade6c73dd170',
      catalogueId: 'CABLE001',
      brand: 'Polycab',
      name: 'Cable Tray 2x1',
      description: 'Galvanized steel cable management tray',
      price: 15.0,
      units: 'per meter',
      gstPercentage: 18,
      hsnCode: '73269090',
      isActive: true,
      category: 'Accessories',
      rating: 4.4,
      image: '📦',
    },
    {
      _id: '68d7b8da5737ade6c73dd171',
      catalogueId: 'TOOL001',
      brand: 'Bosch',
      name: 'Professional Drill Machine',
      description: 'Cordless drill with lithium battery',
      price: 89.99,
      units: 'per piece',
      gstPercentage: 18,
      hsnCode: '84672900',
      isActive: true,
      category: 'Tools',
      rating: 4.9,
      image: '🔧',
    },
    {
      _id: '68d7b8da5737ade6c73dd172',
      catalogueId: 'WIRE002',
      brand: 'RR Kabel',
      name: '4mm Copper Wire',
      description: 'Heavy duty copper wire for main circuits',
      price: 4.2,
      units: 'per meter',
      gstPercentage: 18,
      hsnCode: '85444290',
      isActive: true,
      category: 'Wiring',
      rating: 4.8,
      image: '🔌',
    },
    {
      _id: '68d7b8da5737ade6c73dd173',
      catalogueId: 'SAFETY001',
      brand: 'Schneider',
      name: 'MCB 32A 2-Pole',
      description: 'Miniature circuit breaker for protection',
      price: 45.0,
      units: 'per piece',
      gstPercentage: 18,
      hsnCode: '85362030',
      isActive: true,
      category: 'Safety',
      rating: 4.9,
      image: '⚡',
    },
    {
      _id: '68d7b8da5737ade6c73dd174',
      catalogueId: 'LED002',
      brand: 'Osram',
      name: 'LED Panel Light 18W',
      description: 'Square LED panel for false ceiling',
      price: 25.99,
      units: 'per piece',
      gstPercentage: 18,
      hsnCode: '85395000',
      isActive: true,
      category: 'Lighting',
      rating: 4.7,
      image: '💡',
    },
    {
      _id: '68d7b8da5737ade6c73dd175',
      catalogueId: 'SWITCH002',
      brand: 'Anchor',
      name: '5-Pin Socket',
      description: 'Universal 5-pin socket with switch',
      price: 18.5,
      units: 'per piece',
      gstPercentage: 18,
      hsnCode: '85365000',
      isActive: true,
      category: 'Controls',
      rating: 4.6,
      image: '🔌',
    },
    {
      _id: '68d7b8da5737ade6c73dd176',
      catalogueId: 'CABLE002',
      brand: 'D-Link',
      name: 'Cat6 Ethernet Cable',
      description: 'High speed network cable 305m',
      price: 35.0,
      units: 'per box',
      gstPercentage: 18,
      hsnCode: '85444290',
      isActive: true,
      category: 'Accessories',
      rating: 4.5,
      image: '📦',
    },
    {
      _id: '68d7b8da5737ade6c73dd177',
      catalogueId: 'TOOL002',
      brand: 'Stanley',
      name: 'Wire Stripper Set',
      description: 'Professional wire stripping tools set',
      price: 22.99,
      units: 'per set',
      gstPercentage: 18,
      hsnCode: '84672900',
      isActive: true,
      category: 'Tools',
      rating: 4.8,
      image: '🔧',
    },
  ];

  // Format price display in INR
  const formatPrice = (price: number | string): string => {
    if (typeof price === 'number' && price === 0) return 'Price on request';
    if (typeof price === 'string') return price;
    return `₹${Math.round(price)}`;
  };

  const categories = [
    'All',
    'Wiring',
    'Safety',
    'Lighting',
    'Controls',
    'Accessories',
    'Tools',
  ];

  // Filter products based on search query and category
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        searchQuery === '' ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Product Catalog
          </Text>
          <Text
            style={[styles.headerSubtitle, { color: colors.textSecondary }]}
          >
            Browse our electrical products here
          </Text>
        </View>

        {/* Search and Filter Bar */}
        <View style={styles.searchSection}>
          <View
            style={[
              styles.searchBar,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Search size={20} color={colors.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search products..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity
            style={[styles.filterButton, { backgroundColor: colors.primary }]}
          >
            <Filter size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.categoryChip,
                {
                  backgroundColor:
                    selectedCategory === category
                      ? colors.primary
                      : colors.surface,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  {
                    color:
                      selectedCategory === category ? '#FFFFFF' : colors.text,
                  },
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Products Grid */}
        <View style={styles.productsGrid}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <TouchableOpacity
                key={product._id}
                style={[
                  styles.productCard,
                  { backgroundColor: colors.surface },
                ]}
              >
                <View style={styles.productContent}>
                  <View style={styles.productMainContent}>
                    <View style={styles.productInfo}>
                      <Text
                        style={[styles.productName, { color: colors.text }]}
                      >
                        {product.name}
                      </Text>
                      <Text
                        style={[
                          styles.productCategory,
                          { color: colors.textSecondary },
                        ]}
                      >
                        {product.brand} • {product.category}
                      </Text>
                      <Text
                        style={[
                          styles.productDescription,
                          { color: colors.textSecondary },
                        ]}
                      >
                        {product.description}
                      </Text>
                      <Text
                        style={[
                          styles.productUnits,
                          { color: colors.textSecondary },
                        ]}
                      >
                        Units: {product.units}
                      </Text>
                    </View>

                    <View style={styles.productImageContainer}>
                      <Text style={styles.productEmoji}>{product.image}</Text>
                    </View>
                  </View>

                  <View style={styles.productFooter}>
                    <View style={styles.ratingContainer}>
                      <Star size={14} color="#F59E0B" fill="#F59E0B" />
                      <Text style={[styles.ratingText, { color: colors.text }]}>
                        {product.rating}
                      </Text>
                    </View>
                    <Text
                      style={[styles.productPrice, { color: colors.primary }]}
                    >
                      {formatPrice(product.price)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.noResultsContainer}>
              <Text
                style={[styles.noResultsText, { color: colors.textSecondary }]}
              >
                No products found matching your search
              </Text>
            </View>
          )}
        </View>

        {/* Bottom Spacer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  headerSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
  },
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 24,
    gap: 12,
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  searchInput: {
    fontSize: 16,
    flex: 1,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoriesContainer: {
    marginTop: 20,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  productsGrid: {
    paddingHorizontal: 20,
    marginTop: 24,
    gap: 16,
  },
  productCard: {
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  productContent: {
    gap: 8,
  },
  productMainContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  productImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 90,
    height: 90,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    flexShrink: 0,
  },
  productEmoji: {
    fontSize: 36,
  },
  productInfo: {
    flex: 1,
    gap: 4,
    minWidth: 0,
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  productCategory: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  productDescription: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  productUnits: {
    fontSize: 10,
    fontWeight: '500',
    marginBottom: 8,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
  },
  bottomSpacer: {
    height: 120,
  },
  noResultsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noResultsText: {
    fontSize: 16,
    textAlign: 'center',
  },
});
