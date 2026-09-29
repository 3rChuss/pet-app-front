/* global jest */

// The native AsyncStorage module does not exist in Jest: use the official in-memory mock.
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
)
