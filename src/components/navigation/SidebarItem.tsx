import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  path: string;
}

export function SidebarItem({ label, path }: Props) {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        cn(
          "block rounded px-3 py-2 text-sm transition-colors",
          isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
        )
      }
    >
      {label}
    </NavLink>
  );
}
