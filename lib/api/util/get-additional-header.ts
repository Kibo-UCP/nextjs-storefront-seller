import { NextApiRequest } from 'next'

const getAdditionalHeader = (req: NextApiRequest) => {
  const forwardedForHeader = req?.headers['x-forwarded-for']
  if (!forwardedForHeader) {
    console.log('no forwared for header')
    return {
      'x-forwarded-proto': 'https',
    }
  }
  console.log(forwardedForHeader.toString())
  const forwardedFor = forwardedForHeader.toString().split(',')[0]

  // add additional headers here
  const headers = {
    // 'x-forwarded-for': forwardedFor,
    'x-forwarded-proto': 'https',
  }

  return headers
}

export default getAdditionalHeader
