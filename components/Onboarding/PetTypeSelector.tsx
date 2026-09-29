import { useTranslation } from 'react-i18next'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

import { PetType } from '@/lib/types/onboarding'

import type { LucideIcon } from 'lucide-react-native'

// Icon colors match the label colors; the soft fill marks the active state (Branding guide 3.4)
const IDLE_COLOR = 'rgba(255, 255, 255, 0.9)'
const SELECTED_COLOR = '#fff'
const SELECTED_FILL = 'rgba(255, 255, 255, 0.25)'

interface PetTypeSelectorProps {
  petTypes: { key: PetType; label: string; icon: LucideIcon }[]
  selectedTypes: PetType[]
  onToggle: (type: PetType) => void
}

export default function PetTypeSelector({
  petTypes,
  selectedTypes,
  onToggle,
}: PetTypeSelectorProps) {
  const { t } = useTranslation()

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {petTypes.map(petType => {
          const isSelected = selectedTypes.includes(petType.key)
          const Icon = petType.icon
          return (
            <TouchableOpacity
              key={petType.key}
              style={[styles.petCard, isSelected && styles.petCardSelected]}
              onPress={() => onToggle(petType.key)}
              accessibilityRole="checkbox"
              aria-checked={isSelected}
              accessibilityLabel={t(`onboarding.pets.${petType.key}`)}
            >
              <Icon
                size={32}
                strokeWidth={2}
                color={isSelected ? SELECTED_COLOR : IDLE_COLOR}
                fill={isSelected ? SELECTED_FILL : 'none'}
                style={styles.icon}
              />
              <Text
                style={[styles.petLabel, isSelected && styles.petLabelSelected]}
                className={isSelected ? 'font-quicksand-bold' : 'font-quicksand-semibold'}
              >
                {t(`onboarding.pets.${petType.key}`)}
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
    gap: 16,
  },
  petCard: {
    width: '45%',
    aspectRatio: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  petCardSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  icon: {
    marginBottom: 8,
  },
  petLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  petLabelSelected: {
    color: '#fff',
  },
})
