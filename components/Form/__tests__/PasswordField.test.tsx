import { render, screen, userEvent, waitFor } from '@testing-library/react-native'

import PasswordField from '@/components/Form/PasswordField'
import i18n from '@/services/i18n'
import enUS from '@/services/i18n/locales/en-US.json'

// Expected texts come from the locale file so the tests follow copy changes.
const texts = enUS.common

const user = userEvent.setup()

const showButton = () => screen.getByRole('button', { name: texts.show_password })
const hideButton = () => screen.getByRole('button', { name: texts.hide_password })

describe('PasswordField', () => {
  beforeAll(async () => {
    // services/i18n starts initialising when it is imported and does not expose the promise.
    // The language is set explicitly instead of relying on the device locale of the mock.
    await waitFor(() => expect(i18n.isInitialized).toBe(true))
    await i18n.changeLanguage('en-US')
  })

  it('hides the password at first and offers to show it', async () => {
    await render(<PasswordField placeholder="Password" />)

    expect(screen.getByPlaceholderText('Password')).toHaveProp('secureTextEntry', true)
    expect(showButton()).toBeOnTheScreen()
    expect(screen.queryByRole('button', { name: texts.hide_password })).not.toBeOnTheScreen()
  })

  it('shows and hides the password each time the button is pressed', async () => {
    await render(<PasswordField placeholder="Password" />)
    const input = screen.getByPlaceholderText('Password')

    await user.press(showButton())
    expect(input).toHaveProp('secureTextEntry', false)
    // The button now offers the opposite action.
    expect(screen.queryByRole('button', { name: texts.show_password })).not.toBeOnTheScreen()

    await user.press(hideButton())
    expect(input).toHaveProp('secureTextEntry', true)
    expect(showButton()).toBeOnTheScreen()
  })

  it('forwards the props of TextField, such as the change handler and the error message', async () => {
    const onChangeText = jest.fn()
    await render(
      <PasswordField
        placeholder="Password"
        onChangeText={onChangeText}
        error="The password is required"
      />
    )

    await user.type(screen.getByPlaceholderText('Password'), 'a')

    expect(onChangeText).toHaveBeenLastCalledWith('a')
    expect(screen.getByText('The password is required')).toBeOnTheScreen()
  })

  it('disables the button and the input when the field is not editable', async () => {
    await render(<PasswordField placeholder="Password" editable={false} />)

    expect(showButton()).toBeDisabled()
    expect(screen.getByPlaceholderText('Password')).toHaveProp('editable', false)
  })
})
