import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useBillingImport } from "@/hooks/useBillingImport";

export default function UpdateBilling() {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const billingImport = useBillingImport();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    billingImport.mutate(file);
  };

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-semibold">Update Billing</h1>

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Hidden native file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".xls,.xlsx"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />

        {/* Styled file picker */}
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            Choose File
          </Button>

          <span className="text-sm text-muted-foreground truncate">
            {file ? file.name : "No file selected"}
          </span>
        </div>

        {/* Optional hint */}
        <p className="text-xs text-muted-foreground">
          Accepted formats: .xls, .xlsx
        </p>

        {/* Submit button */}
        <Button type="submit" disabled={!file || billingImport.isPending}>
          {billingImport.isPending ? "Uploading…" : "Upload"}
        </Button>
      </form>

      {/* Success message */}
      {billingImport.isSuccess && (
        <Alert>
          <AlertTitle>Import Success</AlertTitle>
          <AlertDescription>
            Billing file has been processed successfully.
          </AlertDescription>
        </Alert>
      )}

      {/* Error message */}
      {billingImport.isError && (
        <Alert variant="destructive">
          <AlertTitle>Import Failed</AlertTitle>
          <AlertDescription>
            {billingImport.error?.message ?? "Failed to import billing file"}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
