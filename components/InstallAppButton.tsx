import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed', platform: string }>;
}

interface InstallAppButtonProps {
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

const InstallAppButton = ({ 
  className = '', 
  variant = 'default' 
}: InstallAppButtonProps) => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isFullscreen = window.matchMedia('(display-mode: fullscreen)').matches;
    const isIOSStandalone = 'standalone' in window.navigator && (window.navigator as any).standalone === true;
    
    if (isStandalone || isFullscreen || isIOSStandalone) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const promptInstall = async () => {
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
  };

  // Don't show the button if already installed or not installable
  if (isInstalled || !installPrompt) return null;

  return (
    <Button
      variant={variant}
      onClick={promptInstall}
      className={`flex items-center ${className}`}
    >
      <Download className="h-4 w-4 mr-2" />
      Install App
    </Button>
  );
};

export default InstallAppButton;