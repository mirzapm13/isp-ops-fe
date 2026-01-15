import { useMutation } from "@tanstack/react-query";
import { uploadIsolirFile } from "@/api/billing";

export function useBulkIsolir() {
  return useMutation({
    mutationFn: uploadIsolirFile,
  });
}
