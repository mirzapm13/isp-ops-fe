import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { usePing } from "@/hooks/usePing";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  pppoeName: string;
  routerId: string;
}

export function PingModal({ open, onOpenChange, pppoeName, routerId }: Props) {
  const ping = usePing();
  const [count, setCount] = useState(5);

  const runPing = () => {
    ping.mutate({
      pppoeName,
      router_id: routerId,
      count,
    });
  };

  const result = ping.data?.results;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl overflow-x-auto">
        <DialogHeader>
          <DialogTitle>Ping PPPoE Session</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          {/* Meta info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>PPPoE:</strong> {pppoeName}
            </div>
            <div>
              <strong>Router:</strong> {ping.data?.router.name ?? routerId}
            </div>
            <div>
              <strong>Target:</strong> {ping.data?.target ?? "-"}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <span>Count</span>
            <Input
              type="number"
              min={1}
              max={20}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-24"
            />
            <Button onClick={runPing} disabled={ping.isPending}>
              {ping.isPending ? "Pinging…" : "Run Ping"}
            </Button>
          </div>

          {/* Summary */}
          {ping.isSuccess && result && (
            <div className="flex gap-3">
              <Badge variant="outline">Sent: {result.sent}</Badge>
              <Badge variant="outline">Received: {result.received}</Badge>
              <Badge
                variant={result.loss_percent === 0 ? "default" : "destructive"}
              >
                Loss: {result.loss_percent}%
              </Badge>
              <Badge variant="outline">Avg: {result.avg_ms} ms</Badge>
            </div>
          )}

          {/* Details table */}
          {ping.isSuccess && result && (
            <div className="border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>TTL</TableHead>
                    <TableHead>Min RTT</TableHead>
                    <TableHead>Avg RTT</TableHead>
                    <TableHead>Max RTT</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.details.map((d) => (
                    <TableRow key={d.seq}>
                      <TableCell>{d.seq + 1}</TableCell>
                      <TableCell>{d.time}</TableCell>
                      <TableCell>{d.ttl}</TableCell>
                      <TableCell>{d["min-rtt"]}</TableCell>
                      <TableCell>{d["avg-rtt"]}</TableCell>
                      <TableCell>{d["max-rtt"]}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Error */}
          {ping.isError && (
            <div className="text-destructive">
              {ping.error?.message ?? "Ping failed"}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
