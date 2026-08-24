export interface BillingRow {
  id: number;
  id_pelanggan: string;
  ip_secret: string;
  nama_pelanggan: string;
  nama_langganan: string;
  alamat: string;
  tlp: string;
  harga: number;
  status_langganan: string;
  jatuh_tempo: string;
  nama_router: string;
  id_olt: string;
  id_odp: string;
  source_file: string;
  imported_at: string;
}

export interface BillingResponse {
  ip_secret: string;
  count: number;
  data: BillingRow[];
}
