import getConfig from 'next/config'

import type { NextApiRequestWithLogger } from '@/lib/types'

import type { NextApiResponse } from 'next'

export default async function testingEcho(req: NextApiRequestWithLogger, res: NextApiResponse) {
  try {
    const { publicRuntimeConfig } = getConfig()
    res.status(200).json({
      pciHost: publicRuntimeConfig?.pciHost,
      apiHost: publicRuntimeConfig?.apiHost,
      authHost: process.env.KIBO_AUTH_HOST,
    })
  } catch (error) {
    console.error(error)
    const message = 'An unexpected error ocurred'
    res.status(500).json({ data: null, errors: [{ message }] })
  }
}
