"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Plus, Trash2, Users, Shield, Loader2, Copy, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function CreateWallet() {
  const router = useRouter()
  const { toast } = useToast()
  const [isCreating, setIsCreating] = useState(false)
  const [walletName, setWalletName] = useState("")
  const [signers, setSigners] = useState<
    Array<{ address: string; inviteLink?: string; isYou: boolean; status: "pending" | "synchronized" }>
  >([])
  const [threshold, setThreshold] = useState("1")
  const [step, setStep] = useState(1)
  const [progress, setProgress] = useState(33)
  const [userAddress, setUserAddress] = useState("")

  // Load user data from localStorage
  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const user = JSON.parse(userData)
      setUserAddress(user.address)

      // Initialize signers with the current user
      setSigners([{ address: user.address, isYou: true, status: "synchronized" }])
    }
  }, [])

  // Update threshold when signers change
  useEffect(() => {
    // For 2-person wallets, enforce a threshold of 2
    if (signers.length === 2) {
      setThreshold("2")
    } else if (Number(threshold) > signers.length) {
      // Ensure threshold is never greater than number of signers
      setThreshold(signers.length.toString())
    }
  }, [signers, threshold])

  const addSigner = () => {
    // Generate a random invite link
    const inviteId = Math.random().toString(36).substring(2, 15)
    const inviteLink = `${window.location.origin}/invite/${inviteId}`

    // Generate a placeholder address (full address for better display)
    const address = `0x${Math.random().toString(16).slice(2, 42)}`

    setSigners([
      ...signers,
      {
        address,
        inviteLink,
        isYou: false,
        status: "pending",
      },
    ])
  }

  const removeSigner = (index: number) => {
    if (signers.length <= 1) return
    const newSigners = [...signers]
    newSigners.splice(index, 1)
    setSigners(newSigners)

    // Adjust threshold if it's now higher than the number of signers
    if (Number.parseInt(threshold) > newSigners.length) {
      setThreshold(newSigners.length.toString())
    }
  }

  const copyInviteLink = (link: string) => {
    navigator.clipboard.writeText(link)
    toast({
      title: "Invite link copied",
      description: "Share this link with your co-signer",
    })
  }

  const handleNextStep = () => {
    if (step === 1) {
      setStep(2)
      setProgress(66)
    } else if (step === 2) {
      // Require at least 2 signers
      if (signers.length < 2) {
        toast({
          title: "More signers required",
          description: "You need at least 2 signers for a multisig wallet",
          variant: "destructive",
        })
        return
      }
      setStep(3)
      setProgress(100)
    }
  }

  const handlePrevStep = () => {
    if (step === 2) {
      setStep(1)
      setProgress(33)
    } else if (step === 3) {
      setStep(2)
      setProgress(66)
    }
  }

  const handleCreateWallet = () => {
    setIsCreating(true)

    // Save wallet data to localStorage
    const walletData = {
      id: `wallet-${Date.now()}`,
      name: walletName,
      address: `0x${Math.random().toString(16).slice(2, 42)}`,
      balance: "0.00",
      currency: "WLD",
      signers: signers.length,
      threshold: Number(threshold),
      members: signers.map((signer) => ({
        address: signer.address,
        isYou: signer.isYou,
        status: signer.status,
      })),
    }

    const existingWallets = JSON.parse(localStorage.getItem("wallets") || "[]")
    existingWallets.push(walletData)
    localStorage.setItem("wallets", JSON.stringify(existingWallets))

    // Simulate wallet creation
    setTimeout(() => {
      setIsCreating(false)
      router.push("/dashboard")
    }, 2000)
  }

  // Check if we need to disable the threshold selection (for 2-person wallets)
  const isThresholdFixed = signers.length === 2

  return (
    <main className="flex min-h-screen flex-col p-4 bg-white">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" asChild>
            <Link href={step === 1 ? "/auth" : "#"} onClick={step !== 1 ? handlePrevStep : undefined}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-xl font-bold ml-2">Create New Wallet</h1>
        </div>
      </div>

      <div className="w-full max-w-md mx-auto mb-6">
        <Progress value={progress} className="h-2" />
      </div>

      <div className="w-full max-w-md mx-auto">
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Wallet Details</CardTitle>
              <CardDescription>Name your multisig wallet</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="wallet-name">Wallet Name</Label>
                <Input
                  id="wallet-name"
                  placeholder="e.g., Team Treasury"
                  value={walletName}
                  onChange={(e) => setWalletName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="user-address">Your Address</Label>
                <div className="relative">
                  <Input
                    id="user-address"
                    value={userAddress}
                    readOnly
                    className="font-mono text-sm pr-10 bg-muted border-muted-foreground/20 opacity-80"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full"
                    onClick={() => copyInviteLink(userAddress)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  This is your anonymous World ID address (cannot be changed)
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleNextStep} disabled={!walletName.trim()}>
                Continue
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Signers and Confirmations</CardTitle>
              <CardDescription>
                Add the signers for your wallet and set how many confirmations are required
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert variant="default" className="bg-primary/10 border-primary/20">
                <AlertCircle className="h-4 w-4 text-primary" />
                <AlertDescription className="text-sm">
                  At least one co-signer is required to create a multisig wallet
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                {signers.map((signer, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Signer {index + 1}</Label>
                      {!signer.isYou && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSigner(index)}
                          className="h-8 w-8 text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="space-y-2">
                      {signer.isYou ? (
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>You</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">You</p>
                            <p className="text-xs text-muted-foreground font-mono">
                              {signer.address.substring(0, 10)}...{signer.address.substring(signer.address.length - 8)}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>?</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center">
                                <p className="text-sm font-medium">Co-signer</p>
                                <span className="ml-2 text-xs bg-secondary/10 text-secondary px-2 py-0.5 rounded-full">
                                  Pending
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground font-mono">
                                {signer.address.substring(0, 10)}...
                                {signer.address.substring(signer.address.length - 8)}
                              </p>
                            </div>
                          </div>

                          {signer.inviteLink && (
                            <div className="flex items-center space-x-2 mt-2">
                              <div className="flex-1 p-2 bg-muted rounded-md text-xs font-mono truncate">
                                {signer.inviteLink}
                              </div>
                              <Button variant="outline" size="icon" onClick={() => copyInviteLink(signer.inviteLink!)}>
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {index < signers.length - 1 && <Separator className="my-2" />}
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full" onClick={addSigner}>
                <Plus className="h-4 w-4 mr-2" />
                Add Signer
              </Button>

              <div className="space-y-2">
                <Label htmlFor="threshold">Confirmation Threshold</Label>
                <select
                  id="threshold"
                  className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${isThresholdFixed ? "opacity-80" : ""}`}
                  value={threshold}
                  onChange={(e) => setThreshold(e.target.value)}
                  disabled={isThresholdFixed}
                >
                  {Array.from({ length: signers.length }, (_, i) => (
                    <option key={i} value={(i + 1).toString()}>
                      {i + 1} out of {signers.length} signers
                    </option>
                  ))}
                </select>
                {isThresholdFixed ? (
                  <p className="text-xs text-primary mt-1">
                    For 2-person wallets, both signers must approve transactions for security.
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground mt-1">
                    Any transaction will require at least {threshold} confirmation
                    {Number.parseInt(threshold) > 1 ? "s" : ""}.
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={handleNextStep}
                disabled={signers.length < 2 || signers.some((s) => !s.isYou && !s.address)}
              >
                Continue
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Review and Create</CardTitle>
              <CardDescription>Review your wallet details before creation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Wallet Name</h3>
                <p className="font-medium">{walletName}</p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Signers ({signers.length})</h3>
                <div className="space-y-2">
                  {signers.map((signer, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>{signer.isYou ? "Y" : "?"}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-mono">
                        {signer.address.substring(0, 10)}...{signer.address.substring(signer.address.length - 8)}
                      </span>
                      {signer.isYou && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">You</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Confirmation Threshold</h3>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <p className="font-medium">
                    {threshold} out of {signers.length} signers
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Use a threshold higher than one to prevent losing access to your wallet in case a signer key is lost
                  or compromised.
                </p>
              </div>

              <div className="rounded-lg border p-4 bg-muted/50">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Your Safe Account preview</h3>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Name</span>
                    <span>{walletName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Network</span>
                    <span>World ID</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Policy</span>
                    <span>
                      {threshold}/{signers.length}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleCreateWallet} disabled={isCreating}>
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Wallet...
                  </>
                ) : (
                  "Create Wallet"
                )}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </main>
  )
}

