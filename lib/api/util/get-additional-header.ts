import { NextApiRequest } from 'next'

const getAdditionalHeader = (req: NextApiRequest) => {
  const forwardedForHeader = req?.headers['x-forwarded-for']
  if (!forwardedForHeader) {
    return {
      'x-forwarded-proto': 'https',
    }
  }

  const forwardedFor = forwardedForHeader.toString().split(',')[0]

  // add additional headers here
  const headers = {
    // removing client (users) ip for now
    // gql now calls public rp which blocks due to interal access token
    // 'x-forwarded-for': forwardedFor,
    'x-forwarded-proto': 'https'
  }

  return headers
}

export default getAdditionalHeader
