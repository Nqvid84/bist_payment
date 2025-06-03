import { memo } from "react"
import { Outlet } from "react-router-dom"
import MobileNav from "../../components/MobileNav"
import LayoutButtons from "../../components/LayoutButtons"

const paymentComponent = () => {
  return (
    <main className="flex h-screen flex-col items-center p-2 bg-neutral-300 font-vazirMatn dark:bg-neutral-950 md:flex-row">    
      <section className="h-[calc(100%-64px)] w-full overflow-x-hidden bg-neutral-200 dark:bg-neutral-900 md:mx-2 md:h-[97%] md:w-auto md:basis-[90%] md:rounded-2xl 2xl:basis-[93%]">
        <Outlet />
      </section>
      <nav className="hidden h-full basis-[10%] flex-col bg-neutral-300 dark:bg-neutral-950 md:flex 2xl:basis-[7%]">
        <LayoutButtons />
      </nav>

      {/* Mobile navigation - no need for additional wrapper div */}
      <MobileNav />
    </main>
  )
}

export const Payment = memo(paymentComponent)