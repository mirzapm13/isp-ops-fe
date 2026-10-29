export type ButtonSubType = "quick_reply" | "url";

export interface WaButtonConfig {
  index: number;
  sub_type: ButtonSubType;
  column: string;
}

export interface WaTemplatePreset {
  name: string;
  description: string;
  namespace?: string;
  language_code: string;
  phone_column: string;
  header_columns: string[];
  body_columns: string[];
  currency_columns: string[];
  buttons: WaButtonConfig[];
}

export interface WaResolvedMapping {
  namespace?: string;
  template_name: string;
  language_code: string;
  phone_column: string;
  header_columns: string[];
  body_columns: string[];
  currency_columns: string[];
  buttons: WaButtonConfig[];
}

export interface WaTemplatesResponse {
  qiscus_configured: boolean;
  default_namespace: string;
  default_language_code: string;
  templates: Record<string, WaTemplatePreset>;
  active_run_id: number | null;
}

export interface WaUploadResponse {
  upload_id: string;
  filename: string;
  row_count: number;
  header_row: number;
  first_data_row: number;
  columns: string[];
  default_currency_columns: string[];
  preset_mappings: Record<string, WaResolvedMapping>;
}

export interface WaPreviewRequest {
  upload_id: string;
  excel_row: number;
  phone_column: string;
  namespace?: string;
  template_name: string;
  language_code: string;
  body_columns: string[];
  header_columns: string[];
  buttons: WaButtonConfig[];
  currency_columns: string[];
}

export interface WaPreviewResponse {
  excel_row: number;
  raw_phone: string;
  normalized_phone: string;
  payload: Record<string, unknown>;
}

export interface WaStartBroadcastRequest {
  upload_id: string;
  phone_column: string;
  namespace?: string;
  template_name: string;
  language_code: string;
  body_columns: string[];
  header_columns: string[];
  buttons: WaButtonConfig[];
  currency_columns: string[];
  delay_seconds: number;
  dry_run: boolean;
}

export interface WaBroadcastLogItem {
  id: number;
  run_id: number;
  excel_row: number;
  id_pelanggan: string;
  nama_pelanggan: string;
  phone: string;
  phone_number: string;
  status: "SUCCESS" | "FAILED" | "SKIPPED" | "DRY_RUN" | string;
  http_status: number | string;
  message_id: string;
  wa_id: string;
  payload: string;
  response: string;
  error: string;
  sent_at: string | null;
  created_at: string | null;
}

export interface WaBroadcastRun {
  id: number;
  filename: string;
  template_name: string;
  namespace: string;
  language_code: string;
  dry_run: boolean;
  delay_seconds: number;
  status: "RUNNING" | "COMPLETED" | "STOPPED" | "FAILED" | string;
  running: boolean;
  done: boolean;
  stop_requested: boolean;
  total: number;
  processed: number;
  success: number;
  failed: number;
  message: string;
  created_by: string | null;
  started_at: string | null;
  finished_at: string | null;
  results?: WaBroadcastLogItem[];
}

export interface WaBroadcastRunsPaginatedResponse {
  items: WaBroadcastRun[];
  total: number;
  page: number;
  limit: number;
}
