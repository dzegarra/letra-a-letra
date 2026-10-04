import { useEffect } from "react";
import { Button, notification } from "antd";
import { useRegisterSW } from "virtual:pwa-register/react";
import { useTranslation } from "react-i18next";

// How often an open webapp asks the server whether a new version was deployed
const UPDATE_CHECK_INTERVAL = 60 * 60 * 1000;
const NOTIFICATION_KEY = "pwa-update";

/**
 * Tells the user when a new version of the webapp has been downloaded and lets them
 * reload to start using it.
 */
export const UpdatePrompt = () => {
  const { t } = useTranslation();
  const [api, contextHolder] = notification.useNotification();
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, registration) {
      if (!registration) return;
      // Installed apps can stay open for days, so look for updates periodically too
      setInterval(async () => {
        if (registration.installing || !navigator.onLine) return;
        // Skip the check if the server is unreachable to avoid an error in the console
        const response = await fetch(swUrl, { cache: "no-store" }).catch(() => null);
        if (response?.status === 200) await registration.update();
      }, UPDATE_CHECK_INTERVAL);
    },
  });

  useEffect(() => {
    if (!needRefresh) return;
    api.info({
      key: NOTIFICATION_KEY,
      message: t("updateAvailable"),
      description: t("updateAvailableDescription"),
      duration: 0,
      placement: "bottomRight",
      btn: (
        <Button type="primary" onClick={() => updateServiceWorker(true)}>
          {t("update")}
        </Button>
      ),
      onClose: () => setNeedRefresh(false),
    });
  }, [needRefresh, api, t, updateServiceWorker, setNeedRefresh]);

  return contextHolder;
};
