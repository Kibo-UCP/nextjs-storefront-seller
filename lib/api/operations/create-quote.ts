import { NextApiRequest, NextApiResponse } from 'next'

import { getAdditionalHeader } from '@/lib/api/util'
import { fetcher } from '@/lib/api/util'
import getUserClaimsFromRequest from '@/lib/api/util/getUserClaimsFromRequest'
import { getSellerTenantInfo } from '@/lib/api/util/seller'
import { createQuoteMutation } from '@/lib/gql/mutations'
import { buildCreateQuoteParams } from '@/lib/helpers'

export default async function createQuote(
  req: NextApiRequest,
  res: NextApiResponse,
  customerAccountId: string
) {
  const userClaims = await getUserClaimsFromRequest(req, res)

  const headers = req ? getAdditionalHeader(req) : {}

  const response = await fetcher(
    {
      query: createQuoteMutation,
      variables: buildCreateQuoteParams(parseInt(customerAccountId)),
    },
    { userClaims, headers },
    getSellerTenantInfo(req)
  )

  return response?.data?.createQuote
}
