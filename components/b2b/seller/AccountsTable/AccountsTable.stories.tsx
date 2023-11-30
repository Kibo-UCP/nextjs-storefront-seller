import React from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'

import AccountsTable from './AccountsTable'
import { getB2BContactsMock } from '@/__mocks__/stories/getB2BContactsMock'

export default {
  title: 'B2B/Seller/AccountsTable',
  component: AccountsTable,
  argTypes: {
    setB2BContactsSearchParam: { action: 'setB2BContactsSearchParam' },
  },
} as ComponentMeta<typeof AccountsTable>

const Template: ComponentStory<typeof AccountsTable> = (args) => <AccountsTable {...args} />

export const Common = Template.bind({})

Common.args = {
  b2bContacts: getB2BContactsMock,
  filters: {
    address: {
      address1: '',
      cityOrTown: '',
      countryCode: '',
      postalOrZipCode: '',
      stateOrProvince: '',
    },
    email: '',
    accountName: '',
  },
}
