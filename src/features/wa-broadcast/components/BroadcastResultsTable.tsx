import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, Eye } from "lucide-react";
import { waBroadcastService } from "../waBroadcast.service";
import type { WaBroadcastLogItem, WaBroadcastRun } from "../waBroadcast.types";

interface Props {
  run: WaBroadcastRun;
}

function getStatusBadgeVariant(status: string) {
  switch (status) {
    case "SUCCESS":
      return "default";
    case "DRY_RUN":
      return "secondary";
    case "SKIPPED":
      return "outline";
    case "FAILED":
      return "destructive";
    default:
      return "outline";
  }
}

export default function BroadcastResultsTable({ run }: Props) {
  const [search, setSearch] = useState("");
  const [selectedLog, setSelectedLog] = useState<WaBroadcastLogItem | null>(
    null
  );
  const [downloading, setDownloading] = useState(false);

  const results = run.results ?? [];

  const filteredResults = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return results;
    return results.filter(
      (r) =>
        r.phone.toLowerCase().includes(q) ||
        r.id_pelanggan.toLowerCase().includes(q) ||
        r.nama_pelanggan.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q) ||
        r.error.toLowerCase().includes(q)
    );
  }, [results, search]);

  const handleDownloadCsv = async () => {
    try {
      setDownloading(true);
      await waBroadcastService.downloadRunCsv(run.id);
    } finally {
      setDownloading(false);
    }
  };

  const formatJsonPretty = (raw: string) => {
    if (!raw) return "-";
    try {
      return JSON.stringify(JSON.parse(raw), null, 2);
    } catch {
      return raw;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-lg">
            Broadcast Results — Run #{run.id} ({run.filename})
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Template: <span className="font-mono">{run.template_name}</span> |{" "}
            Mode: {run.dry_run ? "Dry Run" : "Live"} | Processed:{" "}
            {run.processed}/{run.total}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Filter phone, customer, status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-60"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadCsv}
            disabled={downloading || results.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            {downloading ? "Exporting..." : "Download CSV"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {filteredResults.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No row logs recorded yet.
          </div>
        ) : (
          <div className="max-h-[480px] overflow-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Row</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>HTTP</TableHead>
                  <TableHead>Message ID / WA ID</TableHead>
                  <TableHead>Error</TableHead>
                  <TableHead className="w-20 text-right">Raw JSON</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResults.map((item) => (
                  <TableRow key={item.id ?? item.excel_row}>
                    <TableCell className="font-mono text-xs">
                      #{item.excel_row}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">
                        {item.nama_pelanggan || "-"}
                      </div>
                      {item.id_pelanggan && (
                        <div className="text-xs text-muted-foreground font-mono">
                          {item.id_pelanggan}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {item.phone || "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(item.status)}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {item.http_status || "-"}
                    </TableCell>
                    <TableCell className="font-mono text-xs max-w-44 truncate">
                      <div>{item.message_id || "-"}</div>
                      {item.wa_id && (
                        <div className="text-muted-foreground">
                          WA: {item.wa_id}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-destructive max-w-60 truncate">
                      {item.error || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedLog(item)}
                        title="View Payload & API Response"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <Dialog
        open={selectedLog !== null}
        onOpenChange={(open) => !open && setSelectedLog(null)}
      >
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Row #{selectedLog?.excel_row} — {selectedLog?.phone || "No Phone"}{" "}
              ({selectedLog?.status})
            </DialogTitle>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4 text-xs">
              {selectedLog.error && (
                <div className="rounded-md bg-destructive/10 p-3 text-destructive">
                  <strong>Error:</strong> {selectedLog.error}
                </div>
              )}
              <div>
                <div className="font-semibold mb-1">Generated Payload:</div>
                <pre className="rounded-md bg-muted p-3 overflow-x-auto font-mono text-xs">
                  {formatJsonPretty(selectedLog.payload)}
                </pre>
              </div>
              <div>
                <div className="font-semibold mb-1">Qiscus API Response:</div>
                <pre className="rounded-md bg-muted p-3 overflow-x-auto font-mono text-xs">
                  {formatJsonPretty(selectedLog.response)}
                </pre>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
