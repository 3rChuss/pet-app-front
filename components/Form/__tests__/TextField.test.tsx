import { createRef } from 'react'

import { render, screen, userEvent } from '@testing-library/react-native'
import { Text, type TextInput } from 'react-native'

import TextField from '@/components/Form/TextField'

const user = userEvent.setup()

describe('TextField', () => {
  it('shows the error message under the field', async () => {
    await render(<TextField placeholder="Email" error="The email is invalid" />)

    expect(screen.getByPlaceholderText('Email')).toBeOnTheScreen()
    expect(screen.getByText('The email is invalid')).toBeOnTheScreen()
  })

  it('shows no message when the field has no error', async () => {
    await render(<TextField placeholder="Email" />)

    expect(screen.getByPlaceholderText('Email')).toBeOnTheScreen()
    expect(screen.queryByText(/.+/)).not.toBeOnTheScreen()
  })

  it('forwards onChangeText, onFocus and onBlur to the input', async () => {
    const onChangeText = jest.fn()
    const onFocus = jest.fn()
    const onBlur = jest.fn()
    await render(
      <TextField
        placeholder="Username"
        onChangeText={onChangeText}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    )

    // Typing focuses the input first and leaves it at the end.
    await user.type(screen.getByPlaceholderText('Username'), 'rex')

    expect(onFocus).toHaveBeenCalledTimes(1)
    expect(onChangeText.mock.calls).toEqual([['r'], ['re'], ['rex']])
    expect(onBlur).toHaveBeenCalledTimes(1)
  })

  it('forwards the other props of TextInput, such as the value and the keyboard type', async () => {
    await render(
      <TextField placeholder="Email" value="rex@example.com" keyboardType="email-address" />
    )

    const input = screen.getByPlaceholderText('Email')
    expect(input).toHaveDisplayValue('rex@example.com')
    expect(input).toHaveProp('keyboardType', 'email-address')
  })

  it('does not accept text when it is not editable', async () => {
    const onChangeText = jest.fn()
    await render(<TextField placeholder="Username" editable={false} onChangeText={onChangeText} />)

    await user.type(screen.getByPlaceholderText('Username'), 'rex')

    expect(onChangeText).not.toHaveBeenCalled()
  })

  it('forwards the ref to the input', async () => {
    const ref = createRef<TextInput>()
    await render(<TextField ref={ref} placeholder="Username" />)

    expect(ref.current).not.toBeNull()
  })

  it('shows the adornment next to the input', async () => {
    await render(<TextField placeholder="Username" endAdornment={<Text>Adornment</Text>} />)

    expect(screen.getByPlaceholderText('Username')).toBeOnTheScreen()
    expect(screen.getByText('Adornment')).toBeOnTheScreen()
  })
})
