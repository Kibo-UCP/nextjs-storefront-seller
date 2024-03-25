import getConfig from 'next/config'
import { NextApiRequest, NextApiResponse } from 'next/types'
import url from 'url'

import { NextApiRequestWithLogger } from '@/lib/types'
import { logger } from '@/next-logger.config'

type ApiHandler = (
  req: NextApiRequest | NextApiRequestWithLogger,
  res: NextApiResponse
) => Promise<any>

const getDecodeCookie = (req: NextApiRequest) => {
  const config = getConfig()
  const cookieName = config?.publicRuntimeConfig.userCookieKey.toLowerCase()

  const cookie = req.cookies?.[cookieName]?.split(';')[0] || ''
  const decodedCookie = cookie ? JSON.parse(Buffer.from(cookie, 'base64').toString('ascii')) : null

  return decodedCookie
}

const getUserId = (req: NextApiRequest) => {
  return getDecodeCookie(req)?.userId
}

const getTenant = (req: NextApiRequest) => {
  const KIBO_API_HOST = process.env.KIBO_API_HOST

  let tenant
  if (KIBO_API_HOST) {
    const tenantArr = KIBO_API_HOST.match(/t(\d+)-/)
    tenant = tenantArr && tenantArr[1]
  } else {
    tenant = req.headers?.tenant
  }

  return tenant || ''
}

const getSite = (req: NextApiRequest) => {
  const KIBO_API_HOST = process.env.KIBO_API_HOST

  let site
  if (KIBO_API_HOST) {
    const siteArr = KIBO_API_HOST.match(/s(\d+)\./)
    site = siteArr && siteArr[1]
  } else {
    site = req.headers?.site
  }

  return site || ''
}

function requestHttpMetaData(req: NextApiRequest) {
  let parsedUrl
  if (req.url) {
    parsedUrl = url.parse(req.url || '', true)
  }
  const http = {
    host: req.headers.host,
    method: req.method,
    protocol: parsedUrl?.protocol,
    referer: req.headers['referer'] || req.headers['referrer'],
    useragent: req.headers['user-agent'],
  } as any
  if (parsedUrl) {
    http.url = {
      path: parsedUrl.pathname,
    }
    http.url_details = parsedUrl.query
  }
  return http
}
function reverseProxyApiContextMeta(req: NextApiRequest) {
  const meta = {} as any
  if (req.headers['x-vol-tenant']) {
    meta.TenantId = parseInt(req.headers['x-vol-tenant'] as string)
  }
  if (req.headers['x-vol-site']) {
    meta.SiteId = parseInt(req.headers['x-vol-site'] as string)
  }
  if (req.headers['x-vol-correlation']) {
    meta.CorrelationId = req.headers['x-vol-correlation']
  }
  const userId = getUserId(req)
  if (userId) {
    meta.UserId = userId
  }
  if (req.headers['X-Forwarded-For']) {
    meta.network = {
      ips: req.headers['X-Forwarded-For'],
    }
  }
  return meta
}
function responseMetaData(res: NextApiResponse) {
  return { statusCode: res.statusCode }
}

export default function withLogger(handle: ApiHandler) {
  return async (request: NextApiRequest, response: NextApiResponse) => {
    const start = Date.now()

    const requestLogger = logger.child({
      handlerName: handle.name,
      http: requestHttpMetaData(request),
      ...reverseProxyApiContextMeta(request),
    })
    ;(request as any).logger = requestLogger

    requestLogger.info('Request start')

    await handle(request, response)
    if (requestLogger.defaultMeta?.http) {
      requestLogger.defaultMeta.http.status_code = response.statusCode
    }
    requestLogger.info('Request end', {
      duration: Date.now() - start,
    })
  }
}
