import React from 'react'

import { parse } from 'url'

import saveSellerToken from '@/lib/api/operations/save-seller-token'

export async function getServerSideProps(context: any) {
  // await saveSellerToken(context.req, context.res)

  const { query } = parse(context.req.url as string, true)
  const { redirect, isSeller } = query

  // Remove "_util" from the current URL and append the redirect path
  const currentPath = context.req.url
  const destination = currentPath.replace(/\/_util\/.*/, `/${redirect}`)

  console.log('context.req: ', context.req)
  console.log('currentPath: ', currentPath)
  console.log('destination: ', destination)

  return {
    redirect: {
      destination: destination + (isSeller ? '&isSeller=' + isSeller : ''),
      permanent: false,
    },
    // props: {   
    //   currentPath: currentPath,
    //   url: destination + (isSeller ? '&isSeller=' + isSeller : ''),
    // },
  }
}

const AdminRedirect = (props: {  currentPath: any; url: string }) => {
  return (
    <div>    
      <h2>currentPath: {props.currentPath}</h2>
      <h2>url: {props.url}</h2>
    </div>
  )
}

export default AdminRedirect
