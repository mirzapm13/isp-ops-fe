import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { waBroadcastService } from "./waBroadcast.service";
import type {
  WaPreviewRequest,
  WaStartBroadcastRequest,
} from "./waBroadcast.types";

export function useWaTemplates() {
  return useQuery({
    queryKey: ["wa-broadcast-templates"],
    queryFn: () => waBroadcastService.getTemplates(),
  });
}

export function useUploadWaFile() {
  return useMutation({
    mutationFn: (file: File) => waBroadcastService.uploadFile(file),
  });
}

export function usePreviewWaPayload() {
  return useMutation({
    mutationFn: (data: WaPreviewRequest) =>
      waBroadcastService.previewPayload(data),
  });
}

export function useStartWaBroadcast() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: WaStartBroadcastRequest) =>
      waBroadcastService.startBroadcast(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wa-broadcast-runs"] });
    },
  });
}

export function useStopWaBroadcast() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (runId: number) => waBroadcastService.stopRun(runId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["wa-broadcast-run", data.id] });
      queryClient.invalidateQueries({ queryKey: ["wa-broadcast-runs"] });
    },
  });
}

export function useWaBroadcastRun(runId: number | null) {
  return useQuery({
    queryKey: ["wa-broadcast-run", runId],
    queryFn: () => waBroadcastService.getRunDetail(runId!),
    enabled: runId !== null,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data && data.running) {
        return 1000;
      }
      return false;
    },
  });
}

export function useWaBroadcastRuns(page = 1, limit = 10) {
  return useQuery({
    queryKey: ["wa-broadcast-runs", { page, limit }],
    queryFn: () => waBroadcastService.getRuns({ page, limit }),
  });
}
