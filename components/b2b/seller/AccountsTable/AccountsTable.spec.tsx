import React from 'react'

import '@testing-library/jest-dom'
import { composeStories } from '@storybook/testing-react'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import getConfig from 'next/config'

import * as stories from './AccountsTable.stories'
import { renderWithQueryClient } from '@/__test__/utils'
import { AuthContext, DialogRoot, ModalContextProvider } from '@/context'

const { Common } = composeStories(stories)

const { publicRuntimeConfig } = getConfig()

publicRuntimeConfig.debounceTimeout = 1000

jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  useMediaQuery: jest.fn(),
}))

const userContextValues = (isAuthenticated: boolean, userId: number) => ({
  isAuthenticated: isAuthenticated,
  user: {
    id: userId,
    roleName: 'Admin',
  },
  login: jest.fn(),
  createAccount: jest.fn(),
  setAuthError: jest.fn(),
  authError: '',
  logout: jest.fn(),
})
const setB2BContactsSearchParamMock = jest.fn()

const setup = () => {
  renderWithQueryClient(
    <AuthContext.Provider value={userContextValues(true, 1)}>
      <ModalContextProvider>
        <DialogRoot />
        <Common setB2BContactsSearchParam={setB2BContactsSearchParamMock} />
      </ModalContextProvider>
    </AuthContext.Provider>
  )
}

describe('[components] - Accounts Table', () => {
  it('should render the table', () => {
    setup()

    expect(screen.getByText('account-name')).toBeVisible()
    expect(screen.getByText('email')).toBeVisible()
    expect(screen.getByText('address')).toBeVisible()
    expect(screen.getByText('city-or-town')).toBeVisible()
    expect(screen.getByText('state-or-province')).toBeVisible()
    expect(screen.getByText('country-code')).toBeVisible()
    expect(screen.getByText('zip-code')).toBeVisible()
  })

  it('should show no contacts found if contacts are not available', () => {
    renderWithQueryClient(
      <Common
        b2bContacts={{ startIndex: 0, pageSize: 5, pageCount: 1, totalCount: 0, items: [] }}
        setB2BContactsSearchParam={setB2BContactsSearchParamMock}
      />
    )

    expect(screen.getByText('no-contacts-found')).toBeVisible()
  })

  it("should open ContactFilterDialog when 'Filter' button is clicked", async () => {
    setup()

    userEvent.click(screen.getByTestId('filter-button'))

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeVisible()
    })

    await waitFor(() => {
      expect(screen.getByText('apply-filter')).toBeVisible()
    })
  })

  it('should render Search bar and handle search', async () => {
    setup()

    const searchInput = screen.getByPlaceholderText('b2b-account-search-placeholder')

    expect(searchInput).toBeVisible()

    await userEvent.type(searchInput, 'Kibo')

    await waitFor(
      () => {
        expect(setB2BContactsSearchParamMock).toHaveBeenLastCalledWith({
          filter: 'accountName cont Kibo or email cont Kibo or address.address1 cont Kibo',
          startIndex: 0,
        })
      },
      { timeout: 1000000 }
    )
  })
})
