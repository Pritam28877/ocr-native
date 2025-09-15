import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { User, CreditCard as Edit, Mail, Phone, MapPin, Globe, ChevronRight, Calendar, FileText } from 'lucide-react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';

export default function ProfileScreen() {
  const { colors } = useTheme();
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'mr', name: 'मराठी (Marathi)' },
    { code: 'hi', name: 'हिंदी (Hindi)' },
    { code: 'gu', name: 'ગુજરાતી (Gujarati)' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)' },
  ];

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    setShowLanguageModal(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
    
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Profile Section */}
        <View style={[styles.profileCard, { backgroundColor: colors.surface }]}>
          <View style={styles.profileHeader}>
            <View style={[styles.avatarContainer, { backgroundColor: colors.background }]}>
              <User size={32} color={colors.primary} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: colors.text }]}>John Doe</Text>
              <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>john.doe@example.com</Text>
            </View>
            <TouchableOpacity style={[styles.editButton, { backgroundColor: colors.background }]}>
              <Edit size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <View style={[styles.statIcon, { backgroundColor: colors.background }]}>
              <FileText size={20} color="#10B981" />
            </View>
            <Text style={[styles.statNumber, { color: colors.text }]}>24</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Quotes</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <View style={[styles.statIcon, { backgroundColor: colors.background }]}>
              <Calendar size={20} color="#3B82F6" />
            </View>
            <Text style={[styles.statNumber, { color: colors.text }]}>8</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>This Month</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <View style={[styles.statIcon, { backgroundColor: colors.background }]}>
              <Calendar size={20} color="#F59E0B" />
            </View>
            <Text style={[styles.statNumber, { color: colors.text }]}>3</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>This Week</Text>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Contact Information</Text>
          <View style={[styles.contactCard, { backgroundColor: colors.surface }]}>
            <View style={styles.contactItem}>
              <View style={[styles.contactIcon, { backgroundColor: colors.background }]}>
                <Mail size={18} color={colors.textSecondary} />
              </View>
              <View style={styles.contactInfo}>
                <Text style={[styles.contactLabel, { color: colors.textSecondary }]}>Email</Text>
                <Text style={[styles.contactValue, { color: colors.text }]}>john.doe@example.com</Text>
              </View>
              <TouchableOpacity>
                <Edit size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.contactItem}>
              <View style={[styles.contactIcon, { backgroundColor: colors.background }]}>
                <Phone size={18} color={colors.textSecondary} />
              </View>
              <View style={styles.contactInfo}>
                <Text style={[styles.contactLabel, { color: colors.textSecondary }]}>Phone</Text>
                <Text style={[styles.contactValue, { color: colors.text }]}>+91 98765 43210</Text>
              </View>
              <TouchableOpacity>
                <Edit size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.contactItem}>
              <View style={[styles.contactIcon, { backgroundColor: colors.background }]}>
                <MapPin size={18} color={colors.textSecondary} />
              </View>
              <View style={styles.contactInfo}>
                <Text style={[styles.contactLabel, { color: colors.textSecondary }]}>Location</Text>
                <Text style={[styles.contactValue, { color: colors.text }]}>Mumbai, Maharashtra</Text>
              </View>
              <TouchableOpacity>
                <Edit size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Language Settings */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Preferences</Text>
          <TouchableOpacity 
            style={[styles.languageCard, { backgroundColor: colors.surface }]}
            onPress={() => setShowLanguageModal(true)}>
            <View style={[styles.languageIcon, { backgroundColor: colors.background }]}>
              <Globe size={18} color={colors.primary} />
            </View>
            <View style={styles.languageInfo}>
              <Text style={[styles.languageLabel, { color: colors.textSecondary }]}>Language</Text>
              <Text style={[styles.languageValue, { color: colors.text }]}>{selectedLanguage}</Text>
            </View>
            <ChevronRight size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowLanguageModal(false)}>
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.surface }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Select Language</Text>
            <TouchableOpacity onPress={() => setShowLanguageModal(false)}>
              <Text style={[styles.modalClose, { color: colors.primary }]}>Done</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            {languages.map((language) => (
              <TouchableOpacity
                key={language.code}
                style={[
                  styles.languageOption, 
                  { borderBottomColor: colors.border },
                  selectedLanguage === language.name && { backgroundColor: colors.background }
                ]}
                onPress={() => handleLanguageSelect(language.name)}>
                <Text style={[
                  styles.languageOptionText, 
                  { color: colors.text },
                  selectedLanguage === language.name && { color: colors.primary, fontWeight: '500' }
                ]}>
                  {language.name}
                </Text>
                {selectedLanguage === language.name && (
                  <View style={[styles.selectedIndicator, { backgroundColor: colors.primary }]} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Bottom Navigation Spacer */}
      <View style={styles.bottomSpacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  profileCard: {
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  sectionContainer: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  contactCard: {
    borderRadius: 16,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  contactIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  languageCard: {
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  languageIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  languageInfo: {
    flex: 1,
  },
  languageLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  languageValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalClose: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 24,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  languageOptionText: {
    fontSize: 16,
  },
  selectedIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  bottomSpacer: {
    height: 100,
  },
});