import { INTERESTS, PET_TYPES, slides } from '@/lib/const/onBoarding'
import enUS from '@/services/i18n/locales/en-US.json'
import esES from '@/services/i18n/locales/es-ES.json'

type FlatLocale = Record<string, unknown>

// Flattens nested translation objects into dotted keys, the way i18next addresses them.
function flatten(node: object, prefix = ''): FlatLocale {
  const flat: FlatLocale = {}
  for (const [key, value] of Object.entries(node)) {
    const path = prefix ? `${prefix}.${key}` : key
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(flat, flatten(value, path))
    } else {
      flat[path] = value
    }
  }
  return flat
}

const en = flatten(enUS)
const es = flatten(esES)
const locales: [string, FlatLocale][] = [
  ['en-US', en],
  ['es-ES', es],
]

const textOf = (value: unknown) => (typeof value === 'string' ? value : '')

// Interpolation markers such as `{{place}}` or the unescaped `{{- place}}`, sorted by name.
function interpolations(text: string): string[] {
  return [...text.matchAll(/\{\{-?\s*([\w.]+)/g)].map(match => match[1]).sort()
}

// Component tags that <Trans> maps to components, such as `<Bold>` and `</Bold>`, sorted.
function componentTags(text: string): string[] {
  return (text.match(/<\/?[\w-]+\s*\/?>/g) ?? []).sort()
}

// Keys present in both languages whose extracted markers differ, ready to read in a failure.
function keysWithDifferentMarkers(extract: (text: string) => string[]): string[] {
  return Object.keys(en)
    .filter(key => Object.hasOwn(es, key))
    .flatMap(key => {
      const inEnglish = extract(textOf(en[key]))
      const inSpanish = extract(textOf(es[key]))
      return JSON.stringify(inEnglish) === JSON.stringify(inSpanish)
        ? []
        : [`${key}: en-US ${JSON.stringify(inEnglish)} vs es-ES ${JSON.stringify(inSpanish)}`]
    })
}

const missingKeys = (from: FlatLocale, to: FlatLocale) =>
  Object.keys(from).filter(key => !Object.hasOwn(to, key))

const isTranslated = (locale: FlatLocale, key: string) => textOf(locale[key]).trim() !== ''

describe('locale files', () => {
  // The checks below compare what these helpers extract, so first prove that they extract it:
  // otherwise two empty results would make every comparison pass.
  describe('helpers', () => {
    it('flatten nested translations into dotted keys', () => {
      expect(flatten({ a: { b: 'x', c: { d: 'y' } }, e: 'z' })).toEqual({
        'a.b': 'x',
        'a.c.d': 'y',
        e: 'z',
      })
      expect(Object.keys(en)).toEqual(expect.arrayContaining(['app.title', 'onboarding.pets.dogs']))
      expect(Object.keys(es)).toEqual(expect.arrayContaining(['app.title', 'onboarding.pets.dogs']))
    })

    it('find interpolation markers', () => {
      expect(interpolations('Hi {{name}}, {{- html}} and {{ spaced }}')).toEqual([
        'html',
        'name',
        'spaced',
      ])
      expect(interpolations(textOf(en['forgot_password.success_message']))).toEqual(['email'])
      expect(interpolations('No markers, only { braces }')).toEqual([])
    })

    it('find component tags', () => {
      expect(
        componentTags('<Bold>Terms</Bold> and <LinkPrivacy>Privacy</LinkPrivacy> <0/>')
      ).toEqual(['</Bold>', '</LinkPrivacy>', '<0/>', '<Bold>', '<LinkPrivacy>'])
      expect(componentTags(textOf(en['login.disclaimer']))).toContain('<LinkCookies>')
      expect(componentTags('No tags, only 1 < 2 and 3 > 2')).toEqual([])
    })
  })

  describe('key parity', () => {
    it('defines in es-ES every key that en-US defines', () => {
      expect(missingKeys(en, es)).toEqual([])
    })

    it('defines in en-US every key that es-ES defines', () => {
      expect(missingKeys(es, en)).toEqual([])
    })
  })

  it('uses the same interpolation markers in both languages', () => {
    expect(keysWithDifferentMarkers(interpolations)).toEqual([])
  })

  it('uses the same component tags in both languages', () => {
    expect(keysWithDifferentMarkers(componentTags)).toEqual([])
  })

  describe.each(locales)('%s', (_language, locale) => {
    it('has no empty texts', () => {
      const emptyKeys = Object.keys(locale).filter(key => !isTranslated(locale, key))
      expect(emptyKeys).toEqual([])
    })

    it('translates every pet type of the onboarding', () => {
      const untranslated = PET_TYPES.map(({ key }) => `onboarding.pets.${key}`).filter(
        key => !isTranslated(locale, key)
      )
      expect(untranslated).toEqual([])
    })

    it('translates every interest of the onboarding', () => {
      const untranslated = INTERESTS.map(({ key }) => `onboarding.interests.${key}`).filter(
        key => !isTranslated(locale, key)
      )
      expect(untranslated).toEqual([])
    })

    it('translates the title and the text of every onboarding slide', () => {
      const untranslated = slides
        .flatMap(({ title, text }) => [`onboarding.${title}`, `onboarding.${text}`])
        .filter(key => !isTranslated(locale, key))
      expect(untranslated).toEqual([])
    })
  })
})
