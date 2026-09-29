import { render, screen, userEvent, waitFor } from '@testing-library/react-native'
import { Linking } from 'react-native'

import LegalNotice, { LEGAL_URLS } from '@/components/Auth/LegalNotice'
import i18n from '@/services/i18n'
import enUS from '@/services/i18n/locales/en-US.json'

// Expected texts come from the locale file so the tests follow copy changes. The translations mark
// the links with tags such as <Bold>...</Bold>, which <Trans> renders as nested texts.
const loginDisclaimer = enUS.login.disclaimer
const registerTerms = enUS.register.terms_conditions

const withoutTags = (text: string) => text.replace(/<\/?\w+>/g, '')

function linkText(text: string, tag: string) {
  const match = text.match(new RegExp(`<${tag}>(.*?)</${tag}>`))
  if (!match) throw new Error(`The tag <${tag}> is not in "${text}"`)
  return match[1]
}

// The page that each tag of the translations opens.
const pageOf = {
  Bold: LEGAL_URLS.terms,
  LinkPrivacy: LEGAL_URLS.privacy,
  LinkCookies: LEGAL_URLS.cookies,
} as const

const openURL = jest.mocked(Linking.openURL)
const user = userEvent.setup()

describe('LegalNotice', () => {
  beforeAll(async () => {
    // services/i18n starts initialising when it is imported and does not expose the promise.
    // The language is set explicitly instead of relying on the device locale of the mock.
    await waitFor(() => expect(i18n.isInitialized).toBe(true))
    await i18n.changeLanguage('en-US')
  })

  // Regression tests for APP-59: the register screen used to show the login disclaimer.
  describe('text', () => {
    it('shows the registration terms, and not the login disclaimer, in the register variant', async () => {
      await render(<LegalNotice variant="register" />)

      expect(screen.getByText(withoutTags(registerTerms))).toBeOnTheScreen()
      expect(screen.queryByText(withoutTags(loginDisclaimer))).not.toBeOnTheScreen()
    })

    it('shows the login disclaimer, and not the registration terms, in the login variant', async () => {
      await render(<LegalNotice variant="login" />)

      expect(screen.getByText(withoutTags(loginDisclaimer))).toBeOnTheScreen()
      expect(screen.queryByText(withoutTags(registerTerms))).not.toBeOnTheScreen()
    })
  })

  describe.each([
    { variant: 'login', text: loginDisclaimer, tags: ['Bold', 'LinkPrivacy', 'LinkCookies'] },
    { variant: 'register', text: registerTerms, tags: ['Bold', 'LinkPrivacy'] },
  ] as const)('links in the $variant variant', ({ variant, text, tags }) => {
    it.each(tags)('open the page of <%s> when they are pressed', async tag => {
      await render(<LegalNotice variant={variant} />)

      await user.press(screen.getByRole('link', { name: linkText(text, tag) }))

      expect(openURL).toHaveBeenCalledTimes(1)
      expect(openURL).toHaveBeenCalledWith(pageOf[tag])
    })
  })

  it('has no cookie policy link in the register variant', async () => {
    await render(<LegalNotice variant="register" />)

    expect(screen.getAllByRole('link')).toHaveLength(2)
    expect(
      screen.queryByRole('link', { name: linkText(loginDisclaimer, 'LinkCookies') })
    ).not.toBeOnTheScreen()
  })

  it('sends each link to a different page', () => {
    expect(new Set(Object.values(LEGAL_URLS)).size).toBe(Object.keys(LEGAL_URLS).length)
  })
})
