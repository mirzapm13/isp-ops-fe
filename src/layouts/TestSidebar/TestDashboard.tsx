import { SidebarTrigger } from "@/components/ui/sidebar";

export function TestDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
      <p className="text-muted-foreground">
        Overview and quick stats will appear here. <SidebarTrigger />
      </p>
    </div>
  );
}
