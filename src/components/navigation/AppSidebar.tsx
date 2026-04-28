import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { useAuth } from "@/features/auth/auth.store";
// import { hasRole } from "@/features/auth/auth.utils";

import {
  EyeIcon,
  ListRestart,
  Table2,
  Plus,
  FileClock,
  Boxes,
  ScanSearch,
} from "lucide-react";

const menu = [
  {
    label: "PPPoE Lookup",
    path: "/subscribers",
    icon: EyeIcon,
    roles: ["Superadmin", "Technician", "PKL"],
  },
  {
    label: "Search by MAC",
    path: "/subscribers/mac",
    icon: ScanSearch,
    roles: ["Superadmin", "Technician", "PKL"],
  },
  {
    label: "Matching Table",
    path: "/matching-table",
    icon: Table2,
    roles: ["Superadmin"],
  },
  {
    label: "Update Billing",
    path: "/update-billing",
    icon: ListRestart,
    roles: ["Superadmin"],
  },
  {
    label: "Create PPPoE Secret",
    path: "/create-secret",
    icon: Plus,
    roles: ["Superadmin", "Technician", "PKL"],
  },
  {
    label: "Sys Log",
    path: "/sys-log",
    icon: FileClock,
    roles: ["Superadmin"],
  },
  {
    label: "IMS",
    path: "/work-in-progress",
    icon: Boxes,
    roles: ["Superadmin"],
  },
];

export function AppSidebar() {
  const { user } = useAuth();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menu
                .filter((item) => {
                  if (!item.roles) return true;
                  return item.roles.some((r) => user?.roles.includes(r));
                })
                .map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild>
                      <a href={item.path}>
                        <item.icon />
                        <span>{item.label}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
