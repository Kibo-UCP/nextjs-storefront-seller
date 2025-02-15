import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { createQuote } from '@/lib/api/operations'

import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next'

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { locale, req, res, query } = context

  const { customerAccountId, mode = 'create', manageQuote = false } = query as any

  const createQuoteResponse = await createQuote(
    req as NextApiRequest,
    res as NextApiResponse,
    customerAccountId
  )

  if (createQuoteResponse?.id) {
    return {
      redirect: {
        destination: `/my-account/b2b/quote/${createQuoteResponse?.id}?mode=${mode}&manageQuote=${manageQuote}`,
        permanent: true,
      },
    }
  }

  return {
    props: {
      ...(await serverSideTranslations(locale as string, ['common'])),
    },
  }
}

export default function CreateQuoteFromSellerPage() {
  return null
}
