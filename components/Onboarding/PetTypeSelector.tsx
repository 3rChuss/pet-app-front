import React from 'react'

import { useTranslation } from 'react-i18next'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

import { PetType } from '@/lib/types/onboarding'

interface PetTypeSelectorProps {
  petTypes: { key: PetType; label: string; emoji: string }[]
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
          return (
            <TouchableOpacity
              key={petType.key}
              style={[styles.petCard, isSelected && styles.petCardSelected]}
              onPress={() => onToggle(petType.key)}
            >
              <Text style={styles.emoji}>{petType.emoji}</Text>
              <Text
                style={[styles.petLabel, isSelected && styles.petLabelSelected]}
                className="font-quicksand"
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
  emoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  petLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  petLabelSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
})
