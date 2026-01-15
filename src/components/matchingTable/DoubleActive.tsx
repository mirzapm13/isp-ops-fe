import { DataTable } from "../common/DataTable";
import type { MatchRow } from "@/types/matchingTable";

export function DoubleActive({ rows }: { rows: MatchRow[] }) {
  return (
    <DataTable<MatchRow>
      data={rows}
      searchPlaceholder="Search PPPoE..."
      columns={[
        {
          header: "ID Pelanggan",
          accessor: (r) => r.id_pelanggan,
          searchable: true,
        },
        {
          header: "Nama Pelanggan",
          accessor: (r) => r.nama_pelanggan,
          searchable: true,
        },
        {
          header: "IP/Secret",
          accessor: (r) => r.ip_secret,
          searchable: true,
        },
        {
          header: "Nama Router",
          accessor: (r) => r.router_name,
          searchable: true,
        },
        {
          header: "Nama Langganan",
          accessor: (r) => r.nama_langganan,
          searchable: true,
        },
        {
          header: "Harga",
          //   accessor: (r) => `Rp ${r.harga?.toLocaleString("id-ID")}`,
          accessor: (r) => r.harga,
        },
        {
          header: "Status Langganan",
          accessor: (r) => r.status_langganan,
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
