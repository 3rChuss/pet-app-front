import { useState } from 'react'

import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'

import { ErrorBoundary } from '@/components/errors/ErrorBoundary'
import NetworkErrorBanner from '@/components/splash/NetworkErrorBanner'
import { useErrorRecovery } from '@/lib/hooks'

// Simple button component for testing
function TestButton({
  title,
  onPress,
  disabled = false,
}: {
  title: string
  onPress: () => void
  disabled?: boolean
}) {
  return (
    <TouchableOpacity
      style={[styles.testButton, disabled && styles.disabledButton]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.buttonText, disabled && styles.disabledText]}>{title}</Text>
    </TouchableOpacity>
  )
}

// Component that can throw errors for testing
function ErrorThrowingComponent({ errorType }: { errorType: string }) {
  const [shouldThrow, setShouldThrow] = useState(false)

  if (shouldThrow) {
    throw new Error(`Test ${errorType} error for testing error boundary`)
  }

  return (
    <View style={styles.testSection}>
      <Text style={styles.testTitle}>Error Boundary Test: {errorType}</Text>
      <TestButton title="Trigger Error" onPress={() => setShouldThrow(true)} />
    </View>
  )
}

export default function ErrorRecoveryTest() {
  const {
    reportError,
    executeWithRetry,
    recoveryState,
    startRecovery,
    clearError,
    getStoredErrors,
    clearStoredErrors,
  } = useErrorRecovery()

  const [networkOffline, setNetworkOffline] = useState(false)
  const [testResults, setTestResults] = useState<string[]>([])

  const addTestResult = (result: string) => {
    setTestResults(prev => [`${new Date().toLocaleTimeString()}: ${result}`, ...prev.slice(0, 9)])
  }

  const testNetworkError = async () => {
    try {
      await reportError('network', new Error('Simulated network error'), {
        endpoint: '/api/test',
        method: 'GET',
      })
      addTestResult('Network error reported successfully')
    } catch (error) {
      addTestResult(`Network error test failed: ${error}`)
    }
  }

  const testRetryMechanism = async () => {
    try {
      let attemptCount = 0
      const result = await executeWithRetry(
        async () => {
          attemptCount++
          if (attemptCount < 3) {
            throw new Error(`Attempt ${attemptCount} failed`)
          }
          return `Success after ${attemptCount} attempts`
        },
        'network',
        { testOperation: true }
      )
      addTestResult(`Retry test: ${result}`)
    } catch (error) {
      addTestResult(`Retry test failed: ${error}`)
    }
  }

  const testFontLoadingError = async () => {
    try {
      await reportError('font-loading', new Error('Failed to load custom font'), {
        fontFamily: 'CustomFont',
        fallbackFont: 'system',
      })
      addTestResult('Font loading error reported successfully')
    } catch (error) {
      addTestResult(`Font loading error test failed: ${error}`)
    }
  }

  const testCriticalError = async () => {
    try {
      await reportError('critical', new Error('Critical system failure'), {
        component: 'ErrorRecoveryTest',
        action: 'testCriticalError',
      })
      addTestResult('Critical error reported successfully')
    } catch (error) {
      addTestResult(`Critical error test failed: ${error}`)
    }
  }

  const viewStoredErrors = async () => {
    try {
      const errors = await getStoredErrors()
      addTestResult(`Found ${errors.length} stored errors`)
      console.log('Stored errors:', errors)
    } catch (error) {
      addTestResult(`Failed to retrieve stored errors: ${error}`)
    }
  }

  const clearAllErrors = async () => {
    try {
      await clearStoredErrors()
      clearError()
      addTestResult('All errors cleared successfully')
    } catch (error) {
      addTestResult(`Failed to clear errors: ${error}`)
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Error Recovery System Test</Text>

      {networkOffline && (
        <NetworkErrorBanner
          onRetry={() => {
            setNetworkOffline(false)
            addTestResult('Network connection restored')
          }}
        />
      )}

      {recoveryState.error && (
        <View style={styles.errorStatus}>
          <Text style={styles.errorStatusTitle}>Current Error State:</Text>
          <Text style={styles.errorStatusText}>Type: {recoveryState.error.type}</Text>
          <Text style={styles.errorStatusText}>Severity: {recoveryState.error.severity}</Text>
          <Text style={styles.errorStatusText}>Strategy: {recoveryState.error.strategy}</Text>
          <Text style={styles.errorStatusText}>Retry Count: {recoveryState.error.retryCount}</Text>
          <Text style={styles.errorStatusText}>
            Message: {recoveryState.error.userFriendlyMessage}
          </Text>

          <View style={styles.errorActions}>
            <TestButton
              title="Start Recovery"
              onPress={() => startRecovery()}
              disabled={recoveryState.isRecovering}
            />
            <TestButton title="Clear Error" onPress={clearError} />
          </View>
        </View>
      )}

      <View style={styles.testSection}>
        <Text style={styles.sectionTitle}>Error Reporting Tests</Text>

        <TestButton title="Test Network Error" onPress={testNetworkError} />

        <TestButton title="Test Retry Mechanism" onPress={testRetryMechanism} />

        <TestButton title="Test Font Loading Error" onPress={testFontLoadingError} />

        <TestButton title="Test Critical Error" onPress={testCriticalError} />

        <TestButton
          title="Simulate Network Offline"
          onPress={() => {
            setNetworkOffline(true)
            addTestResult('Network set to offline mode')
          }}
        />
      </View>

      <View style={styles.testSection}>
        <Text style={styles.sectionTitle}>Error Boundary Tests</Text>

        <ErrorBoundary>
          <ErrorThrowingComponent errorType="Network" />
        </ErrorBoundary>

        <ErrorBoundary>
          <ErrorThrowingComponent errorType="Critical" />
        </ErrorBoundary>
      </View>

      <View style={styles.testSection}>
        <Text style={styles.sectionTitle}>Error Management</Text>

        <TestButton title="View Stored Errors" onPress={viewStoredErrors} />

        <TestButton title="Clear All Errors" onPress={clearAllErrors} />
      </View>

      <View style={styles.resultsSection}>
        <Text style={styles.sectionTitle}>Test Results</Text>
        {testResults.map((result, index) => (
          <Text key={index} style={styles.resultText}>
            {result}
          </Text>
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#444',
  },
  testSection: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  testTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#555',
  },
  testButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledText: {
    color: '#666666',
  },
  errorStatus: {
    backgroundColor: '#ffebee',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  errorStatusTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#c62828',
  },
  errorStatusText: {
    fontSize: 14,
    marginBottom: 4,
    color: '#666',
  },
  errorActions: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  resultsSection: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  resultText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#495057',
    marginBottom: 4,
    paddingVertical: 2,
  },
})
