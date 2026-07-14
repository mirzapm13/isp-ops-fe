import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const TELEGRAM_WEB_APP_SCRIPT =
  "https://telegram.org/js/telegram-web-app.js?56";

type TelegramWebApp = {
  initData: string;
  ready: () => void;
  expand: () => void;
};

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

function initializeTelegramWebApp(): string {
  const webApp = window.Telegram?.WebApp;

  if (!webApp) {
    return "";
  }

  webApp.ready();
  webApp.expand();
  return webApp.initData;
}

export default function TelegramForm() {
  const [initData, setInitData] = useState("");
  const [sdkLoaded, setSdkLoaded] = useState(Boolean(window.Telegram?.WebApp));

  useEffect(() => {
    const loadWebApp = () => {
      setSdkLoaded(true);
      setInitData(initializeTelegramWebApp());
    };

    if (window.Telegram?.WebApp) {
      loadWebApp();
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-telegram-web-app="true"]',
    );
    const script = existingScript ?? document.createElement("script");

    if (!existingScript) {
      script.src = TELEGRAM_WEB_APP_SCRIPT;
      script.async = true;
      script.dataset.telegramWebApp = "true";
      document.head.appendChild(script);
    }

    script.addEventListener("load", loadWebApp);

    return () => script.removeEventListener("load", loadWebApp);
  }, []);

  return (
    <main className="min-h-screen bg-muted/40 p-4 sm:p-8">
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Telegram Field Form</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This page is ready for the Telegram Mini App form. No data is
            submitted yet.
          </p>

          <div className="space-y-2">
            <p className="text-sm font-medium">Telegram initData</p>
            <Textarea
              readOnly
              value={initData}
              className="min-h-48 font-mono text-xs"
              placeholder={
                sdkLoaded
                  ? "Open this page from the configured Telegram Mini App to receive initData."
                  : "Loading the Telegram Mini App SDK..."
              }
            />
          </div>

          {sdkLoaded && !initData ? (
            <p className="text-sm text-muted-foreground">
              Telegram initData is only available when this page is opened
              inside Telegram.
            </p>
          ) : null}
        </CardContent>
      </Card>
    </main>
  );
}
