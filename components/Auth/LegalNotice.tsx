import { Trans, useTranslation } from 'react-i18next'
import { Linking, Text } from 'react-native'

// Placeholder addresses: the legal pages are not published yet.
export const LEGAL_URLS = {
  terms: 'https://tu-pagina-web.com/terminos-y-condiciones',
  privacy: 'https://tu-pagina-web.com/politica-de-privacidad',
  cookies: 'https://tu-pagina-web.com/politica-de-cookies',
} as const

// The login screen shows a disclaimer under its button, while the register screen shows the
// terms that the user accepts by registering. Both translations use the same tags.
const NOTICE_KEYS = {
  login: 'login.disclaimer',
  register: 'register.terms_conditions',
} as const

export type LegalNoticeVariant = keyof typeof NOTICE_KEYS

type LegalNoticeProps = {
  /** Which text to show: the login disclaimer or the registration terms. */
  variant: LegalNoticeVariant
  /** Classes for the whole notice: layout, text size and text color. */
  className?: string
}

// <Trans> injects the translated words as the children of this element.
const link = (url: string) => (
  <Text
    accessibilityRole="link"
    className="font-nunito-bold text-primary underline"
    onPress={() => Linking.openURL(url)}
  />
)

export default function LegalNotice({ variant, className = '' }: LegalNoticeProps) {
  const { t } = useTranslation()

  return (
    <Text className={`font-nunito ${className}`}>
      <Trans
        i18nKey={NOTICE_KEYS[variant]}
        components={{
          Bold: link(LEGAL_URLS.terms),
          LinkPrivacy: link(LEGAL_URLS.privacy),
          LinkCookies: link(LEGAL_URLS.cookies),
        }}
        t={t}
      />
    </Text>
  )
}
