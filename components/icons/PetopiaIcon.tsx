import Ionicons from '@expo/vector-icons/Ionicons'

interface ZookiIconProps {
  name: keyof typeof Ionicons.glyphMap
  size?: number
  color?: string
  style?: any
}

export function PetopiaIcon({
  name,
  size = 24,
  color = '#A0D2DB',
  style,
  ...props
}: ZookiIconProps) {
  return <Ionicons name={name} size={size} color={color} style={style} {...props} />
}

export default PetopiaIcon
