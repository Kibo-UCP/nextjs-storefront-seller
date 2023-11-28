import React from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'

import B2bContactsFilterDialog from './B2bContactsFilterDialog'

export default {
  title: 'Dialogs/B2B/B2bContactsFilterDialog',
  component: B2bContactsFilterDialog,
  argTypes: { closeModal: { action: 'closeModal' }, onFilterAction: { action: 'onFilterAction' } },
} as ComponentMeta<typeof B2bContactsFilterDialog>

const Template: ComponentStory<typeof B2bContactsFilterDialog> = ({ ...args }) => (
  <B2bContactsFilterDialog {...args} />
)

// Common
export const Common = Template.bind({})

Common.args = {
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
