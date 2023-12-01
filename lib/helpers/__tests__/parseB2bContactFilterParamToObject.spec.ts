import { parseB2bContactFilterParamToObject } from '../b2b/parseB2bContactFilterParamToObject' // Adjust the import path accordingly
import { B2bContactsFilters } from '@/lib/types'

describe('parseB2bContactFilterParamToObject', () => {
  it('should parse filter string with email and address.address1', () => {
    const filterParam = 'email eq test@example.com and address.address1 eq 123 Main Street'
    const result: B2bContactsFilters = parseB2bContactFilterParamToObject(filterParam)
    expect(result).toEqual({
      email: 'test@example.com',
      address: {
        address1: '123 Main Street',
        cityOrTown: '',
        stateOrProvince: '',
        countryCode: '',
        postalOrZipCode: '',
      },
      others: '',
    })
  })

  it('should parse filter string with others', () => {
    const filterParam = 'salesrep.userid eq 12345678'
    const result: B2bContactsFilters = parseB2bContactFilterParamToObject(filterParam)
    expect(result).toEqual({
      email: '',
      address: {
        address1: '',
        cityOrTown: '',
        stateOrProvince: '',
        countryCode: '',
        postalOrZipCode: '',
      },
      others: 'salesrep.userid eq 12345678',
    })
  })

  it('should parse filter string with address details', () => {
    const filterParam =
      'address.cityOrTown eq City and address.stateOrProvince eq State and address.countryCode eq US and address.postalOrZipCode eq 12345'
    const result: B2bContactsFilters = parseB2bContactFilterParamToObject(filterParam)
    expect(result).toEqual({
      email: '',
      address: {
        address1: '',
        cityOrTown: 'City',
        stateOrProvince: 'State',
        countryCode: 'US',
        postalOrZipCode: '12345',
      },
      others: '',
    })
  })

  it('should handle empty filterParam', () => {
    const filterParam = ''
    const result: B2bContactsFilters = parseB2bContactFilterParamToObject(filterParam)
    expect(result).toEqual({
      email: '',
      address: {
        address1: '',
        cityOrTown: '',
        stateOrProvince: '',
        countryCode: '',
        postalOrZipCode: '',
      },
      others: '',
    })
  })
})
