"use client"

import React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Loader2 } from "lucide-react"

// Interface para os resultados da verificação
interface VerificationResult {
  status?: string;
  proof?: string;
  merkle_root?: string;
  nullifier_hash?: string;
  verification_level?: string;
  version?: number;
  success?: boolean;
  error?: string;
}

export default function AuthPage() {
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [miniKitInstalled, setMiniKitInstalled] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Verifica se o MiniKit está instalado e disponível
    if (typeof window !== 'undefined' && window.MiniKit && window.MiniKit.isInstalled()) {
      setMiniKitInstalled(true)
      console.log('MiniKit is installed and ready to use')
    } else {
      console.log('MiniKit is not installed or running outside World App')
    }
  }, [])

  const handleVerify = async () => {
    setIsAuthenticating(true)
    
    try {
      if (!window.MiniKit || !window.MiniKit.isInstalled()) {
        console.error('MiniKit is not installed or not available')
        setIsAuthenticating(false)
        return
      }

      // Prepara o payload de verificação
      const verifyPayload = {
        action: 'multiris-auth-sepolia', // ID da ação criada no Developer Portal
        signal: '', // Opcional
        verification_level: 'device', // 'orb' | 'device'
      }

      // Executa o comando de verificação
      const { finalPayload } = await window.MiniKit.commands.verify(verifyPayload)
      
      if (finalPayload.status === 'error') {
        console.error('Verification error:', finalPayload)
        setIsAuthenticating(false)
        return
      }

      console.log('Verification successful:', finalPayload)
      
      // Em produção, você deve verificar a prova no backend
      // Para este exemplo, consideramos a verificação bem-sucedida
      handleAuthSuccess(finalPayload)
    } catch (error) {
      console.error('Error during verification:', error)
      setIsAuthenticating(false)
    }
  }

  const handleAuthSuccess = (result: VerificationResult) => {
    if (!result) {
      console.error("Verification result is undefined");
      setIsAuthenticating(false);
      return;
    }
    
    // Store user info in localStorage with World ID verification data
    localStorage.setItem(
      "user",
      JSON.stringify({
        name: "World ID User",
        address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F", // This would come from the wallet connection
        isAuthenticated: true,
        worldId: {
          verified: true,
          timestamp: Date.now(),
          // Add verification data from the result
          nullifier: result.nullifier_hash || "",
          merkle_root: result.merkle_root || "",
          proof: result.proof || "",
          verification_level: result.verification_level || "",
          network: "sepolia"
        }
      })
    )
    setIsAuthenticating(false)
    router.push("/create-wallet")
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-white">
      <Card className="w-full max-w-md border shadow-md">
        <CardHeader className="text-center">
          <CardTitle>Authenticate with World ID</CardTitle>
          <CardDescription>Verify your identity to access your multisig wallet</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6 pb-6">
          <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-primary/20">
            <Image src="/images/multiris-logo.png" alt="Multiris with World ID" fill className="object-contain p-2" />
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

