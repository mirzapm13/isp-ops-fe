import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useFetchProfile, usePatchProfile } from "@/hooks/useProfile";
import { Spinner } from "../ui/spinner";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { useState } from "react";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  pppoeName: string;
  routerId: string;
  currentProfile: string;
}

export function EditModal({
  open,
  onOpenChange,
  pppoeName,
  routerId,
  currentProfile,
}: Props) {
  const { data, isLoading, error } = useFetchProfile(routerId);
  const [selectedProfile, setSelectedProfile] = useState(currentProfile);
  const updateProfile = usePatchProfile(pppoeName, routerId);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedProfile(currentProfile);
  }, [open, currentProfile]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl overflow-x-auto">
        <DialogHeader>
          <DialogTitle>
            Edit PPPoE: {pppoeName} | router {routerId}
          </DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <Spinner />
        ) : error ? (
          <div>Failed to get Data</div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            <p>Profile :</p>
            <div className="col-span-2">
              <Select
                value={selectedProfile}
                onValueChange={(value) => {
                  setSelectedProfile(value);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={currentProfile} />
                </SelectTrigger>
                <SelectContent>
                  {data?.map((m) => {
                    return (
                      <SelectItem key={m.id} value={m.name}>
                        {m.name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div></div>
            <div className="col-span-2 flex justify-end">
              <Button
                onClick={() => {
                  updateProfile.mutate(selectedProfile);
                }}
                disabled={updateProfile.isPending}
              >
                {updateProfile.isPending ? "Submitting... " : "Submit"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
