import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { colors } from '../constants/colors';
import { Meal } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface MealDetailModalProps {
  meal: Meal | null;
  visible: boolean;
  onClose: () => void;
}

const MealDetailModal: React.FC<MealDetailModalProps> = ({ meal, visible, onClose }) => {
  if (!meal) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Image source={{ uri: meal.image_url }} style={styles.image} />

            <View style={styles.content}>
              <View style={styles.mealTypeBadge}>
                <Text style={styles.mealTypeText}>{meal.meal_type.toUpperCase()}</Text>
              </View>

              <Text style={styles.name}>{meal.name}</Text>
              <Text style={styles.cuisine}>{meal.cuisine} Cuisine</Text>

              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>{meal.calories}</Text>
                  <Text style={styles.statLabel}>Calories</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.stat}>
                  <Text style={styles.statValue}>{meal.cook_time_minutes}</Text>
                  <Text style={styles.statLabel}>Minutes</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.stat}>
                  <Text style={styles.statValue}>{meal.ingredients.length}</Text>
                  <Text style={styles.statLabel}>Ingredients</Text>
                </View>
              </View>

              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{meal.description}</Text>

              <Text style={styles.sectionTitle}>Ingredients</Text>
              <View style={styles.ingredientsList}>
                {meal.ingredients.map((ingredient, index) => (
                  <View key={index} style={styles.ingredientItem}>
                    <Text style={styles.ingredientBullet}>•</Text>
                    <Text style={styles.ingredientText}>{ingredient}</Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.swipeButton} onPress={onClose}>
              <Text style={styles.swipeButtonText}>Back to Swiping</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.cardBg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.6,
    backgroundColor: colors.inputBg,
  },
  content: {
    padding: 20,
  },
  mealTypeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 12,
  },
  mealTypeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
    letterSpacing: 0.5,
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  cuisine: {
    fontSize: 16,
    color: colors.textMuted,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.inputBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.inputBorder,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: colors.textMuted,
    lineHeight: 22,
    marginBottom: 20,
  },
  ingredientsList: {
    gap: 8,
    marginBottom: 20,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ingredientBullet: {
    fontSize: 16,
    color: colors.primary,
    marginRight: 10,
  },
  ingredientText: {
    fontSize: 15,
    color: colors.text,
    textTransform: 'capitalize',
  },
  footer: {
    padding: 20,
    paddingTop: 0,
  },
  swipeButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  swipeButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});

export default MealDetailModal;
