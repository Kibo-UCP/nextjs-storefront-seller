import React, { useEffect, useState } from 'react'

import FilterList from '@mui/icons-material/FilterList'
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material'
import getConfig from 'next/config'
import { useTranslation } from 'next-i18next'

import { AccountsTableStyles } from './AccountsTable.styles'
import { KiboPagination, SearchBar } from '@/components/common'
import { ContactFilterDialog } from '@/components/dialogs'
import { useModalContext } from '@/context'
import { useDebounce } from '@/hooks'
import { addressGetters } from '@/lib/getters'
import { buildB2bContactFilterParam } from '@/lib/helpers'
import { B2bContactsFilters } from '@/lib/types'

import type { QueryQuotesArgs } from '@/lib/gql/types'

interface AccountsTableProps {
  b2bContacts: {
    startIndex: number
    pageSize: number
    totalCount: number
    pageCount: number
    items: any[]
  }
  filters?: B2bContactsFilters
  setB2BContactsSearchParam: (param: QueryQuotesArgs) => void
}

const AccountsTable = (props: AccountsTableProps) => {
  const { b2bContacts, filters, setB2BContactsSearchParam } = props

  const { publicRuntimeConfig } = getConfig()

  const { showModal } = useModalContext()

  const { t } = useTranslation('common')

  const columns = [
    {
      field: 'accountName',
      headerName: t('account-name'),
    },
    {
      field: 'email',
      headerName: t('email'),
    },
    {
      field: 'address',
      headerName: t('address'),
    },
    {
      field: 'city',
      headerName: t('city-or-town'),
    },
    {
      field: 'state',
      headerName: t('state-or-province'),
    },
    {
      field: 'country',
      headerName: t('country-code'),
    },
    {
      field: 'zipcode',
      headerName: t('zip-code'),
    },
  ]

  const [searchTerm, setSearchTerm] = useState('')
  const debouncedTerm = useDebounce(searchTerm, publicRuntimeConfig.debounceTimeout)

  const handleFilterAction = (filters: B2bContactsFilters) => {
    setB2BContactsSearchParam({ filter: buildB2bContactFilterParam(filters), startIndex: 0 })
  }

  const handleFilterButtonClick = () => {
    showModal({
      Component: ContactFilterDialog,
      props: {
        filters: filters,
        onFilterAction: handleFilterAction,
      },
    })
  }

  const handleAccountSearch = (term: string) => {
    setSearchTerm(term)
  }

  const b2bContactsPaginationDetails = {
    count: b2bContacts?.pageCount,
    startIndex: b2bContacts?.startIndex,
    pageSize: b2bContacts?.pageSize,
  }

  useEffect(() => {
    handleFilterAction({
      ...filters,
      address: {
        ...filters?.address,
        address1: debouncedTerm.trim(),
      },
      email: debouncedTerm.trim(),
      accountName: debouncedTerm.trim(),
    })
  }, [debouncedTerm])

  return (
    <>
      <Box sx={AccountsTableStyles.container}>
        <Box width="100%">
          <SearchBar
            placeHolder={t('b2b-account-search-placeholder')}
            searchTerm={searchTerm}
            onSearch={handleAccountSearch}
            showClearButton
          />
        </Box>
        <Box sx={AccountsTableStyles.filterBar}>
          <Box>
            <Tooltip title="Filter list">
              <IconButton onClick={handleFilterButtonClick} data-testid="filter-button">
                <FilterList />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ maxWidth: '100%' }} aria-label="quick order table">
          <TableHead>
            <TableRow
              sx={{
                '&:nth-of-type(odd)': {
                  backgroundColor: 'grey.100',
                },
              }}
            >
              {columns.map((column) => (
                <TableCell component={'th'} key={column.field} sx={{ fontWeight: 700 }}>
                  {t(column.headerName)}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          {b2bContacts?.items?.length === 0 ? (
            <caption>{t('no-contacts-found')}</caption>
          ) : (
            <TableBody data-testid="quotes-table-body">
              {b2bContacts?.items?.map((contact) => {
                const { id, accountName, email, address, city, country, state, zipCode } =
                  addressGetters.getB2BContactDetails(contact)
                return (
                  <TableRow
                    key={id}
                    sx={{
                      ...AccountsTableStyles.tableRow,
                      cursor: 'pointer',
                    }}
                    // onClick={() => router.push(`/my-account/b2b/quote/${quoteId}`)}
                  >
                    <TableCell component="td" scope="row">
                      <Typography variant="body2" data-testid={`quote-number`}>
                        {accountName}
                      </Typography>
                    </TableCell>
                    <TableCell component="td" scope="row" sx={{ whiteSpace: 'break-spaces' }}>
                      <Typography variant="body2" data-testid={`email`}>
                        {email}
                      </Typography>
                    </TableCell>
                    <TableCell component="td" scope="row">
                      <Typography variant="body2" data-testid={`address`}>
                        {address}
                      </Typography>
                    </TableCell>
                    <TableCell component="td" scope="row">
                      <Typography variant="body2" data-testid={`city`}>
                        {city}
                      </Typography>
                    </TableCell>
                    <TableCell component="td" scope="row">
                      <Typography variant="body2" data-testid={`state`}>
                        {state}
                      </Typography>
                    </TableCell>
                    <TableCell component="td" scope="row">
                      <Typography variant="body2" data-testid={`country`}>
                        {country}
                      </Typography>
                    </TableCell>
                    <TableCell component="td" scope="row">
                      <Typography variant="body2" data-testid={`zipCode`}>
                        {zipCode}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          )}
        </Table>
      </TableContainer>
      <Box py={2}>
        <KiboPagination
          {...b2bContactsPaginationDetails}
          onPaginationChange={setB2BContactsSearchParam}
        />
      </Box>
    </>
  )
}

export default AccountsTable
