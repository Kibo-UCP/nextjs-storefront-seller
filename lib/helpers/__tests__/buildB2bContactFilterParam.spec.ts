import { buildB2bContactFilterParam } from '../b2b/buildB2bContactFilterParam' // Adjust the import path accordingly
import { B2bContactsFilters } from '@/lib/types'

describe('buildB2bContactFilterParam', () => {
  it('should build filter string with accountName, email and address.address1', () => {
    const filters: B2bContactsFilters = {
      accountName: 'Esther',
      email: 'test@example.com',
      address: {
        address1: '123 Main Street',
      },
    }
    const result = buildB2bContactFilterParam(filters)
    expect(result).toBe(
      'accountName cont Esther or email cont test@example.com or address.address1 cont 123 Main Street'
    )
  })

  it('should build filter string with pre existing filter', () => {
    const filters: B2bContactsFilters = {
      others: 'salesrep.userid eq 12345678',
      email: '',
      accountName: '',
      address: {},
    }
    const result = buildB2bContactFilterParam(filters)
    expect(result).toBe('salesrep.userid eq 12345678')
  })

  it('should build filter string with address details', () => {
    const filters: B2bContactsFilters = {
      address: {
        cityOrTown: 'City',
        stateOrProvince: 'State',
        countryCode: 'US',
        postalOrZipCode: '12345',
      },
      email: '',
      accountName: '',
    }
    const result = buildB2bContactFilterParam(filters)
    expect(result).toBe(
      'address.cityOrTown cont City and address.stateOrProvince cont State and ' +
        'address.countryCode cont US and address.postalOrZipCode cont 12345'
    )
  })

  it('should build filter string with multiple conditions', () => {
    const filters: B2bContactsFilters = {
      email: 'test@example.com',
      accountName: '',
      address: {
        address1: '123 Main Street',
        cityOrTown: 'City',
      },
    }
    const result = buildB2bContactFilterParam(filters)
    expect(result).toBe(
      'email cont test@example.com or address.address1 cont 123 Main Street and address.cityOrTown cont City'
    )
  })

  it('should handle empty filters', () => {
    const filters: B2bContactsFilters = {
      address: {},
      email: '',
      accountName: '',
    }
    const result = buildB2bContactFilterParam(filters)
    expect(result).toBe('')
  })
})
