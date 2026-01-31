import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { colors } from '../constants/colors';

interface Option {
  label: string;
  value: string | number;
}

interface OnboardingStepProps {
  title: string;
  subtitle?: string;
  options: Option[] | string[];
  selected: (string | number)[];
  onSelect: (value: string | number) => void;
  multiSelect?: boolean;
  maxSelections?: number;
  showFreeText?: boolean;
  freeTextValue?: string;
  onFreeTextChange?: (text: string) => void;
  freeTextPlaceholder?: string;
  required?: boolean;
}

const OnboardingStep: React.FC<OnboardingStepProps> = ({
  title,
  subtitle,
  options,
  selected,
  onSelect,
  multiSelect = true,
  maxSelections,
  showFreeText = false,
  freeTextValue = '',
  onFreeTextChange,
  freeTextPlaceholder = 'Add your own...',
  required = false,
}) => {
  const normalizedOptions: Option[] = options.map(opt =>
    typeof opt === 'string' ? { label: opt, value: opt } : opt
  );

  const isSelected = (value: string | number) => selected.includes(value);

  const handleSelect = (value: string | number) => {
    if (maxSelections && selected.length >= maxSelections && !isSelected(value)) {
      return;
    }
    onSelect(value);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        {required && <Text style={styles.required}>Required</Text>}
        {maxSelections && (
          <Text style={styles.maxLabel}>
            Select up to {maxSelections} ({selected.length}/{maxSelections})
          </Text>
        )}
      </View>

      <ScrollView
        style={styles.optionsContainer}
        contentContainerStyle={styles.optionsContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.optionsGrid}>
          {normalizedOptions.map((option) => (
            <TouchableOpacity
              key={String(option.value)}
              style={[
                styles.optionButton,
                isSelected(option.value) && styles.optionButtonSelected,
              ]}
              onPress={() => handleSelect(option.value)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.optionText,
                  isSelected(option.value) && styles.optionTextSelected,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {showFreeText && (
          <View style={styles.freeTextContainer}>
            <TextInput
              style={styles.freeTextInput}
              placeholder={freeTextPlaceholder}
              placeholderTextColor={colors.textLight}
              value={freeTextValue}
              onChangeText={onFreeTextChange}
              multiline
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textMuted,
    lineHeight: 22,
  },
  required: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 4,
  },
  maxLabel: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 8,
  },
  optionsContainer: {
    flex: 1,
  },
  optionsContent: {
    paddingBottom: 20,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionButton: {
    backgroundColor: colors.inputBg,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderWidth: 2,
    borderColor: colors.inputBorder,
  },
  optionButtonSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  optionText: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '500',
  },
  optionTextSelected: {
    color: colors.primaryDark,
    fontWeight: '600',
  },
  freeTextContainer: {
    marginTop: 16,
  },
  freeTextInput: {
    backgroundColor: colors.inputBg,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: colors.text,
    borderWidth: 1.5,
    borderColor: colors.inputBorder,
    minHeight: 80,
    textAlignVertical: 'top',
  },
});

export default OnboardingStep;
