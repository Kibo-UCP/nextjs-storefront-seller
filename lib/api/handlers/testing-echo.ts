import getConfig from 'next/config'

import type { NextApiRequest, NextApiResponse } from 'next'
export default async function testingEcho(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { publicRuntimeConfig } = getConfig()
    res.status(200).json({
      appDevHost: process.env.KIBO_APPDEV_HOST,
      adminUserHost: process.env.KIBO_ADMIN_USER_HOST,
      apiHost: publicRuntimeConfig?.apiHost,
      pciHost: publicRuntimeConfig?.pciHost
    })
  } catch (error) {
    console.error(error)
    const message = 'An unexpected error ocurred'
    res.status(500).json({ data: null, errors: [{ message }] })
  }
}
