import { apiGet, apiGetBlob, apiPost, apiUpload } from "@/lib/api";
import type {
  WaBroadcastRun,
  WaBroadcastRunsPaginatedResponse,
  WaPreviewRequest,
  WaPreviewResponse,
  WaStartBroadcastRequest,
  WaTemplatesResponse,
  WaUploadResponse,
} from "./waBroadcast.types";

export const waBroadcastService = {
  getTemplates() {
    return apiGet<WaTemplatesResponse>("/wa-broadcast/templates");
  },

  uploadFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return apiUpload<WaUploadResponse>("/wa-broadcast/upload", formData);
  },

  previewPayload(data: WaPreviewRequest) {
    return apiPost<WaPreviewResponse>("/wa-broadcast/preview", data);
  },

  startBroadcast(data: WaStartBroadcastRequest) {
    return apiPost<WaBroadcastRun>("/wa-broadcast/start", data);
  },

  getRuns(params?: { page?: number; limit?: number }) {
    return apiGet<WaBroadcastRunsPaginatedResponse>("/wa-broadcast/runs", params);
  },

  getRunDetail(runId: number) {
    return apiGet<WaBroadcastRun>(`/wa-broadcast/runs/${runId}`);
  },

  stopRun(runId: number) {
    return apiPost<WaBroadcastRun>(`/wa-broadcast/runs/${runId}/stop`, {});
  },

  async downloadRunCsv(runId: number) {
    const blob = await apiGetBlob(`/wa-broadcast/runs/${runId}/csv`);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `qiscus_broadcast_results_${runId}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  },
};
