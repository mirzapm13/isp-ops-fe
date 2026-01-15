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

import { EyeIcon, ListRestart, Table2 } from "lucide-react";

const menu = [
  // { label: "Dashboard", path: "/" },
  { label: "PPPoE Lookup", path: "/subscribers", icon: EyeIcon },
  // { label: "Routers", path: "/routers" },
  { label: "Matching Table", path: "/matching-table", icon: Table2 },
  { label: "Update Billing", path: "/update-billing", icon: ListRestart },
  // { label: "Bulk Isolir", path: "/bulk-isolir", icon: Lock },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menu.map((item) => (
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

    // <aside className="w-64 border-r bg-background">
    //   <div className="p-4 text-lg font-bold border-b">ISP Ops</div>

    //   <nav className="p-2 space-y-1">
    //     {menu.map((item) => (
    //       <SidebarItem key={item.path} {...item} />
    //     ))}
    //   </nav>
    // </aside>
  );
}
