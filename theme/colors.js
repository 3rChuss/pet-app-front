const base = {
  primary: '#A0D2DB', // Azul Suave
  secondary_coral: '#F8B595', // Coral Suave
  secondary_green: '#C8E6C9', // Verde Hoja Suave
  accent_coral: '#F47C7C', // Coral Vibrante
  accent_yellow: '#FFDA63', // Amarillo Sol
  neutral_off_white: '#FDFDFD', // Blanco Roto
  neutral_light_gray: '#F5F5F5', // Gris Claro
  neutral_medium_gray: '#BDBDBD', // Gris Medio
  neutral_dark_gray: '#424242', // Gris Oscuro (Texto)
}

const summer = {
  primary: '#B0E0E6', // Lighter Sky Blue
  secondary_coral: '#FFDAB9', // Bright Peach
  secondary_green: '#98FB98', // Pale Green
  accent_coral: '#FFA07A', // Light Salmon
  accent_yellow: '#FFFACD', // Lemon Chiffon
  neutral_off_white: '#FEFEFE', // Brighter Off-White
  neutral_light_gray: '#FAFAFA', // Brighter Light Gray
  neutral_medium_gray: '#DCDCDC', // Lighter Medium Gray (Gainsboro)
  neutral_dark_gray: '#606060', // Lighter Dark Gray
}

const xmas = {
  primary: '#FFD700', // Festive Gold
  secondary_coral: '#DC143C', // Crimson Red
  secondary_green: '#228B22', // Forest Green
  accent_coral: '#FF0000', // Bright Red
  accent_yellow: '#DAA520', // Goldenrod
  neutral_off_white: '#FFF8DC', // Cornsilk
  neutral_light_gray: '#E8E8E8', // Slightly darker than summer's light gray for contrast
  neutral_medium_gray: '#A9A9A9', // DarkGray (standard)
  neutral_dark_gray: '#303030', // Darker Text
}

const dark = {
  // Colores de marca (se mantienen consistentes)
  primary: '#A0D2DB', // Azul Suave (funciona bien en dark)
  secondary_coral: '#F8B595', // Coral Suave
  secondary_green: '#C8E6C9', // Verde Hoja Suave
  accent_coral: '#F47C7C', // Coral Vibrante
  accent_yellow: '#FFDA63', // Amarillo Sol

  // Neutrales adaptados para modo oscuro
  neutral_off_white: '#111827', // Fondo principal oscuro
  neutral_light_gray: '#1f2937', // Fondo secundario oscuro
  neutral_medium_gray: '#6b7280', // Texto secundario
  neutral_dark_gray: '#f9fafb', // Texto principal (invertido)

  // Colores adicionales para mejor contraste en dark mode
  surface: '#1f2937', // Superficie de componentes
  border: '#374151', // Bordes
  input_bg: '#374151', // Fondo de inputs
  card_bg: '#1f2937', // Fondo de tarjetas
}

module.exports = {
  base,
  summer,
  xmas,
  dark,
}
