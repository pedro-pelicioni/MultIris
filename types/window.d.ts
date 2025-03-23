declare global {
  interface Window {
    MiniKit: {
      isInstalled: () => boolean;
      commands: {
        verify: (options: {
          action: string;
          signal?: string;
          verification_level: 'orb' | 'device';
        }) => Promise<{
          finalPayload: {
            status?: string;
            nullifier_hash?: string;
            merkle_root?: string;
            proof?: string;
            verification_level?: string;
            action?: string;
            signal?: string;
            success?: boolean;
            error?: string;
          }
        }>;
      };
    };
  }
} 