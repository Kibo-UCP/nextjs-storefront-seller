import React from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'

import SellerQuoteActions from './SellerQuoteActions'
import { quoteMock } from '@/__mocks__/stories'
import { QuoteStatus } from '@/lib/constants'

import { Quote } from '@/lib/gql/types'

// Common
export default {
  title: 'B2B/Quotes/SellerQuoteActions',
  component: SellerQuoteActions,

  argTypes: {
    handleClearChanges: { handleClearChanges: { action: 'handleClearChanges' } },
    handleEditQuote: { handleEditQuote: { action: 'handleEditQuote' } },
    handleSubmitForApproval: { handleSubmitForApproval: { action: 'handleSubmitForApproval' } },
    handleGotoCheckout: { handleGotoCheckout: { action: 'handleGotoCheckout' } },
    handlePrint: { handlePrint: { action: 'handlePrint' } },
    mode: {
      options: ['create', 'edit', ''],
      control: { type: 'radio' },
    },
    status: {
      table: {
        disable: true,
      },
    },
  },
} as ComponentMeta<typeof SellerQuoteActions>

const Template: ComponentStory<typeof SellerQuoteActions> = (args) => (
  <SellerQuoteActions {...args} />
)

export const Pending = Template.bind({})
Pending.args = {
  hasDraft: true,
  mode: 'edit',
  status: 'Pending',
  isSubmitForApprovalEnabled: false,
}
export const InReview = Template.bind({})
InReview.args = {
  ...Pending.args,
  status: 'InReview',
}
export const ReadyForCheckout = Template.bind({})
ReadyForCheckout.args = {
  ...Pending.args,
  status: 'ReadyForCheckout',
}
export const Completed = Template.bind({})
Completed.args = {
  ...Pending.args,
  status: 'Completed',
}
export const Expired = Template.bind({})
Expired.args = {
  ...Pending.args,
  status: 'Expired',
}
