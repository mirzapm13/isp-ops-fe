import { useEffect, useRef, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2,
  FileSpreadsheet,
  History,
  Play,
  Plus,
  RefreshCw,
  Square,
  Trash2,
  Upload,
} from "lucide-react";
import BroadcastResultsTable from "../components/BroadcastResultsTable";
import {
  usePreviewWaPayload,
  useStartWaBroadcast,
  useStopWaBroadcast,
  useUploadWaFile,
  useWaBroadcastRun,
  useWaBroadcastRuns,
  useWaTemplates,
} from "../waBroadcast.queries";
import type {
  ButtonSubType,
  WaButtonConfig,
  WaResolvedMapping,
  WaUploadResponse,
} from "../waBroadcast.types";

const NO_VALUE = "__NO_VALUE__";

export default function WaBroadcastPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const templatesQuery = useWaTemplates();
  const uploadMutation = useUploadWaFile();
  const previewMutation = usePreviewWaPayload();
  const startMutation = useStartWaBroadcast();
  const stopMutation = useStopWaBroadcast();

  const [uploadData, setUploadData] = useState<WaUploadResponse | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string>("isolir_info");

  // Template & Mapping state
  const [templateName, setTemplateName] = useState("");
  const [languageCode, setLanguageCode] = useState("id");
  const [phoneColumn, setPhoneColumn] = useState("");
  const [bodyColumns, setBodyColumns] = useState<string[]>([]);
  const [headerColumns, setHeaderColumns] = useState<string[]>([]);
  const [currencyColumns, setCurrencyColumns] = useState<string[]>([]);
  const [buttons, setButtons] = useState<WaButtonConfig[]>([]);

  // Broadcast options
  const [delaySeconds, setDelaySeconds] = useState<number>(1.0);
  const [dryRun, setDryRun] = useState<boolean>(true);
  const [previewRow, setPreviewRow] = useState<number>(4);

  // Active or selected run ID for live tracking / inspection
  const [activeRunId, setActiveRunId] = useState<number | null>(null);
  const [historyPage, setHistoryPage] = useState(1);

  const runQuery = useWaBroadcastRun(activeRunId);
  const historyQuery = useWaBroadcastRuns(historyPage, 15);

  // Initialize default template when templates load
  useEffect(() => {
    if (templatesQuery.data) {
      const tplMap = templatesQuery.data.templates;
      const defaultKey = tplMap["isolir_info"]
        ? "isolir_info"
        : Object.keys(tplMap)[0] || "Custom / Manual";
      setSelectedPreset(defaultKey);

      if (defaultKey !== "Custom / Manual" && tplMap[defaultKey]) {
        const preset = tplMap[defaultKey];
        setTemplateName(preset.name);
        setLanguageCode(
          preset.language_code || templatesQuery.data.default_language_code
        );
      } else {
        setLanguageCode(templatesQuery.data.default_language_code);
      }

      if (templatesQuery.data.active_run_id && activeRunId === null) {
        setActiveRunId(templatesQuery.data.active_run_id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templatesQuery.data]);

  const applyResolvedMapping = (mapping: WaResolvedMapping) => {
    if (mapping.template_name) setTemplateName(mapping.template_name);
    if (mapping.language_code) setLanguageCode(mapping.language_code);
    if (mapping.phone_column) setPhoneColumn(mapping.phone_column);
    setHeaderColumns([...mapping.header_columns]);
    setBodyColumns([...mapping.body_columns]);
    setCurrencyColumns([...mapping.currency_columns]);
    setButtons(mapping.buttons.map((b) => ({ ...b })));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    uploadMutation.mutate(file, {
      onSuccess: (data) => {
        setUploadData(data);
        setPreviewRow(data.first_data_row ?? 4);

        if (
          selectedPreset !== "Custom / Manual" &&
          data.preset_mappings[selectedPreset]
        ) {
          applyResolvedMapping(data.preset_mappings[selectedPreset]);
        } else {
          setPhoneColumn(data.columns[0] || "");
          setCurrencyColumns(data.default_currency_columns || []);
        }
      },
    });
  };

  const handlePresetChange = (presetKey: string) => {
    setSelectedPreset(presetKey);
    if (presetKey === "Custom / Manual") return;

    if (uploadData && uploadData.preset_mappings[presetKey]) {
      applyResolvedMapping(uploadData.preset_mappings[presetKey]);
    } else if (templatesQuery.data?.templates[presetKey]) {
      const tpl = templatesQuery.data.templates[presetKey];
      setTemplateName(tpl.name);
      setLanguageCode(tpl.language_code);
    }
  };

  // Trigger preview automatically when uploadData or mapping changes
  useEffect(() => {
    if (!uploadData || !phoneColumn) return;
    const minRow = uploadData.first_data_row ?? 4;
    const maxRow = uploadData.row_count + minRow - 1;
    const clampedRow = Math.min(Math.max(minRow, previewRow), maxRow);
    previewMutation.mutate({
      upload_id: uploadData.upload_id,
      excel_row: clampedRow,
      phone_column: phoneColumn,
      template_name: templateName,
      language_code: languageCode,
      body_columns: bodyColumns,
      header_columns: headerColumns,
      buttons,
      currency_columns: currencyColumns,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    uploadData,
    previewRow,
    phoneColumn,
    templateName,
    languageCode,
    bodyColumns,
    headerColumns,
    buttons,
    currencyColumns,
  ]);

  const toggleCurrencyColumn = (col: string) => {
    setCurrencyColumns((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    );
  };

  const handleBodyCountChange = (count: number) => {
    const safeCount = Math.max(0, Math.min(100, count));
    setBodyColumns((prev) => {
      if (safeCount > prev.length) {
        return [
          ...prev,
          ...Array(safeCount - prev.length).fill(NO_VALUE),
        ];
      }
      return prev.slice(0, safeCount);
    });
  };

  const handleHeaderCountChange = (count: number) => {
    const safeCount = Math.max(0, Math.min(20, count));
    setHeaderColumns((prev) => {
      if (safeCount > prev.length) {
        return [
          ...prev,
          ...Array(safeCount - prev.length).fill(NO_VALUE),
        ];
      }
      return prev.slice(0, safeCount);
    });
  };

  const handleAddButton = () => {
    if (buttons.length >= 10) return;
    setButtons((prev) => [
      ...prev,
      { index: prev.length, sub_type: "quick_reply", column: NO_VALUE },
    ]);
  };

  const handleRemoveButton = (idx: number) => {
    setButtons((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleUpdateButton = (
    idx: number,
    patch: Partial<WaButtonConfig>
  ) => {
    setButtons((prev) =>
      prev.map((btn, i) => (i === idx ? { ...btn, ...patch } : btn))
    );
  };

  const handleStartBroadcast = () => {
    if (!uploadData) return;
    startMutation.mutate(
      {
        upload_id: uploadData.upload_id,
        phone_column: phoneColumn,
        template_name: templateName,
        language_code: languageCode,
        body_columns: bodyColumns,
        header_columns: headerColumns,
        buttons,
        currency_columns: currencyColumns,
        delay_seconds: delaySeconds,
        dry_run: dryRun,
      },
      {
        onSuccess: (run) => {
          setActiveRunId(run.id);
        },
      }
    );
  };

  const handleStopBroadcast = () => {
    if (!activeRunId) return;
    stopMutation.mutate(activeRunId);
  };

  const columns = uploadData?.columns ?? [];
  const parameterColumns = [NO_VALUE, ...columns];
  const presetKeys = Object.keys(templatesQuery.data?.templates ?? {});
  const presetOptions = [...presetKeys, "Custom / Manual"];

  const currentRun = runQuery.data;
  const isRunning = Boolean(currentRun?.running);
  const qiscusConfigured = templatesQuery.data?.qiscus_configured ?? true;

  const missingRequired =
    !uploadData ||
    !phoneColumn ||
    !templateName.trim() ||
    !languageCode.trim() ||
    (!dryRun && !qiscusConfigured);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            Qiscus WhatsApp Broadcast
          </h1>
          <p className="text-sm text-muted-foreground">
            Excel / CSV → Qiscus WhatsApp Business API with PostgreSQL Run Logs
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={qiscusConfigured ? "default" : "destructive"}>
            {qiscusConfigured
              ? "Qiscus .env Configured"
              : "Missing Qiscus .env Credentials"}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="broadcast" className="space-y-4">
        <TabsList>
          <TabsTrigger value="broadcast">
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Broadcast Setup & Live Run
          </TabsTrigger>
          <TabsTrigger
            value="history"
            onClick={() => historyQuery.refetch()}
          >
            <History className="mr-2 h-4 w-4" />
            Broadcast History ({historyQuery.data?.total ?? 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="broadcast" className="space-y-6">
          {/* Step 1: File Upload & Template Preset */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  1. Upload Recipient Spreadsheet
                </CardTitle>
                <CardDescription>
                  Upload an .xlsx, .xls, or .csv file containing customer phone
                  numbers and template parameters.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadMutation.isPending || isRunning}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {uploadMutation.isPending ? "Reading File..." : "Choose File"}
                  </Button>
                  <span className="text-sm text-muted-foreground truncate">
                    {uploadData ? uploadData.filename : "No file selected"}
                  </span>
                </div>

                {uploadMutation.isError && (
                  <Alert variant="destructive">
                    <AlertTitle>Upload Failed</AlertTitle>
                    <AlertDescription>
                      {(uploadMutation.error as { message?: string })?.message ??
                        "Failed to parse spreadsheet"}
                    </AlertDescription>
                  </Alert>
                )}

                {uploadData && (
                  <div className="flex items-center gap-2 rounded-md border bg-muted/40 px-3 py-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                    <span>
                      Loaded <strong>{uploadData.row_count.toLocaleString()}</strong>{" "}
                      rows and <strong>{uploadData.columns.length}</strong>{" "}
                      columns.
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  2. WhatsApp Template Configuration
                </CardTitle>
                <CardDescription>
                  Select a preset to auto-populate parameters or configure
                  manually.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Template Preset</Label>
                  <Select
                    value={selectedPreset}
                    onValueChange={handlePresetChange}
                    disabled={isRunning}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select preset" />
                    </SelectTrigger>
                    <SelectContent>
                      {presetOptions.map((key) => {
                        const desc =
                          templatesQuery.data?.templates[key]?.description ||
                          key;
                        return (
                          <SelectItem key={key} value={key}>
                            {desc}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Template Name</Label>
                    <Input
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      placeholder="e.g. isolir_info"
                      disabled={isRunning}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Language Code</Label>
                    <Input
                      value={languageCode}
                      onChange={(e) => setLanguageCode(e.target.value)}
                      placeholder="id"
                      disabled={isRunning}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Step 2: Column Mappings & Preview (Only shown once a file is uploaded) */}
          {uploadData && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    3. Parameter & Button Mapping
                  </CardTitle>
                  <CardDescription>
                    Map spreadsheet columns to WhatsApp phone number, body
                    variables, Rupiah formatting, and dynamic buttons.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Phone & Currency Columns */}
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Phone Number Column</Label>
                      <Select
                        value={phoneColumn}
                        onValueChange={setPhoneColumn}
                        disabled={isRunning}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select phone column" />
                        </SelectTrigger>
                        <SelectContent>
                          {columns.map((col) => (
                            <SelectItem key={col} value={col}>
                              {col}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>
                        Format Columns as Rupiah (e.g. 120000 → Rp 120.000)
                      </Label>
                      <div className="flex flex-wrap gap-2 rounded-md border p-2.5 min-h-10">
                        {columns.map((col) => {
                          const checked = currencyColumns.includes(col);
                          return (
                            <label
                              key={col}
                              className="flex items-center gap-1.5 text-xs cursor-pointer select-none rounded border px-2 py-1 hover:bg-muted"
                            >
                              <Checkbox
                                checked={checked}
                                onCheckedChange={() =>
                                  toggleCurrencyColumn(col)
                                }
                                disabled={isRunning}
                              />
                              <span>{col}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Body Parameters */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold">
                        BODY Parameters ({bodyColumns.length})
                      </Label>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          Count:
                        </span>
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          value={bodyColumns.length}
                          onChange={(e) =>
                            handleBodyCountChange(Number(e.target.value))
                          }
                          className="w-20 h-8"
                          disabled={isRunning}
                        />
                      </div>
                    </div>

                    {bodyColumns.length > 0 && (
                      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                        {bodyColumns.map((selectedCol, idx) => (
                          <div key={idx} className="space-y-1">
                            <Label className="text-xs text-muted-foreground">
                              Body Parameter {`{{${idx + 1}}}`}
                            </Label>
                            <Select
                              value={selectedCol}
                              onValueChange={(val) =>
                                setBodyColumns((prev) =>
                                  prev.map((c, i) => (i === idx ? val : c))
                                )
                              }
                              disabled={isRunning}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {parameterColumns.map((col) => (
                                  <SelectItem key={col} value={col}>
                                    {col === NO_VALUE ? "No Value (-)" : col}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Header Parameters */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold">
                        HEADER Text Parameters ({headerColumns.length})
                      </Label>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          Count:
                        </span>
                        <Input
                          type="number"
                          min={0}
                          max={20}
                          value={headerColumns.length}
                          onChange={(e) =>
                            handleHeaderCountChange(Number(e.target.value))
                          }
                          className="w-20 h-8"
                          disabled={isRunning}
                        />
                      </div>
                    </div>

                    {headerColumns.length > 0 && (
                      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                        {headerColumns.map((selectedCol, idx) => (
                          <div key={idx} className="space-y-1">
                            <Label className="text-xs text-muted-foreground">
                              Header Parameter {`{{${idx + 1}}}`}
                            </Label>
                            <Select
                              value={selectedCol}
                              onValueChange={(val) =>
                                setHeaderColumns((prev) =>
                                  prev.map((c, i) => (i === idx ? val : c))
                                )
                              }
                              disabled={isRunning}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {parameterColumns.map((col) => (
                                  <SelectItem key={col} value={col}>
                                    {col === NO_VALUE ? "No Value (-)" : col}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Dynamic Buttons */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold">
                        Dynamic Template Buttons ({buttons.length})
                      </Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddButton}
                        disabled={isRunning || buttons.length >= 10}
                      >
                        <Plus className="mr-1.5 h-3.5 w-3.5" />
                        Add Button
                      </Button>
                    </div>

                    {buttons.map((btn, idx) => (
                      <div
                        key={idx}
                        className="grid gap-3 sm:grid-cols-12 items-end rounded-md border p-3"
                      >
                        <div className="space-y-1 sm:col-span-2">
                          <Label className="text-xs">Index #{idx + 1}</Label>
                          <Input
                            type="number"
                            min={0}
                            max={9}
                            value={btn.index}
                            onChange={(e) =>
                              handleUpdateButton(idx, {
                                index: Number(e.target.value),
                              })
                            }
                            disabled={isRunning}
                          />
                        </div>
                        <div className="space-y-1 sm:col-span-4">
                          <Label className="text-xs">Sub-Type</Label>
                          <Select
                            value={btn.sub_type}
                            onValueChange={(val) =>
                              handleUpdateButton(idx, {
                                sub_type: val as ButtonSubType,
                              })
                            }
                            disabled={isRunning}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="url">url</SelectItem>
                              <SelectItem value="quick_reply">
                                quick_reply
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1 sm:col-span-5">
                          <Label className="text-xs">Excel Column</Label>
                          <Select
                            value={btn.column}
                            onValueChange={(val) =>
                              handleUpdateButton(idx, { column: val })
                            }
                            disabled={isRunning}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {parameterColumns.map((col) => (
                                <SelectItem key={col} value={col}>
                                  {col === NO_VALUE ? "No Value (-)" : col}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="sm:col-span-1 flex justify-end">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveButton(idx)}
                            disabled={isRunning}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Step 3: Payload Preview & Broadcast Controls */}
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-base">
                        4. Payload Preview
                      </CardTitle>
                      <CardDescription>
                        Inspect the generated Qiscus JSON payload before
                        broadcasting.
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-xs whitespace-nowrap">
                        Excel Row:
                      </Label>
                      <Input
                        type="number"
                        min={uploadData.first_data_row ?? 4}
                        max={
                          uploadData.row_count +
                          (uploadData.first_data_row ?? 4) -
                          1
                        }
                        value={previewRow}
                        onChange={(e) => setPreviewRow(Number(e.target.value))}
                        className="w-24 h-8"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {previewMutation.data && (
                      <div className="text-xs text-muted-foreground flex items-center justify-between">
                        <span>
                          Raw Phone:{" "}
                          <code className="font-mono">
                            {previewMutation.data.raw_phone || "-"}
                          </code>
                        </span>
                        <span>
                          Normalized:{" "}
                          <code className="font-mono font-semibold text-foreground">
                            {previewMutation.data.normalized_phone ||
                              "INVALID"}
                          </code>
                        </span>
                      </div>
                    )}
                    <pre className="max-h-80 overflow-auto rounded-md bg-muted p-3 font-mono text-xs">
                      {previewMutation.data
                        ? JSON.stringify(previewMutation.data.payload, null, 2)
                        : "Generating preview..."}
                    </pre>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      5. Broadcast Execution
                    </CardTitle>
                    <CardDescription>
                      Configure inter-message delay and Dry Run mode.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="space-y-1.5">
                      <Label>Delay between messages (seconds)</Label>
                      <Input
                        type="number"
                        min={0}
                        max={3600}
                        step={0.5}
                        value={delaySeconds}
                        onChange={(e) =>
                          setDelaySeconds(Number(e.target.value))
                        }
                        disabled={isRunning}
                      />
                    </div>

                    <label className="flex items-center gap-2.5 cursor-pointer select-none rounded-md border p-3">
                      <Checkbox
                        checked={dryRun}
                        onCheckedChange={(val) => setDryRun(Boolean(val))}
                        disabled={isRunning}
                      />
                      <div className="text-sm">
                        <div className="font-medium">
                          Dry run — build & log payloads without sending to
                          Qiscus
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Recommended for verifying a new spreadsheet before
                          live dispatch.
                        </div>
                      </div>
                    </label>

                    {startMutation.isError && (
                      <Alert variant="destructive">
                        <AlertTitle>Broadcast Error</AlertTitle>
                        <AlertDescription>
                          {(startMutation.error as { message?: string })
                            ?.message ?? "Failed to start broadcast"}
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="flex gap-3">
                      <Button
                        type="button"
                        className="flex-1"
                        onClick={handleStartBroadcast}
                        disabled={
                          missingRequired ||
                          isRunning ||
                          startMutation.isPending
                        }
                      >
                        <Play className="mr-2 h-4 w-4" />
                        {startMutation.isPending
                          ? "Starting..."
                          : dryRun
                            ? "START DRY RUN"
                            : "START LIVE BROADCAST"}
                      </Button>

                      {isRunning && (
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={handleStopBroadcast}
                          disabled={stopMutation.isPending}
                        >
                          <Square className="mr-2 h-4 w-4" />
                          STOP
                        </Button>
                      )}
                    </div>

                    {/* Live Progress & Metrics */}
                    {currentRun && (
                      <div className="space-y-3 pt-2 border-t">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium">
                            Run #{currentRun.id} — {currentRun.status}
                          </span>
                          <span>
                            {currentRun.processed} / {currentRun.total} processed
                          </span>
                        </div>
                        <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
                          <div
                            className="h-full bg-primary transition-all duration-300"
                            style={{
                              width: `${
                                (currentRun.processed /
                                  Math.max(currentRun.total, 1)) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="rounded-md border p-2.5">
                            <div className="text-xs text-muted-foreground">
                              Success
                            </div>
                            <div className="text-xl font-bold text-green-600">
                              {currentRun.success}
                            </div>
                          </div>
                          <div className="rounded-md border p-2.5">
                            <div className="text-xs text-muted-foreground">
                              Failed / Skipped
                            </div>
                            <div className="text-xl font-bold text-destructive">
                              {currentRun.failed}
                            </div>
                          </div>
                        </div>
                        {currentRun.message && (
                          <Alert
                            variant={
                              currentRun.stop_requested ||
                              currentRun.status === "FAILED"
                                ? "destructive"
                                : "default"
                            }
                          >
                            <AlertDescription>
                              {currentRun.message}
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {/* Active or Selected Run Results */}
          {currentRun && <BroadcastResultsTable run={currentRun} />}
        </TabsContent>

        {/* Tab 2: PostgreSQL Broadcast History */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">
                  Past Broadcast Runs (PostgreSQL)
                </CardTitle>
                <CardDescription>
                  Click on any past broadcast run to inspect its per-row logs or
                  export CSV.
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => historyQuery.refetch()}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Run ID</TableHead>
                      <TableHead>Started At</TableHead>
                      <TableHead>File</TableHead>
                      <TableHead>Template</TableHead>
                      <TableHead>Mode</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Success / Failed</TableHead>
                      <TableHead>By</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(historyQuery.data?.items ?? []).length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={10}
                          className="py-8 text-center text-muted-foreground"
                        >
                          No broadcast runs recorded yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      (historyQuery.data?.items ?? []).map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-mono font-medium">
                            #{item.id}
                          </TableCell>
                          <TableCell className="text-xs">
                            {item.started_at
                              ? new Date(item.started_at).toLocaleString(
                                  "id-ID"
                                )
                              : "-"}
                          </TableCell>
                          <TableCell className="text-xs font-medium">
                            {item.filename}
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {item.template_name}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={item.dry_run ? "secondary" : "default"}
                            >
                              {item.dry_run ? "Dry Run" : "Live"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                item.status === "COMPLETED"
                                  ? "default"
                                  : item.status === "RUNNING"
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {item.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {item.processed}/{item.total}
                          </TableCell>
                          <TableCell className="text-xs">
                            <span className="text-green-600 font-semibold">
                              {item.success}
                            </span>{" "}
                            /{" "}
                            <span className="text-destructive font-semibold">
                              {item.failed}
                            </span>
                          </TableCell>
                          <TableCell className="text-xs">
                            {item.created_by || "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setActiveRunId(item.id)}
                            >
                              Inspect Logs
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  Page {historyPage} of{" "}
                  {Math.max(
                    1,
                    Math.ceil((historyQuery.data?.total ?? 0) / 15)
                  )}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={historyPage <= 1}
                    onClick={() => setHistoryPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={
                      historyPage * 15 >= (historyQuery.data?.total ?? 0)
                    }
                    onClick={() => setHistoryPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {currentRun && <BroadcastResultsTable run={currentRun} />}
        </TabsContent>
      </Tabs>
    </div>
  );
}
