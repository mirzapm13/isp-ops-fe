import {
  SidebarTrigger,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { TestSidebar } from "./TestSidebar";

export default function TestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <TestSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <SidebarTrigger />
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
