import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { colors } from '../constants/colors';
import { SwipeDirection } from '../types';

interface ConfidenceSelectorProps {
  visible: boolean;
  direction: SwipeDirection;
  onSelect: (confidence: number) => void;
  onSkip: () => void;
}

const ConfidenceSelector: React.FC<ConfidenceSelectorProps> = ({
  visible,
  direction,
  onSelect,
  onSkip,
}) => {
  const getDirectionColor = () => {
    switch (direction) {
      case 'right':
        return colors.swipeRight;
      case 'left':
        return colors.swipeLeft;
      case 'maybe':
        return colors.swipeMaybe;
    }
  };

  const getDirectionText = () => {
    switch (direction) {
      case 'right':
        return 'You liked this!';
      case 'left':
        return 'Not for you';
      case 'maybe':
        return 'Maybe later';
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={[styles.badge, { backgroundColor: getDirectionColor() }]}>
            <Text style={styles.badgeText}>
              {direction === 'right' ? '👍' : direction === 'left' ? '👎' : '🤔'}
            </Text>
          </View>

          <Text style={styles.title}>{getDirectionText()}</Text>
          <Text style={styles.subtitle}>How confident are you?</Text>

          <View style={styles.confidenceRow}>
            {[1, 2, 3, 4, 5].map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.confidenceButton,
                  { borderColor: getDirectionColor() },
                ]}
                onPress={() => onSelect(level)}
                activeOpacity={0.7}
              >
                <Text style={[styles.confidenceText, { color: getDirectionColor() }]}>
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.labels}>
            <Text style={styles.labelText}>Not sure</Text>
            <Text style={styles.labelText}>Very sure</Text>
          </View>

          <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
            <Text style={styles.skipText}>Skip (default: 3)</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: colors.cardBg,
    borderRadius: 24,
    padding: 28,
    width: '100%',
    alignItems: 'center',
  },
  badge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  badgeText: {
    fontSize: 28,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textMuted,
    marginBottom: 24,
  },
  confidenceRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  confidenceButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
  },
  confidenceText: {
    fontSize: 18,
    fontWeight: '700',
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 8,
    marginBottom: 20,
  },
  labelText: {
    fontSize: 12,
    color: colors.textLight,
  },
  skipButton: {
    paddingVertical: 8,
  },
  skipText: {
    fontSize: 14,
    color: colors.textMuted,
  },
});

export default ConfidenceSelector;
