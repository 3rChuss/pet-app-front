import { render, screen, userEvent } from '@testing-library/react-native'

import Button from '@/components/Button/Button'

const user = userEvent.setup()

describe('Button', () => {
  it('shows its label and is exposed as an enabled button named after it', async () => {
    await render(<Button label="Save" onPress={jest.fn()} />)

    expect(screen.getByText('Save')).toBeOnTheScreen()
    const button = screen.getByRole('button', { name: 'Save' })
    expect(button).toBeOnTheScreen()
    expect(button).toBeEnabled()
    expect(button).not.toBeBusy()
  })

  it('calls onPress once each time it is pressed', async () => {
    const onPress = jest.fn()
    await render(<Button label="Save" onPress={onPress} />)

    await user.press(screen.getByRole('button', { name: 'Save' }))
    expect(onPress).toHaveBeenCalledTimes(1)

    await user.press(screen.getByRole('button', { name: 'Save' }))
    expect(onPress).toHaveBeenCalledTimes(2)
  })

  it('reports itself disabled and ignores presses when disabled', async () => {
    const onPress = jest.fn()
    await render(<Button label="Save" onPress={onPress} disabled />)

    const button = screen.getByRole('button', { name: 'Save' })
    expect(button).toBeDisabled()
    expect(button).not.toBeBusy()

    await user.press(button)
    expect(onPress).not.toHaveBeenCalled()
  })

  it('reports itself busy and ignores presses while loading', async () => {
    const onPress = jest.fn()
    await render(<Button label="Save" onPress={onPress} isLoading />)

    const button = screen.getByRole('button', { name: 'Save' })
    expect(button).toBeBusy()
    expect(button).toBeDisabled()

    await user.press(button)
    expect(onPress).not.toHaveBeenCalled()
  })
})
