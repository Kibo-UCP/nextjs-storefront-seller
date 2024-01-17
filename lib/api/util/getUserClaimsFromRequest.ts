import { ServerResponse } from 'http'
import getConfig from 'next/config'

import adminAuthClient from './adminAuthClient'
import { shopperAuthClient } from './api-auth-client'
import { isShopperAuthExpired } from './config-helpers'
import { decodeParseCookieValue, prepareSetCookieValue } from '@/lib/helpers/cookieHelper'
import type { KiboRequest } from '@/lib/types'

import type { NextApiRequest, NextApiResponse } from 'next'

const { publicRuntimeConfig } = getConfig()
const authCookieName = publicRuntimeConfig.userCookieKey.toLowerCase()

const getUserClaimsFromRequest = async (
  req: NextApiRequest | KiboRequest,
  res: NextApiResponse | ServerResponse
) => {
  if (req.headers['x-vol-exclude-user-claims']) {
    return
  }
  try {
    const cookies = req?.cookies
    let authTicket = decodeParseCookieValue(cookies[authCookieName])

    if (authTicket && isShopperAuthExpired(authTicket) === false) {
      return authTicket.accessToken
    }

    const accountId = authTicket?.accountId
    let token

    // shopper is anonymous
    // else logged in user ticket needs to be refreshed
    if (!authTicket) {
      authTicket = await shopperAuthClient.anonymousAuth()
    } else {
      const isSeller = authTicket?.isSeller
      const tenant = authTicket?.tenant
      const site = authTicket?.site
      const refreshToken = authTicket?.refreshToken
      let response

      if (isSeller) {
        response = await adminAuthClient.refreshUserAuth(refreshToken, tenant)
        token = adminAuthClient.createToken(response, tenant as string, site as string)
      } else {
        response = await shopperAuthClient.refreshUserAuth(authTicket)
        if (response.accessToken) {
          authTicket = response
        }
        token = { ...authTicket, accountId }
      }
    }
    res.setHeader(
      'Set-Cookie',
      authCookieName + '=' + prepareSetCookieValue({ ...token }) + ';path=/'
    )

    return authTicket.accessToken
  } catch (err) {
    console.error(err)
  }
  return
}
export default getUserClaimsFromRequest
