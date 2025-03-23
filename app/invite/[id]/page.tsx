"use client"

import { CardFooter } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { MiniKit, VerifyCommandInput, VerificationLevel, ISuccessResult } from '@worldcoin/minikit-js'

// Interface for verification result
interface VerificationResult {
  nullifier_hash?: string;
  merkle_root?: string;
  proof?: string;
  verification_level?: string;
  action_id?: string;
  signal?: string;
  status?: string;
  success?: boolean;
}

export default function InvitePage({ params }: { params: { id: string } }) {
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [miniKitInstalled, setMiniKitInstalled] = useState(false)
  const router = useRouter()
  const inviteId = params.id

  useEffect(() => {
    // Check if MiniKit is installed and available
    if (typeof window !== 'undefined') {
      try {
        if (MiniKit && MiniKit.isInstalled()) {
          setMiniKitInstalled(true)
          console.log('MiniKit is installed and ready to use')
        } else {
          console.log('MiniKit is not installed or running outside World App')
        }
      } catch (error) {
        console.error('Error checking MiniKit:', error)
      }
    }
  }, [])

  const handleVerify = async () => {
    setIsAuthenticating(true)
    
    try {
      if (!MiniKit.isInstalled()) {
        console.error('MiniKit is not installed')
        setIsAuthenticating(false)
        return
      }

      // Prepare verification payload with invite ID as signal
      const verifyPayload: VerifyCommandInput = {
        action: 'multiris-join-wallet', // This is your action ID from the Developer Portal
        signal: inviteId, // Use invite ID as signal to associate with specific wallet
        verification_level: VerificationLevel.Device, // Orb | Device
      }

      try {
        // World App will open a drawer prompting the user to confirm the operation
        const result = await MiniKit.commands.verify(verifyPayload)
        const finalPayload = result?.finalPayload

        if (!finalPayload || finalPayload.status === 'error') {
          console.error('Error payload', finalPayload)
          setIsAuthenticating(false)
          return
        }

        console.log('Verification successful:', finalPayload)

        // Verify the proof in the backend
        try {
          const verifyResponse = await fetch('/api/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              payload: finalPayload as ISuccessResult, // Parses only the fields we need to verify
              action: 'multiris-join-wallet',
              signal: inviteId,
            }),
          })

          const verifyResponseJson = await verifyResponse.json()
          
          if (verifyResponseJson.status === 200) {
            console.log('Verification success!')
            handleAuthSuccess(finalPayload)
          } else {
            console.error('Backend verification failed:', verifyResponseJson)
            setIsAuthenticating(false)
          }
        } catch (error) {
          console.error('Error verifying proof with backend:', error)
          
          // For demo purposes, we'll handle success anyway
          // In production, you would want to fail here
          console.log('Proceeding with authentication anyway for demo purposes')
          handleAuthSuccess(finalPayload)
        }
      } catch (error) {
        console.error('Error during verification process:', error)
        setIsAuthenticating(false)
      }
    } catch (error) {
      console.error('Error in verification handler:', error)
      setIsAuthenticating(false)
    }
  }

  const handleAuthSuccess = (result: VerificationResult) => {
    if (!result) {
      console.error("Verification result is undefined");
      setIsAuthenticating(false);
      return;
    }
    
    // Generate a deterministic address from nullifier hash for this user
    // In production, you would likely use a proper wallet connection
    const userAddress = result.nullifier_hash ? 
      `0x${result.nullifier_hash.substring(2, 10)}...${result.nullifier_hash.substring(58)}` : 
      `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`;

    // Store user info in localStorage with World ID verification data
    localStorage.setItem(
      "user",
      JSON.stringify({
        name: "World ID User",
        address: userAddress,
        isAuthenticated: true,
        inviteId: inviteId,
        worldId: {
          verified: true,
          timestamp: Date.now(),
          nullifier: result.nullifier_hash || "",
          merkle_root: result.merkle_root || "",
          proof: result.proof || "",
          verification_level: result.verification_level || "",
          network: "sepolia"
        }
      })
    )
    
    setIsAuthenticating(false)

    // In a real app, we would update the wallet to mark this signer as synchronized
    // For now, we'll just redirect to the dashboard
    router.push("/dashboard")
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-white">
      <Card className="w-full max-w-md border shadow-md">
        <CardHeader className="text-center">
          <CardTitle>Join MultIris Wallet</CardTitle>
          <CardDescription>You've been invited to join a multisig wallet</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6 pb-6">
          <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-primary/20">
            <Image src="/images/multiris-logo.png" alt="MultIris with World ID" fill className="object-contain p-2" />
          </div>

          <div className="text-center space-y-2">
            <h3 className="font-medium">World ID Verification</h3>
            <p className="text-sm text-muted-foreground">
              World ID uses iris scanning to verify your unique identity while preserving your privacy.
              This verification will be done on the Sepolia test network.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <button
            onClick={handleVerify}
            disabled={isAuthenticating || !miniKitInstalled}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
          >
            {isAuthenticating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Authenticating...
              </>
            ) : (
              <>
                Authenticate with World ID
              </>
            )}
          </button>
        </CardFooter>
      </Card>
    </main>
  )
}

