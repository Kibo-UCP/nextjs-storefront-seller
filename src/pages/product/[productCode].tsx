import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { ProductDetailTemplate, ProductDetailSkeleton } from '@/components/page-templates'
import { getProduct, getCategoryTree } from '@/lib/api/operations'
import { productGetters } from '@/lib/getters'
import type { MetaData, PageWithMetaData, ProductCustom } from '@/lib/types'

import { PrCategory, Product } from '@/lib/gql/types'
import type { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next'

interface ProductPageType extends PageWithMetaData {
  categoriesTree?: PrCategory[]
  product?: Product
}
function getMetaData(product: Product): MetaData {
  return {
    title: product?.content?.metaTagTitle || null,
    description: product?.content?.metaTagDescription || null,
    keywords: product?.content?.metaTagKeywords || null,
    canonicalUrl: null,
    robots: null,
  }
}

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<any>> {
  const { locale, params } = context
  const { productCode } = params as any
  const product = await getProduct(productCode)
  const categoriesTree = await getCategoryTree()
  if (!product) {
    return { notFound: true }
  }
  return {
    props: {
      product,
      categoriesTree,
      metaData: getMetaData(product),
      ...(await serverSideTranslations(locale as string, ['common'])),
    },
  }
}

const ProductDetailPage: NextPage<ProductPageType> = (props) => {
  const { product } = props
  const router = useRouter()
  const { isFallback } = router

  if (isFallback) {
    return <ProductDetailSkeleton />
  }
  const breadcrumbs = product ? productGetters.getBreadcrumbs(product) : []
  return (
    <>
      <ProductDetailTemplate product={product as ProductCustom} breadcrumbs={breadcrumbs} />
    </>
  )
}

export default ProductDetailPage
