import vercelFetch from '@vercel/fetch'

import { apiAuthClient } from './api-auth-client'
import { getGraphqlUrl, getProxyGraphqlUrl } from './config-helpers'

const fetch = vercelFetch()

const fetcher = async (
  { query, variables }: any,
  options: any,
  sellerTenantInfo?: { tenant: string; site: string }
) => {
  const authToken = await apiAuthClient.getAccessToken()

  const isUserSeller = sellerTenantInfo ? true : false
  const url = getGraphqlUrl()

  // remove t from siteId if t is included
  const tenantId = sellerTenantInfo?.tenant.startsWith('t')
    ? sellerTenantInfo?.tenant.slice(1)
    : sellerTenantInfo?.tenant

  // remove s from siteId if s is included
  const siteId = sellerTenantInfo?.site.startsWith('s')
    ? sellerTenantInfo?.site.slice(1)
    : sellerTenantInfo?.site

  const headers = {
    Authorization: `Bearer ${authToken}`,
    'Content-Type': 'application/json',
    ...(isUserSeller
      ? {
          // 'x-vol-app-claims': options?.userClaims,
          // 'x-vol-user-claims': options?.userClaims,
          'x-vol-tenant': tenantId,
          'x-vol-site': siteId,
        }
      : {
          'x-vol-user-claims': options?.userClaims,
        }),
    ...options.headers,
  }

  console.log('--------headers----------', headers)

  const response = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({
      query,
      variables,
    }),
  })
  const jsonResponse = await response.json()

  return jsonResponse
}
export default fetcher
