import { Box, Typography } from '@mui/material'
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse, NextPage } from 'next'
import getConfig from 'next/config'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { AccountsTable } from '@/components/b2b'
import { MobileB2BLayout } from '@/components/layout'
import { QuotesTemplate } from '@/components/page-templates'
import { useB2BQuote, useGetB2BContacts, useGetQuotes, useHandleB2BContacts } from '@/hooks'
import { getQuotes, getB2BContacts } from '@/lib/api/operations'
import { decodeParseCookieValue, parseQuoteFilterParamToObject } from '@/lib/helpers'
import { parseB2bContactFilterParamToObject } from '@/lib/helpers/b2b/parseB2bContactFilterParamToObject'

import { QuoteCollection } from '@/lib/gql/types'

interface ManageQuotesPageProps {
  quotes: QuoteCollection
  b2bContactsCollection: any
  salesRepUserId: string
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { locale, req, res } = context

  const { publicRuntimeConfig } = getConfig()
  const authCookieName = publicRuntimeConfig.userCookieKey.toLowerCase()

  const cookies = req?.cookies
  const salesRepUserId = decodeParseCookieValue(cookies[authCookieName])?.userId

  const quotes =
    (await getQuotes(req as NextApiRequest, res as NextApiResponse, salesRepUserId)) || []

  const b2bContactsResponse = await getB2BContacts(
    req as NextApiRequest,
    res as NextApiResponse,
    salesRepUserId
  )

  return {
    props: {
      quotes,
      b2bContactsCollection: b2bContactsResponse || null,
      salesRepUserId,
      ...(await serverSideTranslations(locale as string, ['common'])),
    },
  }
}

const ManageQuotesPage: NextPage<ManageQuotesPageProps> = (props) => {
  const { quotes, b2bContactsCollection, salesRepUserId } = props
  const router = useRouter()
  // B2B Contacts API implementation

  const { b2bContactsSearchParam, handleB2BContactsSearchParam } = useHandleB2BContacts({
    b2bContacts: b2bContactsCollection,
    salesRepUserId,
  })

  const { data: b2bContacts } = useGetB2BContacts(b2bContactsSearchParam, b2bContactsCollection)

  // All Quotes API implementations
  const { quotesSearchParam, sortingValues, handleQuotesSearchParam } = useB2BQuote({
    accountId: undefined,
    quotes,
  })

  const { data: quoteCollection } = useGetQuotes(quotesSearchParam, quotes)

  // navigation
  const { t } = useTranslation('common')
  const breadcrumbList = [
    {
      key: 'accountsList',
      backText: t('accounts-list'),
      redirectURL: '/my-account' /*TODO: change this to point to admin url*/,
    },
  ]
  const activeBreadCrumb = breadcrumbList.filter((item) => item.key === 'accountsList')[0]

  const onBackClick = () => {
    if (router.query?.isSeller) {
      window.parent.postMessage('go-back', '*')
    } else {
      router.push(activeBreadCrumb.redirectURL)
    }
  }

  return (
    <>
      <MobileB2BLayout
        headerText={t('create-a-quote')}
        backText={activeBreadCrumb?.backText}
        onBackClick={onBackClick}
      />
      <Box pb={2}>
        <Typography variant="h5">{t('create-quote-subtitle-seller')}</Typography>
      </Box>
      <AccountsTable
        b2bContacts={b2bContacts}
        filters={parseB2bContactFilterParamToObject(b2bContactsSearchParam.filter as string)}
        setB2BContactsSearchParam={handleB2BContactsSearchParam}
      />
      <Box py={2}>
        <Typography variant="h2">{t('all-quotes')}</Typography>
      </Box>
      <QuotesTemplate
        quoteCollection={quoteCollection as QuoteCollection}
        sortingValues={sortingValues}
        filters={parseQuoteFilterParamToObject(quotesSearchParam.filter as string)}
        setQuotesSearchParam={handleQuotesSearchParam}
        showCreateQuoteButton={false}
      />
    </>
  )
}

export default ManageQuotesPage
