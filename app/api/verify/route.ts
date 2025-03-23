import { NextRequest, NextResponse } from 'next/server';
import { verifyCloudProof, IVerifyResponse, ISuccessResult } from '@worldcoin/minikit-js';

interface IRequestPayload {
  payload: ISuccessResult;
  action: string;
  signal?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { payload, action, signal } = await req.json() as IRequestPayload;
    
    // The app_id should be stored in environment variables
    const app_id = process.env.WORLD_APP_ID || 'multiris-wallet';
    
    // Verify the proof using the MiniKit cloud verification
    const verifyRes = await verifyCloudProof(
      payload, 
      app_id as `app_${string}`, 
      action, 
      signal
    ) as IVerifyResponse;

    if (verifyRes.success) {
      // This is where you would perform backend actions if the verification succeeds
      // Such as storing the verification in a database or creating an account
      
      console.log('Verification successful', verifyRes);
      
      return NextResponse.json({ 
        status: 200, 
        message: 'Verification successful',
        data: verifyRes 
      });
    } else {
      // Handle failed verification
      console.error('Verification failed', verifyRes);
      
      return NextResponse.json(
        { 
          status: 400, 
          message: 'Verification failed',
          error: verifyRes.error || 'Unknown error' 
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error during verification:', error);
    
    return NextResponse.json(
      { 
        status: 500, 
        message: 'Server error during verification',
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
} 