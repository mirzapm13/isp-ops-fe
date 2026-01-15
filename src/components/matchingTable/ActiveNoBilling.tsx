import { DataTable } from "../common/DataTable";
import type { MatchRow } from "@/types/matchingTable";

export function ActiveNoBilling({ rows }: { rows: MatchRow[] }) {
  return (
    <DataTable<MatchRow>
      data={rows}
      searchPlaceholder="Search PPPoE..."
      columns={[
        {
          header: "Username",
          accessor: (r) => r.name,
          searchable: true,
        },
        {
          header: "Comment",
          accessor: (r) => r.comment,
          searchable: true,
        },
        {
          header: "Profile",
          accessor: (r) => r.profile,
          searchable: true,
        },
        {
          header: "Uptime",
          accessor: (r) => r.uptime,
          searchable: true,
        },
        {
          header: "IP",
          accessor: (r) => r.ip,
          searchable: true,
        },
        {
          header: "Router Name",
          accessor: (r) => r.router_name,
          searchable: true,
        },
        // {
        //   header: "Nama",
        //   accessor: (r) => r.nama_pelanggan,
        //   searchable: true,
        // },
        // {
        //   header: "Langganan",
        //   accessor: (r) => r.nama_langganan,
        //   searchable: true,
        // },
        // {
        //   header: "Harga",
        //   accessor: (r) => `Rp ${r.harga?.toLocaleString("id-ID") && 0}`,
        // },
        // {
        //   header: "Status",
        //   accessor: (r) => (
        //     <Badge
        //       variant={r.status_langganan === "On" ? "default" : "destructive"}
        //     >
        //       {r.status_langganan}
        //     </Badge>
        //   ),
        // },
      ]}
    />
  );
}
