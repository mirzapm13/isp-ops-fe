import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ServerSideTable, {
  type ServerSideColumn,
} from "@/components/common/ServerSideTable";
import { useBillingCustomers } from "@/hooks/useBillingCustomers";
import { useDebounce } from "@/hooks/useDebounce";
import type { BillingRow } from "@/types/billing";

export default function BillingCustomers() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);
  }, [debouncedSearch]);

  const { data, isLoading, isFetching } = useBillingCustomers({
    search: debouncedSearch,
    page,
    limit: pageSize,
  });

  const columns: ServerSideColumn<BillingRow>[] = [
    {
      key: "id_pelanggan",
      header: "ID Pelanggan",
      cell: (row) => row.id_pelanggan || "-",
    },
    {
      key: "nama_pelanggan",
      header: "Nama Pelanggan",
      cell: (row) => row.nama_pelanggan || "-",
    },
    {
      key: "ip_secret",
      header: "IP / Secret",
      cell: (row) =>
        row.ip_secret ? (
          <Link
            to={`/subscribers?query=${encodeURIComponent(row.ip_secret)}`}
            className="text-primary font-medium hover:underline"
          >
            {row.ip_secret}
          </Link>
        ) : (
          "-"
        ),
    },
    {
      key: "alamat",
      header: "Alamat",
      cell: (row) => row.alamat || "-",
    },
    {
      key: "tlp",
      header: "Telepon",
      cell: (row) => row.tlp || "-",
    },
    {
      key: "nama_langganan",
      header: "Langganan",
      cell: (row) => row.nama_langganan || "-",
    },
    {
      key: "harga",
      header: "Harga",
      cell: (row) =>
        row.harga != null
          ? `Rp ${Number(row.harga).toLocaleString("id-ID")}`
          : "-",
    },
    // {
    //   key: "status_langganan",
    //   header: "Status",
    //   cell: (row) => row.status_langganan || "-",
    // },
    // {
    //   key: "nama_router",
    //   header: "Router",
    //   cell: (row) => row.nama_router || "-",
    // },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Billing Customers</h1>

      <ServerSideTable
        data={data?.data || []}
        columns={columns}
        page={page}
        pageSize={pageSize}
        total={data?.pagination.total || 0}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by ID, IP/Secret, Name, or Phone..."
        onPageChange={(newPage) => setPage(newPage)}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPage(1);
        }}
        isLoading={isLoading || isFetching}
      />
    </div>
  );
}
