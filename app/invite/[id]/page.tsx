"use client"

import { CardFooter } from "@/components/ui/card"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function InvitePage({ params }: { params: { id: string } }) {
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const router = useRouter()
  const inviteId = params.id

  const handleAuthenticate = () => {
    setIsAuthenticating(true)
    // Simulate World authentication
    setTimeout(() => {
      setIsAuthenticating(false)

      // Generate a random address for this user
      const userAddress = `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`

      // Store user info in localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          address: userAddress,
          isAuthenticated: true,
          inviteId: inviteId,
        }),
      )

      // In a real app, we would update the wallet to mark this signer as synchronized
      // For now, we'll just redirect to the dashboard
      router.push("/dashboard")
    }, 2000)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Join Multiris Wallet</CardTitle>
          <CardDescription>You've been invited to join a multisig wallet</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6 pb-6">
          <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-primary/20">
            <Image src="/images/multiris-logo.png" alt="Multiris with World ID" fill className="object-contain p-2" />
          </div>

          <div className="text-center space-y-2">
            <h3 className="font-medium">Authenticate with World ID</h3>
            <p className="text-sm text-muted-foreground">
              Verify your identity with World ID to join this wallet while preserving your privacy
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleAuthenticate} disabled={isAuthenticating} className="w-full">
            {isAuthenticating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Authenticating...
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                Authenticate with World ID
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}

