import cookie from 'cookie'
import { NextApiRequest, NextApiResponse } from 'next'
import getConfig from 'next/config'
import { parse } from 'url'

import { adminAuthClient } from '../util'
import { prepareSetCookieValue } from '@/lib/helpers/cookieHelper'

const { publicRuntimeConfig } = getConfig()
const authCookieName = publicRuntimeConfig.userCookieKey.toLowerCase()

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

const saveSellerToken = async (req: NextApiRequest, res: NextApiResponse) => {
  // Get tenant, site, redirect and refreshToken from request
  const { query } = parse(req.url as string, true)

  const { tenant, site } = query
  const refreshToken = getRefreshToken(req)

  const response = await adminAuthClient.refreshUserAuth(refreshToken as string, tenant as string)
  const token = adminAuthClient.createToken(response, tenant as string, site as string)

  res.setHeader(
    'Set-Cookie',
    authCookieName + '=' + prepareSetCookieValue({ ...token }) + ';path=/'
  )
}

export default saveSellerToken
