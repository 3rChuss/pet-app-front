import { useTranslation } from 'react-i18next'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

import { Interest } from '@/lib/types/onboarding'

import type { LucideIcon } from 'lucide-react-native'

// Icon colors match the label colors; the soft fill marks the active state (Branding guide 3.4)
const IDLE_COLOR = 'rgba(255, 255, 255, 0.9)'
const SELECTED_COLOR = '#fff'
const SELECTED_FILL = 'rgba(255, 255, 255, 0.25)'

interface InterestSelectorProps {
  interests: { key: Interest; label: string; icon: LucideIcon }[]
  selectedInterests: Interest[]
  onToggle: (interest: Interest) => void
}

export default function InterestSelector({
  interests,
  selectedInterests,
  onToggle,
}: InterestSelectorProps) {
  const { t } = useTranslation()

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {interests.map(interest => {
          const isSelected = selectedInterests.includes(interest.key)
          const Icon = interest.icon
          return (
            <TouchableOpacity
              key={interest.key}
              style={[styles.interestCard, isSelected && styles.interestCardSelected]}
              onPress={() => onToggle(interest.key)}
              accessibilityRole="checkbox"
              aria-checked={isSelected}
              accessibilityLabel={t(`onboarding.interests.${interest.key}`)}
            >
              <Icon
                size={24}
                strokeWidth={2}
                color={isSelected ? SELECTED_COLOR : IDLE_COLOR}
                fill={isSelected ? SELECTED_FILL : 'none'}
                style={styles.icon}
              />
              <Text
                style={[styles.interestLabel, isSelected && styles.interestLabelSelected]}
                className={isSelected ? 'font-quicksand-bold' : 'font-quicksand-semibold'}
              >
                {t(`onboarding.interests.${interest.key}`)}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  interestCard: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  interestCardSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  icon: {
    marginBottom: 6,
  },
  interestLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  interestLabelSelected: {
    color: '#fff',
  },
})
