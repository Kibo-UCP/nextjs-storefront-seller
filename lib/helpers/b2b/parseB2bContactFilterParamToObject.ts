import { B2bContactsFilters } from '@/lib/types'

import { CrAddress } from '@/lib/gql/types'

export const parseB2bContactFilterParamToObject = (filterParam: string): B2bContactsFilters => {
  const filters: B2bContactsFilters & { others: string } = {
    accountName: '',
    email: '',
    address: {
      address1: '',
      cityOrTown: '',
      stateOrProvince: '',
      countryCode: '',
      postalOrZipCode: '',
    },
    others: '',
  }

  if (!filterParam) {
    return filters
  }

  const conditions = filterParam?.split(' and ')

  for (const condition of conditions) {
    if (condition.includes('email eq')) {
      filters.email = condition.split('email eq ')[1]
    } else if (condition.includes('accountName eq')) {
      filters.accountName = condition.split('accountName eq ')[1]
    } else if (condition.split('eq')[0].includes('address')) {
      filters.address[condition.split('eq')[0].split('.')[1]?.trim() as keyof CrAddress] = condition
        .split('eq')[1]
        ?.trim()
    } else {
      filters.others = condition
    }
  }

  return filters
}
