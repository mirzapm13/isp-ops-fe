import type { PPPoEMatch } from "@/types/pppoe";
import { Badge } from "@/components/ui/badge";
import { Button } from "../ui/button";
import { useState } from "react";
import { PingModal } from "./PingModal";
import { useDeactivatePPPoE } from "@/hooks/useDectivatePPPoE";
import { useDisableSecret } from "@/hooks/useDisableSecret";
import { useEnableSecret } from "@/hooks/useEnableSecret";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDeleteSecret } from "@/hooks/useDeleteSecret";
import { EditModal } from "./EditModal";
import { useAuth } from "@/features/auth/auth.store";
import { hasPermission } from "@/features/auth/auth.utils";
import { useRemoteClient } from "@/hooks/useRemoteClient";

interface Props {
  matches: PPPoEMatch[];
  username: string;
}

export function RouterTable({ matches, username }: Props) {
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

  const deactivate = useDeactivatePPPoE(username);
  const disable = useDisableSecret(username);
  const enable = useEnableSecret(username);
  const deleteSecret = useDeleteSecret(username);
  const remoteClientMutation = useRemoteClient();
  const { user } = useAuth();

  // async function openRemoteClient(
  //   ip: string,
  //   router_id: string,
  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   mutateAsync: (vars: { ip: string; router_id: string }) => Promise<any>,
  // ) {
  //   // const newTab = window.open("", "_blank");
  //   // const newTab = window.open("about:blank", "_blank");

  //   try {
  //     const res = await mutateAsync({
  //       ip,
  //       router_id,
  //     });

  //     console.log(res);

  //     // newTab?.location.assign(`http://${res.ip}`);

  //     // if (newTab) {
  //     //   newTab.location.href = `http://${res.ip}`;
  //     // }

  //     window.open(`http://${res.ip}`, "_self");
  //   } catch (err) {
  //     // newTab?.close();
  //     console.error("Failed to open remote client:", err);
  //   }
  // }

  async function openRemoteClient(ip: string, router_id: string) {
    const newTab = window.open("about:blank", "_blank");

    if (!newTab) {
      alert("Popup blocked");
      return;
    }

    // Immediately write something → keeps tab "alive"
    newTab.document.write(`
    <html>
      <head><title>Connecting...</title></head>
      <body>
        <p>Connecting to router...</p>
      </body>
    </html>
  `);

    try {
      const res = await remoteClientMutation.mutateAsync({ ip, router_id });

      // Now navigate
      newTab.location.href = `http://${res.ip}`;
    } catch (err) {
      newTab.document.body.innerHTML = "Failed to connect";
      console.error(err);
    }
  }

  return (
    <>
      <p className="text-lg mb-2 font-semibold">Data MikroTik - {username}</p>
      <div className="border rounded-lg overflow-x-auto">
        <Table className="w-full text-sm">
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="p-2 text-left">Router</TableHead>
              <TableHead className="p-2 text-left">Active</TableHead>
              <TableHead className="p-2 text-left">Secret</TableHead>
              <TableHead className="p-2 text-left">Profile</TableHead>
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
            {matches.map((m) => (
              <TableRow key={m.router.id} className="border-t">
                <TableCell className="p-2">{m.router.name}</TableCell>
                <TableCell className="p-2">
                  <Badge
                    variant={m.status === "ACTIVE" ? "default" : "destructive"}
                  >
                    <p className="text-white">{m.status}</p>
                  </Badge>
                </TableCell>
                <TableCell className="p-2">
                  <Badge variant={m.secret ? "destructive" : "default"}>
                    <p className="text-white">
                      {m.secret ? <>DISABLED</> : <>ENABLED</>}
                    </p>
                  </Badge>
                </TableCell>
                <TableCell className="p-2">
                  {hasPermission(user, "change-profile") ? (
                    <Button
                      size={"sm"}
                      variant={"outline"}
                      onClick={() => {
                        setProfileTarget({
                          pppoeName: username,
                          routerId: m.router.id,
                          currentProfile: m.profile,
                        });
                        setProfileOpen(true);
                      }}
                    >
                      {m.profile}
                    </Button>
                  ) : (
                    <>{m.profile}</>
                  )}

                  {/* <Button
                    size={"sm"}
                    variant={"outline"}
                    onClick={() => {
                      setProfileTarget({
                        pppoeName: username,
                        routerId: m.router.id,
                        currentProfile: m.profile,
                      });
                      setProfileOpen(true);
                    }}
                  >
                    {m.profile}
                  </Button> */}
                </TableCell>

                {hasPermission(user, "see_password") && (
                  <TableCell className="p-2">{m.password}</TableCell>
                )}

                {hasPermission(user, "see_password") && (
                  <TableCell className="p-2">
                    {m.connection?.ip ? (
                      <Button
                        variant={"outline"}
                        onClick={() => {
                          if (!m.connection?.ip) return;

                          openRemoteClient(
                            m.connection.ip,
                            m.router.id,
                            // remoteClientMutation.mutateAsync,
                          );
                        }}
                      >
                        {m.connection?.ip}
                      </Button>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                )}

                <TableCell className="p-2">
                  {m.connection?.uptime ?? "-"}
                </TableCell>
                <TableCell className="p-2 flex space-x-2">
                  {m.status === "ACTIVE" && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={m.status !== "ACTIVE" || deactivate.isPending}
                        onClick={() => deactivate.mutate(m.router.id)}
                      >
                        {deactivate.isPending ? "Deactivating…" : "Deactivate"}
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setPingTarget({
                            pppoeName: username,
                            routerId: m.router.id,
                          });
                          setPingOpen(true);
                        }}
                      >
                        Ping
                      </Button>
                    </>
                  )}

                  {m.secret ? (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={enable.isPending}
                      onClick={() => enable.mutate(m.router.id)}
                    >
                      {enable.isPending ? "Enabling...." : "Enable"}
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={disable.isPending}
                      onClick={() => disable.mutate(m.router.id)}
                    >
                      {disable.isPending ? "Disabling..." : "Disable"}
                    </Button>
                  )}

                  {hasPermission(user, "delete_secret") &&
                    m.status !== "ACTIVE" &&
                    m.secret && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteSecret.mutate(m.router.id)}
                      >
                        {deleteSecret.isPending ? "Deleting...." : "Delete"}
                      </Button>
                    )}
                </TableCell>
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
