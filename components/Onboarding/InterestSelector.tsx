import React from 'react'

import { useTranslation } from 'react-i18next'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

import { Interest } from '@/lib/types/onboarding'

interface InterestSelectorProps {
  interests: { key: Interest; label: string; emoji: string }[]
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
          return (
            <TouchableOpacity
              key={interest.key}
              style={[styles.interestCard, isSelected && styles.interestCardSelected]}
              onPress={() => onToggle(interest.key)}
            >
              <Text style={styles.emoji}>{interest.emoji}</Text>
              <Text
                style={[styles.interestLabel, isSelected && styles.interestLabelSelected]}
                className="font-quicksand"
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
  emoji: {
    fontSize: 24,
    marginBottom: 6,
  },
  interestLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  interestLabelSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
})
