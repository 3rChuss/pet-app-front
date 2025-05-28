import { useState } from 'react'

import { View, TouchableOpacity, Text } from 'react-native'

import PetopiaIcon from '@/components/icons/PetopiaIcon'

import { styles } from './styles'
import { PostActionsProps } from './types'

export default function PostActions({
  stats,
  postId,
  content,
  onLike,
  onComment,
  onShare,
  onSave,
}: PostActionsProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  const handleLike = () => onLike?.(postId)
  const handleComment = () => onComment?.(postId)
  const handleShare = () => onShare?.(postId)
  const handleSave = () => onSave?.(postId)

  const shouldTruncate = content && content.length > 99
  const displayContent = shouldTruncate && !isExpanded ? content.substring(0, 99) + '...' : content

  return (
    <>
      {/* Content Text */}
      {content && (
        <View style={styles.content}>
          <Text
            style={styles.contentText}
            className="font-nunito"
            numberOfLines={isExpanded ? undefined : 2}
          >
            {displayContent}
          </Text>
          {shouldTruncate && (
            <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
              <Text style={styles.readMore} className="font-nunito italic text-gray-400">
                {isExpanded ? 'Ver menos' : 'Ver más'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.container}>
        <TouchableOpacity style={styles.actionButton} onPress={handleLike} activeOpacity={0.8}>
          <Text style={[styles.actionIcon, stats.isLiked && styles.likedIcon]}>
            {stats.isLiked ? (
              <PetopiaIcon name="heart" size={20} color="#FF6B6B" />
            ) : (
              <PetopiaIcon name="heart-outline" size={20} color="#FDFDFD" />
            )}
          </Text>
        </TouchableOpacity>
        <Text style={styles.actionCount} className="font-nunito mb-2">
          {formatCount(stats.likes)}
        </Text>

        <TouchableOpacity style={styles.actionButton} onPress={handleComment} activeOpacity={0.8}>
          <Text style={styles.actionIcon}>
            <PetopiaIcon name="chatbubble-outline" size={20} color="#FDFDFD" />
          </Text>
        </TouchableOpacity>
        <Text style={styles.actionCount} className="font-nunito mb-2">
          {formatCount(stats.comments)}
        </Text>

        <TouchableOpacity style={styles.actionButton} onPress={handleShare} activeOpacity={0.8}>
          <Text style={styles.actionIcon}>
            <PetopiaIcon name="share-outline" size={20} color="#FDFDFD" />
          </Text>
        </TouchableOpacity>
        <Text style={styles.actionCount} className="font-nunito mb-2">
          {formatCount(stats.shares)}
        </Text>

        <TouchableOpacity style={styles.actionButton} onPress={handleSave} activeOpacity={0.8}>
          <Text style={[styles.actionIcon, stats.isSaved && styles.savedIcon]}>
            {stats.isSaved ? (
              <PetopiaIcon name="bookmark" size={20} color="#FFD700" />
            ) : (
              <PetopiaIcon name="bookmark-outline" size={20} color="#FDFDFD" />
            )}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  )
}
