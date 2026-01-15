import { useMutation } from "@tanstack/react-query";
import { uploadBillingFile } from "@/api/billing";

export function useBillingImport() {
  return useMutation({
    mutationFn: uploadBillingFile,
  });
}
