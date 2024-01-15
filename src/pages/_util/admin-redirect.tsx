import React from 'react'

import Link from 'next/link'
import { parse } from 'url'

import saveSellerToken from '@/lib/api/operations/save-seller-token'

export async function getServerSideProps(context: any) {
  const details = await saveSellerToken(context.req, context.res)

  const { query } = parse(context.req.url as string, true)
  const { redirect } = query

  // Remove "_util" from the current URL and append the redirect path
  const currentPath = context.req.url
  const destination = currentPath.replace(/\/_util\/.*/, `/${redirect}`)

  return {
    // redirect: {
    //   destination,
    //   permanent: false,
    // },
    props: {
      details: {
        ...details,
        KIBO_APPDEV_HOST: process.env.KIBO_APPDEV_HOST,
        KIBO_ADMIN_USER_HOST: process.env.KIBO_ADMIN_USER_HOST,
        KIBO_API_HOST: process.env.KIBO_API_HOST,
        KIBO_CLIENT_ID: process.env.KIBO_CLIENT_ID,
        KIBO_PCI_HOST: process.env.KIBO_PCI_HOST,
        MZRT_COOKIE_NAME: process.env.MZRT_COOKIE_NAME,
      },
      destination,
    },
  }
}

const AdminRedirect = ({ details, destination }: any) => {
  return (
    <div>
      <h1>Redirecting...</h1>
      <p>{JSON.stringify(details)}</p> <br />
      <br />
      <Link href={destination}>Click here if you are not redirected.</Link>
    </div>
  )
}

export default AdminRedirect
