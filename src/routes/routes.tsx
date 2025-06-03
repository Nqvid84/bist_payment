import { ReactElement, Suspense } from "react";
import { Payment } from "../pages/payment/payment";
import { Login } from "../pages/authentication/login";
import Authentication from "../pages/authentication";
import { Home } from "../pages/payment/paymentCardHome";
import { DeviceManagement } from "../pages/device-management/deviceManagement";
import { TransactionsNetwork } from "../pages/transactions-network/transactionsNetwork";
import { Profile } from "../pages/profile/profile";
import { Users } from "../pages/users/users";
import { ReportClients } from "../pages/reports/clients/reportsClients";
import { ReportStoreOrg } from "../pages/reports/store-org/reportsStoreOrg";
import ChequeManagementPage from "../pages/client/cheque/ChequeManagementPage";
import ClientManagementPage from "../pages/client/clientManagement";
import ClientInstallmentsPage from "../pages/client/installments/ClientInstallmentsPage";
import NetworksPage from "../pages/networks/networks";
import { NotFound } from "../pages/errors/notFound";
import { Installments } from "../pages/installments/installments";
import { EmployeeInstallments } from "../pages/installments/employee/employeeInstallments";
import { LevelInstallments } from "../pages/installments/levels/installmentsLevels";
import { InstallmentManage } from "../pages/installments/management/manageInstallments";
import { InstallmentStore } from "../pages/installments/stores/storeInstallments";
import { NetworksSummery } from "../pages/networks/summery/networksSummery";
import { History } from "../pages/history/auditLogs";

interface Route {
  path?: string;
  title?: string;
  element?: ReactElement;
  children?: Route[];
}

export const Routes: Route[] = [
  {
    path: "/login",
    title: "User",
    element: (
      <Suspense>
        <Login />
      </Suspense>
    ),
  },
  {
    element: (
      <Authentication>
        <Payment />
      </Authentication>
    ),
    children: [
      {
        path: "payment-card",
        title: "Payment Card",
        children: [
          {
            path: "device-management",
            title: "Device Management",
            element: (
              <DeviceManagement />
            ),
          },
          {
            path: "history",
            title: "History",
            element: (
              <History />
            ),
          },
          {
            path: "installments",
            children: [
              {
                path: "",
                title: "Installments",
                element: (
                  <Installments />
                ),
              },
              {
                path: "employees",
                title: "Employees",
                element: (
                  <EmployeeInstallments />
                ),
              },
              {
                path: "levels",
                title: "Levels",
                element: (
                  <LevelInstallments />
                ),
              },
              {
                path: "management",
                title: "Management",
                element: (
                  <InstallmentManage />
                ),
              },
              {
                path: "stores",
                title: "Stores",
                element: (
                  <InstallmentStore />
                ),
              },
            ]
          },
          {
            path: "networks",
            children: [
              {
                path: "",
                title: "Networks",
                element: (
                  <NetworksPage />
                ),
              },
              {
                path: "summery",
                title: "Summery",
                element: (
                  <NetworksSummery />
                ),
              },
            ]
          },
          {
            path: "profile",
            title: "Profile",
            element: (
              <Profile />
            ),
            children: [
              {
                path: "add-client",
                title: "Add Clinet",
                element: (
                  <p>Add Clinet</p>
                )
              },
              {
                path: "settings",
                title: "Settings",
                element: (
                  <p>Settings</p>
                )
              },
            ]
          },
          {
            path: "reports",
            children: [
              {
                path: "clients",
                title: "Report Clients",
                element: (
                  <ReportClients />
                ),
              },
              {
                path: "store-org",
                title: "Report Store Org",
                element: (
                  <ReportStoreOrg />
                ),
              },
            ]
          },
          {
            path: "users",
            title: "Users",
            element: (
              <Users />
            ),
          },
          {
            path: "transactions-network",
            title: "Transactions Network",
            element: (
              <TransactionsNetwork />
            ),
          },
          {
            path: "client",
            children: [
              {
                path: "",
                title: "Client",
                element: (
                  <ClientManagementPage />
                )
              },
              {
                path: "cheques/:clientId",
                title: "Cheques Management",
                element: (
                  <ChequeManagementPage />
                )
              },
              {
                path: "installments",
                title: "Installments",
                element: (
                  <ClientInstallmentsPage />
                )
              },
            ]
          },
          {
            path: "",
            title: "Home",
            element: (
              <Home />
            ),
          },
        ]
      },
    ]
  },
  {
    path: "*",
    element: (
      <Suspense>
        <NotFound />
      </Suspense>
    ),
  },
];
