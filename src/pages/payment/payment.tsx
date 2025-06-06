import { memo, useCallback, useMemo, useState } from "react"
import { Outlet, useLocation } from "react-router-dom"
import MobileNav from "../../components/MobileNav"
import { Header } from "../../components/layout/header"
import { IoMenu } from "react-icons/io5"
import { IconButton } from "../../components/common/buttons/icon"
import { Sidebar } from "../../components/layout/sidebar"

const paymentComponent = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const location = useLocation();

  const selectedRoute = useMemo(() => location.pathname.split('/').at(-1) , [location])

  const handleOpenSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev)
  }, [])

  return (
    <main className="flex h-screen overflow-y-hidden flex-col items-center p-2 bg-background-alt font-vazirMatn dark:bg-dark-background-alt md:flex-row">
      <div className="w-full h-full flex flex-col gap-1">
        <div className="w-full h-12 flex flex-row gap-0 justify-center items-center px-2">
          <Header />
          <div className="w-fit h-fit hidden justify-center items-center md:flex">
            <IconButton
              icon={<IoMenu />}
              onClick={handleOpenSidebar}
              variant="ghost"
            />
          </div>
        </div>
        <div className="flex h-[94%] w-full flex-col items-center bg-background-alt font-vazirMatn dark:bg-dark-background-alt md:flex-row">
          <section className="w-screen md:w-full overflow-x-hidden bg-background dark:bg-dark-background md:mx-2 md:mb-2 md:h-[97%] md:rounded-2xl">
            <Outlet />
          </section>
          <Sidebar
            selectedRoute={selectedRoute ?? ""}
            isExpanded={isSidebarOpen}
          />
        </div>
      </div>
      {/* Mobile navigation - no need for additional wrapper div */}
      <MobileNav />
    </main>
  )
}

export const Payment = memo(paymentComponent)