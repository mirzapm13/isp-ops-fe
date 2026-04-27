import { useState } from "react";
import type { PPPoEMatch } from "@/types/pppoe";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PingModal } from "./PingModal";
import { EditModal } from "./EditModal";
import { useDeactivatePPPoE } from "@/hooks/useDectivatePPPoE";
import { useDisableSecret } from "@/hooks/useDisableSecret";
import { useEnableSecret } from "@/hooks/useEnableSecret";
import { useDeleteSecret } from "@/hooks/useDeleteSecret";
import { useRemoteClient } from "@/hooks/useRemoteClient";
import { useAuth } from "@/features/auth/auth.store";
import { hasPermission } from "@/features/auth/auth.utils";

interface Props {
  matches: PPPoEMatch[];
  macAddress: string;
}

interface RowActionProps {
  match: PPPoEMatch;
  onOpenPing: (pppoeName: string, routerId: string) => void;
}

function MacRouterTableActions({ match, onOpenPing }: RowActionProps) {
  const deactivate = useDeactivatePPPoE(match.name);
  const disable = useDisableSecret(match.name);
  const enable = useEnableSecret(match.name);
  const deleteSecret = useDeleteSecret(match.name);
  const remoteClientMutation = useRemoteClient();
  const { user } = useAuth();

  async function openRemoteClient(ip: string, router_id: string) {
    const newTab = window.open("", "_blank");

    try {
      const res = await remoteClientMutation.mutateAsync({
        ip,
        router_id,
      });

      newTab?.location.assign(`http://${res.ip}`);
    } catch (err) {
      newTab?.close();
      console.error("Failed to open remote client:", err);
    }
  }

  return (
    <>
      {hasPermission(user, "see_password") && (
        <TableCell className="p-2">{match.password}</TableCell>
      )}

      {hasPermission(user, "see_ip") && (
        <TableCell className="p-2">
          {match.connection?.ip ? (
            <Button
              variant="outline"
              onClick={() => openRemoteClient(match.connection!.ip, match.router.id)}
            >
              {match.connection.ip}
            </Button>
          ) : (
            "-"
          )}
        </TableCell>
      )}

      <TableCell className="p-2">{match.connection?.uptime ?? "-"}</TableCell>
      <TableCell className="p-2">
        <div className="flex flex-wrap gap-2">
          {match.status === "ACTIVE" && (
            <>
              <Button
                size="sm"
                variant="outline"
                disabled={deactivate.isPending}
                onClick={() => deactivate.mutate(match.router.id)}
              >
                {deactivate.isPending ? "Deactivating…" : "Deactivate"}
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => onOpenPing(match.name, match.router.id)}
              >
                Ping
              </Button>
            </>
          )}

          {match.secret ? (
            <Button
              size="sm"
              variant="outline"
              disabled={enable.isPending}
              onClick={() => enable.mutate(match.router.id)}
            >
              {enable.isPending ? "Enabling...." : "Enable"}
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              disabled={disable.isPending}
              onClick={() => disable.mutate(match.router.id)}
            >
              {disable.isPending ? "Disabling..." : "Disable"}
            </Button>
          )}

          {hasPermission(user, "delete_secret") &&
            match.status !== "ACTIVE" &&
            match.secret && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => deleteSecret.mutate(match.router.id)}
              >
                {deleteSecret.isPending ? "Deleting...." : "Delete"}
              </Button>
            )}
        </div>
      </TableCell>
    </>
  );
}

export function MacRouterTable({ matches, macAddress }: Props) {
  const [pingOpen, setPingOpen] = useState(false);
  const [pingTarget, setPingTarget] = useState<{
    pppoeName: string;
    routerId: string;
  } | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileTarget, setProfileTarget] = useState<{
    pppoeName: string;
    routerId: string;
    currentProfile: string;
  } | null>(null);
  const { user } = useAuth();

  return (
    <>
      <p className="mb-2 text-lg font-semibold">Data MikroTik - {macAddress}</p>
      <div className="overflow-x-auto rounded-lg border">
        <Table className="w-full text-sm">
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="p-2 text-left">PPPoE</TableHead>
              <TableHead className="p-2 text-left">Router</TableHead>
              <TableHead className="p-2 text-left">Active</TableHead>
              <TableHead className="p-2 text-left">Secret</TableHead>
              <TableHead className="p-2 text-left">Profile</TableHead>
              <TableHead className="p-2 text-left">Comment</TableHead>
              <TableHead className="p-2 text-left">Matched By</TableHead>
              {hasPermission(user, "see_password") && (
                <TableHead className="p-2 text-left">Password</TableHead>
              )}
              {hasPermission(user, "see_ip") && (
                <TableHead className="p-2 text-left">IP (Remote)</TableHead>
              )}
              <TableHead className="p-2 text-left">Uptime</TableHead>
              <TableHead className="p-2 text-left">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {matches.map((match) => (
              <TableRow
                key={`${match.router.id}-${match.name}-${match.matched_by ?? "mac"}`}
                className="border-t"
              >
                <TableCell className="p-2 font-medium">{match.name}</TableCell>
                <TableCell className="p-2">{match.router.name}</TableCell>
                <TableCell className="p-2">
                  <Badge
                    variant={
                      match.status === "ACTIVE" ? "default" : "destructive"
                    }
                  >
                    <p className="text-white">{match.status}</p>
                  </Badge>
                </TableCell>
                <TableCell className="p-2">
                  <Badge variant={match.secret ? "destructive" : "default"}>
                    <p className="text-white">
                      {match.secret ? <>DISABLED</> : <>ENABLED</>}
                    </p>
                  </Badge>
                </TableCell>
                <TableCell className="p-2">
                  {hasPermission(user, "change-profile") ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setProfileTarget({
                          pppoeName: match.name,
                          routerId: match.router.id,
                          currentProfile: match.profile,
                        });
                        setProfileOpen(true);
                      }}
                    >
                      {match.profile}
                    </Button>
                  ) : (
                    <>{match.profile}</>
                  )}
                </TableCell>
                <TableCell className="p-2">{match.comment || "-"}</TableCell>
                <TableCell className="p-2">
                  <div className="space-y-1">
                    <p>{match.matched_by ?? "-"}</p>
                    <p className="text-muted-foreground text-xs">
                      {match.matched_mac ?? "-"}
                    </p>
                  </div>
                </TableCell>
                <MacRouterTableActions
                  match={match}
                  onOpenPing={(pppoeName, routerId) => {
                    setPingTarget({ pppoeName, routerId });
                    setPingOpen(true);
                  }}
                />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {pingTarget && (
        <PingModal
          open={pingOpen}
          onOpenChange={setPingOpen}
          pppoeName={pingTarget.pppoeName}
          routerId={pingTarget.routerId}
        />
      )}
      {profileTarget && (
        <EditModal
          open={profileOpen}
          onOpenChange={setProfileOpen}
          pppoeName={profileTarget.pppoeName}
          routerId={profileTarget.routerId}
          currentProfile={profileTarget.currentProfile}
        />
      )}
    </>
  );
}
