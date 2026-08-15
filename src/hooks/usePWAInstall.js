import { useEffect, useState } from "react";
import {
  setDeferredPrompt,
  getDeferredPrompt,
  clearDeferredPrompt,
} from "../services/pwaService";

export default function usePWAInstall() {
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      // Stop Chrome from showing its own mini-infobar
      e.preventDefault();

      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const install = async () => {
      const prompt = getDeferredPrompt();

      if (!prompt) return;

      prompt.prompt();

      const result = await prompt.userChoice;

    console.log("Install result:", result.outcome);

    clearDeferredPrompt();
    setIsInstallable(false);
  };

  return {
    isInstallable,
    install,
  };
}