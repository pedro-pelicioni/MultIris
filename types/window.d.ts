import { VerificationLevel, ISuccessResult } from '@worldcoin/minikit-js';

declare global {
  interface VerifyCommandInput {
    action: string;
    signal?: string;
    verification_level?: VerificationLevel;
  }

  interface VerifyCommandPayload {
    finalPayload?: {
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
  }

  interface Window {
    MiniKit: {
      isInstalled: () => boolean;
      install: (appId?: string) => void;
      commands: {
        verify: (options: VerifyCommandInput) => Promise<VerifyCommandPayload>;
      };
    };
  }
} 