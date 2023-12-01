import { composeStories } from '@storybook/testing-react'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import * as stories from './ContactFilterDialog.stories'
import { renderWithQueryClient } from '@/__test__/utils'

const { Common } = composeStories(stories)
const user = userEvent.setup()

const onFilterActionMock = jest.fn()
const closeModalMock = jest.fn()

describe('[components]  ContactsFilterDialog', () => {
  it('should render ContactsFilterDialog component', () => {
    renderWithQueryClient(
      <Common closeModal={closeModalMock} onFilterAction={onFilterActionMock} />
    )

    expect(screen.getByRole('textbox', { name: 'city-or-town' })).toBeVisible()
    expect(screen.getByRole('textbox', { name: 'state-or-province' })).toBeVisible()
    expect(screen.getByRole('textbox', { name: 'country-code' })).toBeVisible()
    expect(screen.getByRole('textbox', { name: 'postal-or-zip-code' })).toBeVisible()
  })

  it('should handle applying filters', async () => {
    renderWithQueryClient(
      <Common closeModal={closeModalMock} onFilterAction={onFilterActionMock} />
    )

    const city = screen.getByRole('textbox', { name: 'city-or-town' })
    const state = screen.getByRole('textbox', { name: 'state-or-province' })
    const country = screen.getByRole('textbox', { name: 'country-code' })
    const zipCode = screen.getByRole('textbox', { name: 'postal-or-zip-code' })

    await user.type(city, 'Austin')
    await user.type(state, 'TX')
    await user.type(country, 'US')
    await user.type(zipCode, '73029')

    await user.click(screen.getByRole('button', { name: 'apply' }))

    await waitFor(() => {
      expect(onFilterActionMock).toHaveBeenLastCalledWith({
        address: {
          address1: '',
          cityOrTown: 'Austin',
          countryCode: 'US',
          postalOrZipCode: '73029',
          stateOrProvince: 'TX',
        },
        email: '',
        accountName: '',
      })
    })
  })

  it('should handle clear filters', async () => {
    renderWithQueryClient(
      <Common
        filters={{
          address: {
            address1: '',
            cityOrTown: 'Austin',
            countryCode: 'US',
            postalOrZipCode: '73029',
            stateOrProvince: 'TX',
          },
          email: '',
          accountName: '',
        }}
        closeModal={closeModalMock}
        onFilterAction={onFilterActionMock}
      />
    )

    const city = screen.getByRole('textbox', { name: 'city-or-town' })
    const state = screen.getByRole('textbox', { name: 'state-or-province' })
    const country = screen.getByRole('textbox', { name: 'country-code' })
    const zipCode = screen.getByRole('textbox', { name: 'postal-or-zip-code' })

    expect(city).toHaveValue('Austin')
    expect(state).toHaveValue('TX')
    expect(country).toHaveValue('US')
    expect(zipCode).toHaveValue('73029')

    await user.click(screen.getByRole('button', { name: 'clear' }))

    await waitFor(() => {
      expect(onFilterActionMock).toHaveBeenLastCalledWith(Common.args?.filters)
    })
  })
})
