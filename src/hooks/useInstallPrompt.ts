import { useCallback, useEffect, useState } from "react";

// Not yet part of the TypeScript DOM typings
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

/**
 * Exposes the browser's install prompt, available only when the browser supports
 * installing the webapp and it isn't installed yet.
 */
export const useInstallPrompt = () => {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const onBeforeInstallPrompt = (event: Event) => {
      // Keep the browser from showing its own banner so the header button can trigger it
      event.preventDefault();
      setPromptEvent(event as BeforeInstallPromptEvent);
    };
    const onInstalled = () => setPromptEvent(null);

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const install = useCallback(async () => {
    if (!promptEvent) return;
    await promptEvent.prompt();
    await promptEvent.userChoice;
    // The event can only be used once
    setPromptEvent(null);
  }, [promptEvent]);

  return { canInstall: promptEvent !== null, install };
};
