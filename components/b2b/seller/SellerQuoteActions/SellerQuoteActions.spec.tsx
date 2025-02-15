import React from 'react'

import '@testing-library/jest-dom'
import { composeStories } from '@storybook/testing-react'
import { cleanup, render, screen } from '@testing-library/react'

import * as stories from './SellerQuoteActions.stories'

const { Pending, InReview, ReadyForCheckout, Completed, Expired } = composeStories(stories)

jest.mock('@/lib/helpers/hasPermission', () => ({
  hasPermission: jest.fn(() => true),
}))

const mockProps = {
  hasDraft: false,
  mode: 'edit',
  isSubmitForApprovalEnabled: true,
  handleClearChanges: jest.fn(),
  handleEditQuote: jest.fn(),
  handleSubmitForApproval: jest.fn(),
  handleGotoCheckout: jest.fn(),
  handlePrint: jest.fn(),
}

const isHiddenEditQuoteButton = (Status: any, mode: string) => {
  render(<Status {...mockProps} mode={mode} />)
  const editQuoteButton = screen.queryByText('edit-quote')

  expect(editQuoteButton).not.toBeInTheDocument()
}

const isDisabledEditQuoteButton = (Status: any) => {
  render(<Status {...mockProps} mode={''} />)
  const editQuoteButton = screen.getByText('edit-quote')

  expect(editQuoteButton).toBeDisabled()
}

const isDisabledClearChangesButton = (Status: any) => {
  render(<Status {...mockProps} />)
  const clearChangesButton = screen.getByText('clear-changes')

  expect(clearChangesButton).toBeDisabled()
}

const isDisabledSubmitForApprovalButton = (Status: any) => {
  render(<Status {...mockProps} mode={'edit'} isSubmitForApprovalEnabled={false} />)
  const submitForApprovalButton = screen.getByText('submit-for-approval')

  expect(submitForApprovalButton).toBeDisabled()
}

afterEach(() => {
  cleanup()
})

describe('[components] - SellerQuoteActions', () => {
  describe('Pending status', () => {
    it('should test Pending status in readonly mode', () => {
      render(<Pending {...mockProps} mode={''} />)

      expect(screen.getByText('edit-quote')).toBeEnabled()
    })

    it('should test Pending status in edit mode without changes', () => {
      render(<Pending {...mockProps} mode={'edit'} hasDraft={false} />)

      expect(screen.getByText('clear-changes')).toBeDisabled()
      expect(screen.getByText('submit-for-approval')).toBeDisabled()
    })

    it('should test Pending status in edit mode with changes', () => {
      render(<Pending {...mockProps} mode={'edit'} hasDraft={true} />)

      expect(screen.getByText('clear-changes')).toBeEnabled()
      expect(screen.getByText('submit-for-approval')).toBeEnabled()
    })

    it('should test Pending status in edit mode without all required inputs', () => {
      render(
        <Pending {...mockProps} mode={'edit'} hasDraft={true} isSubmitForApprovalEnabled={false} />
      )

      expect(screen.getByText('clear-changes')).toBeEnabled()
      expect(screen.getByText('submit-for-approval')).toBeDisabled()
    })

    it('should test Pending status in edit mode with all required inputs', () => {
      render(
        <Pending {...mockProps} mode={'edit'} hasDraft={true} isSubmitForApprovalEnabled={true} />
      )

      expect(screen.getByText('clear-changes')).toBeEnabled()
      expect(screen.getByText('submit-for-approval')).toBeEnabled()
    })
  })

  describe('InReview state', () => {
    it('should test InReview status in readonly mode without previous changes', () => {
      render(<InReview {...mockProps} mode={''} hasDraft={false} />)

      expect(screen.queryByText('submit-for-approval')).not.toBeInTheDocument()
      expect(screen.queryByText('approve-quote-with-changes')).not.toBeInTheDocument()
      expect(screen.queryByText('clear-changes')).not.toBeInTheDocument()

      expect(screen.getByText('edit-quote')).toBeEnabled()
      expect(screen.getByText('approve-quote')).toBeEnabled()
    })

    it('should test InReview status in edit mode without previous changes', () => {
      render(<InReview {...mockProps} mode={'edit'} hasDraft={false} />)

      expect(screen.queryByText('edit-quote')).not.toBeInTheDocument()
      expect(screen.queryByText('submit-for-approval')).not.toBeInTheDocument()

      expect(screen.getByText('clear-changes')).toBeDisabled()
      expect(screen.getByText('approve-quote')).toBeEnabled()
    })

    it('should test InReview status in edit mode with changes', () => {
      render(<InReview {...mockProps} mode={'edit'} hasDraft={true} />)

      expect(screen.queryByText('edit-quote')).not.toBeInTheDocument()
      expect(screen.queryByText('approve-quote')).not.toBeInTheDocument()
      expect(screen.queryByText('submit-for-approval')).not.toBeInTheDocument()

      expect(screen.getByText('clear-changes')).toBeEnabled()
      expect(screen.getByText('approve-quote-with-changes')).toBeEnabled()
    })
  })

  describe('Completed/Expired/ReadyForCheckout state', () => {
    it('should disable edit-quote button', () => {
      render(<ReadyForCheckout {...mockProps} mode="" />)

      expect(screen.queryByText('edit-quote')).toBeDisabled()

      cleanup()

      render(<Expired {...mockProps} mode="" />)

      expect(screen.queryByText('edit-quote')).toBeDisabled()

      cleanup()

      render(<Completed {...mockProps} mode="" />)

      expect(screen.queryByText('edit-quote')).toBeDisabled()
    })
  })
})
