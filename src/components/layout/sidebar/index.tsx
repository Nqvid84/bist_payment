import React, { memo, useCallback } from 'react'
import { SidebarButton } from '../../common/buttons/sidebar'
import { MdAdminPanelSettings } from 'react-icons/md'
import { RiHome5Fill, RiSecurePaymentFill } from 'react-icons/ri'
import { FaUsers } from 'react-icons/fa6'
import { PiDevicesFill, PiShareNetworkFill } from 'react-icons/pi'
import { BsCurrencyExchange } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'

interface SidebarProps {
  isExpanded: boolean;
  selectedRoute: string
}

const SidebarComponent = ({
  isExpanded,
  selectedRoute
}: SidebarProps) => {
  const navigate = useNavigate();

  const handleSidebarButtonClick = useCallback((path: string) => {
    navigate(`/payment-card${path}`)
  }, [])

  return (
    <div className={`h-full ${isExpanded ? 'w-52' : 'w-12'} hidden py-2 md:flex flex-col justify-center items-center transition-width ease-in-out duration-300`}>
      <nav className={`w-full py-4  bg-background-alt dark:bg-dark-background-alt flex flex-col gap-6 justify-start items-end md:pr-1`}>
        <SidebarButton
          isExpanded={isExpanded}
          variant={selectedRoute === "payment-card" ? "primary" : "ghost"}
          onClick={() => handleSidebarButtonClick('')}
          title="خونه"
          icon={<RiHome5Fill />}
        />
        <SidebarButton
          isExpanded={isExpanded}
          variant={selectedRoute === "device-management" ? "primary" : "ghost"}
          onClick={() => handleSidebarButtonClick('/device-management')}
          title="دستگاه ها"
          icon={<PiDevicesFill />}
        />
        <SidebarButton
          isExpanded={isExpanded}
          variant={selectedRoute === "transactions-network" ? "primary" : "ghost"}
          onClick={() => handleSidebarButtonClick('/transactions-network')}
          title="تراکنش ها"
          icon={<BsCurrencyExchange />}
        />
        <SidebarButton
          isExpanded={isExpanded}
          variant={selectedRoute === "networks" ? "primary" : "ghost"}
          onClick={() => handleSidebarButtonClick('/networks')}
          title="شبکه ها"
          icon={<PiShareNetworkFill />}
        />
        <SidebarButton
          isExpanded={isExpanded}
          variant={selectedRoute === "client" ? "primary" : "ghost"}
          onClick={() => handleSidebarButtonClick('/client')}
          title="مشتریان"
          icon={<FaUsers />}
        />
        <SidebarButton
          isExpanded={isExpanded}
          variant={selectedRoute === "installments" ? "primary" : "ghost"}
          onClick={() => handleSidebarButtonClick('/installments')}
          title="اقساط"
          icon={<RiSecurePaymentFill />}
        />
        <SidebarButton
          isExpanded={isExpanded}
          variant={selectedRoute === "users" ? "primary" : "ghost"}
          onClick={() => handleSidebarButtonClick('/users')}
          title="مدیران"
          icon={<MdAdminPanelSettings />}
        />
      </nav>
    </div>
  )
}

export const Sidebar = memo(SidebarComponent)