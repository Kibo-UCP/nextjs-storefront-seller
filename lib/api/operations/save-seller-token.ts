import cookie from 'cookie'
import { NextApiRequest, NextApiResponse } from 'next'
import getConfig from 'next/config'
import { parse } from 'url'

import { apiAuthClient } from '../util/api-auth-client'
import { getApiConfig } from '../util/config-helpers'
import { prepareSetCookieValue } from '@/lib/helpers/cookieHelper'
import logger from 'next-logger.config'

const { publicRuntimeConfig } = getConfig()
const authCookieName = publicRuntimeConfig.userCookieKey.toLowerCase()

interface TimeoutRequestInit extends RequestInit {
  timeout?: number
}

const getCookieName = () => {
  const mzrtCookieName = process.env.MZRT_COOKIE_NAME ?? 'mzrt-qa'
  const isDev = mzrtCookieName.includes('dev')
  if (isDev) {
    const keyValuePairs = mzrtCookieName.split('-')
    return mzrtCookieName + '-' + keyValuePairs[keyValuePairs.length - 1]
  }
  return mzrtCookieName
}

const getRefreshToken = (req: NextApiRequest) => {
  const cookies = req.headers.cookie || ''
  const parsedCookies = cookie.parse(cookies)

  // Access the "mzrt-qa" cookie
  const mzrtCookieName = getCookieName()
  const mzrtQACookie = parsedCookies[mzrtCookieName]

  if (mzrtQACookie) {
    // Split the "mzrt-qa" cookie into its key-value pairs
    const keyValuePairs = mzrtQACookie.split('&')

    // Initialize variables to store the values
    let token = ''
    let expires = ''
    let expiration = ''
    let user = ''

    // Iterate through the key-value pairs and extract the values
    for (const pair of keyValuePairs) {
      const [key, value] = pair.split('=')

      switch (key) {
        case 'Token':
          token = value
          break
        case 'Expires':
          expires = value
          break
        case 'Expiration':
          expiration = value
          break
        case 'User':
          user = value
          break
        default:
          // Handle unknown keys, if any
          break
      }
    }

    return token
  }
}

const getAdminUserHost = (tenant: string) => {
  const adminUserHost = getApiConfig().adminUserHost
  const url = `https://${adminUserHost}${tenant}`
  return url
}

const saveSellerToken = async (req: NextApiRequest, res: NextApiResponse) => {
  // Get tenant, site, redirect and refreshToken from request
  const { query } = parse(req.url as string, true)
  const { tenant, site } = query
  const refreshToken = getRefreshToken(req)

  // Get authToken
  const authToken = await apiAuthClient.getAccessToken()

  // Construct url and headers
  const url = getAdminUserHost(tenant as string)

  const headers = new Headers()
  headers.set('x-vol-tenant', tenant as string)
  headers.set('Authorization', `Bearer ${authToken}`)
  headers.set('Content-Type', 'application/json')

  let response: any = null

  logger.info('pino: fetch', {
    tenant,
    site,
    url,
    headers,
    refreshToken,
  })

  try {
    // Fetch user-claims
    const jsonResponse = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        refreshToken,
      }),
      timeout: 10000,
    } as TimeoutRequestInit)

    response = await jsonResponse.json()
    logger.info('pino: response', response)
  } catch (err) {
    console.log('--- err: --- ', err)
    logger.error('pino: err', err)
  }

  // Set cookie
  const token = {
    userId: response?.user?.userId,
    userName: response?.user?.userName,
    accessToken: response?.accessToken,
    accessTokenExpiration: response?.accessTokenExpiration,
    refreshToken: response?.refreshToken,
    refreshTokenExpiration: response?.refreshTokenExpiration,
    tenant,
    site,
  }

  logger.info('pino: token', token)
  res.setHeader(
    'Set-Cookie',
    authCookieName + '=' + prepareSetCookieValue({ ...token }) + ';path=/'
  )
}

export default saveSellerToken
