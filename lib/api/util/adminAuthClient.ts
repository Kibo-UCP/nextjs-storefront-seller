import { apiAuthClient } from './api-auth-client'
import { getApiConfig } from './config-helpers'

const getAPIAuthToken = async () => {
  return (await apiAuthClient.getAccessToken()) || ''
}

const getAdminUserHost = (tenant: string) => {
  const adminUserHost = getApiConfig().adminUserHost
  return `https://${adminUserHost}${tenant}`
}

const createToken = (response: any, tenant: string, site: string) => {
  return {
    userId: response?.user?.userId,
    userName: response?.user?.userName,
    accessToken: response?.accessToken,
    accessTokenExpiration: response?.accessTokenExpiration,
    refreshToken: response?.refreshToken,
    refreshTokenExpiration: response?.refreshTokenExpiration,
    tenant,
    site,
    isSeller: true,
  }
}

const refreshUserAuth = async (refreshToken: string, tenant: string) => {
  if (!tenant) throw new Error('No tenant provided')
  if (!refreshToken) throw new Error('No refresh token provided')

  const apiAuthToken = await getAPIAuthToken()
  const url = getAdminUserHost(tenant as string)

  const headers = new Headers()
  headers.set('x-vol-tenant', tenant as string)
  headers.set('Authorization', `Bearer ${apiAuthToken}`)
  headers.set('Content-Type', 'application/json')

  try {
    const jsonResponse = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        refreshToken,
      }),
    })

    if (!jsonResponse.ok) throw new Error('Error refreshing user Token')
    return await jsonResponse.json()
  } catch (err) {
    console.error('Error refreshing user Token: ', err)
  }
}

const adminAuthClient = {
  refreshUserAuth,
  createToken,
}

export default adminAuthClient
