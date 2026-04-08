import { AppSidebar } from "@/components/navigation/AppSidebar";
// import { Topbar } from "@/components/navigation/Topbar";
import { Outlet } from "react-router-dom";
import {
  SidebarTrigger,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/auth.store";
import { useLogout } from "@/features/auth/auth.queries";
import { User } from "lucide-react";

export default function DashboardLayout() {
  const { user } = useAuth();
  const logoutMutation = useLogout();

  return (
    <SidebarProvider>
      {/* <div className="min-h-screen flex"> */}
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-14 border-b bg-background flex items-center justify-between px-6">
          <div className="flex items-center">
            <SidebarTrigger />
            <div className="text-sm text-muted-foreground">
              Network Operations Dashboard
            </div>
          </div>
          <div className="flex items-center gap-10">
            <p className="text-sm flex items-center gap-3">
              <User />
              Hello, {user?.username.toString() ?? "Failed to fetch user"}
            </p>
            <Button
              className="cursor-pointer"
              variant={"link"}
              onClick={() => {
                logoutMutation.mutate();
              }}
            >
              Logout
            </Button>
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
