"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function WalletMembersPage({ params }: { params: { id: string } }) {
  const [wallet, setWallet] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Load wallet data
    const storedWallets = localStorage.getItem("wallets")
    if (storedWallets) {
      const wallets = JSON.parse(storedWallets)
      const currentWallet = wallets.find((w: any) => w.id === params.id)

      if (currentWallet) {
        setWallet(currentWallet)
      } else {
        router.push("/dashboard")
      }
    } else {
      router.push("/dashboard")
    }

    setLoading(false)
  }, [params.id, router])

  if (loading || !wallet) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading wallet members...</p>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-xl font-bold ml-2">{wallet.name} Members</h1>
        </div>
      </div>

      <div className="w-full max-w-md mx-auto">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Wallet Members</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {wallet.members &&
              wallet.members.map((member: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10 bg-muted">
                      <AvatarFallback>{member.isYou ? "Y" : "?"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-mono">
                        {member.address.substring(0, 10)}...{member.address.substring(member.address.length - 8)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {member.isYou && <Badge variant="secondary">You</Badge>}
                    {!member.isYou && (
                      <Badge
                        variant={member.status === "synchronized" ? "secondary" : "outline"}
                        className={member.status === "pending" ? "text-amber-500 border-amber-500" : ""}
                      >
                        {member.status === "synchronized" ? "Synchronized" : "Pending"}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

