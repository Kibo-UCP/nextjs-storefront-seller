import { B2bContactsFilters } from '@/lib/types'

export const buildB2bContactFilterParam = (filters: B2bContactsFilters): string => {
  let conditions: string[] = []

  if (filters.accountName || filters.email || filters.address.address1) {
    if (filters.accountName) {
      conditions.push(`accountName cont ${filters.accountName}`)
    }

    if (filters.email) {
      conditions.push(`email cont ${filters.email}`)
    }
    if (filters.address.address1) {
      conditions.push(`address.address1 cont ${filters.address.address1}`)
    }

    conditions = [conditions.join(' or ')]
  }

  if (filters.others) {
    conditions.push(filters.others)
  }

  if (filters.address.cityOrTown) {
    conditions.push(`address.cityOrTown cont ${filters.address.cityOrTown}`)
  }
  if (filters.address.stateOrProvince) {
    conditions.push(`address.stateOrProvince cont ${filters.address.stateOrProvince}`)
  }
  if (filters.address.countryCode) {
    conditions.push(`address.countryCode cont ${filters.address.countryCode}`)
  }
  if (filters.address.postalOrZipCode) {
    conditions.push(`address.postalOrZipCode cont ${filters.address.postalOrZipCode}`)
  }

  return conditions.join(' and ')
}
