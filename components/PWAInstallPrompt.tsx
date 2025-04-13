import { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed', platform: string }>;
}

const PWAInstallPrompt = () => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIOSStandalone = 'standalone' in window.navigator && (window.navigator as any).standalone === true;
    const isAndroidApp = document.referrer.includes('android-app://');
    
    if (isStandalone || isIOSStandalone || isAndroidApp) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    
    // Show the install prompt
    await installPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const choiceResult = await installPrompt.userChoice;
    
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the PWA installation');
      setIsInstalled(true);
    }
    
    // Clear the saved prompt since it can't be used twice
    setInstallPrompt(null);
    setShowBanner(false);
  };

  const handleDismiss = () => {
    setShowBanner(false);
  };

  // Don't show the banner if already installed or no install prompt available
  if (isInstalled || !showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-primary text-primary-foreground shadow-lg z-50 flex items-center justify-between">
      <div className="flex-1">
        <p className="font-medium">Install Gondia Shorts for a better experience!</p>
        <p className="text-sm opacity-90">Access news faster with our app</p>
      </div>
      <div className="flex items-center space-x-2">
        <Button 
          variant="secondary" 
          onClick={handleInstallClick}
          className="whitespace-nowrap flex items-center"
        >
          <Download className="h-4 w-4 mr-2" />
          Install App
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleDismiss}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;