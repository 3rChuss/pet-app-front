const path = require('path')

// Depending on the lockfile, npm may install dependencies of `expo` (expo-modules-core,
// expo-file-system...) nested under node_modules/expo/node_modules. The setup file of jest-expo
// requires some of them from its own location, where Node cannot see nested ones ("Cannot find
// module 'expo-modules-core'"), so that folder is added as a last-resort lookup path. Modules
// installed at the top level still take precedence.
const expoNestedModules = path.join(
  path.dirname(require.resolve('expo/package.json')),
  'node_modules'
)

/** @type {import('jest').Config} */
module.exports = {
  // jest-expo provides the React Native environment, the Babel transform (it extends
  // babel.config.js, so the NativeWind JSX runtime and the `@/*` alias from tsconfig.json work in
  // tests) and the asset transformer.
  // NativeWind needs no extra setup in Jest, but Tailwind classes are not compiled there (Metro
  // does it): `className` reaches the rendered elements unresolved, so assert on roles, texts and
  // behavior, never on styles that come from classes.
  preset: 'jest-expo',
  setupFiles: ['<rootDir>/jest.setup.js'],
  modulePaths: [expoNestedModules],
  moduleNameMapper: {
    // lucide-react-native lists its ESM build (.mjs) under the "react-native" export condition,
    // which Jest picks first. The jest-expo transform skips .mjs files, so loading it fails with
    // "Unexpected token 'export'". Node resolution picks the CommonJS build instead.
    '^lucide-react-native$': require.resolve('lucide-react-native'),
  },
  // Tests live in `__tests__/` folders next to the code they cover. Never put them inside
  // `app/`: expo-router would treat every file there as a route.
  testMatch: ['**/__tests__/**/*.test.{ts,tsx}'],
  // Start every test with fresh mock call history (implementations are kept).
  clearMocks: true,
  // The first render of each test file lazily loads a large part of react-native, which takes
  // 2-3 s on a fast machine and more on a cold CI runner. The default of 5 s leaves little margin.
  testTimeout: 15000,
}
