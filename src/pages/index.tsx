import { homePageResultMock } from '@/__mocks__/stories'
import KiboHeroCarousel from '@/components/home/Carousel/KiboHeroCarousel'
import getCategoryTree from '@/lib/api/operations/get-category-tree'
import type { CategoryTreeResponse, NextPageWithLayout } from '@/lib/types'

interface HomePageProps {
  carouselItem: any
}
export async function getServerSideProps() {
  const categoriesTree: CategoryTreeResponse = (await getCategoryTree()) || null

  return {
    props: {
      categoriesTree,
      carouselItem: homePageResultMock,
    },
  }
}

const Home: NextPageWithLayout<HomePageProps> = (props) => {
  const { carouselItem } = props
  return (
    <>
      <KiboHeroCarousel carouselItem={carouselItem || []}></KiboHeroCarousel>
    </>
  )
}

export default Home
