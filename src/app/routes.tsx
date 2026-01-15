import { DashboardLayout } from "@/layouts/DashboardLayout";
import Dashboard from "@/pages/Dashboard";
import Subscribers from "@/pages/Subscribers";
import Routers from "@/pages/Routers";
import { MatchingTable } from "@/pages/MatchingTable";
import UpdateBilling from "@/pages/UpdateBilling";
import BulkIsolir from "@/pages/BulkIsolir";
import TestLayout from "@/layouts/TestSidebar/TestLayout";
import { TestDashboard } from "@/layouts/TestSidebar/TestDashboard";

export const routes = [
  {
    path: "Test",
    element: <TestLayout children={<TestDashboard />} />,
  },
  {
    element: <DashboardLayout />,
    children: [
      { path: "/", element: <Dashboard /> },
      { path: "/subscribers", element: <Subscribers /> },
      { path: "/routers", element: <Routers /> },
      { path: "/matching-table", element: <MatchingTable /> },
      { path: "/update-billing", element: <UpdateBilling /> },
      { path: "/bulk-isolir", element: <BulkIsolir /> },
    ],
  },
];
