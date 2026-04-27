import DashboardLayout from "@/layouts/DashboardLayout";
import Dashboard from "@/pages/Dashboard";
import Subscribers from "@/pages/Subscribers";
import SubscribersByMac from "@/pages/SubscribersByMac";
import Routers from "@/pages/Routers";
import MatchingTable from "@/pages/MatchingTable";
import UpdateBilling from "@/pages/UpdateBilling";
import BulkIsolir from "@/pages/BulkIsolir";
// import TestLayout from "@/layouts/TestSidebar/TestLayout";
// import TestDashboard from "@/layouts/TestSidebar/TestDashboard";
import CreateSecret from "@/features/pppoe-secret/pages/CreateSecret";
import SysLog from "@/features/sys-log/pages/SysLog";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { PublicRoute } from "@/routes/PublicRoute";
import WorkInProgress from "@/pages/WorkInProgress";
// import { ProtectedRoute } from "@/routes/ProtectedRoute";

export const routes = [
  {
    path: "/",
    children: [
      {
        element: <PublicRoute />,
        children: [{ path: "login", element: <LoginPage /> }],
      },

      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              { index: true, element: <Dashboard /> },
              { path: "subscribers", element: <Subscribers /> },
              { path: "subscribers/mac", element: <SubscribersByMac /> },
              { path: "routers", element: <Routers /> },
              { path: "matching-table", element: <MatchingTable /> },
              { path: "update-billing", element: <UpdateBilling /> },
              { path: "bulk-isolir", element: <BulkIsolir /> },
              { path: "create-secret", element: <CreateSecret /> },
              { path: "sys-log", element: <SysLog /> },
              { path: "work-in-progress", element: <WorkInProgress /> },
            ],
          },
        ],
      },
    ],
  },
];
