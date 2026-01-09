import React from 'react'

import { parse } from 'url'

import saveSellerToken from '@/lib/api/operations/save-seller-token'

export async function getServerSideProps(context: any) {
  try {
    const result = await saveSellerToken(context.req, context.res)

    if (!result.success) {
      console.error('admin-redirect: Failed to save seller token:', result.error)
      // Continue with redirect even if token save fails
      // The user may need to re-authenticate on the target page
    }

    const { query } = parse(context.req.url as string, true)
    const { redirect } = query

    if (!redirect) {
      console.error('admin-redirect: No redirect path provided')
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      }
    }

    // Remove "_util" from the current URL and append the redirect path
    const destination = `/${redirect}`

    return {
      redirect: {
        destination,
        permanent: false,
      },
    }
  } catch (error) {
    console.error('admin-redirect: Unexpected error:', error)
    // Fallback to home page on unexpected errors
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
}

const AdminRedirect = () => {
  return (
    <div>
      <h1>Redirecting...</h1>
    </div>
  )
}

export default AdminRedirect
