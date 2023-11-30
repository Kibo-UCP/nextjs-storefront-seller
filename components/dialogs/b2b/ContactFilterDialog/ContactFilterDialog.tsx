import React, { useState } from 'react'

import { Button, Grid, Stack, useMediaQuery, useTheme } from '@mui/material'
import { useTranslation } from 'next-i18next'

import { KiboDialog, KiboTextBox } from '@/components/common'
import { B2bContactsFilters, QuoteFilters } from '@/lib/types'

interface ContactsFilterDialogProps {
  filters: B2bContactsFilters
  onFilterAction: (val: QuoteFilters) => void
  closeModal: () => void
}

interface ContactsFilterActionsProps {
  onApply: () => void
  onClear: () => void
}

interface ContactsFilterContentProps {
  filterValues: B2bContactsFilters
  onFilterInput: (value: string, field: string) => void
}
const ContactFilterContent = (props: ContactsFilterContentProps) => {
  const { filterValues, onFilterInput } = props
  const { t } = useTranslation('common')

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={4}>
        <KiboTextBox
          label={t('city-or-town')}
          placeholder={t('search')}
          defaultValue={filterValues?.address?.cityOrTown || ''}
          name="cityOrTown"
          onChange={(name, value) => onFilterInput(value, name)}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <KiboTextBox
          label={t('state-or-province')}
          placeholder={t('search')}
          name="stateOrProvince"
          defaultValue={filterValues?.address?.stateOrProvince || ''}
          onChange={(name, value) => onFilterInput(value, name)}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <KiboTextBox
          label={t('country-code')}
          placeholder={t('search')}
          name="countryCode"
          defaultValue={filterValues?.address?.countryCode || ''}
          onChange={(name, value) => onFilterInput(value, name)}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <KiboTextBox
          label={t('postal-or-zip-code')}
          placeholder={t('search')}
          name="postalOrZipCode"
          defaultValue={filterValues?.address?.postalOrZipCode || ''}
          onChange={(name, value) => onFilterInput(value, name)}
        />
      </Grid>
    </Grid>
  )
}

const ContactFilterActions = (props: ContactsFilterActionsProps) => {
  const { onApply, onClear } = props
  const { t } = useTranslation('common')
  const theme = useTheme()
  const tabAndDesktop = useMediaQuery(theme.breakpoints.up('sm'))

  return (
    <Stack gap={2} width="100%" direction={tabAndDesktop ? 'row' : 'column'}>
      <Button
        name="clear"
        sx={{ width: '100%' }}
        variant="contained"
        color="secondary"
        onClick={onClear}
      >
        {t('clear')}
      </Button>
      <Button name="confirm" sx={{ width: '100%' }} variant="contained" onClick={onApply}>
        {t('apply')}
      </Button>
    </Stack>
  )
}

// Component
const ContactFilterDialog = (props: ContactsFilterDialogProps) => {
  const { filters, onFilterAction, closeModal } = props
  const { t } = useTranslation('common')

  const [filterValues, setFilterValues] = useState<B2bContactsFilters>(filters)

  const handleFilterInput = (value: string, field: string) => {
    setFilterValues({
      ...filterValues,
      address: {
        ...filterValues.address,
        [field]: value,
      },
    })
  }

  const handleFilterApply = () => {
    onFilterAction(filterValues)
    closeModal()
  }

  const handleFilterClear = () => {
    const clearedValues = {
      ...filterValues,
      address: {
        ...filterValues.address,
        cityOrTown: '',
        stateOrProvince: '',
        countryCode: '',
        postalOrZipCode: '',
      },
    }
    setFilterValues(clearedValues)
    onFilterAction(clearedValues)
    closeModal()
  }

  const DialogArgs = {
    Title: t('apply-filter'),
    Content: <ContactFilterContent filterValues={filterValues} onFilterInput={handleFilterInput} />,
    showContentTopDivider: true,
    showContentBottomDivider: false,
    Actions: <ContactFilterActions onApply={handleFilterApply} onClear={handleFilterClear} />,
    isDialogCentered: true,
    customMaxWidth: '32.375rem',
    onClose: () => closeModal(),
  }

  return <KiboDialog {...DialogArgs} />
}
export default ContactFilterDialog
