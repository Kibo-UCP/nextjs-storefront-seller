import '@testing-library/jest-dom'
import { waitFor } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'

import { useHandleB2BContacts } from './useHandleB2BContacts'
import { createQueryClientWrapper } from '@/__test__/utils'

jest.mock('@/context/AuthContext', () => ({
  useAuthContext: () => ({ isAuthenticated: true, user: { id: 1 } }),
}))

const initialData = { pageCount: 5, totalCount: 400, items: [], pageSize: 10, startIndex: 10 }

describe('useHandleB2BContacts', () => {
  it('should return key value pairs of userId and email Address', async () => {
    const { result } = renderHook(
      () =>
        useHandleB2BContacts({
          salesRepUserId: '1',
          b2bContacts: initialData,
        }),
      {
        wrapper: createQueryClientWrapper(),
      }
    )

    await waitFor(() => {
      expect(result.current.b2bContactsSearchParam).toEqual({
        filter: 'salesrep.userid eq 1',
        pageSize: initialData?.pageSize,
        sortBy: 'email asc',
        startIndex: initialData?.startIndex,
        q: '',
      })
    })
  })
})
