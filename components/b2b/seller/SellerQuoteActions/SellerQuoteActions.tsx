import { LoadingButton } from '@mui/lab'
import { Grid, Stack, NoSsr, Box } from '@mui/material'
import { useTranslation } from 'next-i18next'

import { QuoteStatus } from '@/lib/constants'

interface SellerQuoteActionsProps {
  hasDraft: boolean
  mode: string
  status: string
  isSubmitForApprovalEnabled: boolean
  handleClearChanges: () => void
  handleEditQuote: () => void
  handleSubmitForApproval: (isApproving?: boolean) => void
  handleGotoCheckout: () => void
  handlePrint: () => void
}
export default function SellerQuoteActions({
  hasDraft,
  mode,
  status,
  isSubmitForApprovalEnabled,
  handleClearChanges,
  handleEditQuote,
  handleSubmitForApproval,
  handlePrint,
}: SellerQuoteActionsProps) {
  const { t } = useTranslation()

  return (
    <Grid item display={'flex'} justifyContent={'flex-end'}>
      {
        <Stack
          sx={{
            flexDirection: {
              xs: 'column-reverse',
              md: 'row',
            },
          }}
          direction="row"
          gap={2}
          width={'100%'}
        >
          {
            <Box display={'flex'} gap={2} whiteSpace={'nowrap'}>
              {(QuoteStatus[status] === QuoteStatus.Pending ||
                QuoteStatus[status] === QuoteStatus.InReview) &&
                (mode === 'create' || mode === 'edit') && (
                  <LoadingButton
                    variant="contained"
                    color="secondary"
                    sx={{ width: { xs: '50%', md: '100%' } }}
                    disabled={!hasDraft}
                    onClick={handleClearChanges}
                  >
                    {t('clear-changes')}
                  </LoadingButton>
                )}
              {!mode && (
                <LoadingButton
                  variant="contained"
                  color="secondary"
                  sx={{ width: { xs: '50%', md: '100%' } }}
                  disabled={
                    // add sales-rep check
                    QuoteStatus[status] === QuoteStatus.Completed ||
                    QuoteStatus[status] === QuoteStatus.Expired ||
                    QuoteStatus[status] === QuoteStatus.ReadyForCheckout
                  }
                  onClick={handleEditQuote}
                >
                  {t('edit-quote')}
                </LoadingButton>
              )}
              <LoadingButton
                sx={{ width: { xs: '50%', md: '100%' } }}
                variant="contained"
                color="secondary"
                onClick={handlePrint}
              >
                {t('print-quote')}
              </LoadingButton>
            </Box>
          }
          {QuoteStatus[status as string] === QuoteStatus.Pending &&
            (mode === 'edit' || mode === 'create') && (
              <Box>
                <LoadingButton
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={!isSubmitForApprovalEnabled || !hasDraft}
                  onClick={() => handleSubmitForApproval(false)}
                >
                  {t('submit-for-approval')}
                </LoadingButton>
              </Box>
            )}
          {QuoteStatus[status as string] === QuoteStatus.InReview && (
            <>
              <NoSsr>
                {!hasDraft && (
                  <Box>
                    <LoadingButton
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={() => handleSubmitForApproval(true)}
                    >
                      {t('approve-quote')}
                    </LoadingButton>
                  </Box>
                )}
              </NoSsr>
              <NoSsr>
                {mode === 'edit' && hasDraft && (
                  <Box>
                    <LoadingButton
                      variant="contained"
                      color="primary"
                      fullWidth
                      // disabled={!hasDraft as boolean}
                      onClick={() => handleSubmitForApproval(true)}
                    >
                      {t('approve-quote-with-changes')}
                    </LoadingButton>
                  </Box>
                )}
              </NoSsr>
            </>
          )}
        </Stack>
      }
    </Grid>
  )
}
