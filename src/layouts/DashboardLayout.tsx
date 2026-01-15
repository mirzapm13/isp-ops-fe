import { AppSidebar } from "@/components/navigation/AppSidebar";
// import { Topbar } from "@/components/navigation/Topbar";
import { Outlet } from "react-router-dom";
import {
  SidebarTrigger,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

export function DashboardLayout() {
  return (
    <SidebarProvider>
      {/* <div className="min-h-screen flex"> */}
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-14 border-b bg-background flex items-center px-6">
          <SidebarTrigger />
          <div className="text-sm text-muted-foreground">
            Network Operations Dashboard
          </div>
        </header>
        <SidebarInset>
          <main className="flex-1 p-6 bg-muted/40 max-w-dvw">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
      {/* </div> */}
    </SidebarProvider>
  );
}
