import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import ServerSideTable, {
  type ServerSideColumn,
} from "@/components/common/ServerSideTable";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type LogItem = {
  id: number;
  actor_type: string | null;
  actor_id: string | null;
  event_type: string;
  entity_type: string;
  entity_id: string | null;
  message: string | null;
  payload: Record<string, unknown> | null;
  severity: string;
  created_at: string;
};

type LogsResponse = {
  items: LogItem[];
  total: number;
  page: number;
  limit: number;
};

const severityOptions = ["ALL", "INFO", "WARNING", "ERROR"] as const;

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "medium",
    timeZone: "Asia/Jakarta",
  }).format(date);
}

function formatPayload(payload: LogItem["payload"]) {
  if (!payload) {
    return "-";
  }

  const entries = Object.entries(payload);
  if (entries.length === 0) {
    return "-";
  }

  return entries
    .map(([key, value]) => `${key}: ${String(value)}`)
    .join(", ");
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return "Failed to load logs";
}

export default function SysLog() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [severity, setSeverity] =
    useState<(typeof severityOptions)[number]>("ALL");

  const logsQuery = useQuery({
    queryKey: ["sys-log", { search, page, pageSize, severity }],
    queryFn: () =>
      apiGet<LogsResponse>("/routers/logs", {
        search: search || undefined,
        page,
        limit: pageSize,
        severity: severity === "ALL" ? undefined : severity,
      }),
  });

  const columns = useMemo<ServerSideColumn<LogItem>[]>(
    () => [
      {
        key: "created_at",
        header: "Time",
        cell: (row) => (
          <div className="min-w-44 whitespace-normal">{formatDateTime(row.created_at)}</div>
        ),
      },
      {
        key: "severity",
        header: "Severity",
        cell: (row) => (
          <Badge
            variant={
              row.severity === "ERROR"
                ? "destructive"
                : row.severity === "WARNING"
                  ? "secondary"
                  : "outline"
            }
          >
            {row.severity}
          </Badge>
        ),
      },
      {
        key: "event_type",
        header: "Event",
        cell: (row) => (
          <div className="min-w-44 whitespace-normal font-medium">
            {row.event_type}
          </div>
        ),
      },
      {
        key: "actor",
        header: "Actor",
        cell: (row) => (
          <div className="min-w-32 whitespace-normal">
            {row.actor_id ?? "-"}
          </div>
        ),
      },
      {
        key: "entity",
        header: "Entity",
        cell: (row) => (
          <div className="min-w-40 whitespace-normal">
            <div>{row.entity_type}</div>
            <div className="text-muted-foreground">{row.entity_id ?? "-"}</div>
          </div>
        ),
      },
      {
        key: "message",
        header: "Message",
        cell: (row) => (
          <div className="min-w-56 whitespace-normal">{row.message ?? "-"}</div>
        ),
      },
      {
        key: "payload",
        header: "Payload",
        cell: (row) => (
          <div className="min-w-72 whitespace-normal text-muted-foreground">
            {formatPayload(row.payload)}
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>System Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <ServerSideTable
            data={logsQuery.data?.items ?? []}
            columns={columns}
            page={page}
            pageSize={pageSize}
            total={logsQuery.data?.total ?? 0}
            search={search}
            onSearchChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
            searchPlaceholder="Search logs..."
            emptyMessage={
              logsQuery.isError ? getErrorMessage(logsQuery.error) : "No logs found"
            }
            isLoading={logsQuery.isLoading || logsQuery.isFetching}
            toolbarContent={
              <Select
                value={severity}
                onValueChange={(value) => {
                  setSeverity(value as (typeof severityOptions)[number]);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  {severityOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option === "ALL" ? "All severity" : option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
