import React from 'react'

import { parse } from 'url'

import saveSellerToken from '@/lib/api/operations/save-seller-token'
import { getApiConfig } from '@/lib/api/util/config-helpers'

export async function getServerSideProps(context: any) {
  let details
  //  details = await saveSellerToken(context.req, context.res)

  const { query } = parse(context.req.url as string, true)
  const { redirect, isSeller } = query

  // Remove "_util" from the current URL and append the redirect path
  const currentPath = context.req.url
  const destination = currentPath.replace(/\/_util\/.*/, `/${redirect}`)

  console.log('currentPath: ', currentPath)
  console.log('destination: ', destination)

  const clientId = getApiConfig().clientId
  const sharedSecret = getApiConfig().sharedSecret
  const authHost = getApiConfig().authHost
  const apiHost = getApiConfig().apiHost
  const adminUserHost = getApiConfig().adminUserHost
  const env = {
    clientId,
    sharedSecret,
    authHost,
    apiHost,
    adminUserHost,
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
      <h2>env:: {JSON.stringify(props.env)}</h2>
    </div>
  )
}

export default AdminRedirect
