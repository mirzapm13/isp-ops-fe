import type { BillingRow } from "@/types/billing";
import { Button } from "../ui/button";
import { formatIndonesianNumber } from "@/lib/intl_wa";
// import { Badge } from "@/components/ui/badge";
// import { hasRole } from "@/features/auth/auth.utils";
// import { useAuth } from "@/features/auth/auth.store";

interface Props {
  rows: BillingRow[];
}

// function normalize(value: string | null | undefined) {
//   if (!value) return "-";
//   if (value === "NaN") return "-";
//   return value;
// }

export function BillingTable({ rows }: Props) {
  // const { user } = useAuth();

  const openWA = (phoneNumber: string) => {
    window.open(
      `https://wa.me/${formatIndonesianNumber(phoneNumber)}`,
      "noopener,noreferrer",
    );
  };

  if (rows.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">No billing data found</div>
    );
  }

  return (
    <>
      <p className="text-lg mb-2 font-semibold">Data Billing</p>
      <div className="border rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="p-2 text-left">ID Pelanggan</th>
              <th className="p-2 text-left">Nama</th>
              <th className="p-2 text-left">Alamat</th>
              <th className="p-2 text-left">Tlp</th>
              <th className="p-2 text-left">Langganan</th>
              <th className="p-2 text-left">Secret</th>
              <th className="p-2 text-left">Harga</th>
              {/* {!hasRole(user, "Technician") && ( */}
              <>
                {/* <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Jatuh Tempo</th>
                <th className="p-2 text-left">Router</th>
                <th className="p-2 text-left">OLT</th>
                <th className="p-2 text-left">ODP</th> */}
                <th className="p-2 text-left">Source</th>
              </>
              {/* )} */}
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t">
                <td className="p-2">{row.id_pelanggan}</td>
                <td className="p-2">{row.nama_pelanggan}</td>
                <td className="p-2">{row.alamat}</td>
                <td className="p-2 flex gap-2 items-center">
                  {row.tlp}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      openWA(row.tlp);
                    }}
                  >
                    WA
                  </Button>
                </td>
                <td className="p-2">{row.nama_langganan}</td>
                <td className="p-2">{row.ip_secret}</td>
                <td className="p-2">Rp {row.harga.toLocaleString("id-ID")}</td>

                {/* {!hasRole(user, "Technician") && ( */}
                <>
                  {/* <td className="p-2">
                    <Badge
                      variant={
                        row.status_langganan === "On"
                          ? "default"
                          : "destructive"
                      }
                    >
                      {row.status_langganan}
                    </Badge>
                  </td>
                  <td className="p-2">{normalize(row.jatuh_tempo)}</td>
                  <td className="p-2">{normalize(row.nama_router)}</td>
                  <td className="p-2">{normalize(row.id_olt)}</td>
                  <td className="p-2">{normalize(row.id_odp)}</td> */}
                  <td className="p-2 text-xs text-muted-foreground">
                    {row.source_file}
                  </td>
                </>
                {/* )} */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
