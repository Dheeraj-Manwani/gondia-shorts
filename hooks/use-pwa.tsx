import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

interface PWAContextType {
  deferredPrompt: BeforeInstallPromptEvent | null;
  isInstallable: boolean;
  isInstalled: boolean;
  installationCount: number;
  promptInstall: () => Promise<void>;
  dismissInstall: () => void;
}

const PWAContext = createContext<PWAContextType | undefined>(undefined);

export const PWAProvider = ({ children }: { children: ReactNode }) => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [installationCount, setInstallationCount] = useState(0);

  useEffect(() => {
    // Check if the app is already installed
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      window.matchMedia("(display-mode: fullscreen)").matches ||
      (window.navigator as any).standalone === true
    ) {
      setIsInstalled(true);
    }

    // Get installation count from localStorage
    const count = localStorage.getItem("pwaInstallPromptCount");
    if (count) {
      setInstallationCount(parseInt(count, 10));
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();

      // Stash the event so it can be triggered later
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Optionally, increment the counter
      setInstallationCount((prev) => {
        const newCount = prev + 1;
        localStorage.setItem("pwaInstallPromptCount", newCount.toString());
        return newCount;
      });
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Track when the app gets installed
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      console.log("PWA was installed");
    });

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", () => {
        console.log("PWA was installed");
      });
    };
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    await deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const choiceResult = await deferredPrompt.userChoice;

    if (choiceResult.outcome === "accepted") {
      console.log("User accepted the install prompt");
      setIsInstalled(true);
    } else {
      console.log("User dismissed the install prompt");
    }

    // We can't use it twice
    setDeferredPrompt(null);
  };

  const dismissInstall = () => {
    setDeferredPrompt(null);
  };

  return (
    <PWAContext.Provider
      value={{
        deferredPrompt,
        isInstallable: !!deferredPrompt,
        isInstalled,
        installationCount,
        promptInstall,
        dismissInstall,
      }}
    >
      {children}
    </PWAContext.Provider>
  );
};

export const usePWA = () => {
  const context = useContext(PWAContext);

  if (context === undefined) {
    throw new Error("usePWA must be used within a PWAProvider");
  }

  return context;
};
