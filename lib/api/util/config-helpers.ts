import { UserAuthTicket } from '@kibocommerce/graphql-client'

const protocolRegx = new RegExp(/https?:\/\//)
const addProtocolToHost = (hostname: string | undefined) =>
  hostname && !hostname.match(protocolRegx) ? `https://${hostname}` : hostname

export const getGraphqlUrl = () => `${addProtocolToHost(process.env.KIBO_API_HOST)}/graphql`
export const getProxyGraphqlUrl = () => `${addProtocolToHost(process.env.KIBO_PROXY)}/graphql`

export const getApiConfig = () => {
  return {
    clientId: (process.env.KIBO_CLIENT_ID || 'client') as string,
    sharedSecret: (process.env.KIBO_SHARED_SECRET || 'secret') as string,
    authHost: (process.env.KIBO_APPDEV_HOST || 'home') as string,
    apiHost: (process.env.KIBO_API_HOST || 'host') as string,
    adminUserHost: (process.env.KIBO_ADMIN_USER_HOST || 'admin') as string,
  }
}

export const isShopperAuthExpired = (userAuthTicket: UserAuthTicket) => {
  const { accessTokenExpiration } = userAuthTicket
  return new Date(accessTokenExpiration).getTime() < Date.now()
}
