"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, CheckCircle2, Copy, ExternalLink, Loader2, Clock } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function TransactionDetails({ params }: { params: { id: string } }) {
  const [isSigning, setIsSigning] = useState(false)
  const [transaction, setTransaction] = useState<any>(null)
  const [wallet, setWallet] = useState<any>(null)
  const [userAddress, setUserAddress] = useState("")
  const [showAdvanced, setShowAdvanced] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Load user data
    const userData = localStorage.getItem("user")
    if (userData) {
      const user = JSON.parse(userData)
      setUserAddress(user.address)
    }

    // Load transaction data
    const storedTransactions = localStorage.getItem("transactions")
    if (storedTransactions) {
      const { pending, completed } = JSON.parse(storedTransactions)
      const tx = [...pending, ...completed].find((t: any) => t.id === params.id)

      if (tx) {
        // Add mock transaction data
        const enhancedTx = {
          ...tx,
          hash: `0x${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}`,
          executedAt: new Date(Date.now() - Math.random() * 10000000).toISOString(),
          nonce: Math.floor(Math.random() * 100),
          gasPrice: `${(Math.random() * 50).toFixed(2)} Gwei`,
          gasLimit: Math.floor(Math.random() * 100000),
          data: `0x${Math.random().toString(16).slice(2, 64)}`,
          signatures: [`0x${Math.random().toString(16).slice(2, 64)}`, `0x${Math.random().toString(16).slice(2, 64)}`],
        }

        setTransaction(enhancedTx)

        // Load wallet data
        const storedWallets = localStorage.getItem("wallets")
        if (storedWallets) {
          const wallets = JSON.parse(storedWallets)
          const relatedWallet = wallets.find((w: any) => w.id === tx.walletId)
          if (relatedWallet) {
            setWallet(relatedWallet)
          }
        }
      } else {
        router.push("/transactions")
      }
    } else {
      router.push("/transactions")
    }
  }, [params.id, router])

  const handleSign = () => {
    setIsSigning(true)

    // Update transaction
    if (transaction) {
      const updatedTransaction = { ...transaction, signed: transaction.signed + 1 }

      // If all signatures collected, move to completed
      if (updatedTransaction.signed >= updatedTransaction.signers) {
        updatedTransaction.status = "completed"
      }

      // Update in localStorage
      const storedTransactions = localStorage.getItem("transactions")
      if (storedTransactions) {
        let { pending, completed } = JSON.parse(storedTransactions)

        if (updatedTransaction.status === "completed") {
          // Remove from pending and add to completed
          pending = pending.filter((t: any) => t.id !== transaction.id)
          completed = [updatedTransaction, ...completed]
        } else {
          // Update in pending
          pending = pending.map((t: any) => (t.id === transaction.id ? updatedTransaction : t))
        }

        localStorage.setItem("transactions", JSON.stringify({ pending, completed }))
      }
    }

    // Simulate signing
    setTimeout(() => {
      setIsSigning(false)
      router.push("/transactions")
    }, 2000)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "The text has been copied to your clipboard",
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    })
  }

  const formatAddress = (address: string) => {
    if (!address) return ""
    if (address.includes("...")) return address
    return `${address.substring(0, 10)}...${address.substring(address.length - 8)}`
  }

  if (!transaction || !wallet) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading transaction details...</p>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/transactions">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-xl font-bold ml-2">Transaction Details</h1>
        </div>
      </div>

      <div className="w-full max-w-md mx-auto space-y-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{transaction.title}</CardTitle>
                <CardDescription>{transaction.date}</CardDescription>
              </div>
              <Badge variant={transaction.status === "pending" ? "outline" : "secondary"}>
                {transaction.status === "pending" ? "Pending" : "Completed"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Amount</div>
              <div className="text-xl font-bold">{transaction.amount}</div>
              <div className="text-xs text-muted-foreground">WorldCoin</div>
            </div>

            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Recipient</div>
              <div className="flex items-center">
                <div className="text-sm font-medium font-mono">{formatAddress(transaction.recipient)}</div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => copyToClipboard(transaction.recipient)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Transaction Hash</div>
              <div className="flex items-center">
                <div className="text-sm font-medium font-mono">{formatAddress(transaction.hash)}</div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => copyToClipboard(transaction.hash)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {transaction.description && (
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Description</div>
                <div className="text-sm">{transaction.description}</div>
              </div>
            )}

            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Executed</div>
              <div className="text-sm">{formatDate(transaction.executedAt)}</div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Signatures</span>
                <span>
                  {transaction.signed} of {transaction.signers}
                </span>
              </div>
              <Progress value={(transaction.signed / transaction.signers) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Signatures</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {wallet.members &&
              wallet.members.map((signer: any, index: number) => (
                <div key={index}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{signer.isYou ? "Y" : "?"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-mono">{formatAddress(signer.address)}</p>
                        {signer.isYou && (
                          <Badge variant="secondary" className="text-xs">
                            You
                          </Badge>
                        )}
                      </div>
                    </div>
                    {(signer.isYou && transaction.signed > 0) || index < transaction.signed ? (
                      <div className="flex items-center">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <span className="text-xs text-muted-foreground ml-1">
                          {new Date(transaction.executedAt).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "numeric",
                            hour12: true,
                          })}
                        </span>
                      </div>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                    )}
                  </div>
                  {index < wallet.members.length - 1 && <Separator className="my-4" />}
                </div>
              ))}
          </CardContent>
          <CardFooter>
            {transaction.status === "completed" && (
              <Button variant="outline" className="w-full" asChild>
                <Link href={`https://explorer.world.org/tx/${transaction.id}`} target="_blank">
                  View on Explorer
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
          </CardFooter>
        </Card>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="advanced">
            <AccordionTrigger className="text-sm font-medium">Advanced Transaction Details</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nonce</span>
                  <span className="font-mono">{transaction.nonce}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gas Price</span>
                  <span className="font-mono">{transaction.gasPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gas Limit</span>
                  <span className="font-mono">{transaction.gasLimit}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Transaction Data</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 -mr-1"
                      onClick={() => copyToClipboard(transaction.data)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="bg-muted p-2 rounded-md overflow-x-auto">
                    <code className="text-xs font-mono break-all">{transaction.data}</code>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-muted-foreground">Signatures</span>
                  {transaction.signatures.map((sig: string, i: number) => (
                    <div key={i} className="flex items-start mt-1">
                      <span className="text-xs text-muted-foreground mr-2 mt-2">#{i + 1}:</span>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="text-xs font-mono truncate max-w-[200px]">{sig}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 -mr-1"
                            onClick={() => copyToClipboard(sig)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </main>
  )
}

