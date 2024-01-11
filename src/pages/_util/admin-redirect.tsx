import React from 'react'

import { parse } from 'url'

import saveSellerToken from '@/lib/api/operations/save-seller-token'
import { getApiConfig } from '@/lib/api/util/config-helpers'

export async function getServerSideProps(context: any) {
  const details = await saveSellerToken(context.req, context.res)

  const { query } = parse(context.req.url as string, true)
  const { redirect, isSeller } = query

  // Remove "_util" from the current URL and append the redirect path
  const currentPath = context.req.url
  const destination = currentPath.replace(/\/_util\/.*/, `/${redirect}`)

  console.log('currentPath: ', currentPath)
  console.log('destination: ', destination)

  const env = {
    KIBO_APPDEV_HOST: process.env.KIBO_APPDEV_HOST || '',
    KIBO_ADMIN_USER_HOST: process.env.KIBO_ADMIN_USER_HOST || '',
    KIBO_API_HOST: process.env.KIBO_API_HOST || '',
    KIBO_CLIENT_ID: process.env.KIBO_CLIENT_ID || '',
    KIBO_SHARED_SECRET: process.env.KIBO_SHARED_SECRET || '',
    KIBO_PCI_HOST: process.env.KIBO_PCI_HOST || '',
    MZRT_COOKIE_NAME: process.env.MZRT_COOKIE_NAME || '',
  }

  return {
    // redirect: {
    //   destination: destination + (isSeller ? '&isSeller=' + isSeller : ''),
    //   permanent: false,
    // },
    props: {
      currentPath,
      destination,
      details: details || {},
      env,
    },
  }
}

const AdminRedirect = (props: { currentPath: any; url: string; details: any; env: any }) => {
  return (
    <div>
      <h2>currentPath: {props.currentPath}</h2>
      <h2>url: {props.url}</h2>
      <h2>details:: {JSON.stringify(props.details)}</h2>
      <h2>env: {JSON.stringify(props.env)}</h2>
    </div>
  )
}

export default AdminRedirect
